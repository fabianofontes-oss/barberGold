/**
 * Checks if a path is safe for redirection.
 * Prevents open redirects by ensuring the path is relative and starts with '/'.
 *
 * @param path The path to check
 * @returns true if the path is safe, false otherwise
 */
export function isSafeRedirectPath(path: string | null | undefined): boolean {
  if (!path) return false;

  // Must start with /
  if (!path.startsWith('/')) return false;

  // Must not start with // (protocol relative)
  if (path.startsWith('//')) return false;

  // Must not contain backslashes (sometimes treated as slashes)
  if (path.includes('\\')) return false;

  // Must not contain controls chars (e.g. \r \n)
  // This is a basic check, URL constructors usually handle this but we want to be strict.
  if (/[\x00-\x1F\x7F]/.test(path)) return false;

  // Additional check: prevent 'javascript:' or 'data:' if they somehow got past the '/' check
  // (Though starting with '/' should prevent them, defense in depth)

  return true;
}
