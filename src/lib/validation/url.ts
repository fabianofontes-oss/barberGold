/**
 * Checks if a redirect path is safe (internal).
 *
 * Prevents Open Redirect vulnerabilities by ensuring the path:
 * 1. Starts with '/'
 * 2. Does not start with '//' (protocol-relative)
 * 3. Does not contain backslashes (often treated as slashes by browsers but bypasses simple checks)
 * 4. Does not contain control characters
 *
 * @param path The path to validate
 * @returns true if the path is safe to redirect to
 */
export function isSafeRedirectPath(path: string | null | undefined): boolean {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Must start with /
  if (!path.startsWith('/')) {
    return false;
  }

  // Must not start with // (protocol relative)
  if (path.startsWith('//')) {
    return false;
  }

  // Must not contain backslashes or other dangerous characters
  // \ is often treated as / in browsers
  // Control characters are dangerous
  if (path.includes('\\') || /[\x00-\x1F\x7F]/.test(path)) {
    return false;
  }

  // Prevent "javascript:" or "data:" even if they somehow start with / (unlikely but defensive)
  // Actually, if it starts with /, it's a relative path, so "javascript:" scheme is impossible
  // unless the browser parses "/javascript:..." weirdly.
  // Standard relative path logic applies.

  return true;
}
