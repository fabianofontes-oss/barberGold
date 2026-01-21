import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Adiciona headers de segurança à resposta
 * 🛡️ Sentinel Security Enhancement
 */
function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // HSTS apenas em produção para evitar problemas em localhost
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  return response
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // Detectar subdomínio
  const subdomain = hostname.split('.')[0]
  
  // Lista de domínios principais (não são tenants)
  const mainDomains = ['barber', 'www', 'localhost']
  const isMainDomain = mainDomains.includes(subdomain) || hostname === 'barber.gold' || hostname === 'www.barber.gold' || hostname.startsWith('localhost')
  
  // Se não é o domínio principal, é um tenant (barbearia)
  if (!isMainDomain && subdomain && !pathname.startsWith('/api')) {
    const response = NextResponse.next()
    response.headers.set('x-tenant-slug', subdomain)
    
    if (pathname === '/') {
      return addSecurityHeaders(NextResponse.rewrite(new URL(`/book?tenant=${subdomain}`, request.url)))
    }
    
    return addSecurityHeaders(response)
  }

  // Criar cliente Supabase para verificar autenticação
  let supabaseResponse = NextResponse.next({ request })
  supabaseResponse.headers.set('x-pathname', pathname)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return addSecurityHeaders(supabaseResponse)
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Ignorar assets estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/favicon.ico') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return addSecurityHeaders(supabaseResponse)
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Se não está logado e tenta acessar rota protegida -> Login
  if (!user && pathname.startsWith('/app')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return addSecurityHeaders(NextResponse.redirect(url))
  }

  // Se está logado e tenta acessar login/register -> Dashboard
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/app/dashboard'
    const response = NextResponse.redirect(url)
    request.cookies.getAll().forEach((cookie) => response.cookies.set(cookie.name, cookie.value))
    return addSecurityHeaders(response)
  }

  return addSecurityHeaders(supabaseResponse)
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
