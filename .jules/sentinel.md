## 2024-05-22 - Missing Content Security Policy
**Vulnerability:** The application lacked a Content Security Policy (CSP) header, relying only on standard headers like `X-Frame-Options`.
**Learning:** Default Next.js configurations do not include CSP. Without it, the application is more susceptible to XSS and data exfiltration if an attacker finds an injection vector.
**Prevention:** Implement a strict CSP header in `next.config.ts` that explicitly whitelists trusted sources for scripts, styles, images, and connections (e.g., Stripe, Supabase).