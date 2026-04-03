# Task 18 Integration Hardening Evidence

Worktree: `18-integration-hardening-evidence-run-no-fixes`

## Commands run

- `npm --prefix server test`
- `npm --prefix client run lint`
- `npm --prefix client run build`
- `node client/scripts/smoke/run-smoke.mjs --flow customers`
- `node client/scripts/smoke/run-smoke.mjs --flow inventory`
- `node client/scripts/smoke/run-smoke.mjs --flow repair`
- `node client/scripts/smoke/run-smoke.mjs --flow reception`
- `node client/scripts/smoke/run-smoke.mjs --flow reports`
- `node client/scripts/smoke/run-smoke.mjs --flow topbar`
- `node client/scripts/smoke/run-smoke.mjs --flow admin-role`
- `node client/scripts/smoke/run-smoke.mjs --flow settings-catalog`
- `node client/scripts/smoke/run-smoke.mjs --flow activity-log`
- `node client/scripts/smoke/run-smoke.mjs --flow finance-report`
- `node client/scripts/smoke/run-smoke.mjs --flow route-matrix`

## Results

- Server test suite: failed because runtime deps are unavailable in this worktree (`jsonwebtoken`, `joi`, `sharp`, `exceljs`, `dotenv`, `@prisma/client`) and one test path also hit `DATABASE_URL is required to initialize Prisma client.`
- Client lint: failed immediately because `eslint` is not installed in the environment.
- Client build: failed because `vite` is not installed in the environment.
- Smoke flows passed: `reception`, `admin-role`, `settings-catalog`, `activity-log`, `route-matrix`.
- Smoke flows failed: `customers`, `inventory`, `repair`, `reports`, `topbar`, `finance-report` due missing runtime packages (mainly `joi` or `axios`).
- `finance` flow: no matching smoke flow file existed.

## Notes

No code changes were made; this task only captured hardening evidence.
