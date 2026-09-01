# Granular Commit Standards

## Commit Organization Rules

When implementing features, refactoring, or preparing changes for PR:
1. **Multiple Contextual Commits**:
   - Do not bundle unrelated changes into a single mega-commit.
   - Break commits down by logical component layer (e.g. protocol types, client reducers, native GPUI UI, web client components, documentation/skills).
2. **Conventional Commit Format**:
   - `feat(<scope>): description`
   - `fix(<scope>): description`
   - `docs(<scope>): description`
   - `perf(<scope>): description`
   - `refactor(<scope>): description`
   - `chore(<scope>): description`
3. **Atomic & Green**:
   - Each commit should be a coherent and valid step in the development history.
