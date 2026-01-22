# Sentinel Journal

## 2024-05-24 - Open Redirect in Auth Callback
**Vulnerability:** The authentication callback handler (`src/app/auth/callback/route.ts`) accepted an arbitrary `next` query parameter and used it in `new URL(destination, requestUrl.origin)`. If `next` was an absolute URL (e.g., `https://evil.com`), the `URL` constructor ignores the base argument, resulting in an Open Redirect vulnerability.
**Learning:** The Javascript `URL` constructor's behavior of ignoring the base when the input is absolute is a common pitfall. It makes "relative path enforcement" critical when handling user-supplied redirect targets.
**Prevention:** Always validate that redirect targets start with `/` and do not start with `//` (protocol-relative URL) before using them.
