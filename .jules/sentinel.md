## 2026-01-26 - Conditional Validation Bypass
**Vulnerability:** Found a pattern in `createClientAction` where Zod validation was conditionally wrapped in an `if (data.phone)` block. This meant if the phone field was missing, the ENTIRE validation (including name, email, etc.) was skipped, allowing invalid data into the database.
**Learning:** Developers sometimes wrap validation to handle "optional" fields or legacy data, mistakenly bypassing validation for *other* required fields in the process. This creates a hidden bypass vector.
**Prevention:** Always run schema validation unconditionally. If a field is optional, handle it in the Schema (`.optional()`) or with a default value in the input object, but NEVER skip the `.parse()` call itself.
