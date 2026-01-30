## 2026-01-30 - [Validation Bypass in Server Actions]
**Vulnerability:** Input validation was conditionally skipped in `createClientAction` if a specific field (`phone`) was missing. Additionally, `updateClientAction` lacked validation entirely.
**Learning:** Optional fields in Zod schemas combined with conditional logic in action handlers can create bypasses where required fields (like name/email format) are ignored.
**Prevention:** Always parse the entire input object against the schema unconditionally (`schema.parse(data)`). Use `schema.partial()` for update operations instead of manual field mapping without validation.
