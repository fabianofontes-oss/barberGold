'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { AlertTriangle, Lock, LogOut, ShieldAlert } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const { currentTenantStatus, shopProfile, isImpersonating, exitImpersonation } = useBarber();

  // 1. Se não houver tenant selecionado ou estiver em modo standalone: libera
  if (!currentTenantStatus) {
    return <>{children}</>;
  }

  // 2. Se estiver ativo ou em trial: libera
  if (currentTenantStatus === 'ACTIVE' || currentTenantStatus === 'TRIAL') {
    return <>{children}</>;
  }

  // 3. Se chegou aqui: OVERDUE ou SUSPENDED → bloquear
  const isSuspended = currentTenantStatus === 'SUSPENDED';
  const title = isSuspended ? 'Conta Suspensa' : 'Pagamento Pendente';
  const description = isSuspended
    ? 'O acesso a este ambiente foi suspenso devido a pendências críticas ou violação de termos de uso.'
    : 'Identificamos uma pendência no pagamento da sua assinatura. Regularize para retomar o acesso total ao sistema.';
  
  const themeColor = isSuspended ? 'red' : 'amber';
  const borderColor = isSuspended ? 'border-red-900' : 'border-amber-900';
  const bgGradient = isSuspended ? 'from-red-950 to-zinc-950' : 'from-amber-950 to-zinc-950';
  const iconColor = isSuspended ? 'text-red-500' : 'text-amber-500';

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* GOD MODE EXIT BANNER (Emergency Exit) */}
      {isImpersonating && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white p-2 px-4 shadow-lg z-50 flex flex-col md:flex-row items-center justify-between gap-2 animate-fade-in-down">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
             <ShieldAlert className="w-4 h-4" />
             <span>Visualizando como: {shopProfile.name} ({currentTenantStatus})</span>
          </div>
          <button
            onClick={exitImpersonation}
            className="px-3 py-1.5 rounded bg-white text-red-600 text-[10px] font-bold hover:bg-zinc-100 transition-colors flex items-center gap-2 shadow-sm"
          >
            <LogOut className="w-3 h-3" /> Sair do God Mode
          </button>
        </div>
      )}

      {/* BLOCK SCREEN CARD */}
      <div className={`max-w-md w-full bg-gradient-to-b ${bgGradient} border ${borderColor} p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden animate-fade-in`}>
        {/* Decorative Texture */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-black/40 border-4 border-white/5 shadow-inner`}>
            {isSuspended ? (
               <Lock className={`w-10 h-10 ${iconColor}`} />
            ) : (
               <AlertTriangle className={`w-10 h-10 ${iconColor}`} />
            )}
          </div>

          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">{title}</h1>
          <p className="text-zinc-300 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
            {description}
          </p>

          <div className="space-y-3 w-full">
            <button className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${isSuspended ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-600 hover:bg-amber-500'}`}>
              {isSuspended ? 'Contestar Suspensão' : 'Regularizar Agora'}
            </button>
            <button className="w-full py-3.5 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
              Falar com Suporte
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center opacity-40">
         <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Store ID</p>
         <p className="text-xs font-mono text-zinc-600">{shopProfile.slug || 'UNKNOWN'}</p>
      </div>
    </div>
  );
};
