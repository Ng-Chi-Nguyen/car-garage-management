# Task: 04-port-the-shell-entry-pages-login-and-dashboard

## Feature: ui-ux-init-stitch-export

## Dependencies

- **2. build-routing-bootstrap-from-the-route-manifest** (02-build-routing-bootstrap-from-the-route-manifest)
- **3. create-the-reusable-shell-and-design-primitives** (03-create-the-reusable-shell-and-design-primitives)

## Plan Section

### 4. Port the shell-entry pages: login and dashboard

**Depends on**: 2, 3

**Files:**
- Create: `client/src/pages/auth/login-page.jsx`
- Create: `client/src/pages/dashboard/dashboard-page.jsx`
- Create: `client/src/pages/dashboard/dashboard-sections.jsx`
- Modify: `client/src/app/router.jsx`
- Modify: `client/src/app/routeManifest.js`
- Modify: `client/src/layouts/AuthLayout.jsx`
- Modify: `client/src/layouts/AppShell.jsx`

**What to do**:
- Step 1: Build the static login page outside the app shell.
- Step 2: Build the dashboard page as the authenticated landing screen using shared cards/header primitives.
- Step 3: Reflect the Stitch information architecture structurally with static content only.
- Step 4: Ensure the shell navigation highlights the dashboard route correctly.

**Must NOT do**:
- Do not implement login submission/auth state.
- Do not fetch dashboard metrics from APIs.

**References**:
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/ng_nh_p_gms_enterprise/code.html:99-220` — Login structure outside shell.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/dashboard_t_ng_quan_gms/code.html:142-320` — Dashboard section composition.

**Verify**:
- [ ] Run: `test -f client/src/pages/auth/login-page.jsx && test -f client/src/pages/dashboard/dashboard-page.jsx` → exit code 0
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

## Completed Tasks

- 01-freeze-route-inventory-and-coverage-manifest: Created client/src/app/routeManifest.js with 15 mapped routes (1 auth, 14 app layouts) from the Stitch export. Updated discovery-summary.md with the route inventory and noted the exclusion of the mechanic flow as non-routeable. Verified route counts and exclusions as required.
- 02-build-routing-bootstrap-from-the-route-manifest: Created router.jsx to mechanically build routes from routeManifest.js using Vite's glob import. Replaced placeholder App with RouterProvider. Added AppShell, AuthLayout, and NotFound layouts/pages, and mapped the NotFound page in routeManifest.js. Built successfully.
- 03-create-the-reusable-shell-and-design-primitives: Created layout and UI primitive components (sidebar, topbar, page-header, stat-card, status-badge, data-table, search-input, section-card). Initialized AppShell layout wrapper and added base Tailwind CSS themes. Verification complete and build succeeds.
