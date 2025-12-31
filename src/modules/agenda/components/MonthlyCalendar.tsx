'use client';

import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, AppointmentStatus } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthlyCalendarProps {
  currentMonth: Date;
  appointments: Appointment[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  currentMonth,
  appointments,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(a => 
      isSameDay(a.date, date) && 
      a.status !== AppointmentStatus.CANCELLED &&
      a.status !== AppointmentStatus.BLOCKED
    );
  };

  const getDayStatus = (dayAppointments: Appointment[]) => {
    if (dayAppointments.length === 0) return 'empty';
    const hasInProgress = dayAppointments.some(a => a.status === AppointmentStatus.IN_PROGRESS);
    const hasCheckedIn = dayAppointments.some(a => a.status === AppointmentStatus.CHECKED_IN);
    const allCompleted = dayAppointments.every(a => a.status === AppointmentStatus.COMPLETED);
    
    if (hasInProgress) return 'in-progress';
    if (hasCheckedIn) return 'waiting';
    if (allCompleted) return 'completed';
    return 'scheduled';
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onPrevMonth}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-white font-bold text-lg capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <button 
          onClick={onNextMonth}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'SÃ¡b'].map(dayName => (
          <div key={dayName} className="text-center text-[10px] text-zinc-500 font-bold uppercase py-1">
            {dayName}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayDate, idx) => {
          const dayAppointments = getAppointmentsForDay(dayDate);
          const status = getDayStatus(dayAppointments);
          const isCurrentMonth = isSameMonth(dayDate, currentMonth);
          const isSelected = isSameDay(dayDate, selectedDate);
          const isTodayDate = isToday(dayDate);

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(dayDate)}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center p-1 transition-all relative
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${isSelected ? 'bg-amber-500 text-zinc-900' : 'hover:bg-zinc-800'}
                ${isTodayDate && !isSelected ? 'ring-2 ring-amber-500/50' : ''}
              `}
            >
              <span className={`text-sm font-bold ${isSelected ? 'text-zinc-900' : isCurrentMonth ? 'text-white' : 'text-zinc-600'}`}>
                {format(dayDate, 'd')}
              </span>
              
              {/* Appointment indicators */}
              {dayAppointments.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayAppointments.length <= 3 ? (
                    dayAppointments.slice(0, 3).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full ${
                          status === 'in-progress' ? 'bg-amber-500' :
                          status === 'waiting' ? 'bg-blue-500' :
                          status === 'completed' ? 'bg-emerald-500' :
                          isSelected ? 'bg-zinc-900' : 'bg-zinc-500'
                        }`}
                      />
                    ))
                  ) : (
                    <span className={`text-[8px] font-bold ${isSelected ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {dayAppointments.length}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-[10px] text-zinc-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
          <span>Agendado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>Aguardando</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span>Atendendo</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>ConcluÃ­do</span>
        </div>
      </div>
    </div>
  );
};
