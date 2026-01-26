## 2024-05-22 - Memoizing Expensive Derived State
**Learning:** React components dealing with large lists (like Clients) that rely on Context data often re-render unnecessarily. When expensive filtering logic (O(N) or O(N*M)) is inside the render body without memoization, it causes UI lag, especially on inputs like search.
**Action:** Always wrap expensive derived state (filtering, sorting, Set creation) in `useMemo`. Ensure that early returns (e.g. `if (!user)`) do not prevent hooks from running; instead, handle the null case *inside* the `useMemo` or hoist the checks.
