# Task: 07-port-detailreport-pages-and-complete-route-coverage

## Feature: ui-ux-init-stitch-export

## Dependencies

- **2. build-routing-bootstrap-from-the-route-manifest** (02-build-routing-bootstrap-from-the-route-manifest)
- **3. create-the-reusable-shell-and-design-primitives** (03-create-the-reusable-shell-and-design-primitives)
- **5. port-list-oriented-pages-from-the-manifest** (05-port-list-oriented-pages-from-the-manifest)
- **6. port-workflowform-pages-in-business-flow-order** (06-port-workflowform-pages-in-business-flow-order)

## Plan Section

### 7. Port detail/report pages and complete route coverage

**Depends on**: 2, 3, 5, 6

**Files:**
- Create: `client/src/pages/customers/customer-detail-page.jsx`
- Create: `client/src/pages/customers/customer-report-page.jsx`
- Create: `client/src/pages/inventory/stock-detail-page.jsx`
- Modify: `client/src/app/router.jsx`
- Modify: `client/src/app/routeManifest.js`
- Create: `client/scripts/verify-stitch-routes.mjs`

**What to do**:
- Step 1: Port customer detail and customer analytics/report pages using the established shell and section-card primitives.
- Step 2: Port stock card detail as a detail-oriented page reusing display sections.
- Step 3: Add a verification script that reads `routeManifest.js` and fails if any of the 15 routeable Stitch export keys are missing or duplicated.
- Step 4: Make the script assert that `mechanic_flow` is absent from the route inventory.
- Step 5: Ensure parent list pages can link structurally to detail routes using static/demo IDs only.

**Must NOT do**:
- Do not introduce backend-dependent loaders.
- Do not create a second manual checklist outside the manifest + verification script.

**References**:
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/h_s_kh_ch_h_ng_chi_ti_t_gms/code.html:1-280` — Customer detail structure.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/b_o_c_o_kh_ch_h_ng_chuy_n_s_u_gms/code.html:1-320` — Customer analytics/report structure.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/th_kho_chi_ti_t_gms/code.html:132-320` — Stock detail structure.

**Verify**:
- [ ] Run: `test -f client/src/pages/customers/customer-detail-page.jsx && test -f client/src/pages/customers/customer-report-page.jsx && test -f client/src/pages/inventory/stock-detail-page.jsx && test -f client/scripts/verify-stitch-routes.mjs` → exit code 0
- [ ] Run: `node client/scripts/verify-stitch-routes.mjs` → prints `Verified 15 Stitch routes (mechanic_flow excluded)` and exits 0
- [ ] Run: `npm --prefix client run build` → succeeds

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

- Execution mode: Subagent-driven.
- 2026-03-21: Task 04 blocked because its worktree branch did not contain outputs from completed dependency tasks.
- User decision: merge completed dependency tasks into the current branch before resuming task 04.
- Integration order chosen: 01-freeze-route-inventory-and-coverage-manifest, 02-build-routing-bootstrap-from-the-route-manifest, 03-create-the-reusable-shell-and-design-primitives.
- 2026-03-21: User approved parallel execution for the next batch: 05-port-list-oriented-pages-from-the-manifest and 06-port-workflowform-pages-in-business-flow-order.

## Completed Tasks

- 01-freeze-route-inventory-and-coverage-manifest: Created client/src/app/routeManifest.js with 15 mapped routes (1 auth, 14 app layouts) from the Stitch export. Updated discovery-summary.md with the route inventory and noted the exclusion of the mechanic flow as non-routeable. Verified route counts and exclusions as required.
- 02-build-routing-bootstrap-from-the-route-manifest: Created router.jsx to mechanically build routes from routeManifest.js using Vite's glob import. Replaced placeholder App with RouterProvider. Added AppShell, AuthLayout, and NotFound layouts/pages, and mapped the NotFound page in routeManifest.js. Built successfully.
- 03-create-the-reusable-shell-and-design-primitives: Created layout and UI primitive components (sidebar, topbar, page-header, stat-card, status-badge, data-table, search-input, section-card). Initialized AppShell layout wrapper and added base Tailwind CSS themes. Verification complete and build succeeds.
- 04-port-the-shell-entry-pages-login-and-dashboard: Implemented static login and dashboard pages based on the Stitch UI export. Added route mapping in routeManifest, created bento-grid based login layout, connected dashboard with AppShell layout and stat cards, and updated Sidebar for correct route highlighting. Validated build passes successfully.
- 05-port-list-oriented-pages-from-the-manifest: Created static shell list-oriented pages (Customers, Workshop Status, Inventory, Activity Log, Settings) based on the Stitch export. Integrated with shared UI primitives and updated routeManifest.js paths. Build passes.
- 06-port-workflowform-pages-in-business-flow-order: Created intake, intake modal, repair order, settlement, and payment pages with static forms using the appropriate <form onSubmit={handleSubmit}> semantic structure. Updated routeManifest.js to point to the new paths. Confirmed build passes and files are present.
