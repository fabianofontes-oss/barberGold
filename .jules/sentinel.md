## 2026-01-17 - [Conditional Validation Bypass]
**Vulnerability:** Input validation for an entire object was skipped because it was wrapped in a conditional check for a single field (`if (phone) validate()`).
**Learning:** This happened because the schema enforced a strict format for `phone`, so developers skipped validation entirely when `phone` was missing to avoid errors, inadvertently skipping checks for `name`, `email`, etc.
**Prevention:** Make optional fields truly optional in the Zod schema (using `.optional()` or `.or(z.literal(''))`) instead of conditionally skipping the `.parse()` call. Always validate the full object unconditionally.
