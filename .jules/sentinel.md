## 2025-02-19 - Open Redirect in Auth Callback
**Vulnerability:** The OAuth callback route (`src/app/auth/callback/route.ts`) accepted a `next` query parameter and used it directly in `NextResponse.redirect(new URL(destination, requestUrl.origin))`. The `URL` constructor ignores the base URL if the input is absolute, allowing attackers to redirect users to malicious sites after login.
**Learning:** `NextResponse.redirect` combined with `new URL()` behaves unexpectedly when the input is an absolute URL, overriding the provided base.
**Prevention:** Always validate redirect targets. Use a strict allowlist or a helper like `isSafeRedirectPath` that checks for `/` prefix and rejects `//` or control characters.
