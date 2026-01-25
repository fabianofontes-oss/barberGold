import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

/**
 * Route Handler para callback do Supabase Auth
 * 
 * Fluxo:
 * 1. OAuth (Google): Supabase redireciona para cá com ?code=...
 * 2. Password Reset: Supabase redireciona para cá com ?code=... e type=recovery
 * 3. Exchange code por sessão
 * 4. Redireciona para destino final
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next');

  // Se não houver code, redireciona para login com erro
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', requestUrl.origin));
  }

  const supabase = await createClient();

  // Exchange code por sessão
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Erro ao trocar code por sessão:', error.message);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin));
  }

  // Se for recuperação de senha, redireciona para página de reset
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/reset-password', requestUrl.origin));
  }

  // Redirecionar para dashboard (modal de setup aparecerá se necessário)
  // 🛡️ Security: Validate destination to prevent Open Redirects
  let destination = '/app/dashboard';

  // Accept only relative paths starting with / but not // or /\ (which could be protocol-relative)
  if (next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')) {
    destination = next;
  }

  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
