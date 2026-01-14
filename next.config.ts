import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Configuração de imagens para otimização
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    let supabaseHostname = '*.supabase.co';
    let supabaseWss = 'wss://*.supabase.co';
    let supabaseOrigin = 'https://*.supabase.co';

    try {
       if (supabaseUrl) {
          const url = new URL(supabaseUrl);
          supabaseHostname = url.hostname;
          supabaseOrigin = url.origin; // Includes protocol and port if specified
          supabaseWss = supabaseUrl.replace('http', 'ws').replace('https', 'wss');
       }
    } catch (e) {
       console.warn('Invalid NEXT_PUBLIC_SUPABASE_URL in CSP generation:', e);
    }

    const isDev = process.env.NODE_ENV !== 'production';

    // Construct CSP header
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://images.unsplash.com ${supabaseOrigin} https://*.supabase.co;
      connect-src 'self' ${supabaseOrigin} https://*.supabase.co ${supabaseWss} wss://*.supabase.co https://api.stripe.com${isDev ? ' ws://localhost:* http://localhost:*' : ''};
      font-src 'self' data:;
      frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
      block-all-mixed-content;
      ${isDev ? '' : 'upgrade-insecure-requests;'}
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          }
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
