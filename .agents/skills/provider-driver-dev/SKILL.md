---
name: provider-driver-dev
description: >-
  Implement, test, and maintain external AI coding agent provider drivers in crates/padu-core/src/driver/,
  handling ACP (Agent Client Protocol) integration, subprocess lifecycles, streaming event demuxing,
  reasoning token normalization, and automated CLI verification.
---

# Provider Driver Development Skill

This skill guides the implementation, event normalization, and validation of AI coding agent provider drivers in `crates/padu-core/src/driver/` across both **Agent Client Protocol (ACP)** and **Native Subprocess** architectures.

---

## 1. When to Use This Skill

- Connecting a new coding agent CLI (e.g. from [paseo.sh/agents](https://paseo.sh/agents) such as GitHub Copilot, Cline, Goose, Gemini CLI, Qwen Code, etc.).
- Implementing or updating a native driver (Claude Code, OpenAI Codex, OpenCode, Pi, Amp, DeepSeek).
- Debugging subprocess lifecycles, signal handling, streaming token demuxing, or tool call event ordering.
- Testing binary detection, live connection, model discovery, model switching, forking, and rollback using `bun run provider:test`.

---

## 2. Decision Tree: ACP vs Native Driver

Before writing code, identify whether the agent CLI supports the **Agent Client Protocol (ACP)**:

```mermaid
graph TD
    Agent["New Coding Agent CLI"] --> SpeaksACP{"Does it support ACP<br/>(stdio / JSON-RPC)?"}
    
    SpeaksACP -->|Yes (e.g. Cline, Goose, Gemini, Qwen, Cursor)| PathA["Path A: ACP Integration<br/>(Zero custom driver code needed)"]
    SpeaksACP -->|No (e.g. Claude, Codex, OpenCode, Pi, Amp)| PathB["Path B: Native Custom Driver<br/>(Implement DriverControl trait)"]
```

- **Path A (ACP Driver)**: Use Padu's unified `AcpDriver` (`crates/padu-core/src/driver/acp.rs`). The official `agent-client-protocol` SDK handles process spawning, protocol framing, request correlation, cancellation, and error handling out of the box.
- **Path B (Native Driver)**: Write a custom module in `crates/padu-core/src/driver/<name>.rs` implementing the `DriverControl` trait.

---

## 3. Workflow: Path A (ACP Integration)

### Step 1: Scaffold Boilerplate
Run the provider scaffolding helper to generate exact code snippets:
```bash
bun .agents/skills/provider-driver-dev/scripts/scaffold-provider.ts <id> "<DisplayName>" <binary> --acp
```

### Step 2: Register in `crates/padu-protocol/src/model.rs`
1. Add the new variant to `pub enum ProviderKind`.
2. Update `ProviderKind::ALL`, `id()`, `display_name()`, `short_name()`, and `command()`.
3. Set capabilities:
   - `supports_conversation_rollback(self) -> bool`
   - `supports_conversation_fork(self) -> bool`
   - `supports_model_discovery(self) -> bool`

### Step 3: Register in `crates/padu-core/src/driver/acp.rs`
1. In `launch_for(provider: ProviderKind, ...)`, specify CLI arguments:
   ```rust
   ProviderKind::MyAgent => Ok(AcpLaunch {
       args: vec!["acp".into()],
       env: Vec::new(),
   }),
   ```
2. In `crates/padu-core/src/driver/mod.rs`, ensure `start_local()` routes the provider to `AcpDriver::start()`.

### Step 4: Add Model Catalog in `crates/padu-core/src/model_catalog.rs`
1. Define static fallback models in `pub fn fallback_models(provider: ProviderKind)`.
2. If the agent advertises models via ACP `session/config_options`, dynamic discovery is handled automatically.

### Step 5: Regenerate Protocol Bindings
```bash
bun run protocol:generate
bun run protocol:check
```

### Step 6: Test with the Provider Testing CLI
Run the testing battery to verify functionality:
```bash
bun run provider:test probe <id>
bun run provider:test models <id>
bun run provider:test connect <id>
bun run provider:test turn <id> "Reply with PONG"
bun run provider:test suite <id>
```

---

## 4. Workflow: Path B (Native Custom Driver)

### Step 1: Create Driver Module
1. Create `crates/padu-core/src/driver/<provider>.rs` using [`examples/sample-native-driver.rs`](./examples/sample-native-driver.rs).
2. Implement the `DriverControl` trait:
   - `prompt(&self, prompt: String)`
   - `cancel(&self)`
   - `respond(&self, request_id: String, option_id: String)`
   - `respond_user_input(&self, request_id: String, answers: Vec<UserInputAnswer>)`
   - `apply_options(&self, options: SessionOptions) -> bool`
   - `rollback(&self, turns: usize) -> anyhow::Result<Option<ProviderResumeCursor>>`
   - `fork(&self, turns_to_remove: usize) -> anyhow::Result<ProviderResumeCursor>`

### Step 2: Spawn Process & Normalize Events
1. Spawn the subprocess using `crate::command_env::command(&binary)`.
2. Spawn background reader threads for stdout/stderr. Never block the caller or UI thread.
3. Normalize raw outputs into typed `DriverEvent` payloads and forward through `DriverEventSender`:
   - Text chunks -> `DriverEvent::TextDelta(chunk)`
   - Model thinking -> `DriverEvent::ReasoningDelta(thought)` (strip `<thought>` tags)
   - Tool calls -> `DriverEvent::RichActivity(ActivityItem)`
   - Settlement -> `DriverEvent::TurnFinished { success, summary }`
   - Process exit -> `DriverEvent::ProcessExited`

### Step 3: Register in `crates/padu-core/src/driver/mod.rs`
1. Add `mod <provider>;`.
2. Add a match arm in `pub fn start_local()` returning `Arc::new(<provider>::MyDriver::start(options, events)?)`.

### Step 4: Verify with the Provider Testing CLI
```bash
bun run provider:test probe <provider>
bun run provider:test models <provider>
bun run provider:test turn <provider> "Reply with PONG"
bun run provider:test switch-model <provider> <target-model>
bun run provider:test suite <provider>
```

---

## 5. Provider Testing CLI Reference (`padu-provider-test`)

Padu includes a dedicated CLI testing tool to validate provider drivers before committing code:

```bash
# List all providers and detection status
bun run provider:test list

# Inspect binary path and detected CLI version
bun run provider:test probe <provider>

# Discover models, tiers, and presets
bun run provider:test models <provider>

# Test connection handshake and session cursor
bun run provider:test connect <provider>

# Test live token & reasoning stream on a prompt
bun run provider:test turn <provider> "Write a hello world function in Rust"

# Test dynamic in-place model switching
bun run provider:test switch-model <provider> <model-name>

# Test conversation forking
bun run provider:test fork <provider>

# Test conversation rollback
bun run provider:test rollback <provider>

# Test session re-attachment
bun run provider:test resume <provider> <session-id>

# Run complete diagnostic test matrix (returns JSON with --json)
bun run provider:test suite <provider> --json
```

---

## 6. Performance & Cadence Invariants

Follow the performance rules documented in `docs/performance.md`:
1. **Zero UI Thread Blocking**: Never spawn subprocesses, walk directories, or make blocking calls on GPUI render paths. Move all I/O to background reader threads.
2. **Stream Cadence**: Stream commits to state/disk must be rate-limited to ≤ **8.3 Hz** (~120ms intervals).
3. **Pulse Motion**: Decorative animations must tick at ≤ **30 Hz** and respect `cx.reduce_motion()`.
4. **Wake Coalescing**: Always send events through `DriverEventSender`, which pairs an unbounded event queue with a bounded wake channel to prevent UI thrashing.

---

## 7. Pre-PR Parity Checklist

Before opening a PR for a new or modified provider:
- [ ] Registered in `crates/padu-protocol/src/model.rs` (`ProviderKind`, `ProviderResumeCursor`).
- [ ] Codegen synced: `bun run protocol:generate` and `bun run protocol:check`.
- [ ] Desktop UI parity: icon added to `apps/desktop/assets/icons/` and registered in UI menus.
- [ ] Web client parity: icons and provider components updated in `apps/web/`.
- [ ] Landing catalog updated in `apps/landing/src/data/agent-pages.ts`.
- [ ] Automated verification script passes:
  ```bash
  .agents/skills/provider-driver-dev/scripts/verify-driver.sh
  ```
- [ ] Driver suite passes:
  ```bash
  bun run provider:test suite <provider>
  ```

---

## 8. References & Examples

- [Driver Architecture Reference](./references/driver-architecture.md)
- [Event Normalization Reference](./references/event-normalization.md)
- [ACP Registration Example](./examples/sample-acp-registration.rs)
- [Native Driver Skeleton](./examples/sample-native-driver.rs)
- [Provider Scaffolding Script](./scripts/scaffold-provider.ts)
- [Verification Script](./scripts/verify-driver.sh)
