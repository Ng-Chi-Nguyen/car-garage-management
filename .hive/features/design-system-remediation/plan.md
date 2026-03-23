# Design System Remediation

## Discovery

### Original Request
- "audit toàn bộ trang và component lại, phải đảm bảo đồng bộ style theo @DESIGN.md"
- Follow-up planning choice: "Write remediation plan only"

### Interview Summary
- Scope: UI only
- Allowed: style, layout, tokens, shared component presentation, page composition
- Not allowed: business logic changes, data flow changes, API/backend changes
- Priority direction from audit: shared primitives first, then highest-impact routed pages
- Plan quality requirement after Hygienic review: strengthen coverage and verification so the remediation is measurable against `DESIGN.md`, not just compilable

### Research Findings
- `DESIGN.md:13-18` — No-Line Rule forbids 1px solid borders for sectioning; use surface layering instead.
- `DESIGN.md:21-29` — core surface architecture requires `surface` / `surface_container_low` / `surface_container_lowest` layering, plus glassmorphism for sidebar/topbar.
- `DESIGN.md:35-43` — editorial typography scale should drive page headers, card titles, KPI values, and body copy.
- `DESIGN.md:49-59` — avoid static-card shadows; use tonal layering; ghost borders only when necessary at low opacity.
- `DESIGN.md:64-85` — metric cards, status badges, tables, and inputs all have specific visual behavior.
- `client/src/components/layout/sidebar.jsx` — current active item uses a filled blue pill and hard separators, conflicting with `DESIGN.md:86-89`.
- `client/src/components/layout/topbar.jsx` — current topbar uses opaque white surface and border instead of blurred translucent glassmorphism.
- `client/src/layouts/AppShell.jsx` — shell background/layering does not establish the design system’s surface hierarchy.
- `client/src/components/ui/data-table.jsx` — uses border/divider structure that conflicts with `DESIGN.md:77-80` table rules.
- `client/src/components/ui/search-input.jsx` — uses standard bordered input instead of ghost-border/focus-glow treatment from `DESIGN.md:83-85`.
- `client/src/components/ui/section-card.jsx` and `client/src/components/ui/stat-card.jsx` — rely on borders/shadows rather than tonal layers for hierarchy.
- `client/src/components/ui/page-header.jsx` — typography hierarchy is functional but not explicitly aligned to editorial scale.
- `client/src/components/ui/status-badge.jsx` — status visuals are serviceable but not fully normalized to the soft-fill palette guidance.
- `client/src/pages/finance/Receivables.jsx` — highest page-level mismatch: border-heavy, shadow-heavy static surfaces.
- `client/src/pages/dashboard/dashboard-sections.jsx` — page-local dashboard blocks still hardcode divider lines and border-led sections.
- `client/src/pages/customers/customer-detail-page.jsx` — direct `divide-y`/border usage violates the no-line table/content rules.
- `client/src/pages/settings/settings-page.jsx`, `client/src/pages/activity/activity-log-page.jsx`, `client/src/pages/inventory/inventory-page.jsx` — inherit mixed old utility patterns and line-based separation.
- `client/src/pages/auth/login-page.jsx`, `client/src/pages/intake/VehicleIntake.jsx`, `client/src/pages/workshop/workshop-status-page.jsx` — comparatively closer to `DESIGN.md`, but still need explicit final normalization coverage so they are not silently skipped.
- `client/src/app/routeManifest.js` — active routed-page coverage should be checked against this manifest during final audit so no visible route is omitted.

---

## Non-Goals (What we're NOT building)
- No backend, API, route, validation, or Prisma changes.
- No business-flow rewrites on intake, customers, finance, inventory, or workshop screens.
- No new charting library, design-token build pipeline, or CSS-in-JS migration.
- No attempt to pixel-perfect every Stitch screen in this feature; this plan is about repo-wide alignment to `DESIGN.md`.
- No accessibility overhaul beyond what is incidentally improved by the UI cleanup.

---

## Ghost Diffs
- Add a broad Tailwind semantic-token theme and keep all current page classes mostly unchanged — rejected because earlier debugging showed unsupported token classes repeatedly failed in generated CSS and left pages visually unstyled.
- Fix individual pages first without touching shared primitives — rejected because the audit showed most inconsistencies are inherited from root components (`Sidebar`, `Topbar`, `AppShell`, `DataTable`, `SearchInput`, `SectionCard`, `StatCard`).
- Full visual redesign of every route in one pass — rejected as too risky and out of scope for a UI-only remediation feature.

---

## Tasks

### 1. Establish shared shell surfaces and navigation behavior

**Depends on**: none

**Files:**
- Modify: `client/src/layouts/AppShell.jsx`
- Modify: `client/src/components/layout/topbar.jsx`
- Modify: `client/src/components/layout/sidebar.jsx`
- Test: `client/package.json`

