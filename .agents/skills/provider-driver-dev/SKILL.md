---
name: provider-driver-dev
description: >-
  Implement, debug, and test external AI coding agent provider drivers in crates/padu-core/src/driver/,
  handling subprocess lifecycles, streaming event demuxing, reasoning token normalization, and session mocking.
---

# Provider Driver Development Skill

This skill guides the implementation, event normalization, and validation of AI agent provider drivers (e.g. Claude Code, Codex, DeepSeek, ACP, Amp, OpenCode, Pi) in `crates/padu-core/src/driver/`.

---

## When to Use This Skill

- Implementing a new LLM provider integration.
- Fixing streaming token delivery, reasoning chunk extraction, or tool call event ordering.
- Debugging subprocess startup, authentication, or abnormal process exit.
- Generating realistic mock session fixtures for tests.

---

## Workflow Steps

### Step 1: Implement `AgentDriver`
1. Create `crates/padu-core/src/driver/<provider>.rs`.
2. Implement the `AgentDriver` trait (start, send_turn, interrupt).
3. Register the new driver module in `crates/padu-core/src/driver/mod.rs`.

---

### Step 2: Normalize Provider Events
Ensure raw provider outputs map to `padu_protocol::RuntimeEvent`:
- Assistant text -> `RuntimeEvent::AssistantDelta`
- Model thinking -> `RuntimeEvent::ReasoningDelta` (ensure `markdown_changed` flag is routed on StreamFrame schedule)
- Tool calls -> `RuntimeEvent::ToolCallStart` / `RuntimeEvent::ToolCallComplete`
- Strip private provider tags and control markers.

---

### Step 3: Test with Mock Sessions
Generate and run mock session scenarios:
```bash
bun ./scripts/seed-mock-sessions.ts
```
Verify transcript rendering in both `Padu Debug.app` and `apps/web/`.

---

### Step 4: Run Driver Unit Tests
```bash
cargo test --package padu-core
cargo test --package padu-daemon
```

---

## References & Examples

- [Driver Architecture Reference](./references/driver-architecture.md)
- [Sample Driver Skeleton](./examples/sample-driver.rs)
