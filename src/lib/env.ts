import { z } from 'zod';

/**
 * Schema de validação das variáveis de ambiente
 * Falha rápido se alguma variável obrigatória estiver faltando
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida')
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL é obrigatória'),
  
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatória'),
  
  NEXT_PUBLIC_APP_MODE: z
    .enum(['demo', 'pilot', 'prod', 'DEMO', 'PILOT', 'PROD'])
    .default('demo')
    .transform((val) => val.toLowerCase() as 'demo' | 'pilot' | 'prod'),
});

export type AppMode = 'demo' | 'pilot' | 'prod';

/**
 * Variáveis de ambiente validadas
 * Acessar via env.NEXT_PUBLIC_SUPABASE_URL etc.
 */
function getEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_MODE: process.env.NEXT_PUBLIC_APP_MODE,
  });

  if (!parsed.success) {
    console.error('❌ Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors);
    
    // Em desenvolvimento, mostra erro detalhado
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        `Variáveis de ambiente inválidas:\n${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}`
      );
    }
    
    // Em produção, falha silenciosamente mas loga
    return {
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
      NEXT_PUBLIC_APP_MODE: 'demo' as const,
    };
  }

  return parsed.data;
}

export const env = getEnv();

/**
 * Helpers para verificar modo do app
 */
export function getAppMode(): AppMode {
  return env.NEXT_PUBLIC_APP_MODE;
}

export function isDemoMode(): boolean {
  return env.NEXT_PUBLIC_APP_MODE === 'demo';
}

export function isPilotMode(): boolean {
  return env.NEXT_PUBLIC_APP_MODE === 'pilot';
}

export function isProdMode(): boolean {
  return env.NEXT_PUBLIC_APP_MODE === 'prod';
}

/**
 * Verifica se deve usar Supabase (pilot ou prod)
 */
export function shouldUseSupabase(): boolean {
  return env.NEXT_PUBLIC_APP_MODE !== 'demo';
}
