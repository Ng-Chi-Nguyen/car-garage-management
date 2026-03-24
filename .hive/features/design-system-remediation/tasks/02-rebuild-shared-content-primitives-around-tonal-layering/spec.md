# Task: 02-rebuild-shared-content-primitives-around-tonal-layering

## Feature: design-system-remediation

## Dependencies

- **1. establish-shared-shell-surfaces-and-navigation-behavior** (01-establish-shared-shell-surfaces-and-navigation-behavior)

## Plan Section

### 2. Rebuild shared content primitives around tonal layering

**Depends on**: 1

**Files:**
- Modify: `client/src/components/ui/section-card.jsx`
- Modify: `client/src/components/ui/stat-card.jsx`
- Modify: `client/src/components/ui/page-header.jsx`
- Modify: `client/src/components/ui/status-badge.jsx`
- Test: `client/package.json`

**What to do**:
- Step 1: Remove section/card reliance on 1px borders as primary separators; use nested surfaces and spacing to create hierarchy.
- Step 2: Normalize `StatCard` to the design system’s metric-card hierarchy: strong number, softer label, restrained support text, and minimal/no static shadow.
- Step 3: Tune `PageHeader` typography and spacing to better express headline/body roles from `DESIGN.md`.
- Step 4: Normalize `StatusBadge` variants to the soft-fill approach described in `DESIGN.md` using gentle tinted backgrounds and fully opaque text color.
- Step 5: Preserve current component APIs unless a purely presentational UI-only prop adjustment is unavoidable.
- Step 6: Run verification commands.

**Must NOT do**:
- Do not remove backward-compatibility support already added for page consumers unless all call sites in scope are updated in the same task.
- Do not introduce new business-oriented props or feature flags.

**References**:
- `DESIGN.md:35-43` — editorial typography scale.
- `DESIGN.md:49-75` — tonal layering, metric cards, status badges.
- `client/src/components/ui/section-card.jsx`
- `client/src/components/ui/stat-card.jsx`
- `client/src/components/ui/page-header.jsx`
- `client/src/components/ui/status-badge.jsx`

**Verify**:
- [ ] Run: `npm run lint` in `client/` → no ESLint errors
- [ ] Run: `npm run build` in `client/` → Vite build succeeds
- [ ] Re-read modified primitives and confirm:
  - cards rely on tonal layering more than hard borders
  - KPI values/readouts visually separate display, title, and support text roles
  - status badges use soft-fill tinted backgrounds rather than hard pill fills

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

## Completed Tasks

- 01-establish-shared-shell-surfaces-and-navigation-behavior: Refactored AppShell to use the proper surface base color (#f7f9fb). Updated Topbar and Sidebar to use glassmorphism (white/85 with 12px backdrop blur) and removed structural borders. Replaced Sidebar's filled active state with a left-edge primary indicator and 600-weight text. Fixed Tailwind PostCSS configuration to resolve Vite build error. All verification checks passed.
