## 2024-05-22 - [Hooks Ordering Violation]
**Learning:** Found components (e.g., `Clients.tsx`) with early returns (e.g., `if (!currentUser) return null;`) placed *before* hook execution. This makes adding `useMemo` or other hooks dangerous as it triggers "Rendered more hooks than during the previous render" errors.
**Action:** Always check for early returns in legacy components before adding new hooks. Move existing hooks above the return or make the new hooks unconditional (safe for nulls) and place them above the return.
