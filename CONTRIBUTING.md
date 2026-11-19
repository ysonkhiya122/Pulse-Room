# Contributing to Pulse Room

## 1. Branching & Commit Conventions
- Work in short-lived feature branches: `feat/<feature-name>`, `fix/<bug-name>`.
- Use Conventional Commits: `feat(scope): message`, `fix(scope): message`.
- All PRs are squash-merged into `main`.

## 2. Definition of Done
Before opening a pull request, verify that:
- [ ] TypeScript passes with zero errors: `npm run build`.
- [ ] All unit and component tests pass: `npm run test`.
- [ ] `npm run check-env` passes (no server secrets prefixed with `VITE_`).
- [ ] The app runs cleanly in **Demo Mode** with zero network calls and zero keys.
- [ ] Every new component adheres to WCAG 2.2 AA accessibility standards.
- [ ] Documentation is updated with the changes made.
