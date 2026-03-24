# Task: 08-final-verification-and-implementation-handoff

## Feature: ui-ux-init-stitch-export

## Dependencies

- **4. port-the-shell-entry-pages-login-and-dashboard** (04-port-the-shell-entry-pages-login-and-dashboard)
- **5. port-list-oriented-pages-from-the-manifest** (05-port-list-oriented-pages-from-the-manifest)
- **6. port-workflowform-pages-in-business-flow-order** (06-port-workflowform-pages-in-business-flow-order)
- **7. port-detailreport-pages-and-complete-route-coverage** (07-port-detailreport-pages-and-complete-route-coverage)

## Plan Section

### 8. Final verification and implementation handoff

**Depends on**: 4, 5, 6, 7

**Files:**
- Modify: `docs/agent-sessions/2026-03-21-session.md`
- Modify: `docs/stitch-ui-review-2026-03-21.md`
- Reference only: `client/package.json`

**What to do**:
- Step 1: Run final frontend verification for the static shell-first baseline.
- Step 2: Run the route coverage script and record its output verbatim in the session/report artifacts.
- Step 3: Update session/report artifacts with implementation scope, route coverage, and verification results.
- Step 4: Record remaining next-phase gaps: API integration, auth behavior, data loading, and business-rule wiring.
- Step 5: Prepare the implementation batch for Hygienic review before any commit decision.

**Must NOT do**:
- Do not commit automatically.
- Do not claim backend readiness or production completeness.

**References**:
- `docs/agent-sessions/2026-03-21-session.md` — Required session traceability target.
- `docs/stitch-ui-review-2026-03-21.md` — Existing UI review artifact to extend.

**Verify**:
- [ ] Run: `node client/scripts/verify-stitch-routes.mjs` → prints `Verified 15 Stitch routes (mechanic_flow excluded)` and exits 0
- [ ] Run: `npm --prefix client run build` → succeeds
- [ ] Run: `grep -q "Verified 15 Stitch routes (mechanic_flow excluded)" docs/agent-sessions/2026-03-21-session.md` → exit code 0
- [ ] Run: `grep -q "Verified 15 Stitch routes (mechanic_flow excluded)" docs/stitch-ui-review-2026-03-21.md` → exit code 0

---

## Execution Gate
- This plan must not move to implementation until the user explicitly approves the plan in this session.
- Required workflow order for this repo: plan first → hygienic review plan → user self-review/approve → execute → hygienic review implementation → ask user before commit.
- Starting a Hive worktree or editing application code before that approval would violate repo policy.

## Task Type

modification

## Context

## discovery-summary

Original request evolved into a shell-first UI initialization plan based on the Stitch export.

User decisions:
- UI direction: shell-first frontend baseline derived from the Stitch-exported design assets.
- Interactivity for first pass: static shell only, no live backend integration yet.
- Scope refinement from latest clarification: read the Stitch export code/images first and map out all exported pages to make, rather than limiting planning to only the first 3 screens.

Research findings:
- Current client baseline is minimal: `client/src/main.jsx:1-10` mounts `App` directly; `client/src/App.jsx:1-9` is placeholder-only; `client/src/index.css:1-11` contains only Tailwind import/reset.
- Stitch export contains app-page HTML prototypes under `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/*/code.html`.
- Identified exported page groups: login, dashboard, workshop status, vehicle intake, intake modal, repair order, stock detail, inventory management, payments/receivables, customer list, customer detail, customer analytics, settings, activity log, settlement/print flow.
- Shared patterns across exported pages: consistent sidebar shell, sticky top header, blue/indigo enterprise theme, card/table/form/status-badge patterns.
- Common reusable component candidates: app shell, sidebar, topbar, buttons, cards, badges, stat blocks, table wrappers, search input, profile block, form groups, summary panels, modal shell.

Planning implication:
- Plan should first establish routing/layout/theme/component foundations in `client/`, then map all exported pages into routes and phased implementation groups.
- First execution pass should remain static-only and use mock/placeholder content where needed.

Route Inventory:
- The authoritative route manifest mapped from the Stitch export is located at `client/src/app/routeManifest.js`.
- It contains 15 mapped routes (1 'auth' layout, 14 'app' layout).
- The `mechanic_flow/` folder is intentionally excluded as non-routeable support material.

---

## execution-decisions

2026-03-21 update: serialized recovery completed for remaining merge ancestry. Task 04 manually merged after resolving AppShell container conflict in client/src/layouts/AppShell.jsx. Task 05 manually merged after resolving modify/delete conflicts by accepting deletion of legacy uppercase placeholders client/src/pages/customers/CustomerList.jsx and client/src/pages/inventory/InventoryManagement.jsx in favor of lowercase Stitch pages already referenced by routeManifest. User selected: resume blocked task 08 now that tasks 04–07 are integrated.

## Completed Tasks

- 01-freeze-route-inventory-and-coverage-manifest: Created client/src/app/routeManifest.js with 15 mapped routes (1 auth, 14 app layouts) from the Stitch export. Updated discovery-summary.md with the route inventory and noted the exclusion of the mechanic flow as non-routeable. Verified route counts and exclusions as required.
- 02-build-routing-bootstrap-from-the-route-manifest: Created router.jsx to mechanically build routes from routeManifest.js using Vite's glob import. Replaced placeholder App with RouterProvider. Added AppShell, AuthLayout, and NotFound layouts/pages, and mapped the NotFound page in routeManifest.js. Built successfully.
- 03-create-the-reusable-shell-and-design-primitives: Created layout and UI primitive components (sidebar, topbar, page-header, stat-card, status-badge, data-table, search-input, section-card). Initialized AppShell layout wrapper and added base Tailwind CSS themes. Verification complete and build succeeds.
- 04-port-the-shell-entry-pages-login-and-dashboard: Implemented static login and dashboard pages based on the Stitch UI export. Added route mapping in routeManifest, created bento-grid based login layout, connected dashboard with AppShell layout and stat cards, and updated Sidebar for correct route highlighting. Validated build passes successfully.
- 05-port-list-oriented-pages-from-the-manifest: Created static shell list-oriented pages (Customers, Workshop Status, Inventory, Activity Log, Settings) based on the Stitch export. Integrated with shared UI primitives and updated routeManifest.js paths. Build passes.
- 06-port-workflowform-pages-in-business-flow-order: Created intake, intake modal, repair order, settlement, and payment pages with static forms using the appropriate <form onSubmit={handleSubmit}> semantic structure. Updated routeManifest.js to point to the new paths. Confirmed build passes and files are present.
- 07-port-detailreport-pages-and-complete-route-coverage: Ported customer detail, report, and stock card pages using static primitives. Added route manifest verification script enforcing 15 stitch routes and excluding mechanic_flow. Integrated static structural links in parent list pages. All builds pass successfully.
