# Pull Request Template & Guidelines

Use this structure when composing the final Pull Request description.

---

```markdown
## Summary

Brief summary explaining the problem and the chosen solution.

- What was changed?
- Why was this change made?

## Key Changes

- **Component / Crate / Package**: Detail the specific updates.
- **Protocol / Parity**: Note any protocol updates or parity implementations across `src/` and `apps/web/`.

## Checks Conducted

- [x] `cargo fmt --package padu --package padu-protocol --package padu-client --package padu-core --package padu-daemon -- --check`
- [x] `cargo check`
- [x] `cargo test`
- [x] `bun run protocol:check`
- [x] `bun run --filter @padu/client check`
- [x] `bun run --filter @padu/client test`
- [x] `bun run web:typecheck` & `bun run web:test`
- [x] Manual validation on `Padu Debug.app` / Browser client

## Accessibility & Performance Verification

- [x] Verified zero blocking I/O on UI thread / `render()`
- [x] Verified keyboard navigation and focus rings
- [x] Verified system reduce-motion compliance

## Limitations & Follow-ups

- Known edge cases, limitations, or follow-up items (if any).

## Related Issues

Closes #<issue_number>
```
