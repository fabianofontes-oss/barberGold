## 2024-05-23 - Auth Barriers in E2E Verification
**Learning:** UX verification using Playwright is blocked for internal app pages (`/app/*`) without valid Supabase credentials because the server-side `AuthGuard` strictly enforces session existence and ignores the `NEXT_PUBLIC_APP_MODE=demo` flag.
**Action:** For future UX tasks on protected routes, rely on static analysis/build checks unless a mock-auth mechanism or valid credentials are provided.
