'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { UserX, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export const InactiveClients: React.FC = () => {
  const { clients, currentUser } = useBarber();

  if (!currentUser) return null;

  const isOwner = currentUser.role === 'OWNER';

  // Filtrar clientes que não voltam há 30+ dias
  const inactiveClients = clients
    .filter(client => {
      if (!client.lastVisit) return false;
      const daysSince = differenceInDays(new Date(), client.lastVisit);
      return daysSince >= 30;
    })
    .map(client => ({
      ...client,
      daysSinceVisit: differenceInDays(new Date(), client.lastVisit!)
    }))
    .sort((a, b) => b.daysSinceVisit - a.daysSinceVisit)
    .slice(0, 5);

  if (inactiveClients.length === 0) return null;

  const sendWinbackMessage = (client: typeof inactiveClients[0]) => {
    if (client.phone) {
      const phone = client.phone.replace(/\D/g, '');
      const message = `Olá ${client.name}! 👋\n\nSentimos sua falta na barbearia! Que tal marcar um horário? Temos novidades esperando por você! 💈\n\nAgende já!`;
      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <div className="bg-zinc-900 border border-orange-500/20 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserX className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-bold text-white">Clientes Sumidos</h3>
        <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
          {inactiveClients.length}
        </span>
      </div>

      <div className="space-y-3">
        {inactiveClients.map(client => (
          <div 
            key={client.id} 
            className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                {client.photo ? (
                  <img src={client.photo} alt={client.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-orange-400 font-bold">{client.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{client.name}</p>
                <div className="flex items-center gap-1 text-xs text-orange-400">
                  <Clock className="w-3 h-3" />
                  <span>{client.daysSinceVisit} dias sem vir</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => sendWinbackMessage(client)}
              className="flex items-center gap-1 px-2 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold rounded-lg transition-all"
            >
              <MessageSquare className="w-3 h-3" /> Chamar
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-500">
        <AlertCircle className="w-3 h-3" />
        <span>Recupere esses clientes com uma mensagem!</span>
      </div>
    </div>
  );
};
