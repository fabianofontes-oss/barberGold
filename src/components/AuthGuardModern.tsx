'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getDemoUser } from '@/modules/auth/loginDemo';
import { Loader2 } from 'lucide-react';

interface AuthGuardModernProps {
  children: React.ReactNode;
}

/**
 * AuthGuard que suporta modo demo
 * Redireciona para /login se não estiver autenticado
 */
export function AuthGuardModern({ children }: AuthGuardModernProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  async function checkAuth() {
    setIsChecking(true);

    // Verifica se está em modo demo
    const demoUser = getDemoUser();
    
    if (demoUser) {
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    // TODO: Verificar sessão real do Supabase quando configurado
    // const { data: { session } } = await supabase.auth.getSession();
    // if (session) {
    //   setIsAuthenticated(true);
    //   setIsChecking(false);
    //   return;
    // }

    // Não autenticado - redireciona para login
    setIsAuthenticated(false);
    setIsChecking(false);
    router.push('/login');
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecionando...
  }

  return <>{children}</>;
}


