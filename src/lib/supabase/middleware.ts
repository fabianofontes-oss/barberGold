import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    // Acessa env vars diretamente aqui pois env.ts pode não funcionar em middleware
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️ Supabase env vars não configuradas, pulando middleware')
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

    // IMPORTANTE: Evite escrever qualquer lógica entre createServerClient e
    // supabase.auth.getUser(). Um simples erro pode tornar muito difícil
    // debugar problemas com usuários sendo deslogados aleatoriamente.

    // --- LÓGICA DE PROTEÇÃO DE ROTAS (Updated) ---
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 1. Se acessar a Home "/" e tiver sessão -> Redireciona para Dashboard
    if (user && request.nextUrl.pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/app/dashboard'
      return NextResponse.redirect(url)
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
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error('Erro no middleware de sessão do Supabase:', error)
    return NextResponse.next({ request })
  }
}
