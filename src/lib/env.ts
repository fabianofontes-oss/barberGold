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

  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .optional(), // Opcional - só necessária para webhooks e operações de admin

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
 * Cache para lazy loading das variáveis de ambiente
 */
let _env: z.infer<typeof envSchema> | null = null;

/**
 * Variáveis de ambiente validadas (lazy loading)
 * Não valida durante o build, apenas quando acessado em runtime
 */
function getEnv(): z.infer<typeof envSchema> {
  if (_env) return _env;

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
    
    console.error('❌ ERRO CRÍTICO: Variáveis de ambiente inválidas');
    console.error('Detalhes:', errorDetails);
    console.error('NODE_ENV:', process.env.NODE_ENV);
    console.error('\n🔧 SOLUÇÃO:');
    console.error('1. Acesse Vercel Dashboard > Settings > Environment Variables');
    console.error('2. Configure: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('3. Redeploy a aplicação\n');

    throw new Error(
      `❌ Variáveis de ambiente obrigatórias faltando!\n\n` +
      `Detalhes: ${errorDetails}\n\n` +
      `Configure no Vercel Dashboard > Settings > Environment Variables:\n` +
      `- NEXT_PUBLIC_SUPABASE_URL\n` +
      `- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n` +
      `Após configurar, faça redeploy.`
    );
  }

  _env = parsed.data;
  return _env;
}

/**
 * Proxy para acessar variáveis de ambiente com lazy loading
 * Não valida durante o build/import, apenas quando uma propriedade é acessada
 */
export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(_, prop: string) {
    return getEnv()[prop as keyof z.infer<typeof envSchema>];
  },
});

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
