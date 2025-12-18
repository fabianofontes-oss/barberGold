'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type AuthActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Login com email e senha via Supabase Auth
 */
export async function signInWithPasswordAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Erro no login:', error.message);
    return {
      success: false,
      error: getErrorMessage(error.message),
    };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Logout e redireciona para landing
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

/**
 * Obtém a sessão atual do usuário (server-side)
 */
export async function getSessionAction() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
  };
}

/**
 * Cadastro de novo usuário (opcional para P0)
 */
export async function signUpAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    console.error('Erro no cadastro:', error.message);
    return {
      success: false,
      error: getErrorMessage(error.message),
    };
  }

  return { success: true };
}

/**
 * Traduz mensagens de erro do Supabase para PT-BR
 */
function getErrorMessage(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
    'User already registered': 'Este email já está cadastrado',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
  };

  return errorMap[message] || message;
}