**What to do**:
- Step 1: Refactor AppShell so the page canvas and content wrappers express the `surface` -> `surface_container_low` -> `surface_container_lowest` hierarchy from `DESIGN.md`.
- Step 2: Update Topbar to use blurred/translucent glassmorphism styling instead of opaque white + hard border.
- Step 3: Update Sidebar to use tonal surfaces, remove line separators where they are acting as structure, and replace the filled active pill with the left-edge primary indicator + 600-weight text pattern.
- Step 4: Ensure spacing/radius choices align with the Mechanical Atelier look: breathable whitespace, lg/xl cards, minimal static shadows.
- Step 5: Run verification commands.

**Must NOT do**:
- Do not change navigation structure, route definitions, or menu information architecture.
- Do not introduce a new state management pattern.

**References**:
- `DESIGN.md:13-29` — surface layering and glassmorphism rules.
- `DESIGN.md:86-89` — sidebar active-item specification.
- `client/src/components/layout/sidebar.jsx` — current active-item and separator implementation.
- `client/src/components/layout/topbar.jsx` — current opaque topbar implementation.

**Verify**:
- [ ] Run: `npm run lint` in `client/` → no ESLint errors
- [ ] Run: `npm run build` in `client/` → Vite build succeeds
- [ ] Run: `grep -R "border-[trblxy]?\|border-b\|border-t" client/src/components/layout client/src/layouts --include="*.jsx" --include="*.tsx"` → remaining matches are intentional exceptions only, not primary shell sectioning
- [ ] Re-read `client/src/components/layout/sidebar.jsx`, `client/src/components/layout/topbar.jsx`, `client/src/layouts/AppShell.jsx` and confirm:
  - no opaque line-based shell separation remains as the primary structural device
  - sidebar active item uses an indicator pattern rather than a filled box
  - topbar/sidebar use translucent or tonal shell treatment consistent with `DESIGN.md:27-29,86-89`

### 2. Rebuild shared content primitives around tonal layering

**Depends on**: 1

**Files:**
- Modify: `client/src/components/ui/section-card.jsx`
- Modify: `client/src/components/ui/stat-card.jsx`
- Modify: `client/src/components/ui/page-header.jsx`
- Modify: `client/src/components/ui/status-badge.jsx`
- Test: `client/package.json`

**What to do**:
- Step 1: Remove section/card reliance on 1px borders as primary separators; use nested surfaces and spacing to create hierarchy.
- Step 2: Normalize `StatCard` to the design system’s metric-card hierarchy: strong number, softer label, restrained support text, and minimal/no static shadow.
- Step 3: Tune `PageHeader` typography and spacing to better express headline/body roles from `DESIGN.md`.
- Step 4: Normalize `StatusBadge` variants to the soft-fill approach described in `DESIGN.md` using gentle tinted backgrounds and fully opaque text color.
- Step 5: Preserve current component APIs unless a purely presentational UI-only prop adjustment is unavoidable.
- Step 6: Run verification commands.

**Must NOT do**:
- Do not remove backward-compatibility support already added for page consumers unless all call sites in scope are updated in the same task.
- Do not introduce new business-oriented props or feature flags.

**References**:
- `DESIGN.md:35-43` — editorial typography scale.
- `DESIGN.md:49-75` — tonal layering, metric cards, status badges.
- `client/src/components/ui/section-card.jsx`
- `client/src/components/ui/stat-card.jsx`
- `client/src/components/ui/page-header.jsx`
- `client/src/components/ui/status-badge.jsx`

**Verify**:
- [ ] Run: `npm run lint` in `client/` → no ESLint errors
- [ ] Run: `npm run build` in `client/` → Vite build succeeds
- [ ] Re-read modified primitives and confirm:
  - cards rely on tonal layering more than hard borders
  - KPI values/readouts visually separate display, title, and support text roles
  - status badges use soft-fill tinted backgrounds rather than hard pill fills

### 3. Replace line-based table and input primitives with DESIGN.md-compliant versions

**Depends on**: 2

**Files:**
- Modify: `client/src/components/ui/data-table.jsx`
- Modify: `client/src/components/ui/search-input.jsx`
- Test: `client/package.json`

**What to do**:
- Step 1: Refactor `DataTable` so headers use the prescribed label-like styling (all-caps, tracking, on-surface-variant tone) without border/divider lines.
- Step 2: Replace row separators with spacing + hover tonal background behavior per `DESIGN.md`.
- Step 3: Keep support for both the structured (`columns + data`) and legacy (`headers + children`) APIs while modernizing only the visuals.
- Step 4: Refactor `SearchInput` to use `surface_container_lowest` styling, md radius, and ghost-border/focus-glow behavior rather than a standard gray border.
- Step 5: Run verification commands.

