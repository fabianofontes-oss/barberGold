# Sentinel's Journal 🛡️

## 2026-01-28 - Open Redirect in Auth Callback
**Vulnerability:** The `src/app/auth/callback/route.ts` used the `next` query parameter directly in `NextResponse.redirect(new URL(next, origin))`. The `URL` constructor ignores the second argument (base) if the first argument (path) is an absolute URL, allowing attackers to redirect users to malicious sites (Open Redirect).
**Learning:** Never trust the `URL()` constructor to enforce relative paths when the input can be an absolute URL. It's a common pitfall in Node.js/Browser URL API.
**Prevention:** Always validate user-provided redirect paths using a strict helper like `isSafeRedirectPath` that ensures the path starts with `/` and doesn't contain protocol-relative sequences (`//`) or backslashes (`\`).
