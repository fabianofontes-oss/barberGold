## 2025-05-27 - Early Returns vs Hooks
**Learning:** The codebase uses `if (!currentUser) return null;` early in components to handle authentication safety. This conflicts with React Hooks rules when trying to optimize logic using `useMemo` or `useEffect` that depends on `currentUser`.
**Action:** When optimizing components with early auth checks, move the check to the end of the hook chain and ensure all hooks can gracefully handle `null` user state (e.g. returning empty arrays or default values).
