# Hive Worker Assignment

You are a worker agent executing a task in an isolated git worktree.

## Assignment Details

| Field | Value |
|-------|-------|
| Feature | ui-ux-init-stitch-export |
| Task | 01-freeze-route-inventory-and-coverage-manifest |
| Task # | 1 |
| Branch | hive/ui-ux-init-stitch-export/01-freeze-route-inventory-and-coverage-manifest |
| Worktree | /home/phuctruong/Work/Studies/Subjects/PhatTrienPhanMem/DoAn-QuanLyGarageOto/.hive/.worktrees/ui-ux-init-stitch-export/01-freeze-route-inventory-and-coverage-manifest |

**CRITICAL**: All file operations MUST be within this worktree path:
`/home/phuctruong/Work/Studies/Subjects/PhatTrienPhanMem/DoAn-QuanLyGarageOto/.hive/.worktrees/ui-ux-init-stitch-export/01-freeze-route-inventory-and-coverage-manifest`

Do NOT modify files outside this directory.

---

## Your Mission

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
  task: "01-freeze-route-inventory-and-coverage-manifest",
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
  task: "01-freeze-route-inventory-and-coverage-manifest",
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
  task: "01-freeze-route-inventory-and-coverage-manifest",
  feature: "ui-ux-init-stitch-export",
  status: "failed",
  summary: "What went wrong and what was attempted"
})
```

If you made **partial progress** but can't continue:

```
hive_worktree_commit({
  task: "01-freeze-route-inventory-and-coverage-manifest",
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
