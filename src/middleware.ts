import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // Lista de locales suportados
  locales,
  
  // Locale padrão (Brasil)
  defaultLocale,
  
  // Sempre usar prefixo de locale na URL (ex: /pt-BR/dashboard)
  localePrefix: 'as-needed',
  
  // Detectar locale automaticamente do navegador
  localeDetection: true
});

export const config = {
  // Matcher para aplicar o middleware em todas as rotas exceto arquivos estáticos
  matcher: [
    // Incluir todas as rotas
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Incluir rotas de API se necessário
    // '/api/:path*'
  ]
};
