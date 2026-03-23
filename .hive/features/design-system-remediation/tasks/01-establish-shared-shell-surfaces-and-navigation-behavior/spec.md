# Task: 01-establish-shared-shell-surfaces-and-navigation-behavior

## Feature: design-system-remediation

## Dependencies

_None_

## Plan Section

### 1. Establish shared shell surfaces and navigation behavior

**Depends on**: none

**Files:**
- Modify: `client/src/layouts/AppShell.jsx`
- Modify: `client/src/components/layout/topbar.jsx`
- Modify: `client/src/components/layout/sidebar.jsx`
- Test: `client/package.json`

**What to do**:
- Step 1: Refactor AppShell so the page canvas and content wrappers express the `surface` -> `surface_container_low` -> `surface_container_lowest` hierarchy from `DESIGN.md`.
- Step 2: Update Topbar to use blurred/translucent glassmorphism styling instead of opaque white + hard border.
- Step 3: Update Sidebar to use tonal surfaces, remove line separators where they are acting as structure, and replace the filled active pill with the left-edge primary indicator + 600-weight text pattern.
- Step 4: Ensure spacing/radius choices align with the Mechanical Atelier look: breathable whitespace, lg/xl cards, minimal static shadows.
- Step 5: Run verification commands.

**Must NOT do**:
- Do not change navigation structure, route definitions, or menu information architecture.
- Do not introduce a new state management pattern.

**References**:
- `DESIGN.md:13-29` — surface layering and glassmorphism rules.
- `DESIGN.md:86-89` — sidebar active-item specification.
- `client/src/components/layout/sidebar.jsx` — current active-item and separator implementation.
- `client/src/components/layout/topbar.jsx` — current opaque topbar implementation.

**Verify**:
- [ ] Run: `npm run lint` in `client/` → no ESLint errors
- [ ] Run: `npm run build` in `client/` → Vite build succeeds
- [ ] Run: `grep -R "border-[trblxy]?\|border-b\|border-t" client/src/components/layout client/src/layouts --include="*.jsx" --include="*.tsx"` → remaining matches are intentional exceptions only, not primary shell sectioning
- [ ] Re-read `client/src/components/layout/sidebar.jsx`, `client/src/components/layout/topbar.jsx`, `client/src/layouts/AppShell.jsx` and confirm:
  - no opaque line-based shell separation remains as the primary structural device
  - sidebar active item uses an indicator pattern rather than a filled box
  - topbar/sidebar use translucent or tonal shell treatment consistent with `DESIGN.md:27-29,86-89`

## Task Type

modification

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

User approved revised plan for feature `design-system-remediation` and chose subagent-driven execution. Current runnable set after task sync contains only Task 1 (`01-establish-shared-shell-surfaces-and-navigation-behavior`), so execution proceeds sequentially without parallelization. Future batches should re-check runnable tasks with hive_status before asking about any parallel execution.
