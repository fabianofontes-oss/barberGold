## 2024-05-23 - Open Redirect in Auth Callback
**Vulnerability:** The `auth/callback` route blindly accepted a `next` query parameter and passed it to `new URL(destination, origin)`.
**Learning:** `new URL('/path', base)` works as expected, but `new URL('https://evil.com', base)` and `new URL('//evil.com', base)` IGNORE the base and return the absolute URL. This allows attackers to craft phishing links that redirect users to malicious sites after login.
**Prevention:** Always validate redirect targets. Ensure they start with `/` AND do NOT start with `//` (protocol-relative). Use a whitelist of allowed domains if external redirects are needed.
