# Task: 07-final-audit-pass-against-designmd-and-regression-verification

## Feature: design-system-remediation

## Dependencies

- **4. normalize-dashboard-and-finance-pages-to-consume-the-corrected-primitives** (04-normalize-dashboard-and-finance-pages-to-consume-the-corrected-primitives)
- **5. normalize-crmsysteminventory-routed-pages-that-still-rely-on-line-based-structure** (05-normalize-crmsysteminventory-routed-pages-that-still-rely-on-line-based-structure)
- **6. final-normalization-pass-for-currently-closer-routes-so-no-active-page-is-left-unreviewed** (06-final-normalization-pass-for-currently-closer-routes-so-no-active-page-is-left-unreviewed)

## Plan Section

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

## Task Type

testing

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

Task 6 completed successfully. Task 7 is now the only runnable task. Proceeding sequentially with a frontend specialist because the final audit requires UI-focused regression verification against DESIGN.md across active routes and shared primitives.

## Completed Tasks

- 01-establish-shared-shell-surfaces-and-navigation-behavior: Refactored AppShell to use the proper surface base color (#f7f9fb). Updated Topbar and Sidebar to use glassmorphism (white/85 with 12px backdrop blur) and removed structural borders. Replaced Sidebar's filled active state with a left-edge primary indicator and 600-weight text. Fixed Tailwind PostCSS configuration to resolve Vite build error. All verification checks passed.
- 02-rebuild-shared-content-primitives-around-tonal-layering: Removed static 1px borders and shadows from SectionCard and StatCard, utilizing nested surfaces and spacing for hierarchy. Updated StatCard and PageHeader typography to align with DESIGN.md's editorial scale. Normalized StatusBadge to use the soft-fill approach (15% opacity background, fully opaque text). Fixed postcss config and verified that client builds successfully.
- 03-replace-line-based-table-and-input-primitives-with-designmd-compliant-versions: Refactored DataTable to remove border lines, updated headers to label-like styling with tracking, and added hover row backgrounds. Refactored SearchInput to use surface_container_lowest (bg-white), rounded-xl (0.75rem), and ghost border/glow focus per DESIGN.md. Verified with lint, build, and grep for legacy border classes (all passing).
- 04-normalize-dashboard-and-finance-pages-to-consume-the-corrected-primitives: Removed explicit borders and heavy shadows from dashboard sections and Receivables page. Replaced them with tonal layering and proper bento layout hierarchy. Rebuilt the Receivables page form fields and cards to adhere to the design specs. Fixed PostCSS configuration. Verified lint and build pass successfully.
- 05-normalize-crmsysteminventory-routed-pages-that-still-rely-on-line-based-structure: Refactored CRM, inventory, settings, and activity routed pages to replace hard border lines and structural dividers with tonal layering (`bg-surface-container-*`) and spacing. Replaced legacy table markup with shared `DataTable` primitive and updated typography/controls to inherit from the shared design system. Verified UI passes lint and builds successfully.
- 06-final-normalization-pass-for-currently-closer-routes-so-no-active-page-is-left-unreviewed: Normalized auth, intake, and workshop status routes to adhere strictly to the shared design system. Removed legacy `border-slate` and hard shadows, substituting them with `bg-surface-container` tonal layering, semantic color tokens, and `shadow-sm`. Cleaned up the placeholder files (`IntakeModalPage`, `RepairOrder`, `SettlementPrint`) with baseline surface tokens. Verified no ESLint errors and client builds successfully.
