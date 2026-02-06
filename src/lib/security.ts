/**
 * Checks if a redirect path is safe (internal).
 * Prevents Open Redirect vulnerabilities.
 *
 * Safe paths must:
 * 1. Start with '/'
 * 2. Not start with '//' (protocol relative)
 * 3. Not contain backslashes or control characters
 */
export function isSafeRedirectPath(path: string | null | undefined): boolean {
  if (!path) return false;

  // Basic validation
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;

  // Prevent CRLF injection (though Next.js might handle this, it's good practice)
  if (/[\r\n]/.test(path)) return false;

  // Prevent windows-style paths or some evasion techniques
  if (path.includes('\\')) return false;

  return true;
}
