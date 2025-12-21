import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

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

    const supabase = createServerClient<Database>(
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Rotas públicas que não precisam de auth
    const publicRoutes = [
      '/login',
      '/signup',
      '/landing',
      '/book',
      '/site',
      '/',
    ];

    // Se não tem usuário e não é rota pública, redirecionar
    const isPublicRoute = publicRoutes.some(route =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith('/api/')
    );

    if (!user && !isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Se está logado e tenta acessar login, redireciona para dashboard
    if (user && request.nextUrl.pathname === '/login') {
      const url = request.nextUrl.clone();
      url.pathname = '/app/dashboard';
      return NextResponse.redirect(url);
    }

    return supabaseResponse
  } catch (error) {
    console.error('Erro no middleware de sessão do Supabase:', error)
    return NextResponse.next({ request })
  }
}
