# Palette's Journal

## 2024-05-22 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** The application makes heavy use of icon-only buttons for actions like "delete", "close", "share", and "toggle", but frequently lacks `aria-label`s. This makes the interface difficult to navigate for screen reader users.
**Action:** Systematically audit icon-only buttons during feature development and ensure `aria-label` is present. Use `title` for tooltip behavior but don't rely on it for accessibility alone.
