# Task: 06-final-normalization-pass-for-currently-closer-routes-so-no-active-page-is-left-unreviewed

## Feature: design-system-remediation

## Dependencies

- **4. normalize-dashboard-and-finance-pages-to-consume-the-corrected-primitives** (04-normalize-dashboard-and-finance-pages-to-consume-the-corrected-primitives)
- **5. normalize-crmsysteminventory-routed-pages-that-still-rely-on-line-based-structure** (05-normalize-crmsysteminventory-routed-pages-that-still-rely-on-line-based-structure)

## Plan Section

### 6. Final normalization pass for currently “closer” routes so no active page is left unreviewed

**Depends on**: 4, 5

**Files:**
- Modify: `client/src/pages/auth/login-page.jsx`
- Modify: `client/src/pages/intake/VehicleIntake.jsx`
- Modify: `client/src/pages/workshop/workshop-status-page.jsx`
- Modify: `client/src/pages/intake/IntakeModalPage.jsx`
- Modify: `client/src/pages/repair/RepairOrder.jsx`
- Modify: `client/src/pages/finance/SettlementPrint.jsx`
- Test: `client/package.json`

**What to do**:
- Step 1: Re-read the routes that were previously considered “closer” to the target design and normalize any remaining border/shadow/typography drift so they are not implicitly skipped.
- Step 2: Normalize `IntakeModalPage.jsx`, `RepairOrder.jsx`, and `SettlementPrint.jsx` if they are visible active routes/placeholders that still visually diverge from the shared system.
- Step 3: Keep changes lightweight: only bring them into alignment with the corrected primitives and DESIGN.md rules.
- Step 4: Run verification commands.

**Must NOT do**:
- Do not expand these routes into new feature work.
- Do not redesign print/business semantics beyond UI consistency.

**References**:
- `client/src/pages/auth/login-page.jsx`
- `client/src/pages/intake/VehicleIntake.jsx`
- `client/src/pages/workshop/workshop-status-page.jsx`
- `client/src/pages/intake/IntakeModalPage.jsx`
- `client/src/pages/repair/RepairOrder.jsx`
- `client/src/pages/finance/SettlementPrint.jsx`
- `client/src/app/routeManifest.js`

**Verify**:
- [ ] Run: `npm run lint` in `client/` → no ESLint errors
- [ ] Run: `npm run build` in `client/` → Vite build succeeds
- [ ] Re-read all six files and confirm no route was left with obviously outdated shell/card/table/input styling versus the corrected system

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

Execution continues sequentially after Tasks 4 and 5 completed. Task 6 is the only runnable task and will be delegated to forager-frontend because it is a UI-heavy normalization pass for remaining active routes (login, intake, workshop, intake modal, repair order, settlement print).

## Completed Tasks

- 01-establish-shared-shell-surfaces-and-navigation-behavior: Refactored AppShell to use the proper surface base color (#f7f9fb). Updated Topbar and Sidebar to use glassmorphism (white/85 with 12px backdrop blur) and removed structural borders. Replaced Sidebar's filled active state with a left-edge primary indicator and 600-weight text. Fixed Tailwind PostCSS configuration to resolve Vite build error. All verification checks passed.
- 02-rebuild-shared-content-primitives-around-tonal-layering: Removed static 1px borders and shadows from SectionCard and StatCard, utilizing nested surfaces and spacing for hierarchy. Updated StatCard and PageHeader typography to align with DESIGN.md's editorial scale. Normalized StatusBadge to use the soft-fill approach (15% opacity background, fully opaque text). Fixed postcss config and verified that client builds successfully.
- 03-replace-line-based-table-and-input-primitives-with-designmd-compliant-versions: Refactored DataTable to remove border lines, updated headers to label-like styling with tracking, and added hover row backgrounds. Refactored SearchInput to use surface_container_lowest (bg-white), rounded-xl (0.75rem), and ghost border/glow focus per DESIGN.md. Verified with lint, build, and grep for legacy border classes (all passing).
- 04-normalize-dashboard-and-finance-pages-to-consume-the-corrected-primitives: Removed explicit borders and heavy shadows from dashboard sections and Receivables page. Replaced them with tonal layering and proper bento layout hierarchy. Rebuilt the Receivables page form fields and cards to adhere to the design specs. Fixed PostCSS configuration. Verified lint and build pass successfully.
- 05-normalize-crmsysteminventory-routed-pages-that-still-rely-on-line-based-structure: Refactored CRM, inventory, settings, and activity routed pages to replace hard border lines and structural dividers with tonal layering (`bg-surface-container-*`) and spacing. Replaced legacy table markup with shared `DataTable` primitive and updated typography/controls to inherit from the shared design system. Verified UI passes lint and builds successfully.
