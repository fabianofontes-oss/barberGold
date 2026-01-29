/**
 * Checks if a path is safe for redirection.
 * Ensures the path is relative (starts with /) and does not use protocol-relative URLs (//)
 * or backslashes which can be used to bypass validation in some browsers.
 */
export function isSafeRedirectPath(path: string | null | undefined): path is string {
  if (!path) {
    return false;
  }

  // Must start with /
  if (!path.startsWith('/')) {
    return false;
  }

  // Must NOT start with // (protocol relative)
  if (path.startsWith('//')) {
    return false;
  }

  // Must NOT contain backslashes
  if (path.includes('\\')) {
    return false;
  }

  return true;
}
