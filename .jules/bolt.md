## 2024-05-23 - Context Value Stability & Derived State
**Learning:** The `AppProvider` in `src/context/AppContext.tsx` creates a new `value` object on every render, causing all consumers (like `Clients.tsx`) to re-render frequently. This makes memoization of derived state in consumers critical.
**Action:** When optimizing components consuming global context, assume they re-render often. Always memoize expensive derived data (filtering/mapping large arrays) in these consumers.
