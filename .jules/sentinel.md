## 2024-05-23 - Validation Bypass via Conditional Logic
**Vulnerability:** Found a pattern where Zod validation was skipped entirely if a specific field (`phone`) was missing, using `if (data.phone) { schema.parse(...) }`.
**Learning:** Conditional validation based on input presence is dangerous. It can leave other fields unvalidated.
**Prevention:** Always validate the entire object using `.parse()`. Handle optional fields within the schema itself (e.g., `.optional().or(z.literal(''))`).
