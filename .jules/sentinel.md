## 2026-01-25 - Open Redirect in Auth Callback
**Vulnerability:** The authentication callback handler (`src/app/auth/callback/route.ts`) blindly redirected users to the URL specified in the `next` query parameter without validation.
**Learning:** `new URL(input, base)` ignores `base` if `input` is an absolute URL. Protocol-relative URLs (`//evil.com`) and backslash-prefixed paths (`/\evil.com`) can also be interpreted as absolute or protocol-relative by browsers/URL parsers, leading to open redirects.
**Prevention:** Always validate user-supplied redirect destinations. Ensure they start with `/`, do NOT start with `//` or `/\`, and are relative to the application's domain. Use a safe default if validation fails.
