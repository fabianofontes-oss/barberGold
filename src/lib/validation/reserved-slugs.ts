/**
 * Lista de slugs reservados que não podem ser usados como nomes de barbearia
 * Protege rotas do sistema e nomes genéricos
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
  
  // Domínios principais
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
  
  // Nomes genéricos/confusos
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
  
  // Palavras ofensivas/inapropriadas (adicione conforme necessário)
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
 * Verifica se um slug é reservado/proibido
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
  
  // Vazio é permitido (gera automaticamente)
  if (!trimmed) {
    return { valid: true };
  }
  
  // Mínimo 3 caracteres
  if (trimmed.length < 3) {
    return { valid: false, error: 'O nome deve ter pelo menos 3 caracteres' };
  }
  
  // Máximo 30 caracteres
  if (trimmed.length > 30) {
    return { valid: false, error: 'O nome deve ter no máximo 30 caracteres' };
  }
  
  // Apenas letras, números e hífens
  if (!/^[a-z0-9-]+$/i.test(trimmed)) {
    return { valid: false, error: 'Use apenas letras, números e hífens' };
  }
  
  // Não pode começar ou terminar com hífen
  if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
    return { valid: false, error: 'Não pode começar ou terminar com hífen' };
  }
  
  // Não pode ter hífens consecutivos
  if (trimmed.includes('--')) {
    return { valid: false, error: 'Não pode ter hífens consecutivos' };
  }
  
  // Verifica se é reservado
  if (isSlugReserved(trimmed)) {
    return { valid: false, error: 'Este nome está reservado. Escolha outro' };
  }
  
  return { valid: true };
}
