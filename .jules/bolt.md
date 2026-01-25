## 2026-01-25 - AppContext Memoization
**Learning:** The `AppProvider` context value was being reconstructed on every render, causing the entire application to re-render whenever the provider re-rendered (e.g., on navigation). This "God Context" pattern is particularly vulnerable to performance issues if not memoized.
**Action:** Always memoize the context value object using `useMemo` when the provider has state that updates frequently, especially for "God Contexts" that aggregate many data sources.
