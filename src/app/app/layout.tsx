'use client';

import React from 'react';
import { Layout } from '@/components/Layout';
import { SubscriptionGuard } from '@/components/SubscriptionGuard';
import { AuthGuardModern } from '@/components/AuthGuardModern';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuardModern>
      <Layout>
        <SubscriptionGuard>{children}</SubscriptionGuard>
      </Layout>
    </AuthGuardModern>
  );
}
