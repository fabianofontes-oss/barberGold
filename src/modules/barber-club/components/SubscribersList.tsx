'use client';

import React from 'react';
import { Users, CreditCard, XCircle, CheckCircle } from 'lucide-react';
import { useBarberClub } from '../hooks/useBarberClub';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const SubscribersList: React.FC = () => {
  const { subscriptions, plans, loading, cancelSubscription } = useBarberClub();

  const handleCancel = async (subId: string) => {
    if (confirm('Cancelar assinatura? O cliente perderá os créditos restantes.')) {
      await cancelSubscription(subId, 'Cancelado pelo admin');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Nenhum assinante ainda</h3>
        <p className="text-sm text-zinc-500">
          Quando clientes assinarem seus planos, eles aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Assinantes</h2>
        <span className="text-xs text-zinc-500">{subscriptions.length} total</span>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/50">
              <th className="text-left py-3 px-4 text-xs text-zinc-500 font-medium">Cliente</th>
              <th className="text-left py-3 px-4 text-xs text-zinc-500 font-medium">Plano</th>
              <th className="text-center py-3 px-4 text-xs text-zinc-500 font-medium">Créditos</th>
              <th className="text-center py-3 px-4 text-xs text-zinc-500 font-medium">Status</th>
              <th className="text-center py-3 px-4 text-xs text-zinc-500 font-medium">Próx. Renovação</th>
              <th className="text-right py-3 px-4 text-xs text-zinc-500 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => {
              const plan = plans.find((p) => p.id === sub.planId);
              return (
                <tr key={sub.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="py-3 px-4">
                    <p className="text-white font-medium">#{sub.clientId.slice(0, 8)}</p>
                    <p className="text-[10px] text-zinc-600">ID: {sub.id.slice(0, 8)}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white">{plan?.name ?? '—'}</span>
                    {plan && <span className="text-zinc-500 text-xs ml-1">R$ {plan.monthlyPriceBRL}/mês</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-lg">
                      <CreditCard className="w-3 h-3 text-amber-500" />
                      <span className="text-white font-bold">{sub.creditsRemaining}</span>
                      <span className="text-zinc-500 text-[10px]">/{plan?.monthlyCredits ?? '?'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                        sub.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : sub.status === 'CANCELLED'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {sub.status === 'ACTIVE' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-zinc-400 text-xs">
                    {sub.nextPaymentDate
                      ? format(sub.nextPaymentDate, "dd 'de' MMM", { locale: ptBR })
                      : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {sub.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleCancel(sub.id)}
                        className="text-red-500 hover:text-red-400 text-xs font-medium"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
