# Provider Driver Architecture in Padu

This document outlines the internal architecture for driving and orchestrating AI coding agent CLIs in `crates/padu-core/src/driver/`.

---

## 1. Architectural Overview

Padu executes agent CLIs directly on the user's workstation or remote daemon host. It never calls remote LLM APIs directly when driving an agent; it communicates with the agent's native CLI via standard I/O streams or long-lived protocol sessions.

```mermaid
graph TD
    UI["Padu Clients (Desktop GPUI / Web React)"] <==>|WebSocket JSON-RPC| Daemon["padu-daemon (Daemon Dispatcher)"]
    
    Daemon -->|DriverHandle| DriverControl["dyn DriverControl"]
    
    subgraph Core ["crates/padu-core/src/driver"]
        DriverControl -->|ACP Driver| AcpRuntime["AcpDriver (agent-client-protocol SDK)"]
        DriverControl -->|Native Driver| NativeRuntime["Claude / Codex / OpenCode / Pi / Amp"]
        
        AcpRuntime --> ProcessA["Child Process (stdio)"]
        NativeRuntime --> ProcessB["Child Process (stdio / RPC)"]
    end
    
    ProcessA -->|Reader Thread| EventSender["DriverEventSender"]
    ProcessB -->|Reader Thread| EventSender
    
    EventSender -->|crossbeam_channel (unbounded)| Events["DriverEvent Buffer"]
    EventSender -->|smol::channel (bounded wake)| Wake["UI / Loop Wake Signal"]
```

---

## 2. Core Traits and Primitives

### `DriverControl` Trait
The primary abstraction implemented by all drivers in `crates/padu-core/src/driver/`:

```rust
pub trait DriverControl: Send + Sync {
    /// Submit a user prompt to start or continue a turn.
    fn prompt(&self, prompt: String);

    /// Whether this transport supports mid-turn steering without waiting for turn settlement.
    fn supports_steer(&self) -> bool { false }

    /// Deliver a steering prompt to the currently running turn.
    fn steer(&self, prompt: String) {}

    /// Cancel the active turn or abort subprocess execution.
    fn cancel(&self);

    /// Cancel active computer-use tool invocation.
    fn cancel_computer_use(&self) {}

    /// Refresh status of long-running background tasks.
    fn refresh_background_work(&self) {}

    /// Terminate a background job owned by this agent session.
    fn stop_background_work(&self, key: BackgroundWorkKey, control_id: String) {}

    /// Respond to an interactive permission request (e.g. tool approval).
    fn respond(&self, request_id: String, option_id: String);

    /// Respond to structured interactive user input questions (e.g. ask_question).
    fn respond_user_input(&self, request_id: String, answers: Vec<UserInputAnswer>) {}

    /// Mutate or inspect provider-persisted thread goals.
    fn goal(&self, operation: GoalOperation) {}

    /// Run or reject headless computer-use requests.
    fn run_computer_tool(&self, request: ComputerToolRequest) {}
    fn reject_computer_tool(&self, request: ComputerToolRequest, reason: String) {}

    /// Apply updated turn options (e.g. model, reasoning effort) without restarting.
    /// Returns true if applied in place, or false if the session must be recreated.
    fn apply_options(&self, options: SessionOptions) -> bool { false }

    /// Roll back N turns in conversation history.
    fn rollback(&self, turns: usize) -> anyhow::Result<Option<ProviderResumeCursor>>;

    /// Fork the conversation into a new session branch, dropping N trailing turns.
    fn fork(&self, turns_to_remove: usize) -> anyhow::Result<ProviderResumeCursor> {
        anyhow::bail!("conversation forking is not supported by this provider transport")
    }
}
```

### Event Channel & Wake Coalescing
Padu separates the delivery of event payloads from the waking of the UI thread to guarantee **zero dropped events** with **bounded UI wakeups**:

```rust
pub struct DriverEventSender {
    events: Sender<DriverEvent>,            // crossbeam unbounded queue (never drops)
    wake: smol::channel::Sender<()>,        // bounded(1) wake channel (coalesces wakes)
}
```

Multiple stream writes from the agent reader thread coalesce into a single wake trigger without ever blocking the child process reader or dropping events.

---

## 3. The Two Integration Pathways

### Path A: Agent Client Protocol (ACP)
The open [Agent Client Protocol](https://agentclientprotocol.com) is Padu's preferred integration path. Agents implementing ACP (e.g. Cursor, Grok, Kimi, Cline, Goose, Gemini CLI) run through `crates/padu-core/src/driver/acp.rs`.

**Key Benefits**:
- Uses official `agent-client-protocol` SDK.
- Protocol framing, request/response correlation, cancellation, and error handling are handled by the SDK.
- Adding a new ACP agent only requires registering its CLI executable and launch arguments in `acp.rs::launch_for()`.

### Path B: Native Custom Driver
For agents that use bespoke stdin/stdout protocols, custom SSE endpoints, or unique subprocess interactions (e.g., Anthropic Claude Code, OpenAI Codex, OpenCode, Pi, Amp):
- Implement a dedicated module in `crates/padu-core/src/driver/<name>.rs`.
- Manage child process startup with `crate::command_env::command()`.
- Spawn background reader threads to parse stdout lines into typed `DriverEvent` payloads.
- Handle process exit and errors gracefully, emitting `DriverEvent::ProcessExited`.

---

## 4. Subprocess Lifecycle Invariants

1. **Signal Normalization**:
   Before launching child processes, drivers must call `crate::command_env::unblock_sigchld_for_current_thread()` so child exit signals are caught reliably across operating systems.
2. **Environment Sanitization**:
   Inherit clean host shell environment via `crate::command_env::shell_environment()` and pass session working directory via `cwd`.
3. **No UI Blocking**:
   Subprocess spawns, blocking reads, and network requests MUST run on background threads. Never perform subprocess I/O on GPUI render paths.
4. **Ordering & Marker Stripping**:
   Reasoning deltas, text deltas, and tool calls must be forwarded in the exact order received. Strip proprietary XML tags (e.g. `<thought>`, `<ant_thought>`) before emission.
