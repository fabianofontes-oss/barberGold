/**
 * Lista de slugs reservados que nÃ£o podem ser usados como nomes de barbearia
 * Protege rotas do sistema e nomes genÃ©ricos
 */
export const RESERVED_SLUGS = [
  // Rotas do sistema
  'app',
  'api',
  'auth',
  'login',
  'register',
  'signup',
  'signin',
  'logout',
  'dashboard',
  'admin',
  'super-admin',
  'superadmin',
  'book',
  'booking',
  'reset-password',
  'forgot-password',
  'unauthorized',
  
  // DomÃ­nios principais
  'barber',
  'www',
  'mail',
  'email',
  'smtp',
  'ftp',
  'cdn',
  'static',
  'assets',
  'images',
  'img',
  
  // Nomes genÃ©ricos/confusos
  'test',
  'demo',
  'example',
  'sample',
  'default',
  'null',
  'undefined',
  'admin',
  'root',
  'system',
  'config',
  'settings',
  
  // Palavras ofensivas/inapropriadas (adicione conforme necessÃ¡rio)
  'spam',
  'abuse',
  'fake',
  'scam',
  
  // Rotas futuras
  'blog',
  'help',
  'support',
  'docs',
  'documentation',
  'about',
  'contact',
  'terms',
  'privacy',
  'pricing',
  'plans',
];

/**
 * Verifica se um slug Ã© reservado/proibido
 */
export function isSlugReserved(slug: string): boolean {
  const normalized = slug.toLowerCase().trim();
  return RESERVED_SLUGS.includes(normalized);
}

/**
 * Valida um slug personalizado
 * Retorna { valid: boolean, error?: string }
 */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  const trimmed = slug.trim();
  
  // Vazio Ã© permitido (gera automaticamente)
  if (!trimmed) {
    return { valid: true };
  }
  
  // MÃ­nimo 3 caracteres
  if (trimmed.length < 3) {
    return { valid: false, error: 'O nome deve ter pelo menos 3 caracteres' };
  }
  
  // MÃ¡ximo 30 caracteres
  if (trimmed.length > 30) {
    return { valid: false, error: 'O nome deve ter no mÃ¡ximo 30 caracteres' };
  }
  
  // Apenas letras, nÃºmeros e hÃ­fens
  if (!/^[a-z0-9-]+$/i.test(trimmed)) {
    return { valid: false, error: 'Use apenas letras, nÃºmeros e hÃ­fens' };
  }
  
  // NÃ£o pode comeÃ§ar ou terminar com hÃ­fen
  if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
    return { valid: false, error: 'NÃ£o pode comeÃ§ar ou terminar com hÃ­fen' };
  }
  
  // NÃ£o pode ter hÃ­fens consecutivos
  if (trimmed.includes('--')) {
    return { valid: false, error: 'NÃ£o pode ter hÃ­fens consecutivos' };
  }
  
  // Verifica se Ã© reservado
  if (isSlugReserved(trimmed)) {
    return { valid: false, error: 'Este nome estÃ¡ reservado. Escolha outro' };
  }
  
  return { valid: true };
}
