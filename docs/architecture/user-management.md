# Decision: keep demo writes local and explicit

## Context

Meridian is a frontend portfolio project with static dashboard data and no backend service. The edit flow still needs to demonstrate the same UI concerns as a connected product: an asynchronous save, pending state, success and failure feedback, cache reconciliation, and persistence after reload.

## Decision

The dashboard reads its seed data from `public/data/users.json`. User edits are stored as per-user overrides in browser `localStorage` by the dashboard API adapter. The UI calls the adapter through a TanStack Query mutation, applies an optimistic cache update, rolls back the previous cache on failure, and invalidates the users query after settlement.

## Consequences

- The UI can be moved to an HTTP API by replacing the adapter without changing the drawer or table components.
- The demo is self-contained and edits survive a reload in the same browser profile.
- The data is not shared between browsers or devices, and `localStorage` is not a production database or authentication boundary.
- The adapter's simulated delay and error path exercise loading and recovery UX without implying a real server exists.

## Alternatives considered

- Keeping edits only in React state would lose them on reload and would not exercise cache reconciliation.
- Adding a hosted database would introduce secrets, deployment, and infrastructure concerns that do not improve this frontend-focused portfolio milestone.
- Replacing the seed data with a production API would require backend and account-management scope outside this project.
