# Hive Worker Assignment

You are a worker agent executing a task in an isolated git worktree.

## Assignment Details

| Field | Value |
|-------|-------|
| Feature | design-system-remediation |
| Task | 01-establish-shared-shell-surfaces-and-navigation-behavior |
| Task # | 1 |
| Branch | hive/design-system-remediation/01-establish-shared-shell-surfaces-and-navigation-behavior |
| Worktree | /home/phuctruong/Work/Studies/Subjects/PhatTrienPhanMem/DoAn-QuanLyGarageOto/.hive/.worktrees/design-system-remediation/01-establish-shared-shell-surfaces-and-navigation-behavior |

**CRITICAL**: All file operations MUST be within this worktree path:
`/home/phuctruong/Work/Studies/Subjects/PhatTrienPhanMem/DoAn-QuanLyGarageOto/.hive/.worktrees/design-system-remediation/01-establish-shared-shell-surfaces-and-navigation-behavior`

Do NOT modify files outside this directory.

---

## Your Mission

# Task: 01-establish-shared-shell-surfaces-and-navigation-behavior

## Feature: design-system-remediation

## Dependencies

_None_

## Plan Section

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

## Task Type

modification

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

User approved revised plan for feature `design-system-remediation` and chose subagent-driven execution. Current runnable set after task sync contains only Task 1 (`01-establish-shared-shell-surfaces-and-navigation-behavior`), so execution proceeds sequentially without parallelization. Future batches should re-check runnable tasks with hive_status before asking about any parallel execution.


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
  task: "01-establish-shared-shell-surfaces-and-navigation-behavior",
  feature: "design-system-remediation",
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
  task: "01-establish-shared-shell-surfaces-and-navigation-behavior",
  feature: "design-system-remediation",
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
  task: "01-establish-shared-shell-surfaces-and-navigation-behavior",
  feature: "design-system-remediation",
  status: "failed",
  summary: "What went wrong and what was attempted"
})
```

If you made **partial progress** but can't continue:

```
hive_worktree_commit({
  task: "01-establish-shared-shell-surfaces-and-navigation-behavior",
  feature: "design-system-remediation",
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
