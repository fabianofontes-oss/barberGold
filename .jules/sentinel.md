# Sentinel's Journal

## 2026-01-29 - Open Redirect via `new URL()`

**Vulnerability:** The authentication callback handler blindly used the `next` query parameter in `new URL(next, requestUrl.origin)`.
**Learning:** `new URL(input, base)` completely ignores `base` if `input` is an absolute URL (e.g., `https://evil.com`). This is a common misconception where developers assume `base` enforces the domain.
**Prevention:** Always validate that the redirect path is relative (starts with `/`) and safe (no `//` or `\`) before using it in a redirect, or use a specific "safe redirect" utility.
