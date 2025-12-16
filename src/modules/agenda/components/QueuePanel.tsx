'use client';

import React, { useState, useEffect } from 'react';
import { useBarber } from '@/context/BarberContext';
import { QueueItem, AppointmentStatus } from '@/types';
import { User, Scissors, Trash2, ArrowRightCircle, Plus, UserMinus, ShieldCheck, Timer, MoveRight, UserPlus, X, Save } from 'lucide-react';
import { differenceInMinutes, addMinutes, isSameDay, areIntervalsOverlapping } from 'date-fns';

export const QueuePanel = () => {
  const { queue, joinQueue, leaveQueue, staff, services, clients, addAppointment, appointments, shopSettings, addClient } = useBarber();
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '',
    serviceId: services[0]?.id || '',
    preferredStaffId: ''
  });

  // Quick Register State
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  // --- 1. INTELLIGENT AVAILABILITY LOGIC ---
  
  // Calculate when a specific staff member will be free
  const getStaffFreeTime = (staffId: string) => {
     const now = new Date();
     
     // A. Check current active appointment
     const currentAppt = appointments.find(a => 
        a.staffId === staffId && 
        a.status === AppointmentStatus.SCHEDULED && // Scheduled or In Progress
        areIntervalsOverlapping(
           { start: a.date, end: addMinutes(a.date, 30) }, // Assuming 30m avg if actual duration tricky, or lookup service
           { start: now, end: addMinutes(now, 1) }
        )
     );

     // Start base wait time (0 if free, remaining minutes if busy)
     let minutesToWait = 0;
     if (currentAppt) {
        // Find service duration to be precise
        const service = services.find(s => s.id === currentAppt.serviceId);
        const duration = service ? service.durationMinutes : 30;
        const endTime = addMinutes(currentAppt.date, duration);
        minutesToWait = Math.max(0, differenceInMinutes(endTime, now));
     }

     // B. Add time for everyone currently in queue waiting SPECIFICALLY for this staff
     const peopleAhead = queue.filter(q => q.preferredStaffId === staffId);
     const queueTime = peopleAhead.reduce((acc, item) => {
        const srv = services.find(s => s.id === item.serviceId);
        return acc + (srv ? srv.durationMinutes : 30);
     }, 0);

     return minutesToWait + queueTime;
  };

  // The "Fair & Fast" Algorithm
  const getRecommendedStaffId = () => {
     const today = new Date();
     const dayIndex = today.getDay(); 
     
     // 1. Who is working today?
     const workingStaff = staff.filter(s => {
        const schedule = s.workSchedule.find(d => d.dayIndex === dayIndex);
        return schedule && schedule.isActive;
     });

     if (workingStaff.length === 0) return '';

     // 2. Calculate Status for everyone
     const staffStatus = workingStaff.map(s => {
        const waitTime = getStaffFreeTime(s.id);
        const dailyCount = appointments.filter(a => 
           a.staffId === s.id && 
           isSameDay(a.date, today) && 
           a.status !== AppointmentStatus.CANCELLED
        ).length;

        return { id: s.id, waitTime, dailyCount };
     });

     // 3. Sort Logic based on Rule
     const rule = shopSettings.queueDistributionRule;

     if (rule === 'MANUAL') return ''; // No recommendation

     staffStatus.sort((a, b) => {
        if (rule === 'SPEED') {
           // Prioritize Wait Time (Ascending), break ties with Daily Count
           if (a.waitTime !== b.waitTime) return a.waitTime - b.waitTime;
           return a.dailyCount - b.dailyCount;
        } else {
           // Default: FAIRNESS
           // Prioritize Daily Count (Ascending), break ties with Wait Time
           if (a.dailyCount !== b.dailyCount) return a.dailyCount - b.dailyCount;
           return a.waitTime - b.waitTime;
        }
     });

     return staffStatus[0]?.id || '';
  };

  const recommendedStaffId = getRecommendedStaffId();
  const recommendedStaffWait = recommendedStaffId ? getStaffFreeTime(recommendedStaffId) : 0;

  // --- LOYALTY DETECTION ---
  useEffect(() => {
     if (formData.clientId) {
        const client = clients.find(c => c.id === formData.clientId);
        if (client && client.preferredStaffId) {
           setFormData(prev => ({ ...prev, preferredStaffId: client.preferredStaffId! }));
        }
     } else {
        setFormData(prev => ({ ...prev, preferredStaffId: '' }));
     }
  }, [formData.clientId, clients]);

  const handleJoinQueue = (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find(s => s.id === formData.serviceId);
    
    // Strict Data Rule: Must have a registered Client ID
    if (!service || !formData.clientId || !formData.clientName) return;

    joinQueue({
      clientName: formData.clientName,
      clientId: formData.clientId,
      serviceId: service.id,
      serviceName: service.name,
      preferredStaffId: formData.preferredStaffId || undefined
    });
    
    setIsAdding(false);
    setFormData({ clientName: '', clientId: '', serviceId: services[0]?.id || '', preferredStaffId: '' });
  };

  const handleQuickAddClient = (e: React.FormEvent) => {
     e.preventDefault();
     if (newClientName && newClientPhone) {
        addClient({
           name: newClientName,
           phone: newClientPhone,
           email: '',
           birthDate: ''
        });
        
        // Reset and close
        setNewClientName('');
        setNewClientPhone('');
        setIsClientModalOpen(false);
        alert('Cliente cadastrado! Selecione na lista.');
     }
  };

  const handleStartService = (item: QueueItem) => {
     const staffId = item.preferredStaffId || recommendedStaffId || staff[0].id;
     const service = services.find(s => s.id === item.serviceId);
     const price = service ? service.price : 0;

     addAppointment({
        clientId: item.clientId || 'WALK-IN',
        clientName: item.clientName,
        staffId: staffId,
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        date: new Date(), 
        price: price,
        status: AppointmentStatus.SCHEDULED,
        notes: 'Walk-in from Queue'
     });

     leaveQueue(item.id);
  };

  // New Feature: Allow user to switch from Preferred to Any
  const switchToFastest = (item: QueueItem) => {
     // We "remove" the preference, making them eligible for the auto-recommendation
     leaveQueue(item.id);
     joinQueue({
        clientName: item.clientName,
        clientId: item.clientId,
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        preferredStaffId: undefined // CLEAR PREFERENCE
     });
  };

  return (
    <div className="bg-zinc-900 border-l border-zinc-800 h-full flex flex-col w-80 flex-shrink-0 animate-fade-in-right shadow-2xl">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
        <div>
           <h3 className="font-bold text-white flex items-center gap-2">
              <UserMinus className="w-5 h-5 text-amber-500" /> Walk-in Queue
           </h3>
           <p className="text-xs text-zinc-500 flex items-center gap-1">
              Mode: 
              <span className="text-zinc-300 font-bold uppercase">{shopSettings.queueDistributionRule}</span>
           </p>
        </div>
        <button 
           onClick={() => setIsAdding(!isAdding)}
           className={`p-2 rounded-lg transition-all ${isAdding ? 'bg-zinc-800 text-zinc-400' : 'bg-amber-500 text-zinc-900'}`}
        >
           <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAdding && (
         <div className="p-4 bg-zinc-900 border-b border-zinc-800 animate-fade-in">
            <form onSubmit={handleJoinQueue} className="space-y-3">
               <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Client (Required)</label>
                  <div className="flex gap-2">
                     <select
                        required
                        className={`flex-1 bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-sm focus:border-amber-500 outline-none ${!formData.clientId ? 'text-zinc-500 border-red-500/30' : 'text-white'}`}
                        value={formData.clientId}
                        onChange={(e) => {
                           const client = clients.find(c => c.id === e.target.value);
                           setFormData({
                              ...formData, 
                              clientId: e.target.value,
                              clientName: client ? client.name : ''
                           });
                        }}
                     >
                        <option value="">Select Registered Client</option>
                        {clients.map(c => (
                           <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                     </select>
                     <button 
                        type="button"
                        onClick={() => setIsClientModalOpen(true)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors border border-zinc-700"
                        title="New Client"
                     >
                        <UserPlus className="w-4 h-4" />
                     </button>
                  </div>
               </div>
               
               <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Service</label>
                  <select 
                     className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-sm text-white focus:border-amber-500 outline-none"
                     value={formData.serviceId}
                     onChange={e => setFormData({...formData, serviceId: e.target.value})}
                  >
                     {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes}m)</option>)}
                  </select>
               </div>

               <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Professional Preference</label>
                  <select 
                     className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-sm text-white focus:border-amber-500 outline-none"
                     value={formData.preferredStaffId}
                     onChange={e => setFormData({...formData, preferredStaffId: e.target.value})}
                  >
                     <option value="">
                        Any / Next Up 
                        {recommendedStaffId && ` (Rec: ${staff.find(s => s.id === recommendedStaffId)?.name.split(' ')[0]})`}
                     </option>
                     {staff.map(s => {
                        const wait = getStaffFreeTime(s.id);
                        return (
                           <option key={s.id} value={s.id}>
                              {s.name} ({wait === 0 ? 'Free' : `${wait}m`})
                           </option>
                        );
                     })}
                  </select>
               </div>

               <button 
                  type="submit" 
                  disabled={!formData.clientId}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg text-xs transition-all"
               >
                  Add to Queue
               </button>
            </form>
         </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
         {queue.length === 0 ? (
            <div className="text-center text-zinc-500 py-10 opacity-50">
               <User className="w-12 h-12 mx-auto mb-2" />
               <p className="text-sm">Queue is empty</p>
            </div>
         ) : (
            queue.map(item => {
               const isSpecific = !!item.preferredStaffId;
               let assignedStaffId = item.preferredStaffId || recommendedStaffId;
               
               // If MANUAL mode and no preference, we can't show a recommended staff unless user picked one
               if (shopSettings.queueDistributionRule === 'MANUAL' && !isSpecific) {
                  assignedStaffId = ''; 
               }

               const waitTime = assignedStaffId ? getStaffFreeTime(assignedStaffId) : 0;
               const staffName = staff.find(s => s.id === assignedStaffId)?.name.split(' ')[0] || 'TBD';

               return (
                  <div key={item.id} className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 hover:border-amber-500/50 transition-all group relative">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white text-sm flex items-center gap-1">
                           {item.clientName}
                           {isSpecific && <ShieldCheck className="w-3 h-3 text-amber-500" />}
                        </h4>
                        
                        {assignedStaffId && (
                           <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${waitTime > 30 ? 'text-red-500 bg-red-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                              <Timer className="w-3 h-3" /> {waitTime}m
                           </span>
                        )}
                     </div>
                     
                     <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                        <Scissors className="w-3 h-3" /> {item.serviceName}
                     </div>
                     <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                        <User className="w-3 h-3" /> 
                        {isSpecific ? (
                           <span className="text-amber-500 font-bold">{staffName} (Requested)</span>
                        ) : (
                           shopSettings.queueDistributionRule === 'MANUAL' ? (
                              <span className="text-zinc-500 italic">Waiting for assignment</span>
                           ) : (
                              <span className="text-emerald-500">{staffName} ({shopSettings.queueDistributionRule === 'SPEED' ? 'Fastest' : 'Next Turn'})</span>
                           )
                        )}
                     </div>

                     {/* SWITCH TO FASTEST OPTION (Only if in SPEED or FAIRNESS mode, and waiting for specific) */}
                     {isSpecific && recommendedStaffId && recommendedStaffWait < waitTime && shopSettings.queueDistributionRule !== 'MANUAL' && (
                        <button 
                           onClick={() => switchToFastest(item)}
                           className="w-full mb-3 bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 py-1.5 rounded-lg flex items-center justify-center gap-1 border border-dashed border-zinc-600"
                        >
                           <MoveRight className="w-3 h-3 text-emerald-500" /> 
                           Switch to {staff.find(s => s.id === recommendedStaffId)?.name.split(' ')[0]} (Save {waitTime - recommendedStaffWait}m)
                        </button>
                     )}

                     <div className="flex gap-2">
                        <button 
                           onClick={() => handleStartService(item)}
                           className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-zinc-900 border border-emerald-500/20 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                           <ArrowRightCircle className="w-3 h-3" /> Call / Start
                        </button>
                        <button 
                           onClick={() => leaveQueue(item.id)}
                           className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-all"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               )
            })
         )}
      </div>

      {/* QUICK ADD CLIENT MODAL (Reused Logic) */}
      {isClientModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-sm p-6 shadow-2xl animate-fade-in">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Quick Add Client</h3>
                  <button onClick={() => setIsClientModalOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
               </div>
               <form onSubmit={handleQuickAddClient} className="space-y-4">
                  <div>
                     <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                     <input 
                        type="text" 
                        required 
                        value={newClientName}
                        onChange={e => setNewClientName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-zinc-400 mb-1.5">Phone (Required for ID)</label>
                     <input 
                        type="tel" 
                        required 
                        value={newClientPhone}
                        onChange={e => setNewClientPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-500 outline-none"
                     />
                  </div>
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-2">
                     <Save className="w-4 h-4" /> Save Client
                  </button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};