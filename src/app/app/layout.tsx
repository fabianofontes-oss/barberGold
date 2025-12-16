'use client';

import React from 'react';
import { Layout } from '@/components/Layout';
import { SubscriptionGuard } from '@/components/SubscriptionGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <SubscriptionGuard>{children}</SubscriptionGuard>
    </Layout>
  );
}
