## Summary

<!-- One paragraph: what problem does this solve and what approach was chosen. -->

## Changes

<!-- Bulleted list of what was done, grouped by area. -->

### Native Desktop (`src/`)
- 

### Web Client (`apps/web/`)
- 

### Protocol / Shared (`crates/`, `packages/`)
- 

## Checks

<!-- Mark each with ✅ (passed), ❌ (failed — explain why), or ➖ (skipped — explain why). -->

| Check | Status |
| :--- | :--- |
| `cargo fmt ... --check` |  |
| `cargo check` |  |
| `cargo test` |  |
| `bun run protocol:check` |  |
| `@padu/client check & test` |  |
| `@padu/web typecheck & test` |  |
| Manual validation in debug app |  |

## Performance

<!-- Delete this section if no render/streaming paths were touched. -->

- [ ] Zero blocking I/O in `render()` / row builders
- [ ] No `request_animation_frame` during streaming
- [ ] No `window.refresh()` during streaming
- [ ] Streaming cadence preserved (≤ 8.3 Hz commits, ≤ 30 Hz pulse)
- [ ] New collections virtualized with `list()`

## Accessibility

<!-- Delete this section if no interactive elements were added/changed. -->

- [ ] Keyboard operable (`track_focus`, `tab_index`)
- [ ] Visible focus treatment
- [ ] `reduce_motion` honored
- [ ] No color-only meaning

## Parity

<!-- Delete if the change is backend-only or platform-exclusive. -->

- [ ] Desktop and web updated together
- [ ] Protocol types regenerated (if applicable)

## Screenshots / Recordings

<!-- Attach for user-visible changes. Show both desktop and web when parity applies. -->

## Limitations & Follow-ups

- 

## Related Issues

Closes #
