# Example: Pre-PR Code Review Report

```markdown
# 🔍 Pre-PR Code Review Report

**Target Branch:** `main`  
**Feature Branch:** `feature/new-composer-toolbar`  
**Review Status:** ✅ READY FOR PR (or ⚠️ ACTION REQUIRED)  

---

## 1. Executive Summary
The proposed changes implement keyboard navigation and quick-action shortcuts in the composer toolbar for both the desktop app and the web client. Automated checks passed and client parity is maintained.

---

## 2. Automated Checks Status

| Check | Status | Command / Log |
| :--- | :---: | :--- |
| **Rust Code Formatting** | ✅ PASS | `cargo fmt ... --check` |
| **Cargo Check** | ✅ PASS | `cargo check` |
| **Rust Unit Tests** | ✅ PASS | `cargo test` (142 tests passed) |
| **Protocol Types Sync** | ✅ PASS | `bun run protocol:check` |
| **Padu Client Suite** | ✅ PASS | `bun run --filter @padu/client test` |
| **Web Typecheck & Tests**| ✅ PASS | `bun run web:typecheck` |

---

## 3. Detailed Code Findings

### 🔴 Blockers (0)
*None.*

### 🟡 Warnings & Recommendations (1)
- **`src/ui/composer.rs:184`**: Ensure tooltip timer resets when focus is lost quickly via Escape key.

### 🟢 Code Style & Suggestions (1)
- **`apps/web/src/components/toolbar.tsx:42`**: Optional simplification with optional chaining `item?.action?.()`.

---

## 4. Architectural & Safety Rubric Check

- [x] **Zero UI Thread Blocking**: No sync I/O or subprocesses in `render()`.
- [x] **Desktop / Web Parity**: Both native and web implementations present.
- [x] **Accessibility**: Full keyboard navigation & visible focus rings implemented.
- [x] **Error Handling**: No bare `.unwrap()` in fallible parsing logic.
- [x] **Clean Diff**: No `.DS_Store`, debug `console.log`, or secrets.

---

## 5. Next Steps
1. Resolve the minor tooltip warning in `src/ui/composer.rs`.
2. Proceed with opening the Pull Request using the generated PR template.
```
