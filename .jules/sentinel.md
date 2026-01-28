## 2026-01-28 - Conditional Validation Bypass
**Vulnerability:** `createClientAction` conditionally skipped Zod validation if the `phone` field was missing, allowing invalid data (names, emails) to bypass checks. `updateClientAction` had no validation at all.
**Learning:** Developers often implement "skip validation" logic for optional fields incorrectly by wrapping the *entire* validation block in a condition, rather than making the field optional in the schema.
**Prevention:** Always ensure validation runs unconditionally. Handle optional fields within the schema (e.g., `.optional()`, `.or(z.literal(''))`) rather than via control flow around the validator.
