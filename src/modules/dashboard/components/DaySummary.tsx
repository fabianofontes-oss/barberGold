'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { AppointmentStatus } from '@/types';
import { 
  Play, Users, Clock, Coffee, CheckCircle, 
  Calendar, AlertCircle, TrendingUp
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';

export const DaySummary: React.FC = () => {
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

  const stats = [
    {
      label: 'Atendendo',
      value: isOwner ? inProgress.length : myInProgress.length,
      icon: Play,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      pulse: (isOwner ? inProgress.length : myInProgress.length) > 0
    },
    {
      label: 'Na Fila',
      value: isOwner ? waiting.length : myWaiting.length,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      pulse: false
    },
    {
      label: 'Agendados',
      value: scheduled.length,
      icon: Calendar,
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      pulse: false
    },
    {
      label: 'Concluídos',
      value: completed.length,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      pulse: false
    }
  ];

  // Cliente sendo atendido agora
  const currentlyServing = isOwner ? inProgress[0] : myInProgress[0];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-white">Resumo do Dia</h3>
        </div>
        <span className="text-xs text-zinc-500">{format(today, 'dd/MM/yyyy')}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className={`text-center p-3 rounded-xl bg-zinc-950 border border-zinc-800 ${stat.pulse ? 'ring-2 ring-amber-500/30' : ''}`}
            >
              <div className={`w-8 h-8 mx-auto rounded-full ${stat.color}/20 flex items-center justify-center mb-1`}>
                <Icon className={`w-4 h-4 ${stat.textColor} ${stat.pulse ? 'animate-pulse' : ''}`} />
              </div>
              <p className={`text-xl font-bold ${stat.textColor}`}>{stat.value}</p>
              <p className="text-[10px] text-zinc-500 uppercase">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Currently Serving */}
      {currentlyServing && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-400 font-bold uppercase">Atendendo Agora</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold">{currentlyServing.clientName}</p>
              <p className="text-xs text-zinc-400">{currentlyServing.serviceName}</p>
            </div>
            <div className="text-right">
              <p className="text-amber-400 font-bold">{format(currentlyServing.date, 'HH:mm')}</p>
              <p className="text-xs text-zinc-500">${currentlyServing.price}</p>
            </div>
          </div>
        </div>
      )}

      {/* Waiting List */}
      {waiting.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-zinc-500 uppercase font-bold">Na Fila de Espera</p>
          {(isOwner ? waiting : myWaiting).slice(0, 3).map((appt, idx) => (
            <div key={appt.id} className="flex items-center justify-between bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="text-sm text-white">{appt.clientName}</span>
              </div>
              <span className="text-xs text-zinc-500">{format(appt.date, 'HH:mm')}</span>
            </div>
          ))}
        </div>
      )}

      {/* No-Shows Alert */}
      {noShows.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-orange-400 bg-orange-500/10 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{noShows.length} no-show(s) hoje</span>
        </div>
      )}
    </div>
  );
};
