## 2024-05-24 - Missing Memoization in Heavy Lists
**Learning:** `Clients.tsx` performs O(N) filtering and sorting on potentially large datasets (`clients`, `appointments`) inside the render body without `useMemo`, causing performance degradation on every render (e.g., when typing in inputs).
**Action:** Always verify memoization usage in list-heavy components even if documentation claims it's there. Applied `useMemo` to `myLoyalClients`, `displayedClients`, and `filteredClients`.
