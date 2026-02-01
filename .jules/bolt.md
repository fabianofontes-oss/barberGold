## 2024-05-23 - Context Performance Bottleneck
**Learning:** `AppProvider` context value is recreated on every render, and derived state like `todayRevenue` was iterating over potentially large arrays (O(N)) on every render.
**Action:** Always memoize expensive calculations in Context Providers, especially if the Provider is high up in the tree and re-renders frequently. Used `useMemo` for `todayRevenue`.
