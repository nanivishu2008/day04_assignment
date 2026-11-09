# React Core Concepts Interview Answers

### Q1. What causes a component to re-render? How does React.memo change that?
A component re-renders when its internal state changes, its parent component re-renders, or a consumed React context value updates. By default, every child re-renders when its parent does, even if props are identical. `React.memo` alters this behavior: it shallowly compares incoming props against previous props, skipping the re-render completely if they are identical, thereby optimizing rendering performance.

---

### Q2. What is the dependency array for?
The dependency array instructs React when to re-synchronize effects (`useEffect`) or recompute memoized values (`useMemo`, `useCallback`). Without an array, the effect runs after every render. An empty array (`[]`) runs it only once on mount. Listing specific dependencies guarantees execution only when those values change between renders. Omitting dependencies leads to stale closures and subtle synchronization bugs, while unnecessary dependencies cause redundant computations.

---

### Q3. What are the Rules of Hooks?
React Hooks enforce two core rules:
1. **Call Hooks only at the top level**: Never call Hooks inside loops, conditions, or nested functions.
2. **Call Hooks only from React functions**: Invoke them only from React function components or custom Hooks.

These rules guarantee a fixed, predictable Hook call order across renders, which React's internal fiber architecture relies upon to correctly pair state and effects with the component instance.
