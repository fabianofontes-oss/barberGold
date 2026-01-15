## 2024-05-22 - Conditional Validation Bypass in Server Action
**Vulnerability:** `createClientAction` skipped all schema validation if the optional `phone` field was missing, allowing clients to be created with invalid names (e.g., empty string) or other invalid fields.
**Learning:** Conditional logic wrapping validation (`if (data.phone) validate()`) creates a bypass path. The developer likely wanted to handle optional phone numbers but accidentally made the entire validation dependent on the presence of the phone number.
**Prevention:** Always run validation (`schema.parse()`). Handle optional fields within the Zod schema itself (using `.optional()` or `.or(z.literal(''))`) rather than using procedural `if` checks around the validation logic.
