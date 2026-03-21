# Task: 01-freeze-route-inventory-and-coverage-manifest

## Feature: ui-ux-init-stitch-export

## Dependencies

_None_

## Plan Section

### 1. Freeze route inventory and coverage manifest

**Depends on**: none

**Files:**
- Create: `client/src/app/routeManifest.js`
- Modify: `.hive/features/ui-ux-init-stitch-export/context/discovery-summary.md`
- Reference only: `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/ng_nh_p_gms_enterprise/code.html:99-110`
- Reference only: `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/dashboard_t_ng_quan_gms/code.html:142-220`
- Reference only: `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/danh_s_ch_kh_ch_h_ng_gms/code.html:145-260`
- Reference only: `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/l_p_phi_u_s_a_ch_a_gms/code.html:85-318`

**What to do**:
- Step 1: Create `routeManifest.js` as the single source of truth for every Stitch-derived page route.
- Step 2: Encode for each entry: export key, route path, layout kind, target page component path, and implementation group.
- Step 3: Keep login as the only auth-layout route; all other mapped pages belong to `AppShell`.
- Step 4: Record in the manifest or nearby comment that `mechanic_flow/` is intentionally excluded as non-routeable support material.
- Step 5: Update the Hive discovery context so the implementation handoff references the same route inventory.

**Must NOT do**:
- Do not invent extra routes not backed by a discovered Stitch export.
- Do not include live-data metadata in the manifest for this static-only phase.
- Do not treat `mechanic_flow/` as a routeable page.

**References**:
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/ng_nh_p_gms_enterprise/code.html:99-110` — Confirms login is outside the authenticated shell.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/tr_ng_th_i_x_ng_gms/code.html:86-127` — Representative shared sidebar shell.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/mechanic_flow/` — Non-routeable support folder that must stay out of route coverage counts.

**Verify**:
- [ ] Run: `test -f client/src/app/routeManifest.js` → exit code 0
- [ ] Run: `grep -c "exportKey" client/src/app/routeManifest.js` → `15`
- [ ] Run: `grep -c "layout: 'auth'" client/src/app/routeManifest.js` → `1`
- [ ] Run: `grep -c "layout: 'app'" client/src/app/routeManifest.js` → `14`
- [ ] Run: `grep -q "mechanic_flow" client/src/app/routeManifest.js && exit 1 || exit 0` → exit code 0

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

---

## execution-decisions

# Execution Decisions

- Date: 2026-03-21
- User selected execution mode: Subagent-driven (this session)
- Current batch strategy: run only currently runnable tasks in dependency order
- Initial runnable task set: `01-freeze-route-inventory-and-coverage-manifest`
- Parallelization decision: not applicable yet because only one task is runnable

