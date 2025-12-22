import { headers } from 'next/headers'

/**
 * Extrai o subdomain do hostname
 * Exemplos:
 * - joao.barber.gold → joao
 * - www.barber.gold → www
 * - barber.gold → null
 * - localhost → null
 */
export async function getSubdomain(): Promise<string | null> {
  const headersList = await headers()
  const hostname = headersList.get('host') || ''
  
  // Desenvolvimento local
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Você pode forçar um tenant para teste local
    // return 'teste' // ← Descomente para testar local
    return null
  }
  
  // Produção: barber.gold
  const parts = hostname.split('.')
  
  // Se tem menos de 3 partes, não é subdomain
  // barber.gold = 2 partes = sem subdomain
  // joao.barber.gold = 3 partes = tem subdomain
  if (parts.length < 3) {
    return null
  }
  
  const subdomain = parts[0]
  
  // Ignorar www
  if (subdomain === 'www') {
    return null
  }
  
  return subdomain.toLowerCase()
}

/**
 * Verifica se está acessando via subdomain
 */
export async function isSubdomainAccess(): Promise<boolean> {
  const subdomain = await getSubdomain()
  return subdomain !== null
}

/**
 * Pega hostname completo
 */
export async function getHostname(): Promise<string> {
  const headersList = await headers()
  return headersList.get('host') || 'localhost'
}

