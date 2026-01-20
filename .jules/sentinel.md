# Sentinel Journal

## 2024-05-22 - Open Redirect in Auth Callback
**Vulnerability:** The `next` query parameter in the authentication callback endpoint (`src/app/auth/callback/route.ts`) was used directly in `NextResponse.redirect()` without validation. This allowed an attacker to craft a URL that redirects a user to a malicious site after login, potentially facilitating phishing attacks.
**Learning:** The `new URL(input, base)` constructor ignores the `base` argument if the `input` is an absolute URL. Trusting user input for redirection targets is dangerous if not validated to be relative or whitelisted.
**Prevention:** Always validate redirection targets. Ensure they are relative paths (starting with `/` and not `//`) or strictly match a whitelist of allowed domains.
