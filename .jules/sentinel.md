## 2024-05-21 - Conditional Validation Bypass
**Vulnerability:** The `createClientAction` function conditionally skipped the entire schema validation if the `phone` field was missing. This was intended to handle an optional phone number (which the schema strictly required), but it inadvertently bypassed validation for ALL other fields (like `name`) when the phone number was omitted.
**Learning:** Developers sometimes bypass validation logic to handle edge cases (like optional fields in strict schemas) instead of adjusting the schema itself to match the requirements.
**Prevention:** Always ensure input validation runs unconditionally. If a field is optional, express that in the validation schema (e.g., `z.string().optional()`) rather than skipping validation in the application logic.
