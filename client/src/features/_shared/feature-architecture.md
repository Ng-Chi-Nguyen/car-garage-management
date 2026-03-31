# Feature Architecture Contract

This document standardizes the data-layer template for all features in the application, ensuring consistency across domains.

## Structure
Every feature should organize its data layer into the following distinct files:

- `*.api.js`: Pure data fetching and API calls. Does not know about React Query or UI state.
- `*.queryKeys.js`: Centralized dictionary of React Query keys for the feature.
- `*.filters.js`: URL synchronization, state validation, and filter normalization logic.
- `use*Query.js`: The main read hook that orchestrates `useQuery`, URL sync, and prefetching.
- `use*Mutation.js`: The write hook(s) that handle `useMutation` and enforce query invalidation.

## Query Keys Contract
1. Must use a feature-specific prefix (e.g., `['workshop']`).
2. Must export a `[feature]Keys` object with a consistent factory pattern.
3. Must explicitly define dependencies in key arrays.

## URL Sync Helpers Contract
1. URL is the single source of truth for list-like filters, tabs, and pagination.
2. Filter states must be validated and normalized on load (e.g., invalid range defaults to 'month').
3. Hook must automatically sync URL if invalid parameters are present.

## Mutation Invalidation Contract
1. Every mutation hook MUST expose an `INVALIDATES_KEYS` array documenting which query keys it invalidates.
2. Success paths must explicitly invalidate these keys using `queryClient.invalidateQueries`.
3. Side effects (toast, redirect) should happen in the mutation callbacks (`onSuccess`, `onError`), while cache invalidation happens in `onSettled` or `onSuccess`.
