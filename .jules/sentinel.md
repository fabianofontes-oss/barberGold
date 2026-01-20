## 2024-05-22 - [Validation Bypass in Server Action]
**Vulnerability:** `createClientAction` was manually bypassing Zod validation when the `phone` field was missing, and `updateClientAction` had no server-side validation at all, relying purely on the frontend.
**Learning:** Zod schemas should reflect the true optionality of data. If a field is optional in business logic but required in schema, developers might write insecure code to bypass the schema. Server actions must *always* validate input, never trust the client.
**Prevention:**
1. Define strict Zod schemas that match the data shape (use `.optional()` correctly).
2. Unconditionally call `schema.parse(data)` in Server Actions.
3. Use `schema.partial()` for update operations instead of ad-hoc objects.
