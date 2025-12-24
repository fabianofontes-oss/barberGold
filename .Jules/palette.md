## 2025-05-23 - [Icon-Only Button Accessibility]
**Learning:** Icon-only buttons (like the sidebar toggle or logout button) often lack accessible names when the text label is hidden. Adding `aria-label` ensures screen readers can announce the action even when the visual label is absent.
**Action:** Always check `showText` or similar props in reusable components and provide a fallback `aria-label` or `title` that matches the intended action.
