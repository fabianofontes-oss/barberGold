'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { loginDemo } from './loginDemo';

export type AuthActionResult = {
  success: boolean;
  error?: string;
  demoMode?: boolean;
};

/**
 * Verifica se está em modo demo (sem Supabase configurado)
 */
function isInDemoMode(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return !supabaseUrl || !supabaseKey || supabaseUrl === 'your-supabase-url';
}

/**
 * Login com email e senha via Supabase Auth OU modo demo
 */
export async function signInWithPasswordAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  // Modo Demo: quando Supabase não está configurado
  if (isInDemoMode()) {
    console.log('🎭 Modo Demo ativado - Supabase não configurado');
    
    const demoUser = loginDemo(email, password);
    
    if (!demoUser) {
      return {
        success: false,
        error: 'Email ou senha incorretos (Demo)',
        demoMode: true,
      };
    }
    
    return {
      success: true,
      demoMode: true,
    };
  }

  // Modo Real: com Supabase
  try {
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
        demoMode: false,
      };
    }

    revalidatePath('/', 'layout');
    return { success: true, demoMode: false };
  } catch (error: any) {
    console.error('Erro fatal no login:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor. Verifique as configurações.',
      demoMode: false,
    };
  }
}

/**
 * Logout e redireciona para landing
 */
export async function signOutAction(): Promise<void> {
  // Modo Demo
  if (isInDemoMode()) {
    const { logoutDemo } = await import('./loginDemo');
    logoutDemo();
    revalidatePath('/', 'layout');
    redirect('/login');
    return;
  }

  // Modo Real
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
  } catch (error) {
    console.error('Erro no logout:', error);
    redirect('/login');
  }
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
