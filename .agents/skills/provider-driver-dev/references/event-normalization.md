# Event Normalization Reference for Provider Drivers

All provider outputs (ACP notifications, JSON-RPC lines, SSE events, or custom stdout formats) must be normalized into typed `padu_protocol::model::DriverEvent`s before being dispatched to the UI and state reducers.

---

## 1. `DriverEvent` Variants Reference

| `DriverEvent` Variant | Payload | Purpose | UI Effect |
| :--- | :--- | :--- | :--- |
| `Connected` | `{ provider_cursor: Option<ProviderResumeCursor> }` | Handshake established; reports session/thread ID | Marks session active, updates session cursor |
| `TurnStarted` | None | Indicates provider began processing prompt | Sets busy spinner, disables prompt submission |
| `TextDelta` | `String` | Assistant output text chunk | Appends streaming markdown text |
| `ReasoningDelta` | `String` | Model reasoning / thinking chunk | Appends to collapsible Thought fold |
| `RichActivity` | `ActivityItem` | Tool call (command, edit, search, etc.) | Renders structured tool badge & output |
| `Activity` | `{ id, kind, title, detail, complete }` | Generic milestone (e.g. plan updated) | Updates progress status bar |
| `PermissionRequested` | `{ request_id, options, ... }` | Agent requests permission (e.g. bash execution) | Renders permission modal (Allow / Deny) |
| `UserInputRequested` | `{ request_id, questions }` | Agent asks interactive questions (`ask_question`) | Renders interactive choice modal |
| `TurnFinished` | `{ success: bool, summary: Option<String> }` | Active turn has completed | Commits turn checkpoint, re-enables composer |
| `Error` | `String` | Provider-level or turn error message | Displays error banner in transcript |
| `ProcessExited` | None | Subprocess terminated | Marks session disconnected |
| `SteerAccepted` | `{ message: String }` | Mid-turn prompt steering accepted | Appends steering indicator to active turn |
| `SteerRejected` | `{ message: String, reason: String }` | Mid-turn prompt steering rejected | Reverts steered message to composer |

---

## 2. Token Normalization Rules

### Assistant Output (`TextDelta`)
- Emit plain text chunks as they arrive from the agent.
- Do not accumulate whole paragraphs before emitting; streaming responsiveness is a core requirement.
- Clean and strip raw ANSI escape codes if the provider leaks terminal escape sequences.

### Model Reasoning / Thinking (`ReasoningDelta`)
- High-reasoning models (Claude 3.7 Sonnet / Opus 4, OpenAI o1/o3, DeepSeek R1, Grok) stream thinking tokens separately.
- Normalize thinking tokens into `DriverEvent::ReasoningDelta`.
- In transcripts, reasoning tokens render within a distinct collapsible thought container.
- Strip any proprietary bounding tags (e.g. `<thinking>`, `</thinking>`, `<thought>`, `<<THOUGHT>>`).

### Tool Calls & Activities (`RichActivity`)
- `ActivityItem` fields:
  - `id: String`: Unique ID of the tool call (e.g. `toolu_123` or UUID).
  - `kind: ActivityKind`: One of `Command`, `FileRead`, `FileEdit`, `Search`, `Plan`, `Custom`.
  - `title: String`: Concise description (e.g. `Running git status` or `Editing src/main.rs`).
  - `detail: Option<String>`: Extra context (e.g. file path or command line).
  - `output: Option<String>`: Subprocess output or tool response text.
  - `complete: bool`: Set to `false` when tool starts, `true` when output arrives.
- Forward initial `RichActivity` with `complete: false` as soon as the tool invocation begins.
- Forward updated `RichActivity` with `output` and `complete: true` when tool finishes.

---

## 3. Streaming Cadence & Performance Rules

See `docs/performance.md` for strict streaming constraints:
- **Stream Commit Cadence**: commits to disk/state must be rate-limited to ≤ **8.3 Hz** (~120ms intervals).
- **Pulse Clock Motion**: decorative motion/animations must tick at ≤ **30 Hz**.
- **No Blocking Calls in Event Handlers**:
  All message parsing must be zero-allocation or minimal-allocation. Never perform disk I/O, Git operations, or locks on GPUI render paths.
