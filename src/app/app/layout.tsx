import React from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AppLayoutClient } from './layout.client';

/**
 * Layout principal de /app/*
 * Server Component que aplica AuthGuard antes de renderizar o client layout
 * A configuração inicial (setup) agora é uma modal no dashboard
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppLayoutClient>{children}</AppLayoutClient>
    </AuthGuard>
  );
}
