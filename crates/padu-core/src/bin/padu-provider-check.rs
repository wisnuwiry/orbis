use std::env;
use std::path::PathBuf;
use std::time::{Duration, Instant};

use anyhow::{Result, bail};
use padu_core::driver::{DriverStartOptions, event_channel, start_local};
use padu_core::model::{DriverEvent, InteractionMode, ProviderKind, RuntimeMode};

const DEFAULT_TIMEOUT: Duration = Duration::from_secs(60);

fn usage() -> &'static str {
    "Usage: cargo run -p padu-core --bin padu-provider-check -- <provider> [options]\n\n\
Providers: amp claude codex cursor deepseek elph fx gemini opencode grok kimi ohmypi pi\n\
Options:\n  --model <id>       Model to test (otherwise use the discovered default)\n  --binary <path>    Provider executable override\n  --prompt <text>    Prompt to send (default: reply with exactly: Padu provider check passed)\n  --timeout <secs>   Timeout for startup and prompt completion (default: 60)\n  -h, --help         Show this help"
}

fn parse_provider(value: &str) -> Option<ProviderKind> {
    ProviderKind::ALL
        .into_iter()
        .find(|provider| provider.id() == value.trim().to_ascii_lowercase())
}

fn main() -> Result<()> {
    let mut args = env::args().skip(1);
    let Some(provider_name) = args.next() else {
        println!("{}", usage());
        bail!("a provider is required");
    };
    if provider_name == "-h" || provider_name == "--help" {
        println!("{}", usage());
        return Ok(());
    }
    let provider = parse_provider(&provider_name)
        .ok_or_else(|| anyhow::anyhow!("unknown provider `{provider_name}`\n\n{}", usage()))?;

    let mut model = None;
    let mut binary = None;
    let mut prompt = "reply with exactly: Padu provider check passed".to_owned();
    let mut timeout = DEFAULT_TIMEOUT;
    while let Some(argument) = args.next() {
        match argument.as_str() {
            "--model" => model = Some(next_value(&mut args, "--model")?),
            "--binary" => binary = Some(PathBuf::from(next_value(&mut args, "--binary")?)),
            "--prompt" => prompt = next_value(&mut args, "--prompt")?,
            "--timeout" => {
                let seconds: u64 = next_value(&mut args, "--timeout")?.parse().map_err(|_| {
                    anyhow::anyhow!("--timeout must be a positive number of seconds")
                })?;
                timeout = Duration::from_secs(seconds.max(1));
            }
            "-h" | "--help" => {
                println!("{}", usage());
                return Ok(());
            }
            unknown => bail!("unknown argument `{unknown}`\n\n{}", usage()),
        }
    }

    let binary = binary
        .or_else(|| padu_core::command_env::find_executable(provider.command()))
        .ok_or_else(|| {
            anyhow::anyhow!(
                "{} executable `{}` was not found; use --binary to override it",
                provider.display_name(),
                provider.command()
            )
        })?;
    let cwd = env::current_dir()?;

    let discovered = padu_core::model_catalog::discover_catalog(provider, &binary).0;
    let model = model.or_else(|| {
        discovered
            .iter()
            .find(|model| model.is_default)
            .or_else(|| discovered.first())
            .map(|model| model.id.clone())
    });

    println!("provider: {}", provider.display_name());
    println!("binary:   {}", binary.display());
    println!("cwd:      {}", cwd.display());
    println!(
        "model:    {}",
        model.as_deref().unwrap_or("provider default")
    );
    if !discovered.is_empty() {
        println!(
            "catalog:  {}",
            discovered
                .iter()
                .map(|model| model.id.as_str())
                .collect::<Vec<_>>()
                .join(", ")
        );
    }
    println!("prompt:   {prompt}");
    println!("starting provider...");

    let (wake, _wake_receiver) = smol::channel::bounded(1);
    let (events, received) = event_channel(wake);
    let handle = start_local(
        provider,
        DriverStartOptions {
            binary,
            cwd,
            mode: RuntimeMode::FullAccess,
            interaction_mode: InteractionMode::Build,
            model,
            reasoning_effort: None,
            service_tier: None,
            context_window: None,
            agent_preset: None,
            computer_use_enabled: false,
            provider_cursor: None,
        },
        events,
    )?;

    let deadline = Instant::now() + timeout;
    loop {
        let remaining = deadline
            .checked_duration_since(Instant::now())
            .ok_or_else(|| anyhow::anyhow!("timed out waiting for provider startup"))?;
        let event = received
            .recv_timeout(remaining)
            .map_err(|_| anyhow::anyhow!("timed out waiting for provider startup"))?;
        match event {
            DriverEvent::Connected { provider_cursor } => {
                println!("connected: cursor={provider_cursor:?}");
                break;
            }
            DriverEvent::Error(error) => eprintln!("startup error: {error}"),
            DriverEvent::ProcessExited => bail!("provider exited before connecting"),
            other => println!("startup event: {other:?}"),
        }
    }

    println!("sending prompt...");
    handle.prompt(prompt);

    let mut text = String::new();
    loop {
        let remaining = deadline
            .checked_duration_since(Instant::now())
            .ok_or_else(|| anyhow::anyhow!("timed out waiting for prompt completion"))?;
        let event = received
            .recv_timeout(remaining)
            .map_err(|_| anyhow::anyhow!("timed out waiting for prompt completion"))?;
        match event {
            DriverEvent::TextDelta(delta) => {
                print!("{delta}");
                text.push_str(&delta);
            }
            DriverEvent::ReasoningDelta(delta) => eprintln!("\n[reasoning] {delta}"),
            DriverEvent::Activity {
                title,
                detail,
                complete,
                ..
            } => println!("\nactivity: {title} {detail:?} complete={complete}"),
            DriverEvent::TurnFinished { success, summary } => {
                println!("\nturn finished: success={success} summary={summary:?}");
                if success {
                    println!("provider check passed");
                    return Ok(());
                }
                bail!("provider returned an unsuccessful turn")
            }
            DriverEvent::Error(error) => eprintln!("\nprovider error: {error}"),
            DriverEvent::Permission { title, detail, .. } => {
                eprintln!("\npermission requested unexpectedly: {title}: {detail}")
            }
            DriverEvent::UserInputRequested { questions, .. } => {
                eprintln!("\nuser input requested unexpectedly: {questions:?}")
            }
            DriverEvent::ProcessExited => bail!("provider exited during prompt"),
            other => println!("\nevent: {other:?}"),
        }
    }
}

fn next_value(args: &mut impl Iterator<Item = String>, option: &str) -> Result<String> {
    args.next()
        .ok_or_else(|| anyhow::anyhow!("{option} requires a value"))
}
