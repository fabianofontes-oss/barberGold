## 2026-01-17 - React Compiler & Context
**Learning:** React Compiler does not prevent re-renders caused by Context value identity changes. Consumers will still re-render when the Context Provider's value reference changes (which happens on every update in `AppProvider`).
**Action:** Continue to use `useMemo` for expensive derived state inside consumers (like O(N) filtering), even if React Compiler is enabled, to ensure these calculations are skipped during context-triggered re-renders.
