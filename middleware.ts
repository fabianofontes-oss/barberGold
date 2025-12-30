import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

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
      return NextResponse.rewrite(new URL(`/book?tenant=${subdomain}`, request.url))
    }
    
    return response
  }

  // Criar cliente Supabase para verificar autenticação
  let supabaseResponse = NextResponse.next({ request })
  supabaseResponse.headers.set('x-pathname', pathname)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
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
    return supabaseResponse
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Rotas públicas (não requerem autenticação)
  const publicPaths = ['/login', '/register', '/forgot-password', '/', '/api', '/book']
  const _isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Se não está logado e tenta acessar rota protegida -> Login
  if (!user && pathname.startsWith('/app')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Se está logado e tenta acessar login/register -> Verificar se tem profile
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    // Verificar se usuário já tem profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    const url = request.nextUrl.clone()
    // Se tem profile -> Dashboard, senão -> Setup
    url.pathname = profile ? '/app/dashboard' : '/app/setup'
    const response = NextResponse.redirect(url)
    request.cookies.getAll().forEach((cookie) => response.cookies.set(cookie.name, cookie.value))
    return response
  }

  return supabaseResponse
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
