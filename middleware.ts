import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Extrai subdomain do hostname (versão para middleware)
 */
function getSubdomainFromRequest(request: NextRequest): string | null {
  const hostname = request.headers.get('host') || ''
  
  // Desenvolvimento local
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return null
  }
  
  // Produção: barber.gold
  const parts = hostname.split('.')
  
  // Se tem menos de 3 partes, não é subdomain
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

export async function middleware(request: NextRequest) {
  // ✅ NOVO: Detectar subdomain
  const subdomain = getSubdomainFromRequest(request)
  
  if (subdomain) {
    // Se tiver subdomain, adicionar ao header para uso posterior
    // Não fazemos lookup do tenant aqui para não bloquear cada request
    // O lookup será feito nas páginas que precisarem
    const response = await updateSession(request)
    response.headers.set('x-tenant-slug', subdomain)
    return response
  }

  // Sessão normal sem subdomain
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Arquivos de imagem
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
