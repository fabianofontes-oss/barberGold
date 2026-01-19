## 2026-01-19 - Conditional Validation Bypass
**Vulnerability:** Found a pattern where validation was skipped if a specific field (`phone`) was missing, allowing invalid data for other fields (`name`) to be inserted.
**Learning:** Conditional validation logic (`if (data.field) validate()`) is risky because it trusts the input structure to trigger validation.
**Prevention:** Always enforce validation on the entire input object (`schema.parse(data)`), handling optional fields within the schema definition itself.
