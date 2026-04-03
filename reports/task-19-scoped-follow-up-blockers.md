# Task 19 Scoped Follow-up Blockers

Worktree: `19-scoped-follow-up-blockers-only-if-18-fails`

## Trigger

Task 18 evidence run exposed runtime-environment blockers, so this task scopes bounded follow-up work instead of making broad fixes.

## Bounded follow-up tasks

1. **Server test runtime dependency unblock**
   - Scope: make `npm --prefix server test` executable in the task environment.
   - Blocker: missing runtime deps (`jsonwebtoken`, `joi`, `sharp`, `exceljs`, `dotenv`, `@prisma/client`) and Prisma `DATABASE_URL` initialization failure.

2. **Client lint/build toolchain unblock**
   - Scope: make `npm --prefix client run lint && npm --prefix client run build` executable.
   - Blocker: `eslint` and `vite` are not installed in the environment.

3. **Smoke runtime package unblock for real flows**
   - Scope: make the smoke flows executable with runtime packages available.
   - Blocker: `customers`, `inventory`, `repair`, `reports`, `topbar`, and `finance-report` fail because required runtime packages are missing, mainly `joi` or `axios`.

4. **Finance smoke coverage gap**
   - Scope: add or map the missing `finance` smoke flow so the verification matrix is complete.
   - Blocker: `node client/scripts/smoke/run-smoke.mjs --flow finance` has no matching smoke flow file.

## Outcome

No production code was changed in this task. This artifact only captures the bounded blockers needed before any follow-up fixes.
