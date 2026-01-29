# Sentinel Journal

## 2026-01-29 - Open Redirect in Auth Callback
**Vulnerability:** The auth callback endpoint (`src/app/auth/callback/route.ts`) accepted an arbitrary `next` query parameter and redirected to it without validation. This allowed attackers to construct URLs like `/auth/callback?next=https://evil.com` to steal credentials or phishing.
**Learning:** `NextResponse.redirect(new URL(destination, origin))` is unsafe if `destination` is an absolute URL, as the `URL` constructor ignores the second argument (base) in that case.
**Prevention:** Always validate redirect targets. Ensure they are relative paths (start with `/`, not `//`) or strictly whitelist allowed domains. Implemented `isSafeRedirectPath` in `src/lib/validation/url.ts`.
