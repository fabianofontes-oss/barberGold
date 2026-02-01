# Sentinel Journal - Critical Security Learnings

## 2025-02-18 - Input Validation Bypass in Server Actions
**Vulnerability:** Found `createClientAction` skipping ALL validation if an optional field (phone) was missing. `updateClientAction` had no validation at all.
**Learning:** Conditional validation logic (`if (field) validate()`) is dangerous because it implicitly treats the "else" case as "safe" or "no validation needed", which is often false.
**Prevention:** Always enforce a base schema for all inputs. Use `schema.partial()` for updates or `schema.omit()` for optional subsets, but NEVER skip the `.parse()` call.
