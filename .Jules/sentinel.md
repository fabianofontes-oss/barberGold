## 2025-02-18 - Hardcoded Secrets in Utility Scripts
**Vulnerability:** Hardcoded `SUPABASE_SERVICE_ROLE_KEY` found in a standalone `setup-database.js` script.
**Learning:** Utility scripts often escape standard environment variable loading (like `next` or `dotenv` integration) and developers might hardcode secrets for convenience, forgetting they are committed to the repo.
**Prevention:** Ensure all standalone scripts have a mechanism to load environment variables (e.g., custom parser or `dotenv`) and explicitly check for their existence before execution. Never commit scripts with hardcoded secrets, even if "just for setup".
