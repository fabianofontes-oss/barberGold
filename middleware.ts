import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // Detectar subdomínio
  const subdomain = hostname.split('.')[0]
  const isMainDomain = subdomain === 'barber' || subdomain === 'localhost:3000' || subdomain === 'barber-gold-alpha'
  
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
  const token = request.cookies.get('sb-yitrspfqpakpygfytduz-auth-token')
  
  if (!token && pathname.startsWith('/app')) {
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
