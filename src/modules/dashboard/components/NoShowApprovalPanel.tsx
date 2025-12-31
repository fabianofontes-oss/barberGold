'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { AppointmentStatus } from '@/types';
import { format } from 'date-fns';
import { AlertTriangle, Check, X, User, Scissors, Clock, Bell } from 'lucide-react';

export const NoShowApprovalPanel: React.FC = () => {
  const { appointments, updateAppointmentStatus, staff, currentUser } = useBarber();

  if (!currentUser) return null;

  const isOwner = currentUser.role === 'OWNER';
  
  // SÃ³ mostra para o dono
  if (!isOwner) return null;

  // Filtrar agendamentos com status NO_SHOW_PENDING
  const pendingNoShows = appointments.filter(
    a => a.status === AppointmentStatus.NO_SHOW_PENDING
  );

  if (pendingNoShows.length === 0) return null;

  const getStaffName = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember?.name || 'Desconhecido';
  };

  return (
    <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
          <Bell className="w-5 h-5 text-orange-400 animate-pulse" />
        </div>
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            No-Shows Pendentes de AprovaÃ§Ã£o
          </h3>
          <p className="text-orange-300/70 text-xs">
            {pendingNoShows.length} {pendingNoShows.length === 1 ? 'cliente marcado' : 'clientes marcados'} como faltou. Confirme para validar.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {pendingNoShows.map(appt => (
          <div 
            key={appt.id} 
            className="bg-zinc-900/50 border border-orange-500/20 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-zinc-400" />
                <span className="text-white font-bold">{appt.clientName}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Scissors className="w-3 h-3" /> {appt.serviceName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {format(appt.date, 'dd/MM HH:mm')}
                </span>
                <span className="text-orange-400 font-bold">
                  Marcado por: {getStaffName(appt.staffId)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.NO_SHOW)}
                className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-400 text-white text-xs font-bold rounded-lg transition-all"
              >
                <Check className="w-3 h-3" /> Confirmar No-Show
              </button>
              <button
                onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.SCHEDULED)}
                className="flex items-center gap-1 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-bold rounded-lg transition-all"
              >
                <X className="w-3 h-3" /> Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-zinc-500 mt-3 text-center">
        âš ï¸ Ao confirmar, o cliente serÃ¡ marcado como No-Show e poderÃ¡ afetar seu histÃ³rico.
      </p>
    </div>
  );
};
