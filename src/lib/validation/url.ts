export /**
 * Verifica se um caminho é seguro para redirecionamento.
 * Previne ataques de Open Redirect garantindo que o caminho:
 * 1. Começa com /
 * 2. Não começa com // (protocol-relative)
 * 3. Não contém caracteres de controle
 * 4. Não contém \ (backslashes)
 */
function isSafeRedirectPath(path: string | null | undefined): boolean {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Deve começar com /
  if (!path.startsWith('/')) {
    return false;
  }

  // Não pode começar com // (protocol-relative URL)
  if (path.startsWith('//')) {
    return false;
  }

  // Não pode conter backslashes (pode ser tratado como separador em alguns browsers)
  if (path.includes('\\')) {
    return false;
  }

  // Não pode conter caracteres de controle (CR, LF, etc.)
  // \x00-\x1F e \x7F
  if (/[\x00-\x1F\x7F]/.test(path)) {
    return false;
  }

  return true;
}
