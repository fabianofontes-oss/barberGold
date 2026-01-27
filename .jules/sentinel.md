## 2025-02-19 - Open Redirect in Auth Callback

**Vulnerability:** Found an Open Redirect vulnerability in `src/app/auth/callback/route.ts`. The `next` query parameter was used directly in `NextResponse.redirect()` without validation.
**Learning:** Next.js `new URL(path, base)` ignores `base` if `path` is absolute. This is standard JS URL behavior but dangerous when `path` comes from user input.
**Prevention:** Always validate redirect targets. Ensure they start with `/` and do NOT start with `//`. Used a centralized validator `src/lib/validation/url.ts`.
