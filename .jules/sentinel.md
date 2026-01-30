# Sentinel's Journal 🛡️

## 2024-05-22 - Validation Bypass via Conditional Logic
**Vulnerability:** Input validation in `createClientAction` was conditional (`if (data.phone)`), allowing requests without a phone number to bypass all validation (including name length checks) and insert raw data into the database.
**Learning:** Conditional validation logic is a "fail-open" security anti-pattern. If the condition is not met, the gatekeeper is removed entirely.
**Prevention:** Enforce `schema.parse(data)` unconditionally at the start of any server action. Handle optionality within the Zod schema definition (e.g., `.optional().or(z.literal(''))`), never in the imperative logic.
