# Sentinel Journal

## 2024-05-22 - Open Redirect via `new URL()`

**Vulnerability:** The `new URL(input, base)` constructor ignores the `base` argument if the `input` is an absolute URL. In `src/app/auth/callback/route.ts`, user input (`next` query param) was passed directly to `new URL()`, allowing attackers to redirect authenticated users to malicious sites.

**Learning:** Developers often assume `new URL(path, origin)` enforces the origin, but it only acts as a fallback for relative paths. This "Open Redirect" vulnerability is common in authentication flows.

**Prevention:** Explicitly validate that redirect paths are relative. Ensure they start with `/` and do NOT start with `//` (protocol-relative). Use a whitelist of allowed domains if absolute URLs are required.
