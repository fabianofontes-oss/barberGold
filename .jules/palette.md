## 2024-05-23 - Accessibility of Custom Modals
**Learning:** The project uses manual `div` based modals in `Clients.tsx` without standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) or focus management.
**Action:** When touching other modals, always check for and add `role="dialog"`, `aria-modal="true"`, and proper labelling. Consider recommending a transition to a primitive library like Radix UI for better a11y coverage in the future.
