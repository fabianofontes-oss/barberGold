'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { Cake, Gift, MessageSquare } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

export const BirthdayClients: React.FC = () => {
  const { clients } = useBarber();

  // Filtrar clientes que fazem aniversÃ¡rio hoje
  const todayBirthdays = clients.filter(client => {
    if (!client.birthDate) return false;
    try {
      const birthDate = parseISO(client.birthDate);
      const today = new Date();
      return birthDate.getMonth() === today.getMonth() && 
             birthDate.getDate() === today.getDate();
    } catch {
      return false;
    }
  });

  if (todayBirthdays.length === 0) return null;

  const sendBirthdayMessage = (client: typeof clients[0]) => {
    if (client.phone) {
      const phone = client.phone.replace(/\D/g, '');
      const message = `ðŸŽ‚ Feliz AniversÃ¡rio, ${client.name}! ðŸŽ‰\n\nQue seu dia seja incrÃ­vel! Passe na barbearia para um corte especial! ðŸ’ˆ`;
      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-500/30 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Cake className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-bold text-white">Aniversariantes Hoje ðŸŽ‚</h3>
      </div>

      <div className="space-y-3">
        {todayBirthdays.map(client => (
          <div 
            key={client.id} 
            className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-pink-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                {client.photo ? (
                  <img src={client.photo} alt={client.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-pink-400 font-bold">{client.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="font-bold text-white">{client.name}</p>
                <p className="text-xs text-pink-300/70">{client.phone}</p>
              </div>
            </div>

            <button
              onClick={() => sendBirthdayMessage(client)}
              className="flex items-center gap-1 px-3 py-2 bg-pink-500 hover:bg-pink-400 text-white text-xs font-bold rounded-lg transition-all"
            >
              <MessageSquare className="w-3 h-3" /> Parabenizar
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-pink-300/50">
        <Gift className="w-3 h-3" />
        <span>OfereÃ§a um desconto especial!</span>
      </div>
    </div>
  );
};
