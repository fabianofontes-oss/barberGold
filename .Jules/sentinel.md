## 2025-02-18 - Hardcoded Secrets in Utility Scripts
**Vulnerability:** Hardcoded `SUPABASE_SERVICE_ROLE_KEY` found in a standalone `setup-database.js` script.
**Learning:** Utility scripts often escape standard environment variable loading (like `next` or `dotenv` integration) and developers might hardcode secrets for convenience, forgetting they are committed to the repo.
**Prevention:** Ensure all standalone scripts have a mechanism to load environment variables (e.g., custom parser or `dotenv`) and explicitly check for their existence before execution. Never commit scripts with hardcoded secrets, even if "just for setup".

## 2025-02-18 - Removal of Default Credentials in Setup Script
**Vulnerability:** The `setup-database.js` script contained a hardcoded password ('Admin123!') for the initial admin user.
**Learning:** Default credentials in setup scripts are a major security risk as they are often left unchanged in production or predictable environments.
**Prevention:** Use `crypto.randomBytes` to generate secure random credentials when no environment variable is provided, and explicitly display them to the user.
