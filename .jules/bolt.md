## 2025-02-18 - AppProvider Context Trashing
**Learning:** `AppProvider` reconstructs its `value` object on every render because it is not memoized. This causes *every* consumer of `useApp` to re-render whenever `AppProvider` re-renders (e.g., on route change).
**Action:** Prioritize memoizing the `AppProvider` context value or splitting the context to isolate frequent updates.

## 2025-02-18 - Unmemoized Filtering in Large Lists
**Learning:** `Clients.tsx` performed O(N) filtering on potentially large arrays on every render (including text input keystrokes).
**Action:** Always wrap derived list filtering in `useMemo`, especially when the component contains high-frequency state updates.
