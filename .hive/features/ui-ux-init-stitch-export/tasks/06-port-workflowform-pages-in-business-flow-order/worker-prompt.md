# Hive Worker Assignment

You are a worker agent executing a task in an isolated git worktree.

## Assignment Details

| Field | Value |
|-------|-------|
| Feature | ui-ux-init-stitch-export |
| Task | 06-port-workflowform-pages-in-business-flow-order |
| Task # | 6 |
| Branch | hive/ui-ux-init-stitch-export/06-port-workflowform-pages-in-business-flow-order |
| Worktree | /home/phuctruong/Work/Studies/Subjects/PhatTrienPhanMem/DoAn-QuanLyGarageOto/.hive/.worktrees/ui-ux-init-stitch-export/06-port-workflowform-pages-in-business-flow-order |

**CRITICAL**: All file operations MUST be within this worktree path:
`/home/phuctruong/Work/Studies/Subjects/PhatTrienPhanMem/DoAn-QuanLyGarageOto/.hive/.worktrees/ui-ux-init-stitch-export/06-port-workflowform-pages-in-business-flow-order`

Do NOT modify files outside this directory.

---

## Your Mission

# Task: 06-port-workflowform-pages-in-business-flow-order

## Feature: ui-ux-init-stitch-export

## Dependencies

- **2. build-routing-bootstrap-from-the-route-manifest** (02-build-routing-bootstrap-from-the-route-manifest)
- **3. create-the-reusable-shell-and-design-primitives** (03-create-the-reusable-shell-and-design-primitives)
- **4. port-the-shell-entry-pages-login-and-dashboard** (04-port-the-shell-entry-pages-login-and-dashboard)

## Plan Section

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


---

## Pre-implementation Checklist

Before writing code, confirm:
1. Dependencies are satisfied and required context is present.
2. The exact files/sections to touch (from references) are identified.
3. The first failing test to write is clear (TDD).
4. The minimal change needed to reach green is planned.

---

## Blocker Protocol

If you hit a blocker requiring human decision, **DO NOT** use the question tool directly.
Instead, escalate via the blocker protocol:

1. **Save your progress** to the worktree (commit if appropriate)
2. **Call hive_worktree_commit** with blocker info:

```
hive_worktree_commit({
  task: "06-port-workflowform-pages-in-business-flow-order",
  feature: "ui-ux-init-stitch-export",
  status: "blocked",
  summary: "What you accomplished so far",
  blocker: {
    reason: "Why you're blocked - be specific",
    options: ["Option A", "Option B", "Option C"],
    recommendation: "Your suggested choice with reasoning",
    context: "Relevant background the user needs to decide"
  }
})
```

**After calling hive_worktree_commit with blocked status, STOP IMMEDIATELY.**

The Hive Master will:
1. Receive your blocker info
2. Ask the user via question()
3. Spawn a NEW worker to continue with the decision

This keeps the user focused on ONE conversation (Hive Master) instead of multiple worker panes.

---

## Completion Protocol

When your task is **fully complete**:

```
hive_worktree_commit({
  task: "06-port-workflowform-pages-in-business-flow-order",
  feature: "ui-ux-init-stitch-export",
  status: "completed",
  summary: "Concise summary of what you accomplished"
})
```

Then inspect the tool response fields:
- If `terminal=true` (regardless of `ok`): stop immediately. This call is final and must not be retried with the same parameters.
- If `terminal=false`: **DO NOT STOP**. Follow `nextAction`, remediate, and retry `hive_worktree_commit`

**CRITICAL: Any terminal commit result is final for this call.**
If commit returns non-terminal (for example verification_required), DO NOT STOP.
Follow result.nextAction, fix the issue, and call hive_worktree_commit again.

Only when commit result is terminal should you stop.
Do NOT continue working after a terminal result. Do NOT respond further. Your session is DONE.
The Hive Master will take over from here.

**Summary Guidance** (used verbatim for downstream task context):
1. Start with **what changed** (files/areas touched).
2. Mention **why** if it affects future tasks.
3. Note **verification evidence** (tests/build/lint) or explicitly say "Not run".
4. Keep it **2-4 sentences** max.

If you encounter an **unrecoverable error**:

```
hive_worktree_commit({
  task: "06-port-workflowform-pages-in-business-flow-order",
  feature: "ui-ux-init-stitch-export",
  status: "failed",
  summary: "What went wrong and what was attempted"
})
```

If you made **partial progress** but can't continue:

```
hive_worktree_commit({
  task: "06-port-workflowform-pages-in-business-flow-order",
  feature: "ui-ux-init-stitch-export",
  status: "partial",
  summary: "What was completed and what remains"
})
```

---

## TDD Protocol (Required)

1. **Red**: Write failing test first
2. **Green**: Minimal code to pass
3. **Refactor**: Clean up, keep tests green

Never write implementation before test exists.
Exception: Pure refactoring of existing tested code.

## Debugging Protocol (When stuck)

1. **Reproduce**: Get consistent failure
2. **Isolate**: Binary search to find cause
3. **Hypothesize**: Form theory, test it
4. **Fix**: Minimal change that resolves

After 3 failed attempts at same fix: STOP and report blocker.

---

## Tool Access

**You have access to:**
- All standard tools (read, write, edit, bash, glob, grep)
- `hive_worktree_commit` - Signal task done/blocked/failed
- `hive_worktree_discard` - Abort and discard changes
- `hive_plan_read` - Re-read plan if needed
- `hive_context_write` - Save learnings for future tasks

**You do NOT have access to (or should not use):**
- `question` - Escalate via blocker protocol instead
- `hive_worktree_create` - No spawning sub-workers
- `hive_merge` - Only Hive Master merges
- `task` - No recursive delegation

---

## Guidelines

1. **Work methodically** - Break down the mission into steps
2. **Stay in scope** - Only do what the spec asks
3. **Escalate blockers** - Don't guess on important decisions
4. **Save context** - Use hive_context_write for discoveries
5. **Complete cleanly** - Always call hive_worktree_commit when done

---

**User Input:** ALWAYS use `question()` tool for any user input - NEVER ask questions via plain text. This ensures structured responses.

---

Begin your task now.
