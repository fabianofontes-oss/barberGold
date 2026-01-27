# Sentinel's Journal

## 2024-05-22 - Flawed Input Validation Pattern
**Vulnerability:** Input validation was conditionally applied (`if (data.phone) validate()`), allowing invalid data (like short names) to bypass checks if optional fields were missing.
**Learning:** Rigid schemas that don't match business logic (e.g., required phone when it should be optional) lead to dangerous workarounds that bypass validation entirely.
**Prevention:** Design schemas to accurately reflect data requirements (use `.optional()`, `.or(z.literal(''))`) so developers can validate the *entire* object payload without conditional logic.
