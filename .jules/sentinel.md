## 2026-02-03 - Open Redirect in Auth Callback
**Vulnerability:** The `next` parameter in the authentication callback (`/auth/callback`) was used directly in `new URL()` without validation. This allowed an attacker to craft a URL like `?next=https://evil.com` which would redirect the user to a malicious site after login/signup (Open Redirect).
**Learning:** `new URL(path, base)` ignores the `base` argument if the `path` argument is an absolute URL (e.g., starts with `http://` or `//`). Relying on the `base` parameter to enforce same-origin is not sufficient.
**Prevention:** Always validate redirect paths. Ensure they start with `/` and do NOT start with `//`. Use a dedicated validation function like `isSafeRedirectPath` before passing user input to redirect functions.
