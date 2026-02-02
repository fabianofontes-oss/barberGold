## 2026-02-02 - Transitive Vulnerability in qs via Stripe
**Vulnerability:** Found `qs < 6.14.1` (High Severity) introduced transitively via `stripe` dependency. Direct update impossible as `stripe` locked it.
**Learning:** `npm` allows `overrides` to force resolution of nested dependencies. This is critical for fixing vulnerabilities in maintained packages that haven't updated their own deps yet.
**Prevention:** Regularly audit `package-lock.json` and use `overrides` in `package.json` to patch transitive vulnerabilities without waiting for upstream fixes.
