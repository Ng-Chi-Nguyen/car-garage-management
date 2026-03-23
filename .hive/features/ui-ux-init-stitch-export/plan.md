# UI UX Init From Stitch Export

## Discovery

### Original Request
- "Continue if you have next steps, or stop and ask for clarification if you are unsure how to proceed."
- Clarified direction from prior approved discussion: build a shell-first frontend baseline from the Stitch export.
- Latest clarification: "static shell only with all page from stitch folder, read the code, image there first, map out all page to make"

### Interview Summary
- UI direction: Build a shell-first frontend baseline from the Stitch export.
- Interactivity level: Static-only in the first pass; no live backend integration yet.
- Scope: Plan for all exported Stitch pages, not only the first three screens.
- Design source of truth: Reuse layout/theme/page structure from the Stitch-exported HTML/screens under `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/`.
- Near-term objective: Map all pages into a maintainable React app shell and phased implementation order.

### Research Findings
- `client/src/main.jsx:1-10`: Frontend entry mounts `App` directly; there is no router/provider shell yet.
- `client/src/App.jsx:1-9`: App is currently a placeholder heading only.
- `client/src/index.css:1-11`: Only Tailwind imports and a minimal reset exist; no shared theme tokens or app layout primitives are defined.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/dashboard_t_ng_quan_gms/code.html:142-220`: Dashboard export uses the common app shell, sticky top header, KPI cards, and grid-based content.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/danh_s_ch_kh_ch_h_ng_gms/code.html:145-260`: Customer list export uses the common shell with filters, search, and tabular/list content.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/l_p_phi_u_s_a_ch_a_gms/code.html:85-318`: Repair order export demonstrates the shared shell plus complex forms, summary sections, and itemized table structures.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/ti_p_nh_n_xe_m_i_gms/code.html:127-358`: Vehicle intake export contains reusable labeled form groups and summary panels.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/tr_ng_th_i_x_ng_gms/code.html:86-375`: Workshop status export contains shared sidebar/topbar structure and reusable stat/job-card patterns.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/qu_n_l_kho_v_t_t_gms/code.html:144-320`: Inventory management export reuses shell and table/list management patterns.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/ng_nh_p_gms_enterprise/code.html:99-110`: Login page is intentionally separate from the authenticated app shell.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/mechanic_flow/`: Supporting design/documentation folder, not a routeable Stitch screen; it must be excluded from the page route inventory.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/*/code.html`: Exported routeable pages collectively cover login, dashboard, workshop status, intake, intake modal, repair order, stock detail, inventory management, payments/receivables, customer list, customer detail, analytics/reporting, settings, activity log, and settlement/print flow.

### Planned Route Matrix
| Stitch export page | Route path | Layout | Component file |
| --- | --- | --- | --- |
| `ng_nh_p_gms_enterprise` | `/login` | `AuthLayout` | `client/src/pages/auth/login-page.jsx` |
| `dashboard_t_ng_quan_gms` | `/dashboard` | `AppShell` | `client/src/pages/dashboard/dashboard-page.jsx` |
| `tr_ng_th_i_x_ng_gms` | `/workshop` | `AppShell` | `client/src/pages/workshop/workshop-status-page.jsx` |
| `ti_p_nh_n_xe_m_i_gms` | `/intake/new` | `AppShell` | `client/src/pages/intake/intake-page.jsx` |
| `modal_l_p_phi_u_ti_p_nh_n_gms` | `/intake/modal-preview` | `AppShell` | `client/src/pages/intake/intake-modal-page.jsx` |
| `l_p_phi_u_s_a_ch_a_gms` | `/repair-orders/new` | `AppShell` | `client/src/pages/repair/repair-order-page.jsx` |
| `th_kho_chi_ti_t_gms` | `/inventory/stock-card/:stockId` | `AppShell` | `client/src/pages/inventory/stock-detail-page.jsx` |
| `qu_n_l_kho_v_t_t_gms` | `/inventory` | `AppShell` | `client/src/pages/inventory/inventory-page.jsx` |
| `thu_ti_n_v_c_ng_n_gms` | `/payments` | `AppShell` | `client/src/pages/payments/payments-page.jsx` |
| `danh_s_ch_kh_ch_h_ng_gms` | `/customers` | `AppShell` | `client/src/pages/customers/customers-page.jsx` |
| `h_s_kh_ch_h_ng_chi_ti_t_gms` | `/customers/:customerId` | `AppShell` | `client/src/pages/customers/customer-detail-page.jsx` |
| `b_o_c_o_kh_ch_h_ng_chuy_n_s_u_gms` | `/customers/:customerId/report` | `AppShell` | `client/src/pages/customers/customer-report-page.jsx` |
| `c_i_t_h_th_ng_gms` | `/settings` | `AppShell` | `client/src/pages/settings/settings-page.jsx` |
| `nh_t_k_thao_t_c_gms` | `/activity-log` | `AppShell` | `client/src/pages/activity/activity-log-page.jsx` |
| `in_quy_t_to_n_gms` | `/settlements/preview` | `AppShell` | `client/src/pages/settlement/settlement-page.jsx` |

Route coverage note:
- The route matrix intentionally covers exactly 15 routeable Stitch export pages.
- `mechanic_flow/` is excluded because it is a supporting design folder, not a page export with app-shell routing semantics.

---

## Non-Goals (What we're NOT building)
- No live API integration, mutations, or React Query data fetching in this first UI baseline.
- No backend contract changes, new endpoints, or database work.
- No detailed business validation beyond static form structure and UI affordances.
- No authentication logic implementation beyond static login page routing/presentation.
- No pixel-perfect guarantee for every exported detail if a simpler reusable component system achieves the same structural baseline.

---

## Tasks

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

### 6. Port workflow/form pages in business-flow order

**Depends on**: 2, 3, 4

**Files:**
- Create: `client/src/pages/intake/intake-page.jsx`
- Create: `client/src/pages/intake/intake-modal-page.jsx`
- Create: `client/src/pages/repair/repair-order-page.jsx`
- Create: `client/src/pages/settlement/settlement-page.jsx`
- Create: `client/src/pages/payments/payments-page.jsx`
- Modify: `client/src/app/router.jsx`
- Modify: `client/src/app/routeManifest.js`

**What to do**:
- Step 1: Port vehicle intake with static form sections and summary panel.
- Step 2: Port the intake modal export as a routeable static representation or modal-shell-backed preview screen.
- Step 3: Port repair order with static itemized rows/table sections.
- Step 4: Port settlement preview and payments/receivables in the same workflow family.
- Step 5: Preserve semantic `<form onSubmit={handleSubmit}>` structure even for static submission stubs.

**Must NOT do**:
- Do not implement real submit handlers, API mutations, or persistence.
- Do not replace forms with click-only fake interactions.

**References**:
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/ti_p_nh_n_xe_m_i_gms/code.html:127-358` — Intake workflow structure.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/modal_l_p_phi_u_ti_p_nh_n_gms/code.html:1-260` — Intake modal shell.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/l_p_phi_u_s_a_ch_a_gms/code.html:85-318` — Repair order structure.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/thu_ti_n_v_c_ng_n_gms/code.html:138-320` — Payment/receivable structure.
- `design/stitch_ng_nh_p_h_th_ng_qu_n_l_gara/in_quy_t_to_n_gms/code.html:1-260` — Settlement/print flow structure.

**Verify**:
- [ ] Run: `test -f client/src/pages/intake/intake-page.jsx && test -f client/src/pages/intake/intake-modal-page.jsx && test -f client/src/pages/repair/repair-order-page.jsx && test -f client/src/pages/settlement/settlement-page.jsx && test -f client/src/pages/payments/payments-page.jsx` → exit code 0
- [ ] Run: `npm --prefix client run build` → succeeds

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
