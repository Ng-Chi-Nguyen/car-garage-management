Investigation after second Hygienic REJECT:
- Task 08 worktree contains materially updated UI files vs current workspace for AppShell, Topbar, Sidebar, SectionCard, DataTable, SearchInput, Settings, Activity, and Workshop.
- Conclusion: Hygienic likely reviewed the parent/current branch for UI files rather than the latest task 08 worktree state.
- However, task 08 artifacts do not contain recorded lint/build evidence; the evidence gap is real.
- Config state is split/inverted:
  - current workspace uses `tailwindcss` + `autoprefixer` with `@tailwind` directives in index.css
  - task 08 uses `@tailwindcss/postcss` with `@import "tailwindcss"` and `@theme`
- Therefore task 08 should not be merged blindly. We need a deliberate reconcile step that combines the latest UI remediation with the correct/desired frontend config and then runs verifiable lint/build evidence before re-review.