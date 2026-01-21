## 2024-05-23 - [Missing Security Headers]
**Vulnerability:** Application was missing standard security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), potentially exposing it to clickjacking, MIME sniffing, and other attacks.
**Learning:** In Next.js App Router, `middleware.ts` is the most effective centralized point to inject these headers for every response, ensuring consistent protection across the entire application.
**Prevention:** Implement a dedicated function in `middleware.ts` to append these headers to every `NextResponse` before it is returned to the client.
