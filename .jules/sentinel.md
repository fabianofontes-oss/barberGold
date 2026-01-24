## 2024-05-22 - Validation Bypass via Conditional Logic
**Vulnerability:** `createClientAction` skipped schema validation entirely if the `phone` field was missing, allowing invalid data (e.g., short names) to be inserted into the database.
**Learning:** Conditional validation logic based on the presence of a field is a dangerous antipattern. It creates hidden paths where validation is bypassed. The schema itself should define what is optional, not the calling code.
**Prevention:** Always perform validation unconditionally using `schema.parse(data)` at the entry point of server actions. Rely on Zod's `.optional()` or `.or(z.literal(''))` to handle optional fields within the schema, and strictly use the returned `validated` object for database operations.
