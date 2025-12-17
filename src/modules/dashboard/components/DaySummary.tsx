'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { AppointmentStatus } from '@/types';
import { 
  Play, Users, Clock, Coffee, CheckCircle, 
  Calendar, AlertCircle, TrendingUp, DollarSign, Wallet,
  UserCheck, Ban
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';

interface DaySummaryProps {
  todayRevenue?: number;
  activeClientsCount?: number;
}

export const DaySummary: React.FC<DaySummaryProps> = ({ todayRevenue = 0, activeClientsCount = 0 }) => {
  const { appointments, currentUser } = useBarber();

  const isOwner = currentUser.role === 'OWNER';

  // Filtrar agendamentos de hoje
  const today = new Date();
  const todayAppointments = appointments.filter(a => 
    isSameDay(a.date, today) && 
    a.status !== AppointmentStatus.BLOCKED &&
    a.status !== AppointmentStatus.CANCELLED
  );

  // Estatísticas
  const inProgress = todayAppointments.filter(a => a.status === AppointmentStatus.IN_PROGRESS);
  const waiting = todayAppointments.filter(a => a.status === AppointmentStatus.CHECKED_IN);
  const scheduled = todayAppointments.filter(a => a.status === AppointmentStatus.SCHEDULED);
  const completed = todayAppointments.filter(a => a.status === AppointmentStatus.COMPLETED);
  const noShows = todayAppointments.filter(a => 
    a.status === AppointmentStatus.NO_SHOW || 
    a.status === AppointmentStatus.NO_SHOW_PENDING
  );

  // Se for staff, filtrar apenas os seus
  const myInProgress = inProgress.filter(a => a.staffId === currentUser.id);
  const myWaiting = waiting.filter(a => a.staffId === currentUser.id);

  // 8 stats unificados (sem repetição) - com fundos coloridos
  const allStats = [
    { label: 'Receita', value: `$${todayRevenue.toFixed(0)}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Agenda', value: todayAppointments.length, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Clientes', value: activeClientsCount, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Ticket', value: '$42', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Atendendo', value: isOwner ? inProgress.length : myInProgress.length, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', pulse: inProgress.length > 0 },
    { label: 'Na Fila', value: isOwner ? waiting.length : myWaiting.length, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Concluídos', value: completed.length, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'No-Show', value: noShows.length, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ];

  // Cliente sendo atendido agora
  const currentlyServing = isOwner ? inProgress[0] : myInProgress[0];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-white">Resumo do Dia</h3>
        </div>
        <span className="text-xs text-zinc-500">{format(today, 'dd/MM/yyyy')}</span>
      </div>

      {/* Unified Stats Grid - 8 cols desktop, 4 cols mobile */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 mb-4">
        {allStats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`text-center py-4 px-2 rounded-xl border ${stat.bg} ${stat.pulse ? 'ring-1 ring-orange-500/50' : ''}`}
          >
            <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-wide mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Currently Serving */}
      {currentlyServing && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-amber-400 animate-pulse" />
              <div>
                <p className="text-white font-bold text-sm">{currentlyServing.clientName}</p>
                <p className="text-[10px] text-zinc-400">{currentlyServing.serviceName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-amber-400 font-bold">{format(currentlyServing.date, 'HH:mm')}</p>
              <p className="text-[10px] text-zinc-500">${currentlyServing.price}</p>
            </div>
          </div>
        </div>
      )}

      {/* Waiting List - Compact */}
      {waiting.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-zinc-500 uppercase font-bold">Fila:</span>
          {(isOwner ? waiting : myWaiting).slice(0, 4).map((appt, idx) => (
            <span key={appt.id} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
              {appt.clientName.split(' ')[0]}
            </span>
          ))}
          {waiting.length > 4 && <span className="text-xs text-zinc-500">+{waiting.length - 4}</span>}
        </div>
      )}
    </div>
  );
};
