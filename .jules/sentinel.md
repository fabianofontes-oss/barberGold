## 2024-05-22 - Conditional Validation Bypass
**Vulnerability:** Found a logic flaw where input validation for a user creation form was entirely skipped if an optional field (`phone`) was missing. The code checked `if (data.phone)` before running *any* schema validation.
**Learning:** Conditional validation logic is prone to bypass errors. Avoid wrapping the entire validation block in a condition based on a single field.
**Prevention:** Use Zod's `omit` or `pick` to validate the "always required" fields unconditionally, then validate optional/conditional fields separately. Or use a schema that correctly models the optionality (e.g. `z.union` or `.optional()`).
