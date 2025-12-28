'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { QueuePanel } from './components/QueuePanel';
import { AppointmentDetailModal } from './components/AppointmentDetailModal';
import { MonthlyCalendar } from './components/MonthlyCalendar';
import { 
  format, 
  addDays, 
  startOfToday,
  addMonths as addMonthsFn,
  subMonths, 
  isSameDay, 
  set,
  addMonths,
  getDay,
  addMinutes,
  areIntervalsOverlapping
} from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle,
  Plus,
  Scissors,
  Repeat,
  Smile,
  Coffee,
  AlertOctagon,
  Cigarette,
  Utensils,
  Lock,
  List,
  Share2,
  MoreVertical,
  CircleDollarSign,
  X,
  UserPlus,
  Save
} from 'lucide-react';
import { AppointmentStatus, RecurrenceType, Appointment } from '@/types';

export const Agenda = () => {
  const { appointments, services, clients, staff, addAppointment, updateAppointmentStatus, currentUser, shopProfile, addClient } = useBarber();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'SERVICE' | 'BLOCK'>('SERVICE');
  const [showQueue, setShowQueue] = useState(true); // Toggle for Queue Sidebar

  // Appointment Detail Modal State (Mobile)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // View Mode: WEEK (7 days) or MONTH (calendar)
  const [viewMode, setViewMode] = useState<'WEEK' | 'MONTH'>('WEEK');
  const [currentMonth, setCurrentMonth] = useState(startOfToday());

  const openAppointmentDetail = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setIsDetailModalOpen(true);
  };

  // Modal State
  const [newApptClientId, setNewApptClientId] = useState('');
  const [newApptStaffId, setNewApptStaffId] = useState('');
  const [newApptServiceId, setNewApptServiceId] = useState(services[0]?.id || '');
  const [newApptTime, setNewApptTime] = useState('09:00');
  const [blockReason, setBlockReason] = useState('Break / Lunch');
  const [conflictError, setConflictError] = useState('');
  
  // Quick Add Client State (Agenda)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  
  // Recurrence State
  const [recurrence, setRecurrence] = useState<RecurrenceType>(RecurrenceType.NONE);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(format(addMonths(new Date(), 1), 'yyyy-MM-dd'));

  if (!currentUser) return null;

  const isOwner = currentUser.role === 'OWNER';
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  // Determine who to show on the board
  const visibleStaff = isOwner ? staff : staff.filter(s => s.id === currentUser.id);

  // Filter staff based on selected Service AND Availability for the selected day (For Modal dropdown)
  const availableStaffForBooking = staff.filter(s => {
    // 1. If not owner, only show myself
    if (!isOwner && s.id !== currentUser.id) return false;

    // 2. Skill Check (If Booking Service)
    if (bookingType === 'SERVICE' && newApptServiceId) {
       if (s.allowedServices && !s.allowedServices.includes(newApptServiceId)) {
          return false; 
       }
    }
    
    // 3. Schedule Check (Is working this day?)
    const dayOfWeek = getDay(selectedDate); // 0 = Sun
    const schedule = s.workSchedule?.find(day => day.dayIndex === dayOfWeek);
    if (!schedule || !schedule.isActive) return false;

    return true;
  });

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError('');
    
    // Default to first staff if none selected (or auto-select current user if not owner)
    const staffId = !isOwner ? currentUser.id : (newApptStaffId || availableStaffForBooking[0]?.id);
    
    if (!staffId) return; // No staff available

    const [hours, minutes] = newApptTime.split(':').map(Number);
    const appointmentDate = set(selectedDate, { hours, minutes });

    // --- CONFLICT DETECTION ---
    // 1. Determine duration
    let duration = 30; // Default
    if (bookingType === 'SERVICE') {
       const srv = services.find(s => s.id === newApptServiceId);
       if (srv) duration = srv.durationMinutes;
    } else {
       // Blocks
       if (blockReason.includes('Smoke')) duration = 15;
       if (blockReason.includes('Coffee')) duration = 15;
       if (blockReason.includes('Lunch')) duration = 60;
    }

    const appointmentEndDate = addMinutes(appointmentDate, duration);

    // 2. Check overlap against existing appointments for THIS staff on THIS day
    const staffDailyAppointments = appointments.filter(a => isSameDay(a.date, selectedDate) && a.staffId === staffId);

    const hasConflict = staffDailyAppointments.some(existing => {
       if (existing.status === AppointmentStatus.CANCELLED) return false;

       // Get duration of existing appt
       let existingDuration = 30;
       if (existing.serviceId === 'BLOCK') {
          existingDuration = 30; 
       } else {
          const srv = services.find(s => s.id === existing.serviceId);
          if (srv) existingDuration = srv.durationMinutes;
       }

       const existingEndDate = addMinutes(existing.date, existingDuration);

       return areIntervalsOverlapping(
          { start: appointmentDate, end: appointmentEndDate },
          { start: existing.date, end: existingEndDate }
       );
    });

    if (hasConflict) {
       setConflictError('Conflict detected! This time slot overlaps with another appointment.');
       return;
    }

    // --- END CONFLICT DETECTION ---

    if (bookingType === 'BLOCK') {
      addAppointment({
         clientId: 'BLOCK',
         clientName: blockReason, // "Lunch", "Personal"
         staffId: staffId,
         serviceId: 'BLOCK',
         serviceName: 'Blocked Time',
         date: appointmentDate,
         price: 0,
         notes: 'Staff Blocked Time',
         status: AppointmentStatus.BLOCKED
      });
    } else {
      const service = services.find(s => s.id === newApptServiceId);
      const client = clients.find(c => c.id === newApptClientId);
      
      if (!service || !client) return;

      addAppointment({
        clientId: client.id,
        clientName: client.name,
        staffId: staffId,
        serviceId: service.id,
        serviceName: service.name,
        date: appointmentDate,
        price: service.price,
        notes: '',
        recurrence: recurrence,
        recurrenceEndDate: recurrence !== RecurrenceType.NONE ? new Date(recurrenceEndDate) : undefined
      });
    }

    setIsModalOpen(false);
    // Reset form
    setNewApptClientId('');
    setNewApptTime('09:00');
    setRecurrence(RecurrenceType.NONE);
    setBookingType('SERVICE');
    setConflictError('');
  };

  const handleQuickAddClient = (e: React.FormEvent) => {
     e.preventDefault();
     if (newClientName && newClientPhone) {
        const newId = addClient({
           name: newClientName,
           phone: newClientPhone,
           email: '',
           birthDate: ''
        });
        
        // Auto Select
        setNewApptClientId(newId);
        
        // Reset
        setNewClientName('');
        setNewClientPhone('');
        setIsClientModalOpen(false);
     }
  };

  const openModal = (type: 'SERVICE' | 'BLOCK', preSelectedStaffId?: string) => {
     setBookingType(type);
     setConflictError('');
     
     // Auto-select staff logic
     if (preSelectedStaffId) {
        setNewApptStaffId(preSelectedStaffId);
     } else if (!isOwner) {
        setNewApptStaffId(currentUser.id);
     } else if (availableStaffForBooking.find(s => s.id === currentUser.id)) {
        setNewApptStaffId(currentUser.id);
     }
     
     setIsModalOpen(true);
  }

  // Quick Preset Helper
  const setQuickBlock = (reason: string) => {
     setBlockReason(reason);
  };

  const copyBookingLink = () => {
     const link = `https://barberflow.app/book/${shopProfile.name.replace(/\s/g, '').toLowerCase()}`;
     navigator.clipboard.writeText(link);
     alert('Link copied! Send it to your client.');
  };

  // Get Smart Break Duration from user settings
  const breakDuration = currentUser.smartBreak?.durationMinutes || 15;

  return (
    <div className="h-full flex gap-0 overflow-hidden relative">
      {/* MAIN AGENDA AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 pr-0 md:pr-4">
         <div className="flex justify-between items-center mb-6 pl-1 md:pl-0">
            <div>
               <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Agenda</h2>
               <p className="text-zinc-400 text-xs md:text-sm hidden md:block">
                  {isOwner ? 'Gerencie a agenda da loja.' : 'Gerencie seus agendamentos.'}
               </p>
            </div>
            <div className="flex gap-2">
               {/* SHARE LINK SHORTCUT */}
               <button 
                  onClick={copyBookingLink}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold p-2.5 rounded-xl flex items-center justify-center transition-all border border-zinc-700"
                  title="Copy Online Booking Link"
               >
                  <Share2 className="w-5 h-5" />
               </button>

               <button 
                  onClick={() => setShowQueue(!showQueue)}
                  className={`md:hidden p-3 rounded-xl border transition-all ${showQueue ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
               >
                  <List className="w-5 h-5" />
               </button>
               <button 
                  onClick={() => openModal('BLOCK')}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all hidden md:flex"
               >
                  <Coffee className="w-5 h-5" /> Block
               </button>
               <button 
                  onClick={() => openModal('SERVICE')}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 px-4 md:px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
               >
                  <Plus className="w-5 h-5" /> <span className="hidden md:inline">New Appointment</span>
               </button>
            </div>
         </div>

         {/* View Mode Toggle */}
         <div className="flex items-center gap-2 mb-4 px-1 md:px-0">
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
               <button
                  onClick={() => setViewMode('WEEK')}
                  className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${viewMode === 'WEEK' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-400 hover:text-white'}`}
               >
                  Semana
               </button>
               <button
                  onClick={() => setViewMode('MONTH')}
                  className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${viewMode === 'MONTH' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-400 hover:text-white'}`}
               >
                  Mês
               </button>
            </div>
         </div>

         {/* Monthly Calendar View */}
         {viewMode === 'MONTH' && (
            <div className="mb-4">
               <MonthlyCalendar
                  currentMonth={currentMonth}
                  appointments={appointments}
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                     setSelectedDate(date);
                     setViewMode('WEEK'); // Auto-switch to week view after selecting
                  }}
                  onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  onNextMonth={() => setCurrentMonth(addMonthsFn(currentMonth, 1))}
               />
            </div>
         )}

         {/* Date Selector (Week View) */}
         {viewMode === 'WEEK' && (
         <div className="flex gap-4 overflow-x-auto pb-4 mb-4 scrollbar-hide px-1 md:px-0">
            {dates.map((date) => {
               const isSelected = isSameDay(date, selectedDate);
               return (
               <button
                  key={date.toString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-16 md:w-20 h-20 md:h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${
                     isSelected 
                     ? 'bg-zinc-100 text-zinc-950 shadow-lg scale-105' 
                     : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
               >
                  <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider mb-1">
                     {format(date, 'EEE')}
                  </span>
                  <span className={`text-xl md:text-2xl font-bold ${isSelected ? 'text-zinc-950' : 'text-white'}`}>
                     {format(date, 'd')}
                  </span>
               </button>
               );
            })}
         </div>
         )}

         {/* --- MULTI-COLUMN TIMELINE VIEW --- */}
         <div className="flex-1 overflow-hidden bg-zinc-900/30 rounded-2xl border border-zinc-800 md:mr-4 flex flex-col relative">
            
            {/* Scrollable Container with SNAP */}
            <div className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
               {visibleStaff.map(staffMember => (
                  <div key={staffMember.id} className="flex-none w-[85vw] md:w-auto md:flex-1 md:min-w-[280px] h-full flex flex-col border-r border-zinc-800 bg-zinc-900/20 snap-center">
                     
                     {/* Sticky Header Per Column */}
                     <div className="p-3 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-xs font-bold text-zinc-400">
                              {staffMember.avatar ? <img src={staffMember.avatar} className="w-full h-full rounded-full object-cover"/> : staffMember.name.charAt(0)}
                           </div>
                           <span className="font-bold text-white text-sm">{staffMember.name}</span>
                        </div>
                        <button onClick={() => openModal('SERVICE', staffMember.id)} className="text-zinc-500 hover:text-amber-500"><Plus className="w-4 h-4" /></button>
                     </div>

                     {/* Scrollable Appointments */}
                     <div className="flex-1 overflow-y-auto relative p-2">
                        {/* Background Lines */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
                           {Array.from({length: 12}).map((_, i) => (
                              <div key={i} className="h-[80px] border-b border-zinc-500 w-full" style={{ top: `${i * 80}px` }}>
                                 <span className="text-[10px] text-zinc-500 ml-1">{9 + i}:00</span>
                              </div>
                           ))}
                        </div>

                        {/* Appointments content */}
                        <div className="relative z-10 space-y-3 pt-2">
                           {appointments
                              .filter(a => a.staffId === staffMember.id && isSameDay(a.date, selectedDate))
                              .sort((a, b) => a.date.getTime() - b.date.getTime())
                              .map(appt => {
                                 const isBlocked = appt.status === AppointmentStatus.BLOCKED;
                                 const isCheckedIn = appt.status === AppointmentStatus.CHECKED_IN;
                                 const isInProgress = appt.status === AppointmentStatus.IN_PROGRESS;
                                 const isCompleted = appt.status === AppointmentStatus.COMPLETED;
                                 
                                 const isNoShowPending = appt.status === AppointmentStatus.NO_SHOW_PENDING;
                                 const isNoShow = appt.status === AppointmentStatus.NO_SHOW;

                                 // Status-based styling
                                 const getCardStyle = () => {
                                    if (isBlocked) return 'bg-zinc-950/80 border-dashed border-zinc-700';
                                    if (isCompleted) return 'bg-zinc-900/50 border-zinc-800 opacity-60';
                                    if (isNoShow) return 'bg-red-500/10 border-red-500/30 opacity-70';
                                    if (isNoShowPending) return 'bg-orange-500/10 border-orange-500/30 ring-2 ring-orange-500/20';
                                    if (isInProgress) return 'bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/30';
                                    if (isCheckedIn) return 'bg-blue-500/10 border-blue-500/50';
                                    return 'bg-zinc-800 border-zinc-700 hover:border-amber-500';
                                 };

                                 // Status badge
                                 const getStatusBadge = () => {
                                    if (isNoShow) return <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">No-Show</span>;
                                    if (isNoShowPending) return <span className="text-[8px] bg-orange-500 text-zinc-900 px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">Faltou?</span>;
                                    if (isInProgress) return <span className="text-[8px] bg-amber-500 text-zinc-900 px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">Atendendo</span>;
                                    if (isCheckedIn) return <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">Aguardando</span>;
                                    if (isCompleted) return <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">Concluído</span>;
                                    return null;
                                 };

                                 return (
                                    <div 
                                       key={appt.id} 
                                       onClick={() => openAppointmentDetail(appt)}
                                       className={`p-3 rounded-xl border flex flex-col gap-1 shadow-lg transition-all cursor-pointer active:scale-95 ${getCardStyle()}`}
                                    >
                                       <div className="flex justify-between items-start">
                                          <div className="flex items-center gap-2">
                                             <span className={`text-sm font-bold ${isBlocked ? 'text-zinc-500' : 'text-white'}`}>
                                                {format(appt.date, 'HH:mm')}
                                             </span>
                                             {getStatusBadge()}
                                          </div>
                                          {!isBlocked && (
                                             <span className="text-xs font-bold text-amber-500">${appt.price}</span>
                                          )}
                                       </div>
                                       
                                       <div className="flex items-center gap-2">
                                          {isBlocked ? <AlertOctagon className="w-3 h-3 text-zinc-500" /> : <User className="w-3 h-3 text-zinc-400" />}
                                          <span className={`text-sm font-bold truncate ${isBlocked ? 'text-zinc-500 italic' : 'text-zinc-200'}`}>
                                             {appt.clientName}
                                          </span>
                                       </div>

                                       {!isBlocked && (
                                          <div className="text-xs text-zinc-500 flex items-center gap-1">
                                             <Scissors className="w-3 h-3" /> {appt.serviceName}
                                          </div>
                                       )}

                                       {/* Mobile: Tap indicator */}
                                       <div className="md:hidden mt-2 text-center border-t border-zinc-700/30 pt-2">
                                          <span className="text-[9px] text-zinc-500">Toque para detalhes</span>
                                       </div>

                                       {/* Desktop: Action buttons */}
                                       <div className="hidden md:flex mt-2 gap-2 border-t border-zinc-700/50 pt-2" onClick={e => e.stopPropagation()}>
                                          {/* SCHEDULED: Check-in or No-Show */}
                                          {appt.status === AppointmentStatus.SCHEDULED && !isBlocked && (
                                             <>
                                                <button 
                                                   onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.CHECKED_IN)}
                                                   className="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded text-[10px] font-bold text-center"
                                                >
                                                   ✓ Chegou
                                                </button>
                                                <button 
                                                   onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.NO_SHOW_PENDING)}
                                                   className="px-2 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded text-[10px]"
                                                   title="Marcar como faltou (No-Show)"
                                                >
                                                   ⊘
                                                </button>
                                                <button 
                                                   onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.CANCELLED)}
                                                   className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-[10px]"
                                                >
                                                   <XCircle className="w-3 h-3" />
                                                </button>
                                             </>
                                          )}
                                          {/* NO_SHOW_PENDING: Aguardando confirmação do dono */}
                                          {appt.status === AppointmentStatus.NO_SHOW_PENDING && !isBlocked && (
                                             <div className="w-full text-center">
                                                <span className="text-[9px] text-orange-400 font-bold">⏳ Aguardando confirmação</span>
                                             </div>
                                          )}
                                          {/* NO_SHOW: Confirmado */}
                                          {appt.status === AppointmentStatus.NO_SHOW && !isBlocked && (
                                             <div className="w-full text-center">
                                                <span className="text-[9px] text-red-400 font-bold">❌ No-Show</span>
                                             </div>
                                          )}
                                          {/* CHECKED_IN: Start */}
                                          {appt.status === AppointmentStatus.CHECKED_IN && !isBlocked && (
                                             <>
                                                <button 
                                                   onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.IN_PROGRESS)}
                                                   className="flex-1 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded text-[10px] font-bold text-center animate-pulse"
                                                >
                                                   ▶ Iniciar
                                                </button>
                                                <button 
                                                   onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.SCHEDULED)}
                                                   className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-400 rounded text-[10px]"
                                                   title="Voltar"
                                                >
                                                   ↩
                                                </button>
                                             </>
                                          )}
                                          {/* IN_PROGRESS: Finish */}
                                          {appt.status === AppointmentStatus.IN_PROGRESS && !isBlocked && (
                                             <button 
                                                onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.COMPLETED)}
                                                className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 rounded text-[10px] font-bold text-center"
                                             >
                                                ✓ Finalizar
                                             </button>
                                          )}
                                          {isBlocked && (
                                             <button 
                                                onClick={() => updateAppointmentStatus(appt.id, AppointmentStatus.CANCELLED)}
                                                className="w-full py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded text-[10px]"
                                             >
                                                Unblock
                                             </button>
                                          )}
                                       </div>
                                    </div>
                                 );
                              })
                           }
                           {appointments.filter(a => a.staffId === staffMember.id && isSameDay(a.date, selectedDate)).length === 0 && (
                              <div className="h-40 flex flex-col items-center justify-center text-zinc-600 mt-10">
                                 <Coffee className="w-8 h-8 mb-2 opacity-20" />
                                 <span className="text-xs">Free all day</span>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* QUEUE SIDEBAR (Responsive Overlay) */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-zinc-900 border-l border-zinc-800 transform transition-transform duration-300 z-40 ${showQueue ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 md:block`}>
         {/* Mobile Close Button */}
         <button onClick={() => setShowQueue(false)} className="md:hidden absolute top-4 left-4 z-50 bg-zinc-800 text-white p-2 rounded-full shadow-lg">
            <X className="w-5 h-5" />
         </button>
         <QueuePanel />
      </div>
      
      {/* Mobile Queue Backdrop */}
      {showQueue && (
         <div className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setShowQueue(false)}></div>
      )}

      {/* Full Screen Modal on Mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 md:bg-black/70 md:backdrop-blur-sm p-0 md:p-4">
          <div className="bg-zinc-900 h-full w-full md:h-auto md:max-w-md md:rounded-2xl border-0 md:border border-zinc-800 p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl md:text-xl font-bold text-white">
                  {bookingType === 'BLOCK' ? 'Block Time' : 'New Appointment'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
                  <X className="w-6 h-6" />
               </button>
            </div>
            
            {/* Conflict Alert */}
            {conflictError && (
               <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4 flex items-start gap-2">
                  <AlertOctagon className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-200">{conflictError}</p>
               </div>
            )}

            <form onSubmit={handleSaveAppointment} className="space-y-6 md:space-y-4">
              
              {bookingType === 'SERVICE' && (
                 <div>
                  <label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">Client</label>
                  <div className="relative">
                    <Smile className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600" />
                    <div className="flex gap-2">
                       <select
                         required
                         value={newApptClientId}
                         onChange={(e) => setNewApptClientId(e.target.value)}
                         className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none text-lg md:text-base"
                       >
                         <option value="" disabled>Select a client...</option>
                         {clients.map(c => (
                           <option key={c.id} value={c.id}>{c.name}</option>
                         ))}
                       </select>
                       <button 
                          type="button"
                          onClick={() => setIsClientModalOpen(true)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-xl transition-colors border border-zinc-800"
                          title="New Client"
                       >
                          <UserPlus className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                </div>
              )}

              {bookingType === 'SERVICE' && (
                 <div>
                  <label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">Service</label>
                  <div className="relative">
                    <Scissors className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600" />
                    <select 
                      value={newApptServiceId}
                      onChange={(e) => {
                         setNewApptServiceId(e.target.value);
                         if (isOwner) setNewApptStaffId('');
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none text-lg md:text-base"
                    >
                       {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">
                   {bookingType === 'BLOCK' ? 'Staff Member' : 'Professional'}
                </label>
                <div className="relative">
                  {isOwner ? (
                     <User className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600" />
                  ) : (
                     <Lock className="absolute left-4 top-3.5 w-5 h-5 text-amber-500" />
                  )}
                  
                  <select
                    required
                    disabled={!isOwner}
                    value={newApptStaffId}
                    onChange={(e) => setNewApptStaffId(e.target.value)}
                    className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none text-lg md:text-base ${!isOwner ? 'opacity-70 cursor-not-allowed text-zinc-400' : ''}`}
                  >
                    {availableStaffForBooking.length === 0 ? (
                       <option value="" disabled>No staff available</option>
                    ) : (
                       <option value="" disabled>Select a professional...</option>
                    )}
                    {availableStaffForBooking.map(s => (
                      <option key={s.id} value={s.id}>{s.name} {s.id === currentUser.id ? '(You)' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {bookingType === 'BLOCK' && (
                 <div>
                    <label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">Quick Presets</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                       <button type="button" onClick={() => setQuickBlock('Quick Break')} className="py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-bold border border-zinc-700 hover:border-amber-500 flex flex-col items-center gap-1 transition-all">
                          <Cigarette className="w-4 h-4 text-amber-500" />
                          Smoke ({breakDuration}m)
                       </button>
                       <button type="button" onClick={() => setQuickBlock('Coffee')} className="py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-bold border border-zinc-700 hover:border-amber-500 flex flex-col items-center gap-1 transition-all">
                          <Coffee className="w-4 h-4 text-amber-500" />
                          Coffee (15m)
                       </button>
                       <button type="button" onClick={() => setQuickBlock('Lunch')} className="py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-bold border border-zinc-700 hover:border-amber-500 flex flex-col items-center gap-1 transition-all">
                          <Utensils className="w-4 h-4 text-amber-500" />
                          Lunch (60m)
                       </button>
                    </div>

                    <label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">Custom Reason</label>
                    <input 
                      type="text"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-amber-500 text-lg md:text-base"
                    />
                 </div>
              )}

              <div>
                <label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600" />
                  <input 
                    type="time"
                    required
                    value={newApptTime}
                    onChange={(e) => setNewApptTime(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors text-lg md:text-base"
                  />
                </div>
              </div>

              {bookingType === 'SERVICE' && (
                 <div className="border-t border-zinc-800 pt-4 mt-4">
                  <label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">Recurrence</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Repeat className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600" />
                      <select 
                        value={recurrence}
                        onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none text-lg md:text-base"
                      >
                         <option value={RecurrenceType.NONE}>None</option>
                         <option value={RecurrenceType.DAILY}>Daily</option>
                         <option value={RecurrenceType.WEEKLY}>Weekly</option>
                         <option value={RecurrenceType.MONTHLY}>Monthly</option>
                      </select>
                    </div>
                    
                    {recurrence !== RecurrenceType.NONE && (
                      <div className="relative">
                        <input 
                          type="date"
                          required
                          value={recurrenceEndDate}
                          onChange={(e) => setRecurrenceEndDate(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-amber-500 transition-colors text-lg md:text-base"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8 pt-4 border-t border-zinc-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 md:py-3 text-zinc-400 font-medium hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={bookingType === 'SERVICE' && !newApptClientId}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-bold py-4 md:py-3 rounded-xl transition-all text-lg md:text-base"
                >
                  {conflictError ? 'Fix Conflict' : (bookingType === 'BLOCK' ? 'Block Time' : 'Book Now')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD CLIENT MODAL (Shared logic) */}
      {isClientModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 w-full h-full md:h-auto md:max-w-sm p-6 shadow-2xl animate-fade-in md:rounded-2xl border-0 md:border md:border-zinc-800 flex flex-col justify-center">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Quick Add Client</h3>
                  <button onClick={() => setIsClientModalOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-800 p-2 rounded-full"><X className="w-5 h-5"/></button>
               </div>
               <form onSubmit={handleQuickAddClient} className="space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-zinc-400 mb-2">Full Name</label>
                     <input 
                        type="text" 
                        required 
                        value={newClientName}
                        onChange={e => setNewClientName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none text-lg"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-zinc-400 mb-2">Phone (Required)</label>
                     <input 
                        type="tel" 
                        required 
                        value={newClientPhone}
                        onChange={e => setNewClientPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none text-lg"
                     />
                  </div>
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 mt-4 text-lg shadow-lg">
                     <Save className="w-5 h-5" /> Save & Select
                  </button>
               </form>
            </div>
         </div>
      )}

      {/* Appointment Detail Modal (Mobile-First) */}
      <AppointmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
};