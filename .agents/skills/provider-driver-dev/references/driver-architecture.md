# Provider Driver Architecture in Padu

This document outlines the architecture for integrating AI coding agent providers in `crates/padu-core/src/driver/`.

---

## 1. Core Abstraction: `AgentDriver`

Every agent provider (Claude Code, Codex, DeepSeek, ACP, Amp, OpenCode, Pi) implements the `AgentDriver` trait:

```rust
#[async_trait]
pub trait AgentDriver: Send + Sync {
    /// Spawns the provider process or connects to the remote service.
    async fn start(&self, session: &SessionConfig) -> Result<DriverHandle, DriverError>;

    /// Sends a user prompt or tool response to the active provider session.
    async fn send_turn(&self, handle: &mut DriverHandle, turn: TurnPayload) -> Result<(), DriverError>;

    /// Cancels the current running turn.
    async fn interrupt(&self, handle: &mut DriverHandle) -> Result<(), DriverError>;
}
```

---

## 2. Event Stream Normalization

The daemon multiplexer expects normalized runtime events:

| Provider Native Event | Normalized Event | Stream Frame Flag |
| :--- | :--- | :--- |
| Text delta chunk | `RuntimeEvent::AssistantDelta` | `markdown_changed = true` |
| Reasoning / thinking delta | `RuntimeEvent::ReasoningDelta` | `markdown_changed = true` (**critical**) |
| Tool invocation start | `RuntimeEvent::ToolCallStart` | `turn_activity_changed = true` |
| Tool invocation result | `RuntimeEvent::ToolCallComplete`| `turn_activity_changed = true` |
| Turn finished | `RuntimeEvent::TurnSettled` | Commits final turn state |

---

## 3. Key Invariants

1. **Ordering Preservation**: Provider reasoning tokens, text tokens, and tool call lifecycle events must be forwarded in exact payload arrival order.
2. **No Private Marker Leaks**: Strip any internal control markers (e.g. `<<THOUGHT>>`, `<ant_thought>`, XML wrappers) before forwarding to transcript.
3. **Subprocess Graceful Teardown**: Drivers must capture process exit codes, handle SIGINT on interruption, and restart cleanly if crashed.
4. **Mock Testing**: Use `scripts/seed-mock-sessions.ts` to test transcripts and reducers with realistic recorded payloads.
