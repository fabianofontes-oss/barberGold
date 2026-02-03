/**
 * Valida se um caminho é seguro para redirecionamento.
 * Previne vulnerabilidades de Open Redirect.
 *
 * @param path O caminho a ser validado
 * @returns true se o caminho for seguro (relativo e sem caracteres perigosos)
 */
export function isSafeRedirectPath(path: string): boolean {
  if (typeof path !== 'string') return false;

  // Deve começar com /
  if (!path.startsWith('/')) return false;

  // Não pode começar com // (protocol-relative URL)
  if (path.startsWith('//')) return false;

  // Não pode conter backslashes (frequentemente tratados como slashes)
  if (path.includes('\\')) return false;

  // Previne caracteres de controle
  if (/[\x00-\x1F\x7F]/.test(path)) return false;

  return true;
}
