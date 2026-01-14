## 2024-05-22 - Open Redirect in Auth Callback
**Vulnerability:** The `/auth/callback` route blindly trusted the `next` query parameter for redirection, allowing attackers to construct URLs that redirect users to malicious sites after login.
**Learning:** `new URL()` treats the second argument as a base only if the first argument is relative. If the first argument is absolute (e.g., `https://evil.com`), the base is ignored.
**Prevention:** Always validate redirect destinations. Ensure they are relative paths (start with `/`) and do not use protocol-relative URLs (`//`).
