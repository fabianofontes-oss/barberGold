## 2025-02-18 - Conditional Validation Bypass in Server Action
**Vulnerability:** `createClientAction` skipped Zod validation entirely if the optional `phone` field was missing, allowing invalid data (e.g. short names) to be inserted into the database.
**Learning:** The previous developer likely tried to hack around a "Required" schema for an "Optional" field by conditionally skipping validation, which is a dangerous pattern. They also used a "dummy phone" default for validation which was brittle.
**Prevention:** Always validate input unconditionally. If a field is optional in the UI/Action, make it optional in the Schema using `.optional()` or `.or(z.literal(''))`. Never use conditional logic to determine *whether* to validate.
