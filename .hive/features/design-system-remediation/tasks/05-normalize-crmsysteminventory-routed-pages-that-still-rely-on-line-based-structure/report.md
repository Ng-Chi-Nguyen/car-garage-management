# Task Report: 05-normalize-crmsysteminventory-routed-pages-that-still-rely-on-line-based-structure

**Feature:** design-system-remediation
**Completed:** 2026-03-21T17:09:36.627Z
**Status:** success
**Commit:** 0652b2054857c63666504478dcef13e90f022380

---

## Summary

Refactored CRM, inventory, settings, and activity routed pages to replace hard border lines and structural dividers with tonal layering (`bg-surface-container-*`) and spacing. Replaced legacy table markup with shared `DataTable` primitive and updated typography/controls to inherit from the shared design system. Verified UI passes lint and builds successfully.

---

## Changes

- **Files changed:** 8
- **Insertions:** +94
- **Deletions:** -121

### Files Modified

- `client/package-lock.json`
- `client/postcss.config.js`
- `client/src/pages/activity/activity-log-page.jsx`
- `.../src/pages/customers/customer-detail-page.jsx`
- `.../src/pages/customers/customer-report-page.jsx`
- `client/src/pages/inventory/inventory-page.jsx`
- `client/src/pages/inventory/stock-detail-page.jsx`
- `client/src/pages/settings/settings-page.jsx`
