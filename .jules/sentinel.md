# Sentinel Journal 🛡️

## 2025-02-19 - Open Redirect in Auth Callback
**Vulnerability:** The authentication callback route blindly redirected to the `next` query parameter without validation, allowing attackers to construct URLs that redirect users to malicious sites after login (e.g., `?next=https://evil.com`).
**Learning:** Using `new URL(input, base)` ignores the `base` argument if the `input` is an absolute URL. This is a common pitfall when handling redirects in Next.js or generic JS environments.
**Prevention:** Always validate redirect targets. Ensure they are relative paths (start with `/`) and strictly not protocol-relative (do not start with `//`).
