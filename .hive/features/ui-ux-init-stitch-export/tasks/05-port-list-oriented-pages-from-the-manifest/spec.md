# Task: 05-port-list-oriented-pages-from-the-manifest

## Feature: ui-ux-init-stitch-export

## Dependencies

- **2. build-routing-bootstrap-from-the-route-manifest** (02-build-routing-bootstrap-from-the-route-manifest)
- **3. create-the-reusable-shell-and-design-primitives** (03-create-the-reusable-shell-and-design-primitives)
- **4. port-the-shell-entry-pages-login-and-dashboard** (04-port-the-shell-entry-pages-login-and-dashboard)

## Plan Section

### 5. Port list-oriented pages from the manifest

**Depends on**: 2, 3, 4

**Files:**
- Create: `client/src/pages/customers/customers-page.jsx`
- Create: `client/src/pages/workshop/workshop-status-page.jsx`
- Create: `client/src/pages/inventory/inventory-page.jsx`
- Create: `client/src/pages/activity/activity-log-page.jsx`
- Create: `client/src/pages/settings/settings-page.jsx`
- Modify: `client/src/app/router.jsx`
- Modify: `client/src/app/routeManifest.js`

**What to do**:
- Step 1: Port customer list using shared search/filter/table/list primitives.
- Step 2: Port workshop status using stat/job-card patterns.
- Step 3: Port inventory, activity log, and settings as static shell pages.
- Step 4: Localize placeholder/mock content to each page module while reusing shared shell primitives.

**Must NOT do**:
- Do not add live filtering/query behavior beyond structural UI.
- Do not reintroduce duplicate shell framing within page files.

**References**:
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/danh_s_ch_kh_ch_h_ng_gms/code.html:145-320` — Customer list patterns.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/tr_ng_th_i_x_ng_gms/code.html:159-375` — Workshop cards and status groupings.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/nh_t_k_thao_t_c_gms/code.html:145-320` — Activity log framing.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/c_i_t_h_th_ng_gms/code.html:134-320` — Settings structure.

**Verify**:
- [ ] Run: `test -f client/src/pages/customers/customers-page.jsx && test -f client/src/pages/workshop/workshop-status-page.jsx && test -f client/src/pages/inventory/inventory-page.jsx && test -f client/src/pages/activity/activity-log-page.jsx && test -f client/src/pages/settings/settings-page.jsx` → exit code 0
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
