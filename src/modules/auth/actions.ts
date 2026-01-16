'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { loginSchema, registerSchema } from './schemas';

export type AuthActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Login with email and password via Supabase Auth
 */
export async function signInWithPasswordAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  // Input validation
  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return {
      success: false,
      error: getErrorMessage(error.message),
    };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Logout and redirect to landing
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

/**
 * Get current user session (server-side)
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
 * Register new user
 */
export async function signUpAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  // Input validation
  const result = registerSchema.safeParse({ email, password });
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    console.error('Registration error:', error.message);
    return {
      success: false,
      error: getErrorMessage(error.message),
    };
  }

  return { success: true };
}

/**
 * Translate Supabase error messages
 */
function getErrorMessage(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Email not confirmed. Check your inbox.',
    'User already registered': 'User already registered',
    'Password should be at least 6 characters': 'Password should be at least 6 characters',
    'Unable to validate email address: invalid format': 'Invalid email format',
  };

  return errorMap[message] || message;
}
