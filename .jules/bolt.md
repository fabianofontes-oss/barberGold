## 2024-05-23 - AppProvider Context Instability
**Learning:** `AppProvider` reconstructs its `value` object on every render because it aggregates state from many hooks (like `useSales`) which return new object references. This causes all context consumers (like `Clients.tsx`) to re-render constantly.
**Action:** When working in consumer components, use `useMemo` aggressively for expensive derived data (filtering lists) to mitigate the impact of unavoidable context re-renders. Avoid relying on context stability.
