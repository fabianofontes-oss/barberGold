# Sentinel Journal 🛡️

## 2024-05-22 - Input Validation Bypass in Server Action
**Vulnerability:** Input Validation Bypass in `createClientAction`. The code conditionally executed `createClientSchema.parse(data)` only if `data.phone` was truthy. This meant that if a request omitted the phone number (or sent an empty one), NO validation was performed for *any* field (including Name, Email, BirthDate), allowing invalid or potentially malicious data to be inserted.
**Learning:** Conditional validation logic is a security anti-pattern. Procedural checks (`if`) that control whether validation runs can easily create loopholes where the entire validation suite is skipped.
**Prevention:** Always execute validation unconditionally. If a field allows specific "empty" states (like an empty string for an optional phone number), define that explicitly in the Zod schema (e.g., `.or(z.literal(''))`) so the schema handles the logic, ensuring all other fields remain strictly validated.
