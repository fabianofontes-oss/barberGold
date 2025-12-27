'use client';

import React, { useState, useEffect } from 'react';
import { useBarber } from '@/context/BarberContext';
import { StaffMember, CompensationModel, DaySchedule, BreakTime } from '@/types';
import { User, Phone, Wallet, CalendarClock, Scissors, Clock, CheckSquare, Square, Utensils, Coffee, Plus, Trash2, DoorOpen, X } from 'lucide-react';
import { ImageUpload } from '@/components/shared/ImageUpload';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: StaffMember | null;
}

export const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose, staffToEdit }) => {
  const { addStaff, updateStaff, commissionPlans, services } = useBarber();
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'SERVICES' | 'SCHEDULE'>('DETAILS');

  // Helper to init schedule
  const createDefaultSchedule = (): DaySchedule[] => {
    return Array.from({ length: 7 }, (_, i) => ({
      dayIndex: i,
      isActive: i !== 0,
      startTime: '09:00',
      endTime: i === 6 ? '14:00' : '19:00',
      breaks: []
    }));
  };

  const initialStaffState: Partial<StaffMember> = { 
    name: '', 
    role: 'BARBER', 
    commissionModel: CompensationModel.PERCENTAGE, 
    serviceCommissionRate: 50, 
    productCommissionRate: 20,
    rentalFee: 0,
    paymentFrequency: 'WEEKLY',
    phone: '',
    cpf: '',
    birthDate: '',
    address: '',
    avatar: '',
    allowedServices: [],
    workSchedule: createDefaultSchedule()
  };

  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>(initialStaffState);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('DETAILS');
      if (staffToEdit) {
        // Ensure breaks array exists for legacy data
        const safeSchedule = staffToEdit.workSchedule?.map(day => ({
           ...day,
           breaks: day.breaks || []
        })) || createDefaultSchedule();

        setNewStaff({ ...staffToEdit, workSchedule: safeSchedule });
      } else {
        setNewStaff({
          ...initialStaffState,
          allowedServices: services.map(s => s.id) // Default new staff does all services
        });
      }
    }
  }, [isOpen, staffToEdit, services]);

  if (!isOpen) return null;

  const handleCreateOrUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStaff.name && newStaff.phone) {
      if (staffToEdit && staffToEdit.id) {
        updateStaff({ ...newStaff, id: staffToEdit.id } as StaffMember);
      } else {
        addStaff(newStaff as Omit<StaffMember, 'id'>);
      }
      onClose();
    }
  };

  const applyPlanToStaff = (planId: string) => {
    const plan = commissionPlans.find(p => p.id === planId);
    if (plan) {
      setNewStaff(prev => ({
        ...prev,
        commissionModel: plan.model,
        serviceCommissionRate: plan.serviceRate,
        productCommissionRate: plan.productRate,
        rentalFee: plan.rentalFee
      }));
    }
  };

  const toggleService = (serviceId: string) => {
    const current = newStaff.allowedServices || [];
    if (current.includes(serviceId)) {
      setNewStaff({...newStaff, allowedServices: current.filter(id => id !== serviceId)});
    } else {
      setNewStaff({...newStaff, allowedServices: [...current, serviceId]});
    }
  };

  const updateDaySchedule = (dayIndex: number, field: keyof DaySchedule, value: any) => {
    const updatedSchedule = [...(newStaff.workSchedule || [])];
    updatedSchedule[dayIndex] = { ...updatedSchedule[dayIndex], [field]: value };
    setNewStaff({ ...newStaff, workSchedule: updatedSchedule });
  };

  const addBreak = (dayIndex: number) => {
     const updatedSchedule = [...(newStaff.workSchedule || [])];
     const day = updatedSchedule[dayIndex];
     
     const newBreak: BreakTime = {
        id: Math.random().toString(36).substr(2, 5),
        startTime: '12:00',
        endTime: '13:00',
        type: 'LUNCH'
     };
     
     day.breaks = [...(day.breaks || []), newBreak];
     updatedSchedule[dayIndex] = day;
     setNewStaff({ ...newStaff, workSchedule: updatedSchedule });
  };

  const removeBreak = (dayIndex: number, breakId: string) => {
     const updatedSchedule = [...(newStaff.workSchedule || [])];
     const day = updatedSchedule[dayIndex];
     day.breaks = (day.breaks || []).filter(b => b.id !== breakId);
     updatedSchedule[dayIndex] = day;
     setNewStaff({ ...newStaff, workSchedule: updatedSchedule });
  };

  const updateBreak = (dayIndex: number, breakId: string, field: keyof BreakTime, value: any) => {
     const updatedSchedule = [...(newStaff.workSchedule || [])];
     const day = updatedSchedule[dayIndex];
     day.breaks = (day.breaks || []).map(b => b.id === breakId ? { ...b, [field]: value } : b);
     updatedSchedule[dayIndex] = day;
     setNewStaff({ ...newStaff, workSchedule: updatedSchedule });
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate Total Weekly Hours (Rough Estimate excluding breaks)
  const totalWeeklyHours = (newStaff.workSchedule || []).reduce((acc, day) => {
     if (!day.isActive) return acc;
     const start = parseInt(day.startTime.split(':')[0]);
     const end = parseInt(day.endTime.split(':')[0]);
     const breakHours = (day.breaks || []).reduce((bAcc, b) => {
        const bStart = parseInt(b.startTime.split(':')[0]);
        const bEnd = parseInt(b.endTime.split(':')[0]);
        return bAcc + (bEnd - bStart);
     }, 0);
     return acc + (end - start) - breakHours;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 md:bg-black/70 md:backdrop-blur-sm p-0 md:p-4 overflow-y-auto">
      <div className="bg-zinc-900 w-full h-full md:h-auto md:max-w-2xl md:rounded-2xl border-0 md:border border-zinc-800 p-6 shadow-2xl animate-fade-in flex flex-col max-h-none md:max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
           <div className="flex flex-col">
              <h3 className="text-xl font-bold text-white">
                {staffToEdit ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              {activeTab === 'SCHEDULE' && (
                 <span className={`text-[10px] font-bold ${totalWeeklyHours < 30 ? 'text-red-500' : 'text-emerald-500'}`}>
                    ~{totalWeeklyHours} Hours / Week
                 </span>
              )}
           </div>
           <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-zinc-950 p-1 rounded-xl mb-6 border border-zinc-800 flex-shrink-0">
           <button onClick={() => setActiveTab('DETAILS')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'DETAILS' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <User className="w-3 h-3" /> Details
           </button>
           <button onClick={() => setActiveTab('SERVICES')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'SERVICES' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <Scissors className="w-3 h-3" /> Skills
           </button>
           <button onClick={() => setActiveTab('SCHEDULE')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'SCHEDULE' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <Clock className="w-3 h-3" /> Schedule
           </button>
        </div>

        <form onSubmit={handleCreateOrUpdateStaff} className="flex-1 overflow-y-auto pr-2 pb-20 md:pb-0">
           
           {/* TAB 1: DETAILS */}
           {activeTab === 'DETAILS' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider border-b border-zinc-800 pb-2 mb-4">Personal Details</h4>
                   <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                      <input required type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-3 text-white focus:border-amber-500 outline-none"/>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                         <label className="block text-xs font-medium text-zinc-400 mb-1.5">CPF (Private)</label>
                         <input required type="text" placeholder="000.000.000-00" value={newStaff.cpf || ''} onChange={e => setNewStaff({...newStaff, cpf: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-3 text-white focus:border-amber-500 outline-none"/>
                      </div>
                      <div>
                         <label className="block text-xs font-medium text-zinc-400 mb-1.5">Birth Date</label>
                         <input required type="date" value={newStaff.birthDate || ''} onChange={e => setNewStaff({...newStaff, birthDate: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-3 text-white focus:border-amber-500 outline-none text-sm"/>
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Phone / WhatsApp</label>
                      <input required type="tel" placeholder="(00) 00000-0000" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-3 text-white focus:border-amber-500 outline-none"/>
                   </div>
                   
                   <ImageUpload 
                      label="Profile Photo"
                      value={newStaff.avatar || ''} 
                      onChange={(val) => setNewStaff({...newStaff, avatar: val})} 
                   />
                </div>
                <div className="space-y-4">
                   <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider border-b border-zinc-800 pb-2 mb-4">Role & Contract</h4>
                   <div>
                     <label className="block text-xs font-medium text-zinc-400 mb-1.5">Address</label>
                     <input required type="text" placeholder="Street..." value={newStaff.address || ''} onChange={e => setNewStaff({...newStaff, address: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-3 text-white focus:border-amber-500 outline-none"/>
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">System Role</label>
                      <div className="grid grid-cols-3 gap-2">
                         <button type="button" onClick={() => setNewStaff({...newStaff, role: 'BARBER'})} className={`py-2 text-xs font-bold rounded-lg border ${newStaff.role === 'BARBER' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}>Barber</button>
                         <button type="button" onClick={() => setNewStaff({...newStaff, role: 'ASSISTANT'})} className={`py-2 text-xs font-bold rounded-lg border ${newStaff.role === 'ASSISTANT' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}>Assistant</button>
                         <button type="button" onClick={() => setNewStaff({...newStaff, role: 'OWNER'})} className={`py-2 text-xs font-bold rounded-lg border ${newStaff.role === 'OWNER' ? 'bg-amber-500 border-amber-500 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}>Owner</button>
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Payment Frequency</label>
                      <div className="relative">
                         <CalendarClock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                         <select 
                           value={newStaff.paymentFrequency} 
                           onChange={(e) => setNewStaff({...newStaff, paymentFrequency: e.target.value as any})}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-9 pr-3 text-white focus:border-amber-500 outline-none text-sm"
                         >
                            <option value="WEEKLY">Weekly</option>
                            <option value="BIWEEKLY">Bi-Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                         </select>
                      </div>
                   </div>

                   <div className="bg-zinc-800/50 p-4 rounded-xl border border-dashed border-zinc-700">
                      <label className="block text-xs font-bold text-white mb-2">Aplicar Plano de Comissão</label>
                      <select onChange={(e) => applyPlanToStaff(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-3 text-zinc-300 focus:border-amber-500 outline-none text-sm">
                         <option value="">-- Selecione um Plano --</option>
                         {commissionPlans.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                      </select>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                         <label className="block text-xs font-medium text-zinc-400 mb-1.5">Comissão de Serviço %</label>
                         <input type="number" min="0" max="100" value={newStaff.serviceCommissionRate} onChange={e => setNewStaff({...newStaff, serviceCommissionRate: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-3 text-white focus:border-amber-500 outline-none"/>
                      </div>
                      <div>
                         <label className="block text-xs font-medium text-zinc-400 mb-1.5">Comissão de Produto %</label>
                         <input type="number" min="0" max="100" value={newStaff.productCommissionRate} onChange={e => setNewStaff({...newStaff, productCommissionRate: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-3 text-white focus:border-amber-500 outline-none"/>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* TAB 2: SERVICES */}
           {activeTab === 'SERVICES' && (
              <div className="space-y-4">
                 <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 mb-4">
                    <p className="text-sm text-zinc-400">
                       Selecione os serviços que <b>{newStaff.name || 'este profissional'}</b> está qualificado para realizar. 
                       Serviços desmarcados não aparecerão nas opções de agendamento.
                    </p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.map(service => {
                       const isSelected = newStaff.allowedServices?.includes(service.id);
                       return (
                          <div 
                             key={service.id} 
                             onClick={() => toggleService(service.id)}
                             className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-amber-500/10 border-amber-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                          >
                             <div className={`w-5 h-5 rounded flex items-center justify-center ${isSelected ? 'bg-amber-500 text-zinc-900' : 'bg-zinc-800 text-zinc-600'}`}>
                                {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                             </div>
                             <div>
                                <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-zinc-400'}`}>{service.name}</p>
                                <p className="text-xs text-zinc-500">${service.price} • {service.durationMinutes}m</p>
                             </div>
                          </div>
                       )
                    })}
                 </div>
              </div>
           )}

           {/* TAB 3: SCHEDULE & BREAKS */}
           {activeTab === 'SCHEDULE' && (
              <div className="space-y-4">
                 <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 mb-4">
                    <p className="text-sm text-zinc-400">
                       Defina o horário de trabalho e <span className="text-amber-500 font-bold">Pausas Planejadas</span>.
                       <br/><span className="text-xs text-zinc-500">Pausas como Almoço ou Café serão bloqueadas automaticamente na agenda online.</span>
                    </p>
                 </div>
                 
                 <div className="space-y-3">
                    {newStaff.workSchedule?.map((day, idx) => (
                       <div key={idx} className={`p-4 rounded-xl border transition-all ${day.isActive ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-900/30 border-zinc-800/50 opacity-60'}`}>
                          {/* DAY HEADER & TOGGLE */}
                          <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-4">
                                <span className={`font-bold w-12 uppercase ${day.isActive ? 'text-white' : 'text-zinc-600'}`}>
                                   {daysOfWeek[day.dayIndex]}
                                </span>
                                {day.isActive && (
                                   <div className="flex items-center gap-2">
                                      <input 
                                         type="time" 
                                         value={day.startTime}
                                         onChange={(e) => updateDaySchedule(idx, 'startTime', e.target.value)}
                                         className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-white text-xs focus:border-amber-500 outline-none"
                                      />
                                      <span className="text-zinc-600">-</span>
                                      <input 
                                         type="time" 
                                         value={day.endTime}
                                         onChange={(e) => updateDaySchedule(idx, 'endTime', e.target.value)}
                                         className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-white text-xs focus:border-amber-500 outline-none"
                                      />
                                   </div>
                                )}
                             </div>
                             
                             <div className="flex items-center gap-3">
                                {day.isActive && (
                                   <button 
                                      type="button"
                                      onClick={() => addBreak(idx)}
                                      className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                   >
                                      <Plus className="w-3 h-3" /> Pausa
                                   </button>
                                )}
                                <button 
                                   type="button"
                                   onClick={() => updateDaySchedule(idx, 'isActive', !day.isActive)}
                                   className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${day.isActive ? 'text-zinc-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                                >
                                   {day.isActive ? 'Desativar' : 'Ativar'}
                                </button>
                             </div>
                          </div>

                          {/* BREAKS LIST */}
                          {day.isActive && day.breaks && day.breaks.length > 0 && (
                             <div className="pl-12 space-y-2 border-l-2 border-zinc-800 ml-2">
                                {day.breaks.map((blk) => (
                                   <div key={blk.id} className="flex items-center gap-2 animate-fade-in">
                                      <div className="relative">
                                         {blk.type === 'LUNCH' && <Utensils className="absolute left-2 top-1.5 w-3 h-3 text-zinc-500" />}
                                         {blk.type === 'COFFEE' && <Coffee className="absolute left-2 top-1.5 w-3 h-3 text-zinc-500" />}
                                         {blk.type === 'OTHER' && <DoorOpen className="absolute left-2 top-1.5 w-3 h-3 text-zinc-500" />}
                                         
                                         <select 
                                            value={blk.type}
                                            onChange={(e) => updateBreak(idx, blk.id, 'type', e.target.value)}
                                            className="bg-zinc-950 border border-zinc-800 rounded-lg py-1 pl-7 pr-2 text-zinc-300 text-xs focus:border-amber-500 outline-none w-24"
                                         >
                                            <option value="LUNCH">Almoço</option>
                                            <option value="COFFEE">Café</option>
                                            <option value="OTHER">Fora</option>
                                         </select>
                                      </div>

                                      <input 
                                         type="time" 
                                         value={blk.startTime}
                                         onChange={(e) => updateBreak(idx, blk.id, 'startTime', e.target.value)}
                                         className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-white text-xs focus:border-amber-500 outline-none"
                                      />
                                      <span className="text-zinc-600 text-xs">-</span>
                                      <input 
                                         type="time" 
                                         value={blk.endTime}
                                         onChange={(e) => updateBreak(idx, blk.id, 'endTime', e.target.value)}
                                         className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-white text-xs focus:border-amber-500 outline-none"
                                      />
                                      
                                      <button 
                                         type="button"
                                         onClick={() => removeBreak(idx, blk.id)}
                                         className="p-1 text-zinc-600 hover:text-red-500 transition-colors"
                                      >
                                         <Trash2 className="w-3 h-3" />
                                      </button>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </div>
           )}

           <div className="fixed bottom-0 left-0 w-full p-4 bg-zinc-950/90 border-t border-zinc-800 md:static md:bg-transparent md:border-0 md:p-0 flex gap-3 mt-6">
             <button type="button" onClick={onClose} className="flex-1 py-4 md:py-3 text-zinc-500 hover:text-white font-medium">Cancelar</button>
             <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-4 md:py-3 rounded-xl shadow-lg shadow-amber-500/20">
               {staffToEdit ? 'Atualizar Membro' : 'Salvar Membro'}
             </button>
           </div>
        </form>
      </div>
    </div>
  );
};