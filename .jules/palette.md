## 2024-05-22 - Loading States for Page Reload Actions
**Learning:** When async actions trigger a full page reload (e.g., `window.location.reload()`), standard loading states are still critical. Without them, users may click multiple times or perceive the app as unresponsive during the network request phase before the reload occurs.
**Action:** Always wrap async actions that reload the page with a local `isSubmitting` state, show a spinner, and disable the button to provide immediate feedback and prevent double-submission.
