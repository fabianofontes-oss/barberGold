## 2024-05-23 - Open Redirect Vulnerability
**Vulnerability:** The authentication callback route blindly redirected to the `next` query parameter using `new URL(destination, requestUrl.origin)`. Since `new URL()` treats the first argument as absolute if it contains a protocol, an attacker could supply `https://evil.com` to redirect users out of the application.
**Learning:** Never trust user input for redirect destinations. The `new URL()` constructor's second argument is ignored if the first argument is an absolute URL, making it a common source of open redirect vulnerabilities.
**Prevention:** Always validate that redirect targets are relative paths (start with `/` and not `//`) before using them in `NextResponse.redirect` or similar functions.
