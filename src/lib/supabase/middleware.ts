import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run getUser() on public static assets
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/favicon.ico') ||
    request.nextUrl.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Se acessar a Home "/" e tiver sessão -> Redireciona para Dashboard
  if (user && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/app/dashboard'
    const response = NextResponse.redirect(url)
    // IMPORTANT: Sync cookies to the redirect response
    request.cookies.getAll().forEach((cookie) => response.cookies.set(cookie.name, cookie.value))
    return response
  }

  // 2. Se acessar rotas protegidas "/app/*" e NÃO tiver sessão -> Redireciona para Login
  if (!user && request.nextUrl.pathname.startsWith('/app')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 3. Se acessar Login/Register e JÁ tiver sessão -> Redireciona para Dashboard
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/app/dashboard'
    const response = NextResponse.redirect(url)
    // IMPORTANT: Sync cookies to the redirect response
    request.cookies.getAll().forEach((cookie) => response.cookies.set(cookie.name, cookie.value))
    return response
  }

  return supabaseResponse
}
