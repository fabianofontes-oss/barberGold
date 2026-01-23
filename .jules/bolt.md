## 2024-05-22 - [Manual Context Memoization Required]
**Learning:** Even with React Compiler enabled (`reactCompiler: true`), the large `AppProvider` context value needs manual `useMemo`. The compiler likely misses it due to the object's complexity or cross-module dependencies, leading to massive re-renders.
**Action:** Always manually memoize large Context value objects in this project, specifically checking `AppContext` equivalents.
