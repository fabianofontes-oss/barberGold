'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { Appointment, AppointmentStatus } from '@/types';
import { format, differenceInDays, differenceInHours } from 'date-fns';
import { 
  X, User, Scissors, Clock, Phone, MessageSquare, 
  Calendar, DollarSign, Star, Heart, AlertCircle,
  CheckCircle, Play, XCircle, Ban, History, Send, Bell
} from 'lucide-react';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  const { clients, updateAppointmentStatus, staff, shopProfile } = useBarber();

  if (!isOpen || !appointment) return null;

  const client = clients.find(c => c.id === appointment.clientId);
  const staffMember = staff.find(s => s.id === appointment.staffId);
  const isBlocked = appointment.status === AppointmentStatus.BLOCKED;

  const daysSinceLastVisit = client?.lastVisit 
    ? differenceInDays(new Date(), client.lastVisit) 
    : null;

  const hoursUntilAppointment = differenceInHours(appointment.date, new Date());

  const handleAction = (status: AppointmentStatus) => {
    updateAppointmentStatus(appointment.id, status);
    onClose();
  };

  // Mensagem de lembrete padrÃ£o
  const getReminderMessage = () => {
    const time = format(appointment.date, 'HH:mm');
    const date = format(appointment.date, 'dd/MM');
    return `OlÃ¡ ${client?.name}! ðŸ‘‹\n\nLembrando do seu horÃ¡rio na *${shopProfile.name}*:\n\nðŸ“… ${date} Ã s ${time}\nâœ‚ï¸ ${appointment.serviceName}\n\nTe esperamos! ðŸ’ˆ`;
  };

  const openWhatsApp = (message?: string) => {
    if (client?.phone) {
      const phone = client.phone.replace(/\D/g, '');
      const text = message || `OlÃ¡ ${client.name}!`;
      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const sendReminder = () => {
    openWhatsApp(getReminderMessage());
  };

  // Status-based colors
  const getStatusColor = () => {
    switch (appointment.status) {
      case AppointmentStatus.CHECKED_IN: return 'bg-blue-500';
      case AppointmentStatus.IN_PROGRESS: return 'bg-amber-500';
      case AppointmentStatus.COMPLETED: return 'bg-emerald-500';
      case AppointmentStatus.NO_SHOW_PENDING: return 'bg-orange-500';
      case AppointmentStatus.NO_SHOW: return 'bg-red-500';
      case AppointmentStatus.CANCELLED: return 'bg-zinc-500';
      default: return 'bg-zinc-700';
    }
  };

  const getStatusLabel = () => {
    switch (appointment.status) {
      case AppointmentStatus.SCHEDULED: return 'Agendado';
      case AppointmentStatus.CHECKED_IN: return 'Aguardando';
      case AppointmentStatus.IN_PROGRESS: return 'Atendendo';
      case AppointmentStatus.COMPLETED: return 'ConcluÃ­do';
      case AppointmentStatus.NO_SHOW_PENDING: return 'Faltou?';
      case AppointmentStatus.NO_SHOW: return 'No-Show';
      case AppointmentStatus.CANCELLED: return 'Cancelado';
      default: return 'Bloqueado';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-zinc-900 w-full max-w-lg md:rounded-2xl rounded-t-3xl border-t md:border border-zinc-800 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <span className="text-white font-bold">{getStatusLabel()}</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Time & Service */}
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {format(appointment.date, 'HH:mm')}
            </div>
            <div className="flex items-center justify-center gap-2 text-zinc-400">
              <Calendar className="w-4 h-4" />
              <span>{format(appointment.date, 'dd/MM/yyyy')}</span>
              {hoursUntilAppointment > 0 && hoursUntilAppointment < 24 && (
                <span className="text-amber-500 text-sm font-bold">
                  (em {hoursUntilAppointment}h)
                </span>
              )}
            </div>
            <div className="mt-3 inline-flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full">
              <Scissors className="w-4 h-4 text-amber-500" />
              <span className="text-white font-medium">{appointment.serviceName}</span>
              <span className="text-amber-500 font-bold">${appointment.price}</span>
            </div>
          </div>

          {/* Client Info */}
          {!isBlocked && client && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                  {client.photo ? (
                    <img src={client.photo} className="w-full h-full rounded-full object-cover" alt={client.name} />
                  ) : (
                    <User className="w-6 h-6 text-zinc-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{client.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Phone className="w-3 h-3" />
                    <span>{client.phone}</span>
                  </div>
                </div>
                {/* Loyalty */}
                <div className="text-center">
                  <div className="text-amber-500 font-bold text-lg">{client.loyaltyPoints || 0}</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Selos</div>
                </div>
              </div>

              {/* Last Visit */}
              {daysSinceLastVisit !== null && (
                <div className="flex items-center gap-2 text-xs text-zinc-500 border-t border-zinc-800 pt-3">
                  <History className="w-3 h-3" />
                  <span>Ãšltima visita: <b className="text-zinc-300">{daysSinceLastVisit} dias atrÃ¡s</b></span>
                </div>
              )}

              {/* Tags */}
              {client.tags && client.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-zinc-800 pt-3">
                  {client.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                        tag === 'VIP' ? 'bg-amber-500/20 text-amber-400' :
                        tag === 'PONTUAL' ? 'bg-emerald-500/20 text-emerald-400' :
                        tag === 'ATRASA' ? 'bg-orange-500/20 text-orange-400' :
                        tag === 'EXIGENTE' ? 'bg-red-500/20 text-red-400' :
                        'bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Preferences */}
              {client.preferences && (
                <div className="border-t border-zinc-800 pt-3 space-y-2">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1">
                    <Heart className="w-3 h-3" /> PreferÃªncias do Cliente
                  </h4>
                  
                  {client.preferences.preferredService && (
                    <div className="flex items-center gap-2 text-sm">
                      <Scissors className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-400">Favorito:</span>
                      <span className="text-white font-medium">{client.preferences.preferredService}</span>
                    </div>
                  )}

                  {client.preferences.preferredDay && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-400">Dia preferido:</span>
                      <span className="text-white font-medium">{client.preferences.preferredDay}</span>
                    </div>
                  )}

                  {client.preferences.preferredTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-400">HorÃ¡rio:</span>
                      <span className="text-white font-medium">{client.preferences.preferredTime}</span>
                    </div>
                  )}
                  
                  {(client.preferences.allergies || client.preferences.observations) && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-amber-300 text-sm">
                        {client.preferences.allergies && <><b>Alergias:</b> {client.preferences.allergies}<br/></>}
                        {client.preferences.observations && <><b>Obs:</b> {client.preferences.observations}</>}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {appointment.notes && (
                <div className="border-t border-zinc-800 pt-3">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase mb-1">ObservaÃ§Ãµes do Agendamento</h4>
                  <p className="text-sm text-zinc-300 bg-zinc-800/50 p-2 rounded">{appointment.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Staff Info */}
          {staffMember && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Atendido por:</span>
              <span className="text-white font-medium">{staffMember.name}</span>
            </div>
          )}

          {/* Communication Buttons */}
          {client?.phone && !isBlocked && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openWhatsApp()}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all"
              >
                <MessageSquare className="w-5 h-5" /> Conversar
              </button>
              <button
                onClick={sendReminder}
                className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
              >
                <Bell className="w-5 h-5" /> Lembrete
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {!isBlocked && (
            <div className="grid grid-cols-2 gap-3">
              {/* SCHEDULED */}
              {appointment.status === AppointmentStatus.SCHEDULED && (
                <>
                  <button
                    onClick={() => handleAction(AppointmentStatus.CHECKED_IN)}
                    className="flex items-center justify-center gap-2 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-lg"
                  >
                    <CheckCircle className="w-6 h-6" /> Chegou
                  </button>
                  <button
                    onClick={() => handleAction(AppointmentStatus.NO_SHOW_PENDING)}
                    className="flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl text-lg"
                  >
                    <Ban className="w-6 h-6" /> Faltou
                  </button>
                </>
              )}

              {/* CHECKED_IN */}
              {appointment.status === AppointmentStatus.CHECKED_IN && (
                <button
                  onClick={() => handleAction(AppointmentStatus.IN_PROGRESS)}
                  className="col-span-2 flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold rounded-xl text-lg"
                >
                  <Play className="w-6 h-6" /> Iniciar Atendimento
                </button>
              )}

              {/* IN_PROGRESS */}
              {appointment.status === AppointmentStatus.IN_PROGRESS && (
                <button
                  onClick={() => handleAction(AppointmentStatus.COMPLETED)}
                  className="col-span-2 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-lg"
                >
                  <CheckCircle className="w-6 h-6" /> Finalizar
                </button>
              )}

              {/* Cancel button for scheduled/checked-in */}
              {(appointment.status === AppointmentStatus.SCHEDULED || 
                appointment.status === AppointmentStatus.CHECKED_IN) && (
                <button
                  onClick={() => handleAction(AppointmentStatus.CANCELLED)}
                  className="col-span-2 flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold rounded-xl text-sm"
                >
                  <XCircle className="w-4 h-4" /> Cancelar Agendamento
                </button>
              )}
            </div>
          )}

          {/* Blocked Time - Unblock button */}
          {isBlocked && (
            <button
              onClick={() => handleAction(AppointmentStatus.CANCELLED)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl"
            >
              <X className="w-5 h-5" /> Desbloquear HorÃ¡rio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
