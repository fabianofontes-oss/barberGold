
/**
 * Valida se um caminho de redirecionamento é seguro
 * Previne vulnerabilidades de Open Redirect
 *
 * Regras:
 * 1. Deve começar com /
 * 2. Não pode começar com // (protocol-relative)
 * 3. Não pode conter \ (backslashes)
 * 4. Não pode conter caracteres de controle
 */
export function isSafeRedirectPath(path: string | null | undefined): boolean {
  if (!path) return false;

  // Deve começar com /
  if (!path.startsWith('/')) return false;

  // Não pode ser protocol-relative (//evil.com)
  if (path.startsWith('//')) return false;

  // Não pode conter backslash (alguns browsers tratam como slash)
  if (path.includes('\\')) return false;

  // Não pode conter caracteres de controle
  // \x00-\x1F são caracteres de controle ASCII
  if (/[\x00-\x1F]/.test(path)) return false;

  return true;
}
