## 2026-01-18 - Preventing Secret Exposure in DOM
**Vulnerability:** Sensitive API keys (Stripe Secret Key, etc.) were rendered directly into the `value` attribute of input fields, exposing them in the DOM and allowing retrieval via "Inspect Element".
**Learning:** Controlled components in React that bind sensitive data to `value` inadvertently expose that data in the HTML source, even if `type="password"`.
**Prevention:** Use a "write-only" input pattern for secrets where the existing value is indicated by a placeholder/state but never rendered back to the DOM.
