import React from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { AppLayoutClient } from './layout.client';

/**
 * Layout principal de /app/*
 * Server Component que aplica AuthGuard antes de renderizar o client layout
 * IMPORTANTE: /app/setup tem seu próprio layout e NÃO usa este
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireProfile={true}>
      <AppLayoutClient>{children}</AppLayoutClient>
    </AuthGuard>
  );
}
