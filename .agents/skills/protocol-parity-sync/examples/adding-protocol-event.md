# Example: End-to-End Workflow for Adding a Protocol Event

This example demonstrates how to add a new event `CustomModelStatus` across all layers of the Padu stack.

---

### Step 1: Define Rust Protocol Type
Edit `crates/padu-protocol/src/lib.rs`:

```rust
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct CustomModelStatus {
    pub provider_id: String,
    pub is_available: bool,
    pub latency_ms: Option<u64>,
}
```

Add to `ServerMessage` enum if emitted from daemon:
```rust
#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[serde(tag = "type", content = "payload")]
#[ts(export)]
pub enum ServerMessage {
    // ...
    CustomModelStatus(CustomModelStatus),
}
```

---

### Step 2: Generate TypeScript Bindings
Run:
```bash
bun run protocol:generate
bun run protocol:check
```

This generates `packages/padu-client/src/generated/CustomModelStatus.ts`.

---

### Step 3: Update Client Reducer & Tests
In `packages/padu-client/src/event-reducer.ts`:

```typescript
import type { CustomModelStatus } from './generated/CustomModelStatus';

export function reduceCustomModelStatus(state: SessionState, event: CustomModelStatus): SessionState {
  return {
    ...state,
    modelStatuses: {
      ...state.modelStatuses,
      [event.provider_id]: {
        isAvailable: event.is_available,
        latencyMs: event.latency_ms ?? null,
      },
    },
  };
}
```

Add unit test in `packages/padu-client/src/event-reducer.test.ts` and run:
```bash
bun run --filter @padu/client test
```

---

### Step 4: Update Desktop UI (GPUI)
In `src/ui/model_picker.rs` or `src/app/composer.rs`:
- Render status indicator based on `is_available` and `latency_ms`.
- Ensure keyboard focus is preserved.

---

### Step 5: Update Web UI (React)
In `apps/web/src/components/ModelPicker.tsx`:
- Render identical badge/indicator with Tailwind CSS.

---

### Step 6: Verify Parity
Run:
```bash
.agents/skills/protocol-parity-sync/scripts/verify-parity.sh
```
