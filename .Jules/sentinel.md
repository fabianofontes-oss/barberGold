## 2024-02-14 - Hardcoded Service Role Key in Setup Script
**Vulnerability:** A hardcoded `serviceRoleKey` was found in `setup-database.js`. This key has full administrative access to the Supabase instance, bypassing Row Level Security.
**Learning:** Utility scripts, even if not part of the main application build, can be dangerous if they contain secrets. They are often overlooked during security reviews because they aren't "production code," but if committed to the repo, they expose critical secrets.
**Prevention:** Never hardcode secrets in any file, including setup scripts. Use environment variables or prompt the user for input. Scan all files in the repository, not just `src/`, for secrets.
