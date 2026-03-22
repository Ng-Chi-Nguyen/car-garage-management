# Task: 05-normalize-crmsysteminventory-routed-pages-that-still-rely-on-line-based-structure

## Feature: design-system-remediation

## Dependencies

- **1. establish-shared-shell-surfaces-and-navigation-behavior** (01-establish-shared-shell-surfaces-and-navigation-behavior)
- **2. rebuild-shared-content-primitives-around-tonal-layering** (02-rebuild-shared-content-primitives-around-tonal-layering)
- **3. replace-line-based-table-and-input-primitives-with-designmd-compliant-versions** (03-replace-line-based-table-and-input-primitives-with-designmd-compliant-versions)

## Plan Section

### 5. Normalize CRM/system/inventory routed pages that still rely on line-based structure

**Depends on**: 1, 2, 3

**Files:**
- Modify: `client/src/pages/customers/customer-detail-page.jsx`
- Modify: `client/src/pages/customers/customers-page.jsx`
- Modify: `client/src/pages/customers/customer-report-page.jsx`
- Modify: `client/src/pages/settings/settings-page.jsx`
- Modify: `client/src/pages/activity/activity-log-page.jsx`
- Modify: `client/src/pages/inventory/inventory-page.jsx`
- Modify: `client/src/pages/inventory/stock-detail-page.jsx`
- Test: `client/package.json`

**What to do**:
- Step 1: Remove direct divider/table-line patterns from `customer-detail-page.jsx` and convert the detail regions to tonal separation.
- Step 2: Update `customers-page.jsx` so KPI/filter/table regions inherit the corrected shared primitives consistently.
- Step 3: Update `customer-report-page.jsx` so any charts/summary wrappers follow the same surface and typography hierarchy.
- Step 4: Update `settings-page.jsx` and `activity-log-page.jsx` to remove border-led sectioning and align badges/controls with the shared UI.
- Step 5: Update `inventory-page.jsx` and `stock-detail-page.jsx` so table/filter/action blocks follow the new no-line, tonal-layer approach.
- Step 6: Run verification commands.

**Must NOT do**:
- Do not rewrite the page business flows.
- Do not change route manifest mappings or page data semantics.

**References**:
- `client/src/pages/customers/customer-detail-page.jsx`
- `client/src/pages/customers/customers-page.jsx`
- `client/src/pages/customers/customer-report-page.jsx`
- `client/src/pages/settings/settings-page.jsx`
- `client/src/pages/activity/activity-log-page.jsx`
- `client/src/pages/inventory/inventory-page.jsx`
- `client/src/pages/inventory/stock-detail-page.jsx`
- `DESIGN.md:69-85` — badge, table, input behavior

**Verify**:
- [ ] Run: `npm run lint` in `client/` → no ESLint errors
- [ ] Run: `npm run build` in `client/` → Vite build succeeds
- [ ] Re-read each touched routed page and confirm:
  - section separation primarily uses whitespace + surface layering
  - tables/lists no longer depend on dividers as the main structural device
  - badges/filters/summary blocks visually match the shared primitives

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

- User approved subagent-driven execution.
- Task 3 completed successfully.
- Hive status after Task 3 showed two runnable tasks: 04-normalize-dashboard-and-finance-pages-to-consume-the-corrected-primitives and 05-normalize-crmsysteminventory-routed-pages-that-still-rely-on-line-based-structure.
- User decision: run both tasks in parallel.
- Execution instruction: dispatch Task 4 and Task 5 concurrently with forager-frontend agents, then inspect Hive status again when both return.

## Completed Tasks

- 01-establish-shared-shell-surfaces-and-navigation-behavior: Refactored AppShell to use the proper surface base color (#f7f9fb). Updated Topbar and Sidebar to use glassmorphism (white/85 with 12px backdrop blur) and removed structural borders. Replaced Sidebar's filled active state with a left-edge primary indicator and 600-weight text. Fixed Tailwind PostCSS configuration to resolve Vite build error. All verification checks passed.
- 02-rebuild-shared-content-primitives-around-tonal-layering: Removed static 1px borders and shadows from SectionCard and StatCard, utilizing nested surfaces and spacing for hierarchy. Updated StatCard and PageHeader typography to align with DESIGN.md's editorial scale. Normalized StatusBadge to use the soft-fill approach (15% opacity background, fully opaque text). Fixed postcss config and verified that client builds successfully.
- 03-replace-line-based-table-and-input-primitives-with-designmd-compliant-versions: Refactored DataTable to remove border lines, updated headers to label-like styling with tracking, and added hover row backgrounds. Refactored SearchInput to use surface_container_lowest (bg-white), rounded-xl (0.75rem), and ghost border/glow focus per DESIGN.md. Verified with lint, build, and grep for legacy border classes (all passing).
