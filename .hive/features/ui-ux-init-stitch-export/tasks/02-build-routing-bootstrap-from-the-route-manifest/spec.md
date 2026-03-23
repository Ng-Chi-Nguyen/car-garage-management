# Task: 02-build-routing-bootstrap-from-the-route-manifest

## Feature: ui-ux-init-stitch-export

## Dependencies

- **1. freeze-route-inventory-and-coverage-manifest** (01-freeze-route-inventory-and-coverage-manifest)

## Plan Section

### 2. Build routing bootstrap from the route manifest

**Depends on**: 1

**Files:**
- Modify: `client/src/main.jsx:1-10`
- Modify: `client/src/App.jsx:1-9`
- Create: `client/src/app/router.jsx`
- Create: `client/src/layouts/AppShell.jsx`
- Create: `client/src/layouts/AuthLayout.jsx`
- Create: `client/src/pages/not-found.jsx`
- Modify: `client/src/app/routeManifest.js`

**What to do**:
- Step 1: Replace the placeholder root with a router-driven app entry.
- Step 2: Build the top-level router from `routeManifest.js` so route coverage stays mechanical.
- Step 3: Separate login routing into `AuthLayout` and all app pages into `AppShell`.
- Step 4: Include a not-found route without breaking the explicit Stitch route mapping.
- Step 5: Keep URL structure as the source of truth for navigation state where applicable.

**Must NOT do**:
- Do not hardcode a second page list outside the manifest.
- Do not use component state to imitate routing.

**References**:
- `client/src/main.jsx:1-10` — Current app entry point to replace with routing bootstrap.
- `client/src/App.jsx:1-9` — Current placeholder root component.
- `client/src/app/routeManifest.js` — Required single source of truth from Task 1.

**Verify**:
- [ ] Run: `test -f client/src/app/router.jsx` → exit code 0
- [ ] Run: `grep -q "createBrowserRouter\|createRoutesFromElements\|useRoutes" client/src/app/router.jsx` → exit code 0
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
