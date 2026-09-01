---
name: protocol-parity-sync
description: >-
  Step-by-step runbook and verification tool for synchronizing wire protocol changes,
  generating TypeScript bindings, updating shared reducers, and ensuring UI/feature
  parity between Padu's native desktop (apps/desktop/), web (apps/web/), and mobile (apps/mobile/) clients.
---

# Protocol & Cross-Client Parity Skill

This skill guides the developer or agent through synchronizing wire protocol changes, generating TypeScript bindings, updating `@padu/client` state reducers, and maintaining feature parity across all client surfaces (Desktop, Web, and Mobile).

---

## When to Use This Skill

- Modifying or adding wire types in `crates/padu-protocol/`.
- Adding new agent events or daemon commands.
- Implementing a user-facing feature on one client (Desktop or Web) and creating its counterpart.
- Resolving TypeScript build errors caused by out-of-sync generated types in `packages/padu-client/src/generated/`.
- Validating cross-client parity before submitting PRs.

---

## Workflow Steps

### Step 1: Modify Rust Protocol & Export Types
1. Edit `crates/padu-protocol/src/lib.rs` (or relevant module).
2. Ensure types derive `#[derive(Serialize, Deserialize, TS)]` and `#[ts(export)]`.
3. If adding a new root type, add it to `crates/padu-protocol/src/bin/export_types.rs`.

---

### Step 2: Generate & Check TypeScript Bindings
Execute:
```bash
bun run protocol:generate
bun run protocol:check
```
Verify the generated files in `packages/padu-client/src/generated/` and commit them alongside your Rust changes.

---

### Step 3: Update `@padu/client` State & Presentation
1. Handle new events in `packages/padu-client/src/event-reducer.ts`.
2. Update presentation helpers if needed (`transcript-presentation.ts`, `composer-preferences.ts`).
3. Add unit tests in `packages/padu-client/src/*.test.ts`.
4. Run client checks:
   ```bash
   bun run --filter @padu/client check
   bun run --filter @padu/client test
   ```

---

### Step 4: Implement Desktop UI (GPUI)
1. Update `apps/desktop/src/ui/` or `apps/desktop/src/app/` to reflect the new state/event.
2. Adhere to GPUI native idioms, keyboard accessibility (`track_focus`, `focus_visible`), and zero blocking I/O on UI thread.

---

### Step 5: Implement Web & Mobile Client Parity
1. Update `apps/web/src/components/` and `apps/web/src/lib/`.
2. Update `apps/mobile/src/` if not desktop-exclusive.
3. Run typechecks & test suites:
   ```bash
   bun run --filter @padu/web typecheck
   bun run --filter @padu/web test
   bun run --filter @padu/mobile typecheck
   ```

---

### Step 6: Verify Parity with Helper Script
Execute the parity verification script:
```bash
.agents/skills/protocol-parity-sync/scripts/verify-parity.sh
```

---

## References & Examples

- [Parity Checklist](./references/parity-checklist.md)
- [Walkthrough: Adding a Protocol Event](./examples/adding-protocol-event.md)
