## 2024-05-22 - Validation Bypass via Unused Parse Result
**Vulnerability:** The `createClientAction` function called `zodSchema.parse()` but ignored the return value, relying on the raw input `data` for database insertion. Furthermore, validation was wrapped in a conditional block, causing it to be entirely skipped if a specific optional field was missing.
**Learning:** Calling a validation function is not enough; the return value (the sanitized/transformed data) must be the source of truth. The developer likely assumed `parse()` modifies the object in place or just throws on error, but failed to realize the raw data remains un-sanitized and un-transformed.
**Prevention:**
1. Always assign the result of `schema.parse()` to a variable (e.g., `validatedData`).
2. Use ONLY the `validatedData` variable for all downstream operations (DB inserts, API calls).
3. Never wrap the primary validation call in a conditional statement based on input presence.
