## 2024-05-24 - Missing Server Action Validation
**Vulnerability:** `updateClientAction` accepted partial updates without validating input format, potentially allowing invalid data into the database.
**Learning:** Server Actions often manually map inputs but forget to validate the *content* of those inputs against a schema, especially for partial updates.
**Prevention:** Always use `Schema.partial().parse(input)` for update actions to ensure type and format safety.
