/**
 * Security utilities
 */

/**
 * Validates if a path is safe for redirection (internal only)
 * Prevents Open Redirect vulnerabilities by ensuring the path:
 * 1. Starts with /
 * 2. Does not start with // (protocol relative)
 * 3. Does not contain backslashes (could be treated as separators on Windows or some browsers)
 * 4. Does not contain control characters
 */
export function isSafeRedirectPath(path: string | null | undefined): boolean {
  if (!path) return false;

  // Must start with /
  if (!path.startsWith('/')) return false;

  // Must not be protocol relative (//google.com)
  if (path.startsWith('//')) return false;

  // Must not contain backslashes (could be treated as separators on Windows or some browsers)
  if (path.includes('\\')) return false;

  // Prevent control characters (CRLF injection)
  if (/[\x00-\x1F\x7F]/.test(path)) return false;

  return true;
}
