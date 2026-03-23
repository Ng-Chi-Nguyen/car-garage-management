# Task: 10-fix-status-badge-compatibility-and-record-verification-evidence

## Feature: design-system-remediation

## Dependencies

_None_

## Plan Section

_No plan section available._

## Context

## design-audit-summary

User requested a repo-wide audit to ensure pages and components are stylistically consistent with DESIGN.md. Read-only audit found systemic DESIGN.md mismatches concentrated in shared primitives and a few routed pages. Key shared offenders: client/src/components/layout/sidebar.jsx, client/src/components/layout/topbar.jsx, client/src/layouts/AppShell.jsx, client/src/components/ui/data-table.jsx, client/src/components/ui/search-input.jsx, client/src/components/ui/section-card.jsx, client/src/components/ui/stat-card.jsx, client/src/components/ui/page-header.jsx, client/src/components/ui/status-badge.jsx. Highest-risk routed pages inheriting mismatch: client/src/pages/finance/Receivables.jsx, client/src/pages/dashboard/dashboard-sections.jsx, client/src/pages/customers/customer-detail-page.jsx, client/src/pages/settings/settings-page.jsx, client/src/pages/activity/activity-log-page.jsx. DESIGN.md priorities: no 1px section borders, tonal layering over line separators, glassmorphism topbar/sidebar, sidebar active indicator instead of filled pill, no table divider lines, md inputs with ghost-border focus, editorial typography, minimal static shadows.

---

## scope-decision

Clarifying question answered for design-system-remediation planning.

Decision:
- Scope: UI only
- Meaning: standardize style/layout/tokens/components/page composition to align with DESIGN.md.
- Explicitly out of scope: business logic changes, data flow changes, API changes, backend work, domain behavior changes.

User selected: "UI only (Recommended)".

---

## execution-decisions

- User approved immediate remediation of the final two implementation-review blockers.
- Create a focused follow-up task to: (1) reconcile StatusBadge API compatibility (`children` vs `label`, plus `error` status mapping) across reconciled pages, and (2) record concrete lint/build verification evidence in Hive task artifacts before another Hygienic implementation review.
- Keep scope UI-only and verification-artifact-only; no backend/data-flow changes.

---

## post-review-remediation-findings

Post-review verification after Hygienic REJECT:
- Current workspace still has rejected UI primitive styles in stat-card, section-card, data-table, and search-input.
- status-badge is already compliant in current workspace.
- Task 02 contains improved stat-card / section-card / status-badge.
- Task 03 contains improved data-table / partially improved search-input.
- Current workspace still lags task 05 for settings, workshop, activity, customers, and inventory pages; strongest remaining drift is settings/workshop/activity.
- Tailwind/PostCSS config drift is real in current workspace: client/package.json includes @tailwindcss/postcss but client/postcss.config.js still uses tailwindcss + autoprefixer plugin config.
- Decision: create a focused remediation task to reconcile missing worker changes and finish remaining DESIGN.md alignment before any merge or feature completion.

---

## branch-mismatch-investigation

Investigation after second Hygienic REJECT:
- Task 08 worktree contains materially updated UI files vs current workspace for AppShell, Topbar, Sidebar, SectionCard, DataTable, SearchInput, Settings, Activity, and Workshop.
- Conclusion: Hygienic likely reviewed the parent/current branch for UI files rather than the latest task 08 worktree state.
- However, task 08 artifacts do not contain recorded lint/build evidence; the evidence gap is real.
- Config state is split/inverted:
  - current workspace uses `tailwindcss` + `autoprefixer` with `@tailwind` directives in index.css
  - task 08 uses `@tailwindcss/postcss` with `@import "tailwindcss"` and `@theme`
- Therefore task 08 should not be merged blindly. We need a deliberate reconcile step that combines the latest UI remediation with the correct/desired frontend config and then runs verifiable lint/build evidence before re-review.

## Completed Tasks

- 01-establish-shared-shell-surfaces-and-navigation-behavior: Refactored AppShell to use the proper surface base color (#f7f9fb). Updated Topbar and Sidebar to use glassmorphism (white/85 with 12px backdrop blur) and removed structural borders. Replaced Sidebar's filled active state with a left-edge primary indicator and 600-weight text. Fixed Tailwind PostCSS configuration to resolve Vite build error. All verification checks passed.
- 02-rebuild-shared-content-primitives-around-tonal-layering: Removed static 1px borders and shadows from SectionCard and StatCard, utilizing nested surfaces and spacing for hierarchy. Updated StatCard and PageHeader typography to align with DESIGN.md's editorial scale. Normalized StatusBadge to use the soft-fill approach (15% opacity background, fully opaque text). Fixed postcss config and verified that client builds successfully.
- 03-replace-line-based-table-and-input-primitives-with-designmd-compliant-versions: Refactored DataTable to remove border lines, updated headers to label-like styling with tracking, and added hover row backgrounds. Refactored SearchInput to use surface_container_lowest (bg-white), rounded-xl (0.75rem), and ghost border/glow focus per DESIGN.md. Verified with lint, build, and grep for legacy border classes (all passing).
- 04-normalize-dashboard-and-finance-pages-to-consume-the-corrected-primitives: Removed explicit borders and heavy shadows from dashboard sections and Receivables page. Replaced them with tonal layering and proper bento layout hierarchy. Rebuilt the Receivables page form fields and cards to adhere to the design specs. Fixed PostCSS configuration. Verified lint and build pass successfully.
- 05-normalize-crmsysteminventory-routed-pages-that-still-rely-on-line-based-structure: Refactored CRM, inventory, settings, and activity routed pages to replace hard border lines and structural dividers with tonal layering (`bg-surface-container-*`) and spacing. Replaced legacy table markup with shared `DataTable` primitive and updated typography/controls to inherit from the shared design system. Verified UI passes lint and builds successfully.
- 06-final-normalization-pass-for-currently-closer-routes-so-no-active-page-is-left-unreviewed: Normalized auth, intake, and workshop status routes to adhere strictly to the shared design system. Removed legacy `border-slate` and hard shadows, substituting them with `bg-surface-container` tonal layering, semantic color tokens, and `shadow-sm`. Cleaned up the placeholder files (`IntakeModalPage`, `RepairOrder`, `SettlementPrint`) with baseline surface tokens. Verified no ESLint errors and client builds successfully.
- 07-final-audit-pass-against-designmd-and-regression-verification: Updated postcss.config.js to use @tailwindcss/postcss to resolve Vite build errors. Performed final route-by-route audit against DESIGN.md and documented remaining legacy tailwind classes in DESIGN_COMPLIANCE_AUDIT.md as intentional exceptions for density/accessibility. Verified shared primitives effectively enforce the No-Line rule and tonal hierarchy. ESLint passes and Vite build succeeds without errors.
- 08-post-review-remediation-for-design-system-batch: Reconciled missing UI alignments across primitive components (stat-card, section-card, data-table, search-input) and shared layouts (Sidebar, Topbar). Swept all routed pages to strip out legacy 1px structural borders and heavy static shadows to enforce the No-Line rule. Added missing Tailwind v4 theme configuration to index.css and updated postcss.config.js. Verified lint and build pass successfully.
- 09-reconcile-ui-remediation-with-frontend-config-and-verification: Reconciled UI files from task 08 with the correct frontend configuration (Tailwind v4 using @tailwindcss/postcss). Restored correctly styled shared primitives (stat-card, section-card, data-table, search-input) and updated all page routes to remove structural borders and heavy static shadows, ensuring compliance with the No-Line rule and tonal hierarchy. Verified success via ESLint and full client build without errors.
