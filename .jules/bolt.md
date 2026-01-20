## 2024-05-22 - Context Provider Value Instability
**Learning:** The `AppProvider` creates a new `value` object on every render because it is not memoized. This forces all consuming components (like `Clients`) to re-render whenever *any* context state changes, even unrelated ones.
**Action:** Always memoize expensive derived state in consuming components (using `useMemo`) to mitigate the impact of frequent re-renders caused by unstable context values.