**Must NOT do**:
- Do not break the compatibility fix previously added to `DataTable`.
- Do not introduce visual-only changes that require page authors to rewrite all call sites.

**References**:
- `DESIGN.md:57-59` — ghost border guidance.
- `DESIGN.md:77-85` — table and form/input rules.
- `client/src/components/ui/data-table.jsx`
- `client/src/components/ui/search-input.jsx`

**Verify**:
- [ ] Run: `npm run lint` in `client/` → no ESLint errors
- [ ] Run: `npm run build` in `client/` → Vite build succeeds
- [ ] Run: `grep -R "divide-y\|divide-x\|border-y\|border-b\|border-t" client/src/components/ui/data-table.jsx client/src/components/ui/search-input.jsx` → no line-based table/input structure remains except intentional accessibility exceptions
- [ ] Re-read both files and confirm:
  - table headers use label-like styling with tracking
  - rows are visually separated by spacing/hover rather than lines
  - input focus uses ghost-border/glow treatment, not a standard gray border

### 4. Normalize dashboard and finance pages to consume the corrected primitives

**Depends on**: 1, 2, 3

**Files:**
- Modify: `client/src/pages/dashboard/dashboard-sections.jsx`
- Modify: `client/src/pages/dashboard/dashboard-page.jsx`
- Modify: `client/src/pages/finance/Receivables.jsx`
- Test: `client/package.json`

**What to do**:
- Step 1: Remove page-local border/divider/shadow patterns in dashboard sections and convert them to the new tonal primitives.
- Step 2: Align dashboard KPI blocks, tables, and summary sections to the editorial bento feel described in `DESIGN.md`.
- Step 3: Rework `Receivables.jsx` away from framed/bordered cards toward layered surfaces and calmer hierarchy.
- Step 4: Preserve current UI-only behavior and local state; do not rework data logic.
- Step 5: Run verification commands.

**Must NOT do**:
- Do not change finance calculations, seeded local state, or existing page flow.
- Do not add new routes or modals.

**References**:
- `DESIGN.md:5-8` — editorial bento / asymmetry direction.
- `DESIGN.md:13-29` — tonal layering.
- `DESIGN.md:77-80` — no-line table behavior.
- `client/src/pages/dashboard/dashboard-sections.jsx`
- `client/src/pages/finance/Receivables.jsx`

**Verify**:
- [ ] Run: `npm run lint` in `client/` → no ESLint errors
- [ ] Run: `npm run build` in `client/` → Vite build succeeds
- [ ] Re-read `client/src/pages/dashboard/dashboard-sections.jsx` and `client/src/pages/finance/Receivables.jsx` and confirm:
  - large sections are separated by tonal layers/whitespace, not explicit borders
  - KPI and summary cards do not rely on static box shadows for hierarchy
  - tables or list blocks follow the shared no-line treatment

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

### 7. Final audit pass against DESIGN.md and regression verification

**Depends on**: 4, 5, 6

**Files:**
- Test: `client/package.json`
- Test: `client/src/app/routeManifest.js`
- Test: `DESIGN.md`

**What to do**:
- Step 1: Re-audit all active routed pages listed in `client/src/app/routeManifest.js` against the DESIGN.md rules used in discovery.
- Step 2: Confirm shared primitives no longer depend on line-based sectioning or opaque border-led structure.
- Step 3: Produce a route-by-route checklist covering: shell layering, card hierarchy, table treatment, input treatment, status badge treatment, and typography hierarchy.
- Step 4: Record any intentional exceptions explicitly instead of leaving them ambiguous.
- Step 5: Run final verification commands.
- Step 6: Prepare implementation summary listing shared fixes first, then page-level fixes.

**Must NOT do**:
- Do not introduce new cleanup work in this final pass unless it is a blocker to DESIGN.md compliance.
- Do not expand scope into backend or data-layer consistency.

**References**:
- `client/src/app/routeManifest.js`
- `DESIGN.md`
- All files touched in Tasks 1-6

**Verify**:
- [ ] Run: `npm run lint` in `client/` → no ESLint errors
- [ ] Run: `npm run build` in `client/` → Vite build succeeds
- [ ] Run: `grep -R "border-[trblxy]?\|border-b\|border-t\|divide-y\|divide-x\|shadow-sm\|shadow-md\|shadow-lg" client/src/components client/src/pages client/src/layouts --include="*.jsx" --include="*.tsx"` → any remaining matches are reviewed and documented as intentional exceptions, not default structure
- [ ] Re-read `client/src/app/routeManifest.js` and confirm every active route file is either touched in Tasks 4-6 or explicitly documented as intentionally unchanged
- [ ] Produce an agent-executable checklist report mapping each active route to pass/intentional-exception/follow-up-needed for:
  - No-Line Rule
  - surface hierarchy
  - table behavior
  - input behavior
  - sidebar/topbar consistency where applicable
  - typography hierarchy
