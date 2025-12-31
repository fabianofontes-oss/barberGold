'use client';

import React from 'react';
import { Layout } from '@/components/Layout';
import { SubscriptionGuard } from '@/components/SubscriptionGuard';

/**
 * Client Layout para /app/*
 * Renderiza o shell da aplicação (Sidebar + Layout) e o SubscriptionGuard
 */
export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <SubscriptionGuard>{children}</SubscriptionGuard>
    </Layout>
  );
}
