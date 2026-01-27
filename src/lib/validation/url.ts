/**
 * Valida se um caminho de redirecionamento é seguro (relativo e sem protocolo)
 * Previne vulnerabilidades de Open Redirect
 */
export function isSafeRedirectPath(path: string): boolean {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Normaliza espaços
  const trimmed = path.trim();

  // Deve começar com /
  if (!trimmed.startsWith('/')) {
    return false;
  }

  // NÃO deve começar com // (protocol relative URL)
  // Ex: //google.com é interpretado como http://google.com ou https://google.com
  if (trimmed.startsWith('//')) {
    return false;
  }

  // NÃO deve conter backslashes (alguns browsers normalizam para /, permitindo bypass)
  // Ex: /\google.com ou \google.com
  if (trimmed.includes('\\')) {
    return false;
  }

  // NÃO deve conter caracteres de controle (CR, LF, etc)
  if (/[\x00-\x1F\x7F]/.test(trimmed)) {
    return false;
  }

  // Verifica se o parser de URL padrão o considera relativo
  // Hack: tenta criar URL com base dummy. Se o path mudar o origin, não é relativo puro?
  // Na verdade, apenas checar startswith / e !// é o padrão ouro para 'path absolute' URLs.

  return true;
}
