/**
 * Lista de subdomínios reservados/proibidos
 * Atualizada: 22/12/2025
 */

export const RESERVED_SUBDOMAINS = [
  // Sistema e infraestrutura
  'www', 'api', 'app', 'admin', 'dashboard', 'painel',
  'mail', 'email', 'smtp', 'pop', 'imap', 'webmail',
  'ftp', 'sftp', 'ssh', 'vpn', 'cdn', 'static', 'assets',
  'media', 'files', 'upload', 'download', 'storage',
  
  // Autenticação e segurança
  'login', 'signin', 'signup', 'register', 'cadastro',
  'auth', 'oauth', 'sso', 'security', 'secure',
  'password', 'senha', 'reset', 'recovery', 'recuperar',
  'verify', 'verificar', 'confirm', 'confirmar',
  
  // Ambiente e desenvolvimento
  'test', 'testing', 'dev', 'development', 'staging',
  'stage', 'prod', 'production', 'demo', 'sandbox',
  'localhost', 'local', 'internal', 'private', 'public',
  
  // Páginas institucionais
  'blog', 'news', 'noticias', 'sobre', 'about',
  'contato', 'contact', 'suporte', 'support', 'ajuda', 'help',
  'faq', 'docs', 'documentation', 'documentacao',
  
  // Comercial e legal
  'pricing', 'preco', 'precos', 'planos', 'plans',
  'comprar', 'buy', 'vendas', 'sales',
  'legal', 'terms', 'termos', 'privacy', 'privacidade',
  'cookies', 'politica', 'policy', 'gdpr', 'lgpd',
  
  // Status e monitoramento
  'status', 'health', 'ping', 'monitor', 'metrics',
  'analytics', 'stats', 'estatisticas',
  
  // Palavrões e termos ofensivos (pt-br)
  'merda', 'porra', 'caralho', 'cacete', 'puta', 'putaria',
  'fdp', 'cu', 'bosta', 'buceta', 'penis', 'vagina',
  'sexual', 'sexo', 'porn', 'porno', 'xxx',
  
  // Palavrões (inglês)
  'fuck', 'fucking', 'shit', 'ass', 'asshole', 'bitch',
  'dick', 'cock', 'pussy', 'cunt', 'bastard', 'damn',
  
  // Marcas conhecidas (para evitar confusão)
  'google', 'facebook', 'meta', 'instagram', 'twitter', 'x',
  'microsoft', 'apple', 'amazon', 'whatsapp', 'telegram',
  'tiktok', 'youtube', 'linkedin', 'spotify', 'netflix',
  
  // Termos genéricos que podem confundir
  'barber', 'barbershop', 'barbearia', 'barbeiro',
  'salao', 'salon', 'cabeleireiro', 'hair', 'haircut',
  'corte', 'cabelo', 'beleza', 'beauty', 'estetica',
  
  // Números puros (confusos)
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '00', '01', '10', '11', '99', '100', '123', '321',
  
  // Testes comuns
  'test1', 'test2', 'teste', 'teste1', 'teste2',
  'demo1', 'demo2', 'example', 'sample', 'temp',
  
  // Nomes muito curtos (< 3 caracteres são rejeitados)
  'aa', 'bb', 'cc', 'ab', 'ac', 'ad',
] as const

/**
 * Verifica se o subdomain está na lista de reservados
 */
export function isSubdomainReserved(subdomain: string): boolean {
  return RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase() as any)
}

/**
 * Valida formato e disponibilidade do subdomain
 */
export function validateSubdomain(subdomain: string): {
  valid: boolean
  error?: string
} {
  // Limpar e normalizar
  subdomain = subdomain.toLowerCase().trim()
  
  // Comprimento mínimo
  if (subdomain.length < 3) {
    return { 
      valid: false, 
      error: 'O nome deve ter no mínimo 3 caracteres' 
    }
  }
  
  // Comprimento máximo (DNS limit)
  if (subdomain.length > 63) {
    return { 
      valid: false, 
      error: 'O nome deve ter no máximo 63 caracteres' 
    }
  }
  
  // Formato: apenas letras minúsculas, números e hífen
  // Não pode começar ou terminar com hífen
  // Não pode começar com número
  const formatRegex = /^[a-z][a-z0-9-]{1,61}[a-z0-9]$/
  
  if (!formatRegex.test(subdomain)) {
    if (/^[0-9]/.test(subdomain)) {
      return { 
        valid: false, 
        error: 'O nome não pode começar com número' 
      }
    }
    
    if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
      return { 
        valid: false, 
        error: 'O nome não pode começar ou terminar com hífen (-)' 
      }
    }
    
    return { 
      valid: false, 
      error: 'Use apenas letras minúsculas, números e hífen (-)' 
    }
  }
  
  // Não pode ter hífens consecutivos
  if (subdomain.includes('--')) {
    return { 
      valid: false, 
      error: 'Não pode ter hífens consecutivos (--)' 
    }
  }
  
  // Verificar se é reservado
  if (isSubdomainReserved(subdomain)) {
    return { 
      valid: false, 
      error: 'Este nome não está disponível. Tente outro.' 
    }
  }
  
  return { valid: true }
}

/**
 * Gera sugestões de subdomains baseado em um nome
 */
export function suggestSubdomains(name: string): string[] {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
  
  const suggestions: string[] = []
  
  // Base
  if (base.length >= 3 && !isSubdomainReserved(base)) {
    suggestions.push(base)
  }
  
  // Com números
  for (let i = 1; i <= 3; i++) {
    const variant = `${base}${i}`
    if (variant.length >= 3 && variant.length <= 63 && !isSubdomainReserved(variant)) {
      suggestions.push(variant)
    }
  }
  
  // Com sufixos comuns
  const suffixes = ['barber', 'cuts', 'style', 'shop']
  for (const suffix of suffixes) {
    const variant = `${base}-${suffix}`
    if (variant.length >= 3 && variant.length <= 63 && !isSubdomainReserved(variant)) {
      suggestions.push(variant)
    }
  }
  
  return suggestions.slice(0, 5) // Máximo 5 sugestões
}


