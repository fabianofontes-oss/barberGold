'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { LifeBuoy, AlertCircle, CheckCircle2, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export const SuperAdminSupport = () => {
   const { tickets, resolveTicket, impersonateTenant } = useBarber();
   const [filter, setFilter] = useState<'ALL' | 'OPEN'>('OPEN');

   const filteredTickets = tickets.filter(t => filter === 'ALL' || (filter === 'OPEN' && t.status !== 'RESOLVED'));

   const getPriorityColor = (p: string) => {
      switch(p) {
         case 'CRITICAL': return 'bg-red-500 text-white';
         case 'HIGH': return 'bg-orange-500 text-white';
         case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-500';
         default: return 'bg-zinc-800 text-zinc-400';
      }
   };

   return (
      <div className="min-h-screen bg-zinc-950 space-y-6 animate-fade-in pb-20">
         <div className="border-b border-zinc-800 pb-6 flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                  <LifeBuoy className="w-8 h-8 text-blue-500" /> Central de Suporte
               </h2>
               <p className="text-zinc-400 text-sm">Gerencie solicitações de ajuda e tickets críticos.</p>
            </div>
            
            <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
               <button onClick={() => setFilter('OPEN')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'OPEN' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Abertos</button>
               <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Todos</button>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-4">
            {filteredTickets.length === 0 ? (
               <div className="text-center py-20 text-zinc-600 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Tudo limpo! Nenhum ticket pendente.</p>
               </div>
            ) : (
               filteredTickets.map(ticket => (
                  <div key={ticket.id} className={`bg-zinc-900 border rounded-xl p-5 flex flex-col md:flex-row gap-6 hover:border-zinc-700 transition-all ${ticket.status === 'RESOLVED' ? 'border-zinc-800 opacity-60' : 'border-zinc-800 shadow-lg'}`}>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                           </span>
                           <h3 className="font-bold text-white text-lg">{ticket.subject}</h3>
                        </div>
                        <p className="text-sm text-zinc-400 mb-3 line-clamp-2">"{ticket.lastMessage}"</p>
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                           <span className="flex items-center gap-1 font-bold text-zinc-300">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span> {ticket.tenantName}
                           </span>
                           <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {format(ticket.createdAt, 'dd MMM, HH:mm')}
                           </span>
                        </div>
                     </div>

                     <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6">
                        {ticket.status !== 'RESOLVED' && (
                           <>
                              <button 
                                 onClick={() => impersonateTenant(ticket.tenantId)}
                                 className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-all"
                              >
                                 Acessar Loja
                              </button>
                              <button 
                                 onClick={() => resolveTicket(ticket.id)}
                                 className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 text-xs font-bold rounded-lg transition-all flex items-center gap-2"
                              >
                                 <CheckCircle2 className="w-4 h-4" /> Resolver
                              </button>
                           </>
                        )}
                        {ticket.status === 'RESOLVED' && (
                           <div className="text-emerald-500 flex items-center gap-2 font-bold text-sm px-4">
                              <CheckCircle2 className="w-5 h-5" /> Resolvido
                           </div>
                        )}
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
};
