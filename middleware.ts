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
  // Otimização: Tenta identificar o cookie de auth antes de chamar o updateSession
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let token = null

  if (supabaseUrl) {
    // Extrair project ref da URL do Supabase (ex: https://<project-ref>.supabase.co)
    const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]
    if (projectRef) {
      const cookieName = `sb-${projectRef}-auth-token`
      token = request.cookies.get(cookieName)
    }
  }
  
  // Se conseguimos determinar o nome do cookie e ele não existe, redireciona
  // Se não conseguimos determinar (ex: localhost ou custom domain), deixa o updateSession lidar
  if (supabaseUrl && !token && pathname.startsWith('/app')) {
    // Só redireciona se tivermos certeza que deveria ter o cookie
    // Para isso, verificamos se o padrão de URL do Supabase foi reconhecido
    const isStandardSupabaseUrl = supabaseUrl.includes('.supabase.co')
    if (isStandardSupabaseUrl) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
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
