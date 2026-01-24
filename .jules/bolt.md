## 2024-05-22 - AppProvider Context Stability
**Learning:** `AppProvider` aggregates a massive amount of state and hooks. Without manual `useMemo` on the `value` object, every single state change (even internal ones like `currentView`) causes the entire application to re-render, as the context reference changes. React Compiler does not automatically optimize this complex object creation.
**Action:** When adding new state or hooks to `AppProvider`, always ensure they are added to the `useMemo` dependency array. Consider splitting this context in the future if performance remains an issue.
