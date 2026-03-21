# Task: 03-create-the-reusable-shell-and-design-primitives

## Feature: ui-ux-init-stitch-export

## Dependencies

- **1. freeze-route-inventory-and-coverage-manifest** (01-freeze-route-inventory-and-coverage-manifest)
- **2. build-routing-bootstrap-from-the-route-manifest** (02-build-routing-bootstrap-from-the-route-manifest)

## Plan Section

### 3. Create the reusable shell and design primitives

**Depends on**: 1, 2

**Files:**
- Modify: `client/src/index.css:1-11`
- Create: `client/src/components/layout/sidebar.jsx`
- Create: `client/src/components/layout/topbar.jsx`
- Create: `client/src/components/ui/page-header.jsx`
- Create: `client/src/components/ui/stat-card.jsx`
- Create: `client/src/components/ui/status-badge.jsx`
- Create: `client/src/components/ui/data-table.jsx`
- Create: `client/src/components/ui/search-input.jsx`
- Create: `client/src/components/ui/section-card.jsx`
- Modify: `client/src/layouts/AppShell.jsx`

**What to do**:
- Step 1: Extract the repeated sidebar, topbar, header, card, badge, table, and search patterns from the Stitch exports.
- Step 2: Keep the primitive set intentionally small and reusable across dashboard, list, workflow, and detail pages.
- Step 3: Add only the minimal theme tokens/utilities needed to support the shell-first static baseline.
- Step 4: Wire the shared shell layout to use the common primitives rather than page-specific framing.

**Must NOT do**:
- Do not build a speculative design system with unused variants.
- Do not duplicate sidebar/topbar markup inside individual page components.

**References**:
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/tr_ng_th_i_x_ng_gms/code.html:134-208` — Topbar + KPI/stat patterns.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/qu_n_l_kho_v_t_t_gms/code.html:144-320` — Table/list management patterns.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/ti_p_nh_n_xe_m_i_gms/code.html:176-358` — Form/summary patterns.

**Verify**:
- [ ] Run: `test -f client/src/components/layout/sidebar.jsx && test -f client/src/components/layout/topbar.jsx` → exit code 0
- [ ] Run: `test -f client/src/components/ui/page-header.jsx && test -f client/src/components/ui/stat-card.jsx && test -f client/src/components/ui/status-badge.jsx && test -f client/src/components/ui/data-table.jsx && test -f client/src/components/ui/search-input.jsx && test -f client/src/components/ui/section-card.jsx` → exit code 0
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

# Execution Decisions

- Date: 2026-03-21
- User selected execution mode: Subagent-driven (this session)
- Current batch strategy: run only currently runnable tasks in dependency order
- Initial runnable task set: `01-freeze-route-inventory-and-coverage-manifest`
- Parallelization decision: not applicable yet because only one task is runnable


## Completed Tasks

- 01-freeze-route-inventory-and-coverage-manifest: Created client/src/app/routeManifest.js with 15 mapped routes (1 auth, 14 app layouts) from the Stitch export. Updated discovery-summary.md with the route inventory and noted the exclusion of the mechanic flow as non-routeable. Verified route counts and exclusions as required.
- 02-build-routing-bootstrap-from-the-route-manifest: Created router.jsx to mechanically build routes from routeManifest.js using Vite's glob import. Replaced placeholder App with RouterProvider. Added AppShell, AuthLayout, and NotFound layouts/pages, and mapped the NotFound page in routeManifest.js. Built successfully.
