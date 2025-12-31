import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

/**
 * Route Handler para callback do Supabase Auth
 * 
 * Fluxo:
 * 1. OAuth (Google): Supabase redireciona para cÃ¡ com ?code=...
 * 2. Password Reset: Supabase redireciona para cÃ¡ com ?code=... e type=recovery
 * 3. Exchange code por sessÃ£o
 * 4. Redireciona para destino final
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next');

  // Se nÃ£o houver code, redireciona para login com erro
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', requestUrl.origin));
  }

  const supabase = await createClient();

  // Exchange code por sessÃ£o
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Erro ao trocar code por sessÃ£o:', error.message);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin));
  }

  // Se for recuperaÃ§Ã£o de senha, redireciona para pÃ¡gina de reset
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/reset-password', requestUrl.origin));
  }

  // Redirecionar para dashboard (modal de setup aparecerÃ¡ se necessÃ¡rio)
  const destination = next || '/app/dashboard';
  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
