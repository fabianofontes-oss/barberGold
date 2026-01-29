## 2026-01-29 - Context Consumer Optimization
**Learning:** Components consuming large contexts (like `useBarber`/`useApp`) receive updates on *any* state change. Derived data (filtering/sorting lists) inside these components MUST be memoized to prevent expensive recalculations on every render.
**Action:** When working on components using `useBarber`, always wrap list filtering/sorting logic in `useMemo`.
