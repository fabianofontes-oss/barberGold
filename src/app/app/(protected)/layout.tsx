import { AuthGuard } from '@/components/AuthGuard';

export default async function ProtectedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <AuthGuard requireProfile={true}>
      {children}
    </AuthGuard>
  );
}
