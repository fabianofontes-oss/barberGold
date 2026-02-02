## 2025-05-23 - Client-Side Secret Exposure in Context
**Vulnerability:** The `ShopSettings` object containing full `gatewayConfig` (with sensitive API keys and tokens) was being exposed via React Context (`AppProvider`) to all authenticated users, including non-owners.
**Learning:** In Single Page Applications (SPAs) or client-side rendered apps using global context for state management, it's easy to accidentally broadcast sensitive data to all components (and thus all users with access to the console/DevTools) if the backend API returns the full object without role-based filtering.
**Prevention:**
1. **Server-Side Filtering (Preferred):** The API should never return sensitive fields to unauthorized roles.
2. **Client-Side Sanitization (Defense in Depth):** If server-side changes are not possible (e.g. legacy/demo modes), explicitly sanitize sensitive data in the Provider before passing it to the Context value, ensuring only authorized roles receive the secrets.
