## 2024-05-23 - Open Redirect in Auth Callback
**Vulnerability:** The `/auth/callback` route blindly redirected to the `next` query parameter without validation, allowing attackers to construct URLs that redirect users to malicious sites after login.
**Learning:** `NextResponse.redirect(new URL(destination, base))` ignores `base` if `destination` is an absolute URL, making naive implementations vulnerable.
**Prevention:** Always validate user-supplied redirect targets. Ensure they are relative paths (start with `/`, no `//`) using a strict allowlist or validation function like `isSafeRedirectPath`.
