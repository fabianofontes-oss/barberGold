/**
 * Validates if a path is safe for redirection (Open Redirect protection)
 *
 * Rules:
 * 1. Must start with '/'
 * 2. Must NOT start with '//' (protocol relative URL)
 * 3. Must NOT contain '\' (backslashes can be treated as slashes)
 * 4. Must NOT contain control characters (optional safety)
 */
export function isSafeRedirectPath(path: string | null | undefined): boolean {
  if (!path) return false;

  // Basic sanity checks
  if (typeof path !== 'string') return false;

  // Must start with /
  if (!path.startsWith('/')) return false;

  // Must not start with // (protocol relative)
  if (path.startsWith('//')) return false;

  // Must not contain backslashes
  if (path.includes('\\')) return false;

  // Additional check: Ensure it's not trying to bypass with mixed slashes like /\\
  // (Covered by includes check, but explicit comment helps)

  return true;
}
