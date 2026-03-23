# Task: 03-replace-line-based-table-and-input-primitives-with-designmd-compliant-versions

## Feature: design-system-remediation

## Dependencies

- **2. rebuild-shared-content-primitives-around-tonal-layering** (02-rebuild-shared-content-primitives-around-tonal-layering)

## Plan Section

### 3. Replace line-based table and input primitives with DESIGN.md-compliant versions

**Depends on**: 2

**Files:**
- Modify: `client/src/components/ui/data-table.jsx`
- Modify: `client/src/components/ui/search-input.jsx`
- Test: `client/package.json`

**What to do**:
- Step 1: Refactor `DataTable` so headers use the prescribed label-like styling (all-caps, tracking, on-surface-variant tone) without border/divider lines.
- Step 2: Replace row separators with spacing + hover tonal background behavior per `DESIGN.md`.
- Step 3: Keep support for both the structured (`columns + data`) and legacy (`headers + children`) APIs while modernizing only the visuals.
- Step 4: Refactor `SearchInput` to use `surface_container_lowest` styling, md radius, and ghost-border/focus-glow behavior rather than a standard gray border.
- Step 5: Run verification commands.

**Must NOT do**:
- Do not break the compatibility fix previously added to `DataTable`.
- Do not introduce visual-only changes that require page authors to rewrite all call sites.

**References**:
- `DESIGN.md:57-59` — ghost border guidance.
- `DESIGN.md:77-85` — table and form/input rules.
- `client/src/components/ui/data-table.jsx`
- `client/src/components/ui/search-input.jsx`

**Verify**:
- [ ] Run: `npm run lint` in `client/` → no ESLint errors
- [ ] Run: `npm run build` in `client/` → Vite build succeeds
- [ ] Run: `grep -R "divide-y\|divide-x\|border-y\|border-b\|border-t" client/src/components/ui/data-table.jsx client/src/components/ui/search-input.jsx` → no line-based table/input structure remains except intentional accessibility exceptions
- [ ] Re-read both files and confirm:
  - table headers use label-like styling with tracking
  - rows are visually separated by spacing/hover rather than lines
  - input focus uses ghost-border/glow treatment, not a standard gray border

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
- 02-rebuild-shared-content-primitives-around-tonal-layering: Removed static 1px borders and shadows from SectionCard and StatCard, utilizing nested surfaces and spacing for hierarchy. Updated StatCard and PageHeader typography to align with DESIGN.md's editorial scale. Normalized StatusBadge to use the soft-fill approach (15% opacity background, fully opaque text). Fixed postcss config and verified that client builds successfully.
