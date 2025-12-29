import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // Detectar subdomínio
  const subdomain = hostname.split('.')[0]
  
  // Lista de domínios principais (não são tenants)
  // barber.gold é o domínio principal da plataforma
  const mainDomains = ['barber', 'www']
  const isMainDomain = mainDomains.includes(subdomain) || hostname === 'barber.gold' || hostname === 'www.barber.gold'
  
  // Se não é o domínio principal, é um tenant (barbearia)
  if (!isMainDomain && subdomain && !pathname.startsWith('/api')) {
    // Adicionar o slug do tenant no header para usar no app
    const response = NextResponse.next()
    response.headers.set('x-tenant-slug', subdomain)
    
    // Redirecionar para a área do tenant se estiver na raiz
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/book?tenant=${subdomain}`, request.url))
    }
    
    return response
  }

  // Permitir acesso a rotas públicas
  const publicPaths = ['/login', '/register', '/forgot-password', '/', '/api', '/book', '/app/setup']
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Verificar autenticação para rotas protegidas
  // Otimização: Tenta verificar o cookie localmente para evitar chamada de rede desnecessária
  // Se não conseguir determinar o nome do cookie ou se o cookie existir, deixa o updateSession validar
  let hasSessionCookie = true
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  if (supabaseUrl) {
    try {
      const { hostname } = new URL(supabaseUrl)
      // O hostname é tipicamente <project-ref>.supabase.co
      const projectRef = hostname.split('.')[0]
      const cookieName = `sb-${projectRef}-auth-token`
      hasSessionCookie = request.cookies.has(cookieName)
    } catch {
      // Se falhar ao parsear a URL, assume que pode ter sessão para não bloquear indevidamente
    }
  }

  // Se conseguimos determinar o nome do cookie e ele NÃO existe, redireciona login imediatamente
  if (!hasSessionCookie && pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

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
