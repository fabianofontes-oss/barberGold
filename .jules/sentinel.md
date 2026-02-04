## 2024-05-23 - Open Redirect in URL Constructor
**Vulnerability:** The `new URL(input, base)` constructor ignores the `base` argument if `input` is an absolute URL, leading to Open Redirect vulnerabilities when `input` is user-controlled.
**Learning:** This behavior is standard but often overlooked. Validating that `input` is a relative path is crucial.
**Prevention:** Use a helper like `isSafeRedirectPath` to enforce paths start with `/` and forbid `//`.
