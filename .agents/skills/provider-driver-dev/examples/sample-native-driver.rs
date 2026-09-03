//! Example: Native Custom Driver Skeleton for Padu Core
//! File: crates/padu-core/src/driver/my_provider.rs
//!
//! Use this template when an agent DOES NOT speak ACP (Agent Client Protocol)
//! and requires a bespoke subprocess lifecycle, custom stdio line parsing,
//! or custom JSON-RPC/SSE demuxing (e.g. Claude, Codex, OpenCode, Pi, Amp).

use std::io::{BufRead, BufReader, Write};
use std::process::{Child, Command, Stdio};
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;

use anyhow::{Context as _, anyhow};
use parking_lot::Mutex;

use crate::driver::{
    DriverControl, DriverEventSender, DriverStartOptions, SessionOptions,
};
use crate::model::{
    ActivityItem, ActivityKind, BackgroundWorkKey, DriverEvent, GoalOperation,
    InteractionMode, ProviderKind, ProviderResumeCursor, RuntimeMode, UserInputAnswer,
};

pub struct MyProviderDriver {
    child: Arc<Mutex<Option<Child>>>,
    stdin: Arc<Mutex<Option<std::process::ChildStdin>>>,
    interrupted: Arc<AtomicBool>,
    options: Mutex<SessionOptions>,
}

impl MyProviderDriver {
    pub fn start(
        options: DriverStartOptions,
        events: DriverEventSender,
    ) -> anyhow::Result<Self> {
        let DriverStartOptions {
            binary,
            cwd,
            mode,
            interaction_mode,
            model,
            reasoning_effort,
            service_tier,
            context_window,
            agent_preset: _,
            computer_use_enabled: _,
            provider_cursor,
        } = options;

        let session_options = SessionOptions {
            mode,
            interaction_mode,
            model: model.clone(),
            reasoning_effort: reasoning_effort.clone(),
            service_tier,
            context_window,
        };

        // 1. Configure subprocess command
        let mut cmd = crate::command_env::command(&binary);
        cmd.current_dir(&cwd);
        cmd.stdin(Stdio::piped());
        cmd.stdout(Stdio::piped());
        cmd.stderr(Stdio::piped());

        // Add CLI arguments matching provider spec
        cmd.arg("--stream-json");
        if let Some(m) = &model {
            cmd.arg("--model").arg(m);
        }
        if let Some(cursor) = &provider_cursor {
            cmd.arg("--resume").arg(cursor.native_id());
        }

        let mut child = cmd
            .spawn()
            .with_context(|| format!("failed to spawn '{}'", binary.display()))?;

        let stdin = child.stdin.take().expect("piped stdin");
        let stdout = child.stdout.take().expect("piped stdout");
        let stderr = child.stderr.take().expect("piped stderr");

        let child_arc = Arc::new(Mutex::new(Some(child)));
        let stdin_arc = Arc::new(Mutex::new(Some(stdin)));
        let interrupted = Arc::new(AtomicBool::new(false));

        // 2. Spawn background reader thread for stdout
        let thread_events = events.clone();
        let thread_interrupted = interrupted.clone();
        thread::Builder::new()
            .name("padu-myprovider-stdout".into())
            .spawn(move || {
                let reader = BufReader::new(stdout);
                for line_res in reader.lines() {
                    let line = match line_res {
                        Ok(l) => l,
                        Err(_) => break,
                    };

                    if line.trim().is_empty() {
                        continue;
                    }

                    // Parse JSON line from provider CLI
                    if let Ok(value) = serde_json::from_str::<serde_json::Value>(&line) {
                        Self::handle_message(&value, &thread_events);
                    }
                }

                if !thread_interrupted.load(Ordering::Acquire) {
                    let _ = thread_events.send(DriverEvent::ProcessExited);
                }
            })
            .context("failed to spawn stdout reader thread")?;

        // 3. Spawn background reader thread for stderr error capture
        let stderr_events = events.clone();
        thread::Builder::new()
            .name("padu-myprovider-stderr".into())
            .spawn(move || {
                let reader = BufReader::new(stderr);
                for line in reader.lines().map_while(Result::ok) {
                    if !line.trim().is_empty() {
                        // Capture diagnostic logs if needed
                    }
                }
            })
            .ok();

        // 4. Send initial Connected event
        let _ = events.send(DriverEvent::Connected {
            provider_cursor: Some(ProviderResumeCursor::from_session_id(
                ProviderKind::Codex, // replace with your ProviderKind variant
                "session-id-from-handshake".to_string(),
            )),
        });

        Ok(Self {
            child: child_arc,
            stdin: stdin_arc,
            interrupted,
            options: Mutex::new(session_options),
        })
    }

    fn handle_message(value: &serde_json::Value, events: &DriverEventSender) {
        let msg_type = value.get("type").and_then(|v| v.as_str()).unwrap_or("");
        match msg_type {
            "text_delta" => {
                if let Some(text) = value.get("text").and_then(|v| v.as_str()) {
                    let _ = events.send(DriverEvent::TextDelta(text.to_owned()));
                }
            }
            "reasoning_delta" => {
                if let Some(thought) = value.get("thought").and_then(|v| v.as_str()) {
                    let _ = events.send(DriverEvent::ReasoningDelta(thought.to_owned()));
                }
            }
            "tool_call" => {
                let name = value.get("name").and_then(|v| v.as_str()).unwrap_or("tool");
                let _ = events.send(DriverEvent::RichActivity(ActivityItem {
                    id: value.get("id").and_then(|v| v.as_str()).unwrap_or("").to_owned(),
                    kind: ActivityKind::Command,
                    title: format!("Running {}", name),
                    detail: None,
                    output: None,
                    complete: false,
                }));
            }
            "turn_complete" => {
                let _ = events.send(DriverEvent::TurnFinished {
                    success: true,
                    summary: None,
                });
            }
            "error" => {
                let err = value.get("message").and_then(|v| v.as_str()).unwrap_or("unknown error");
                let _ = events.send(DriverEvent::Error(err.to_owned()));
                let _ = events.send(DriverEvent::TurnFinished {
                    success: false,
                    summary: Some(err.to_owned()),
                });
            }
            _ => {}
        }
    }
}

impl DriverControl for MyProviderDriver {
    fn prompt(&self, prompt: String) {
        let mut stdin = self.stdin.lock();
        if let Some(stdin) = stdin.as_mut() {
            let payload = serde_json::json!({
                "type": "prompt",
                "content": prompt,
            });
            let _ = writeln!(stdin, "{}", payload);
            let _ = stdin.flush();
        }
    }

    fn cancel(&self) {
        self.interrupted.store(true, Ordering::Release);
        if let Some(child) = self.child.lock().as_mut() {
            let _ = child.kill();
        }
    }

    fn respond(&self, _request_id: String, _option_id: String) {
        // Implement interactive permission approval/rejection
    }

    fn respond_user_input(&self, _request_id: String, _answers: Vec<UserInputAnswer>) {
        // Implement interactive question answers
    }

    fn apply_options(&self, options: SessionOptions) -> bool {
        *self.options.lock() = options;
        // Return true if options can be applied in-place, false if restart is required
        true
    }

    fn rollback(&self, _turns: usize) -> anyhow::Result<Option<ProviderResumeCursor>> {
        anyhow::bail!("rollback not supported")
    }

    fn fork(&self, _turns_to_remove: usize) -> anyhow::Result<ProviderResumeCursor> {
        anyhow::bail!("fork not supported")
    }
}
