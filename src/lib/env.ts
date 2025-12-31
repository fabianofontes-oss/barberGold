import { z } from 'zod';

/**
 * Schema de validaÃ§Ã£o das variÃ¡veis de ambiente
 * Falha rÃ¡pido se alguma variÃ¡vel obrigatÃ³ria estiver faltando
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL deve ser uma URL vÃ¡lida')
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL Ã© obrigatÃ³ria'),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY Ã© obrigatÃ³ria'),

  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .optional(), // Opcional - sÃ³ necessÃ¡ria para webhooks e operaÃ§Ãµes de admin

  NEXT_PUBLIC_APP_MODE: z
    .enum(['demo', 'pilot', 'prod', 'DEMO', 'PILOT', 'PROD'])
    .default('demo')
    .transform((val) => val.toLowerCase() as 'demo' | 'pilot' | 'prod'),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export type AppMode = 'demo' | 'pilot' | 'prod';

/**
 * VariÃ¡veis de ambiente validadas
 * Acessar via env.NEXT_PUBLIC_SUPABASE_URL etc.
 */
function getEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_APP_MODE: process.env.NEXT_PUBLIC_APP_MODE,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!parsed.success) {
    const errorDetails = JSON.stringify(parsed.error.flatten().fieldErrors, null, 2);
    
    console.error('âŒ ERRO CRÃTICO: VariÃ¡veis de ambiente invÃ¡lidas');
    console.error('Detalhes:', errorDetails);
    console.error('NODE_ENV:', process.env.NODE_ENV);
    console.error('\nðŸ”§ SOLUÃ‡ÃƒO:');
    console.error('1. Acesse Vercel Dashboard > Settings > Environment Variables');
    console.error('2. Configure: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('3. Redeploy a aplicaÃ§Ã£o\n');

    // SEMPRE falha, tanto em dev quanto em prod
    throw new Error(
      `âŒ VariÃ¡veis de ambiente obrigatÃ³rias faltando!\n\n` +
      `Detalhes: ${errorDetails}\n\n` +
      `Configure no Vercel Dashboard > Settings > Environment Variables:\n` +
      `- NEXT_PUBLIC_SUPABASE_URL\n` +
      `- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n` +
      `ApÃ³s configurar, faÃ§a redeploy.`
    );
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
