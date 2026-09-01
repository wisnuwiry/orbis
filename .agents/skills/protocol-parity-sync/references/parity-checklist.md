# Cross-Client Parity & Protocol Checklist

This checklist must be followed whenever implementing features, modifying event streams, or adjusting UI behavior across Padu's client surfaces.

---

## 1. Wire Protocol & Codegen Layer

When adding or modifying data exchanged between the daemon and clients:

- [ ] **Rust Definition**: Defined in `crates/padu-protocol/src/lib.rs` (or submodule) with `#[derive(Serialize, Deserialize, TS)]` and `#[ts(export)]`.
- [ ] **Export Binary**: Included in `crates/padu-protocol/src/bin/export_types.rs` if a new root export type.
- [ ] **Codegen**: Executed `bun run protocol:generate` and verified changes under `packages/padu-client/src/generated/`.
- [ ] **Verification**: `bun run protocol:check` exits with code 0.

---

## 2. Shared Client Layer (`packages/padu-client`)

- [ ] **Event Reducer**: If the protocol message affects session state, handle it in `packages/padu-client/src/event-reducer.ts`.
- [ ] **Presentation Helpers**: Formatters or derive functions updated in `packages/padu-client/src/transcript-presentation.ts`, `composer-preferences.ts`, or `provider-probe-cache.ts`.
- [ ] **Unit Tests**: Added test cases in `packages/padu-client/src/*.test.ts` verifying state transitions and edge cases.
- [ ] **Package Checks**: `bun run --filter @padu/client check` and `bun run --filter @padu/client test` pass.

---

## 3. Desktop Client Layer (`src/` in GPUI)

- [ ] **Native Idioms**: Respects GPUI styling, font rendering, keyboard navigation, and theme colors.
- [ ] **UI Thread Safety**: Zero blocking I/O in `render()` or row builders. Heavy work offloaded to `cx.background_executor().spawn`.
- [ ] **Focus & Accessibility**: Interactive controls use `track_focus`, `tab_index`, and `focus_visible`.
- [ ] **Pane Caching**: Uses `Entity::cached` where appropriate without breaking child notifications.

---

## 4. Web Client Layer (`apps/web/`)

- [ ] **Component Parity**: Corresponding React components implemented in `apps/web/src/components/`.
- [ ] **State Parity**: Uses `@padu/client` hooks or state machines without duplicating business logic.
- [ ] **Styling & Theme**: Tailwind CSS styling matching desktop dark/light surface tokens.
- [ ] **Typecheck & Tests**: `bun run --filter @padu/web typecheck` and `bun run --filter @padu/web test` pass.

---

## 5. Mobile Client Layer (`apps/mobile/`)

- [ ] **Mobile Touch UX**: Touch targets are at least 44x44pt.
- [ ] **Client Parity**: Uses `@padu/client` core reducers.
- [ ] **Typecheck**: `bun run --filter @padu/mobile typecheck` passes.
