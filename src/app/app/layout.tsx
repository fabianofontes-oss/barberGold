import React from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AppLayoutClient } from './layout.client';
import { headers } from 'next/headers';

/**
 * Layout principal de /app/*
 * Server Component que aplica AuthGuard antes de renderizar o client layout
 * IMPORTANTE: /app/setup não requer profile completo
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Se for a página de setup, não exige profile completo
  const requireProfile = !pathname.includes('/app/setup');
  
  return (
    <AuthGuard requireProfile={requireProfile}>
      {requireProfile ? (
        <AppLayoutClient>{children}</AppLayoutClient>
      ) : (
        // Setup page sem o Layout principal (sem sidebar)
        <div className="min-h-screen bg-zinc-950">{children}</div>
      )}
    </AuthGuard>
  );
}
