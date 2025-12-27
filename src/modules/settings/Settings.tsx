'use client';

import React, { useState, useEffect } from 'react';
import { useBarber } from '@/context/BarberContext';
import { useI18n } from '@/hooks/useI18n';
import { StaffModal } from './modals/StaffModal';
import { QRCodeSVG } from 'qrcode.react';
import { generatePixPayload } from '@/lib/pix/generatePixPayload';
import { CommissionPlanModal } from './modals/CommissionPlanModal';
import { ReferralSettingsPanel } from './ReferralSettingsPanel'; 
import { ImageUpload } from '@/components/shared/ImageUpload';
import { 
  Users, User, Phone, 
  Briefcase, TrendingUp, Percent, Edit2, CalendarClock, 
  Gift, Share2, Star, MessageSquare, Target,
  Store, MapPin, Instagram, Clock,
  Scale, Plus, Wallet, Zap, Copy,
  Save, Coffee, Timer, Link, UserMinus, ThumbsUp,
  Utensils, DoorOpen, Trash2, Handshake, CreditCard, Smartphone, Banknote
} from 'lucide-react';
import { StaffMember, DaySchedule, AppointmentStatus, PaymentMethod, BreakTime } from '@/types';

export const Settings = () => {
  const { 
    staff, commissionPlans, shopSettings, shopProfile, currentUser,
    deleteCommissionPlan, updateShopSettings, updateShopProfile, updateStaff,
    appointments
  } = useBarber();
  const { t, formatCurrency } = useI18n();
  
  if (!currentUser) return null;
  
  const isOwner = currentUser.role === 'OWNER';
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'SHOP' | 'TEAM' | 'PAYMENTS' | 'COMMISSIONS' | 'MY_PROFILE' | 'REFERRAL'>('SHOP');
  
  // Payment Config Sub-tab
  // Set default tab based on role
  useEffect(() => {
     if (!isOwner && activeTab !== 'MY_PROFILE') {
        setActiveTab('MY_PROFILE');
     }
  }, [isOwner, activeTab]);

  // Modals
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  
  // Edit State
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // My Profile State (Staff View)
  const [myProfileForm, setMyProfileForm] = useState<StaffMember>(currentUser);
  
  // Update local form when currentUser changes
  useEffect(() => {
     // Ensure legacy compatibility for breaks
     const safeSchedule = currentUser.workSchedule?.map(day => ({
        ...day,
        breaks: day.breaks || []
     })) || [];
     setMyProfileForm({ ...currentUser, workSchedule: safeSchedule });
  }, [currentUser]);

  const openEditStaff = (member: StaffMember) => {
    setEditingStaff(member);
    setIsStaffModalOpen(true);
  };

  const openNewStaff = () => {
    setEditingStaff(null);
    setIsStaffModalOpen(true);
  };

  const handleSaveMyProfile = () => {
     updateStaff(myProfileForm);
     alert(t('settings.alerts.profileUpdatedSuccessfully'));
  };

  const updateMySchedule = (dayIndex: number, field: keyof DaySchedule, value: any) => {
    const updatedSchedule = [...(myProfileForm.workSchedule || [])];
    updatedSchedule[dayIndex] = { ...updatedSchedule[dayIndex], [field]: value };
    setMyProfileForm({ ...myProfileForm, workSchedule: updatedSchedule });
  };

  const addBreak = (dayIndex: number) => {
     const updatedSchedule = [...(myProfileForm.workSchedule || [])];
     const day = updatedSchedule[dayIndex];
     
     const newBreak: BreakTime = {
        id: Math.random().toString(36).substr(2, 5),
        startTime: '12:00',
        endTime: '13:00',
        type: 'LUNCH'
     };
     
     day.breaks = [...(day.breaks || []), newBreak];
     updatedSchedule[dayIndex] = day;
     setMyProfileForm({ ...myProfileForm, workSchedule: updatedSchedule });
  };

  const removeBreak = (dayIndex: number, breakId: string) => {
     const updatedSchedule = [...(myProfileForm.workSchedule || [])];
     const day = updatedSchedule[dayIndex];
     day.breaks = (day.breaks || []).filter(b => b.id !== breakId);
     updatedSchedule[dayIndex] = day;
     setMyProfileForm({ ...myProfileForm, workSchedule: updatedSchedule });
  };

  const updateBreak = (dayIndex: number, breakId: string, field: keyof BreakTime, value: any) => {
     const updatedSchedule = [...(myProfileForm.workSchedule || [])];
     const day = updatedSchedule[dayIndex];
     day.breaks = (day.breaks || []).map(b => b.id === breakId ? { ...b, [field]: value } : b);
     updatedSchedule[dayIndex] = day;
     setMyProfileForm({ ...myProfileForm, workSchedule: updatedSchedule });
  };

  // --- SHOP HOURS UPDATES ---
  const updateShopSchedule = (dayIndex: number, field: keyof DaySchedule, value: any) => {
     const updatedSchedule = [...(shopProfile.operatingHours || [])];
     // Ensure structure exists (fallback if migrating)
     if (!updatedSchedule[dayIndex]) {
        updatedSchedule[dayIndex] = { dayIndex, isActive: true, startTime: '09:00', endTime: '20:00', breaks: [] };
     }
     updatedSchedule[dayIndex] = { ...updatedSchedule[dayIndex], [field]: value };
     updateShopProfile({ ...shopProfile, operatingHours: updatedSchedule });
  };

  const copyMondayToWeekdays = () => {
     const monday = shopProfile.operatingHours[1];
     if (!monday) return;
     
     const updatedSchedule = [...shopProfile.operatingHours];
     // Apply Mon stats to Tue(2), Wed(3), Thu(4), Fri(5)
     [2, 3, 4, 5].forEach(idx => {
        updatedSchedule[idx] = { ...monday, dayIndex: idx };
     });
     updateShopProfile({ ...shopProfile, operatingHours: updatedSchedule });
  };

  const updateSmartBreak = (field: 'enabled' | 'clientsPerCycle' | 'durationMinutes', value: number | boolean) => {
     setMyProfileForm({
        ...myProfileForm,
        smartBreak: {
           enabled: false,
           clientsPerCycle: 3,
           durationMinutes: 15,
           ...(myProfileForm.smartBreak || {}),
           [field]: value
        }
     });
  };

  // --- METRICS CALCULATION HELPERS ---
  const calculateStaffMetrics = (memberId: string, schedule: DaySchedule[]) => {
     // 1. Calculate Available Hours per Week
     const weeklyAvailableMinutes = schedule.reduce((acc, day) => {
        if (!day.isActive) return acc;
        const start = parseInt(day.startTime.split(':')[0]) * 60 + parseInt(day.startTime.split(':')[1] || '0');
        const end = parseInt(day.endTime.split(':')[0]) * 60 + parseInt(day.endTime.split(':')[1] || '0');
        
        // Subtract breaks
        const breakMins = (day.breaks || []).reduce((bAcc, b) => {
           const bStart = parseInt(b.startTime.split(':')[0]) * 60 + parseInt(b.startTime.split(':')[1] || '0');
           const bEnd = parseInt(b.endTime.split(':')[0]) * 60 + parseInt(b.endTime.split(':')[0] || '0');
           return bAcc + (bEnd - bStart);
        }, 0);

        return acc + (end - start) - breakMins;
     }, 0);
     const weeklyAvailableHours = weeklyAvailableMinutes / 60;

     // 2. Calculate Actual Work (Based on Appointments Last 7 Days for Demo)
     const completedAppts = appointments.filter(a => a.staffId === memberId && a.status === AppointmentStatus.COMPLETED);
     const totalRevenue = completedAppts.reduce((acc, a) => acc + a.price, 0);
     
     // Estimate duration worked (Approximation for demo)
     const minutesWorked = completedAppts.length * 45; // Avg 45 min
     const hoursWorked = minutesWorked / 60;

     // 3. Occupancy Rate
     const occupancyRate = weeklyAvailableHours > 0 ? (hoursWorked / (weeklyAvailableHours * 4)) * 100 : 0; 
     
     // 4. Revenue Per Available Hour
     const rph = weeklyAvailableHours > 0 ? (totalRevenue / (weeklyAvailableHours * 4)) : 0;

     return {
        weeklyAvailableHours,
        occupancyRate: Math.min(100, Math.max(0, occupancyRate)), // Clamp 0-100
        totalRevenue,
        rph
     };
  };

  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{isOwner ? 'Configurações' : 'Meu Perfil'}</h2>
        <p className="text-zinc-400">
           {isOwner ? 'Gerencie detalhes da barbearia, equipe e regras de negócio.' : 'Gerencie sua agenda e preferências.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
           {isOwner && (
             <>
               <button
                  onClick={() => setActiveTab('SHOP')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'SHOP' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Store className="w-4 h-4" /> Perfil da Loja
                </button>
                 <button
                  onClick={() => setActiveTab('TEAM')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'TEAM' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Users className="w-4 h-4" /> Equipe
                </button>
                <button
                  onClick={() => setActiveTab('PAYMENTS')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'PAYMENTS' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Wallet className="w-4 h-4" /> Pagamentos
                </button>
                <button
                  onClick={() => setActiveTab('COMMISSIONS')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'COMMISSIONS' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> Regras e Crescimento
                </button>
                <button
                  onClick={() => setActiveTab('REFERRAL')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'REFERRAL' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Handshake className="w-4 h-4" /> Indicações
                </button>
             </>
           )}
           
           {/* MY PROFILE TAB (Always available, but mainly for Staff) */}
           <button
              onClick={() => setActiveTab('MY_PROFILE')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'MY_PROFILE' 
                  ? 'border-amber-500 text-white' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <User className="w-4 h-4" /> Meu Perfil
            </button>
        </div>
        
        {isOwner && activeTab !== 'SHOP' && activeTab !== 'MY_PROFILE' && activeTab !== 'REFERRAL' && (
          <button 
            onClick={() => {
              if (activeTab === 'COMMISSIONS') setIsPlanModalOpen(true);
              else openNewStaff();
            }}
            className="mb-2 flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Novo {activeTab === 'TEAM' ? 'Membro' : 'Plano'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        
        {/* --- SHOP TAB --- */}
        {activeTab === 'SHOP' && isOwner && (
          <div className="max-w-4xl space-y-8 animate-fade-in">
             {/* Basic Info Card */}
             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                   <Store className="w-5 h-5 text-amber-500" /> Informações Básicas
                </h3>
                
                {/* LOGO UPLOAD SECTION */}
                <div className="mb-6 border-b border-zinc-800 pb-6">
                   <ImageUpload 
                      label="Logo da Barbearia" 
                      value={shopProfile.logo} 
                      onChange={(val) => updateShopProfile({ ...shopProfile, logo: val })} 
                      placeholder="Envie o logo da sua marca (PNG/JPG)"
                      className="w-full max-w-xs"
                   />
                   <p className="text-[10px] text-zinc-500 mt-2">
                      Este logo substituirá o texto &quot;BarberFlow&quot; na barra lateral, cabeçalho mobile e website.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Nome da Barbearia</label>
                         <input 
                            type="text" 
                            value={shopProfile.name}
                            onChange={(e) => updateShopProfile({ ...shopProfile, name: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Endereço</label>
                         <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                            <MapPin className="w-4 h-4 text-zinc-500" />
                            <input 
                               type="text" 
                               value={shopProfile.address}
                               onChange={(e) => updateShopProfile({ ...shopProfile, address: e.target.value })}
                               className="w-full bg-transparent text-white outline-none"
                            />
                         </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Telefone / Contato</label>
                         <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                            <Phone className="w-4 h-4 text-zinc-500" />
                            <input 
                               type="text" 
                               value={shopProfile.phone}
                               onChange={(e) => updateShopProfile({ ...shopProfile, phone: e.target.value })}
                               className="w-full bg-transparent text-white outline-none"
                            />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Instagram</label>
                            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                               <Instagram className="w-4 h-4 text-zinc-500" />
                               <input 
                                  type="text" 
                                  value={shopProfile.instagram}
                                  onChange={(e) => updateShopProfile({ ...shopProfile, instagram: e.target.value })}
                                  className="w-full bg-transparent text-white outline-none text-sm"
                               />
                            </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">WhatsApp</label>
                            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                               <MessageSquare className="w-4 h-4 text-zinc-500" />
                               <input 
                                  type="text" 
                                  value={shopProfile.whatsapp}
                                  onChange={(e) => updateShopProfile({ ...shopProfile, whatsapp: e.target.value })}
                                  className="w-full bg-transparent text-white outline-none text-sm"
                               />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Share Your Shop */}
             <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                   <Share2 className="w-5 h-5 text-purple-400" /> Compartilhar sua Barbearia
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                   Divulgue sua barbearia nas redes sociais e atraia mais clientes!
                </p>
                <div className="flex flex-wrap gap-3">
                   <button
                      onClick={() => {
                         const text = `Conheça a ${shopProfile.name}! Agende seu horário: ${window.location.origin}/book/${shopProfile.name.replace(/\s/g, '').toLowerCase()}`;
                         window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all"
                   >
                      <MessageSquare className="w-4 h-4" /> WhatsApp
                   </button>
                   <button
                      onClick={() => {
                         const text = `Conheça a ${shopProfile.name}! Agende seu horário online.`;
                         const url = `${window.location.origin}/book/${shopProfile.name.replace(/\s/g, '').toLowerCase()}`;
                         window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
                   >
                      <Share2 className="w-4 h-4" /> Facebook
                   </button>
                   <button
                      onClick={() => {
                         navigator.clipboard.writeText(`${window.location.origin}/book/${shopProfile.name.replace(/\s/g, '').toLowerCase()}`);
                         alert(t('settings.alerts.instagramLinkCopied'));
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-xl transition-all"
                   >
                      <Instagram className="w-4 h-4" /> Copiar para Instagram
                   </button>
                   <button
                      onClick={() => {
                         const link = `${window.location.origin}/book/${shopProfile.name.replace(/\s/g, '').toLowerCase()}`;
                         navigator.clipboard.writeText(link);
                         alert(t('settings.alerts.bookingLinkCopied'));
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl transition-all"
                   >
                      <Link className="w-4 h-4" /> Copiar Link
                   </button>
                </div>
             </div>

             {/* Operating Hours */}
             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-500" /> Horário de Funcionamento
                   </h3>
                   <button 
                      onClick={copyMondayToWeekdays}
                      className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1"
                   >
                      <Copy className="w-3 h-3" /> Copiar Seg para Sex
                   </button>
                </div>
                
                <div className="space-y-2">
                   {shopProfile.operatingHours?.map((day, idx) => (
                      <div key={idx} className={`flex items-center gap-4 p-3 rounded-xl border ${day.isActive ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-950/50 border-transparent opacity-50'}`}>
                         <div className="w-24">
                            <span className={`font-bold uppercase ${day.isActive ? 'text-white' : 'text-zinc-600'}`}>
                               {days[day.dayIndex]}
                            </span>
                         </div>
                         
                         <div className="flex-1 flex items-center gap-4">
                            {day.isActive ? (
                               <>
                                  <input 
                                     type="time" 
                                     value={day.startTime}
                                     onChange={(e) => updateShopSchedule(idx, 'startTime', e.target.value)}
                                     className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-white focus:border-amber-500 outline-none"
                                  />
                                  <span className="text-zinc-600 font-bold">-</span>
                                  <input 
                                     type="time" 
                                     value={day.endTime}
                                     onChange={(e) => updateShopSchedule(idx, 'endTime', e.target.value)}
                                     className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-white focus:border-amber-500 outline-none"
                                  />
                               </>
                            ) : (
                               <span className="text-sm text-zinc-500 font-medium italic">Fechado</span>
                            )}
                         </div>

                         <div className="flex items-center gap-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                               <input 
                                  type="checkbox" 
                                  checked={day.isActive}
                                  onChange={(e) => updateShopSchedule(idx, 'isActive', e.target.checked)}
                                  className="sr-only peer"
                               />
                               <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- TEAM TAB --- */}
        {activeTab === 'TEAM' && isOwner && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
             {staff.filter(member => member.role !== 'SUPER_ADMIN').map(member => {
                const metrics = calculateStaffMetrics(member.id, member.workSchedule || []);
                return (
                   <div key={member.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-4">
                            <img 
                               src={member.avatar || 'https://via.placeholder.com/150'} 
                               alt={member.name} 
                               className="w-14 h-14 rounded-full border-2 border-zinc-800 object-cover"
                            />
                            <div>
                               <h4 className="font-bold text-white text-lg">{member.name}</h4>
                               <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${member.role === 'OWNER' ? 'bg-amber-500 text-zinc-900' : 'bg-zinc-800 text-zinc-400'}`}>
                                  {member.role}
                               </span>
                            </div>
                         </div>
                         <button 
                            onClick={() => openEditStaff(member)}
                            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                         >
                            <Edit2 className="w-4 h-4" />
                         </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                         <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <span className="block text-xs text-zinc-500 mb-1">Comissão</span>
                            <span className="text-white font-bold">{member.serviceCommissionRate}% / {member.productCommissionRate}%</span>
                         </div>
                         <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <span className="block text-xs text-zinc-500 mb-1">Receita Est. (7d)</span>
                            <span className="text-emerald-500 font-bold">${metrics.totalRevenue.toFixed(0)}</span>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between text-xs text-zinc-400">
                            <span>Ocupação ({metrics.weeklyAvailableHours.toFixed(1)}h disponível)</span>
                            <span>{metrics.occupancyRate.toFixed(0)}%</span>
                         </div>
                         <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${metrics.occupancyRate}%` }}></div>
                         </div>
                      </div>
                   </div>
                );
             })}
             
             <button 
                onClick={openNewStaff}
                className="border-2 border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all min-h-[200px]"
             >
                <div className="bg-zinc-900 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                   <Plus className="w-6 h-6" />
                </div>
                <span className="font-bold">Adicionar Membro da Equipe</span>
             </button>
          </div>
        )}

        {/* --- REFERRAL TAB (NEW) --- */}
        {activeTab === 'REFERRAL' && isOwner && (
           <div className="max-w-4xl mx-auto">
              <ReferralSettingsPanel />
           </div>
        )}

        {/* --- MY PROFILE TAB (STAFF VIEW) --- */}
        {activeTab === 'MY_PROFILE' && (
           <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-6">
                 <div className="relative">
                    <img 
                       src={myProfileForm.avatar || 'https://via.placeholder.com/150'} 
                       alt={myProfileForm.name} 
                       className="w-24 h-24 rounded-full border-4 border-zinc-900 object-cover shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 bg-amber-500 text-zinc-900 p-1.5 rounded-full border-4 border-zinc-900">
                       <User className="w-4 h-4" />
                    </div>
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                       <h3 className="text-2xl font-bold text-white">{myProfileForm.name}</h3>
                       <span className="px-2 py-0.5 bg-zinc-950 text-zinc-400 text-xs rounded uppercase font-bold tracking-wider border border-zinc-800">
                          {myProfileForm.role}
                       </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
                       <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {myProfileForm.phone}</span>
                       <span className="flex items-center gap-1"><Wallet className="w-3 h-3" /> {myProfileForm.serviceCommissionRate}% Commission</span>
                    </div>
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          placeholder="Photo URL..." 
                          value={myProfileForm.avatar || ''} 
                          onChange={(e) => setMyProfileForm({...myProfileForm, avatar: e.target.value})}
                          className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white w-full max-w-sm focus:border-amber-500 outline-none"
                       />
                    </div>
                 </div>
                 <button 
                    onClick={handleSaveMyProfile}
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all self-end md:self-center"
                 >
                    <Save className="w-5 h-5" /> Save Changes
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="space-y-8">
                     {/* My Weekly Schedule - EDITABLE */}
                     <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              <CalendarClock className="w-5 h-5 text-amber-500" /> Weekly Schedule
                           </h3>
                           <span className="text-xs text-zinc-500">Set your availability & breaks</span>
                        </div>
                        
                        <div className="space-y-3">
                           {myProfileForm.workSchedule?.map((day, idx) => (
                              <div key={idx} className={`p-4 rounded-xl border transition-all ${day.isActive ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-950/30 border-transparent opacity-60'}`}>
                                 <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                       <span className={`font-bold w-12 uppercase ${day.isActive ? 'text-amber-500' : 'text-zinc-600'}`}>
                                          {days[day.dayIndex].substring(0, 3)}
                                       </span>
                                       
                                       {day.isActive && (
                                          <div className="flex items-center gap-2">
                                             <input 
                                                type="time" 
                                                value={day.startTime}
                                                onChange={(e) => updateMySchedule(idx, 'startTime', e.target.value)}
                                                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white text-xs focus:border-amber-500 outline-none"
                                             />
                                             <span className="text-zinc-600">-</span>
                                             <input 
                                                type="time" 
                                                value={day.endTime}
                                                onChange={(e) => updateMySchedule(idx, 'endTime', e.target.value)}
                                                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white text-xs focus:border-amber-500 outline-none"
                                             />
                                          </div>
                                       )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                       {day.isActive && (
                                          <button type="button" onClick={() => addBreak(idx)} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded hover:text-white flex items-center gap-1">
                                             <Plus className="w-3 h-3" /> Break
                                          </button>
                                       )}
                                       <button 
                                          type="button"
                                          onClick={() => updateMySchedule(idx, 'isActive', !day.isActive)}
                                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${day.isActive ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                                       >
                                          {day.isActive ? 'Off' : 'Work'}
                                       </button>
                                    </div>
                                 </div>

                                 {/* Breaks List */}
                                 {day.isActive && day.breaks && day.breaks.length > 0 && (
                                    <div className="pl-12 border-l-2 border-zinc-800 ml-2 space-y-2">
                                       {day.breaks.map(blk => (
                                          <div key={blk.id} className="flex items-center gap-2 animate-fade-in">
                                             <div className="relative">
                                                {blk.type === 'LUNCH' && <Utensils className="absolute left-2 top-1.5 w-3 h-3 text-zinc-500" />}
                                                {blk.type === 'COFFEE' && <Coffee className="absolute left-2 top-1.5 w-3 h-3 text-zinc-500" />}
                                                {blk.type === 'OTHER' && <DoorOpen className="absolute left-2 top-1.5 w-3 h-3 text-zinc-500" />}
                                                <select 
                                                   value={blk.type}
                                                   onChange={(e) => updateBreak(idx, blk.id, 'type', e.target.value)}
                                                   className="bg-zinc-900 border border-zinc-800 rounded-lg py-1 pl-7 pr-2 text-zinc-300 text-xs focus:border-amber-500 outline-none w-24"
                                                >
                                                   <option value="LUNCH">Lunch</option>
                                                   <option value="COFFEE">Coffee</option>
                                                   <option value="OTHER">Away</option>
                                                </select>
                                             </div>
                                             <input type="time" value={blk.startTime} onChange={(e) => updateBreak(idx, blk.id, 'startTime', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-xs focus:border-amber-500 outline-none" />
                                             <span className="text-zinc-600 text-xs">-</span>
                                             <input type="time" value={blk.endTime} onChange={(e) => updateBreak(idx, blk.id, 'endTime', e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-xs focus:border-amber-500 outline-none" />
                                             <button onClick={() => removeBreak(idx, blk.id)} className="p-1 text-zinc-600 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                       ))}
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Work Rhythm & Breaks - NEW */}
                     <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              <Coffee className="w-5 h-5 text-amber-500" /> Work Rhythm & Buffer
                           </h3>
                        </div>
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 mb-4">
                           <p className="text-xs text-zinc-400 mb-3">
                              Define your automatic buffer preferences. We&apos;ll suggest breaks in the agenda.
                           </p>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Clients per Cycle</label>
                                 <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-zinc-600" />
                                    <input 
                                       type="number" 
                                       min="1"
                                       value={myProfileForm.smartBreak?.clientsPerCycle || 3}
                                       onChange={(e) => updateSmartBreak('clientsPerCycle', Number(e.target.value))}
                                       className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-1.5 px-3 text-white text-sm focus:border-amber-500 outline-none"
                                    />
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Break Duration (Min)</label>
                                 <div className="flex items-center gap-2">
                                    <Timer className="w-4 h-4 text-zinc-600" />
                                    <input 
                                       type="number" 
                                       step="5"
                                       min="5"
                                       value={myProfileForm.smartBreak?.durationMinutes || 15}
                                       onChange={(e) => updateSmartBreak('durationMinutes', Number(e.target.value))}
                                       className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-1.5 px-3 text-white text-sm focus:border-amber-500 outline-none"
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                 </div>

              </div>
           </div>
        )}

        {/* --- PAYMENTS TAB --- */}
        {activeTab === 'PAYMENTS' && isOwner && (
          <div className="max-w-6xl space-y-8 animate-fade-in">
            {/* PAYMENT METHODS CONFIGURATION */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6">
               <div className="mb-6">
                  <h3 className="text-white font-bold text-2xl flex items-center gap-2 mb-2">
                    <Wallet className="w-6 h-6 text-amber-500" /> Métodos de Pagamento
                  </h3>
                  <p className="text-zinc-400">
                     Configure quais métodos de pagamento sua barbearia aceita na loja física e no agendamento online.
                  </p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* IN-STORE PAYMENTS */}
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
                     <div className="flex items-center gap-2 mb-4">
                        <Store className="w-5 h-5 text-emerald-500" />
                        <h4 className="font-bold text-white text-lg">Pagamentos na Loja (PDV)</h4>
                     </div>
                     <p className="text-xs text-zinc-500 mb-4">Métodos aceitos no caixa físico e atendimento presencial.</p>
                     
                     <div className="space-y-2">
                        {[
                           { value: PaymentMethod.CASH, label: 'Dinheiro', icon: Banknote, requiresGateway: false },
                           { value: PaymentMethod.CREDIT_CARD, label: 'Cartão de Crédito', icon: CreditCard, requiresGateway: false },
                           { value: PaymentMethod.DEBIT_CARD, label: 'Cartão de Débito', icon: CreditCard, requiresGateway: false },
                           { value: PaymentMethod.PIX, label: 'PIX', icon: Smartphone, requiresGateway: false },
                           { value: PaymentMethod.GOOGLE_PAY, label: 'Google Pay', icon: Smartphone, requiresGateway: true, gateway: 'stripe' },
                           { value: PaymentMethod.APPLE_PAY, label: 'Apple Pay', icon: Smartphone, requiresGateway: true, gateway: 'stripe' },
                           { value: PaymentMethod.MERCADO_PAGO, label: 'Mercado Pago', icon: Wallet, requiresGateway: true, gateway: 'mercadoPago' },
                           { value: PaymentMethod.PAGSEGURO, label: 'PagSeguro', icon: Wallet, requiresGateway: true, gateway: 'pagSeguro' },
                           { value: PaymentMethod.INFINITE_PAY, label: 'InfinitePay', icon: Wallet, requiresGateway: true, gateway: 'infinitePay' },
                           { value: PaymentMethod.STONE, label: 'Stone', icon: Wallet, requiresGateway: true, gateway: 'stone' },
                        ].map(method => {
                           const Icon = method.icon;
                           const isEnabled = shopSettings.paymentSettings?.inStore?.includes(method.value) ?? false;
                           
                           // Validar se gateway está configurado
                           let isConfigured = true;
                           if (method.gateway === 'mercadoPago') {
                              isConfigured = !!(shopSettings.gatewayConfig?.mercadoPago?.enabled && 
                                               shopSettings.gatewayConfig?.mercadoPago?.publicKey && 
                                               shopSettings.gatewayConfig?.mercadoPago?.accessToken);
                           } else if (method.gateway === 'pagSeguro') {
                              isConfigured = !!(shopSettings.gatewayConfig?.pagSeguro?.enabled && 
                                               shopSettings.gatewayConfig?.pagSeguro?.email && 
                                               shopSettings.gatewayConfig?.pagSeguro?.token);
                           } else if (method.gateway === 'stripe') {
                              isConfigured = !!(shopSettings.gatewayConfig?.stripe?.enabled && 
                                               shopSettings.gatewayConfig?.stripe?.publishableKey && 
                                               shopSettings.gatewayConfig?.stripe?.secretKey);
                           } else if (method.gateway === 'infinitePay') {
                              isConfigured = !!(shopSettings.gatewayConfig?.infinitePay?.enabled && 
                                               shopSettings.gatewayConfig?.infinitePay?.apiKey && 
                                               shopSettings.gatewayConfig?.infinitePay?.appKey);
                           } else if (method.gateway === 'stone') {
                              isConfigured = !!(shopSettings.gatewayConfig?.stone?.enabled && 
                                               shopSettings.gatewayConfig?.stone?.stoneCode && 
                                               shopSettings.gatewayConfig?.stone?.apiKey);
                           } else if (method.value === PaymentMethod.PIX) {
                              isConfigured = !!(shopSettings.pixConfig?.key && shopSettings.pixConfig?.beneficiaryName);
                           }
                           
                           const canEnable = !method.requiresGateway || isConfigured;
                           
                           return (
                              <button
                                 key={method.value}
                                 onClick={() => {
                                    if (!canEnable) {
                                       alert(`Configure o gateway ${method.label} primeiro na seção "Integrações de Gateway" abaixo.`);
                                       return;
                                    }
                                    const current = shopSettings.paymentSettings?.inStore || [];
                                    const updated = isEnabled 
                                       ? current.filter(m => m !== method.value)
                                       : [...current, method.value];
                                    updateShopSettings({ 
                                       paymentSettings: { 
                                          ...shopSettings.paymentSettings,
                                          inStore: updated,
                                          online: shopSettings.paymentSettings?.online || []
                                       } 
                                    });
                                 }}
                                 className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                                    isEnabled && canEnable
                                       ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                                       : !canEnable
                                       ? 'bg-zinc-900 border-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed'
                                       : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                 }`}
                                 disabled={!canEnable}
                              >
                                 <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{method.label}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    {!canEnable && (
                                       <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">Não Configurado</span>
                                    )}
                                    {isEnabled && canEnable && <Zap className="w-4 h-4 text-emerald-500" />}
                                 </div>
                              </button>
                           );
                        })}
                     </div>
                  </div>

                  {/* ONLINE PAYMENTS */}
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
                     <div className="flex items-center gap-2 mb-4">
                        <Smartphone className="w-5 h-5 text-blue-500" />
                        <h4 className="font-bold text-white text-lg">Pagamentos Online</h4>
                     </div>
                     <p className="text-xs text-zinc-500 mb-4">Métodos aceitos no agendamento online pelo site/app.</p>
                     
                     <div className="space-y-2">
                        {[
                           { value: PaymentMethod.CREDIT_CARD, label: 'Cartão de Crédito', icon: CreditCard, requiresGateway: true, gateway: 'any' },
                           { value: PaymentMethod.DEBIT_CARD, label: 'Cartão de Débito', icon: CreditCard, requiresGateway: true, gateway: 'any' },
                           { value: PaymentMethod.PIX, label: 'PIX', icon: Smartphone, requiresGateway: false },
                           { value: PaymentMethod.GOOGLE_PAY, label: 'Google Pay', icon: Smartphone, requiresGateway: true, gateway: 'stripe' },
                           { value: PaymentMethod.APPLE_PAY, label: 'Apple Pay', icon: Smartphone, requiresGateway: true, gateway: 'stripe' },
                           { value: PaymentMethod.MERCADO_PAGO, label: 'Mercado Pago', icon: Wallet, requiresGateway: true, gateway: 'mercadoPago' },
                           { value: PaymentMethod.PAGSEGURO, label: 'PagSeguro', icon: Wallet, requiresGateway: true, gateway: 'pagSeguro' },
                        ].map(method => {
                           const Icon = method.icon;
                           const isEnabled = shopSettings.paymentSettings?.online?.includes(method.value) ?? false;
                           
                           // Validar se gateway está configurado
                           let isConfigured = true;
                           if (method.gateway === 'mercadoPago') {
                              isConfigured = !!(shopSettings.gatewayConfig?.mercadoPago?.enabled && 
                                               shopSettings.gatewayConfig?.mercadoPago?.publicKey && 
                                               shopSettings.gatewayConfig?.mercadoPago?.accessToken);
                           } else if (method.gateway === 'pagSeguro') {
                              isConfigured = !!(shopSettings.gatewayConfig?.pagSeguro?.enabled && 
                                               shopSettings.gatewayConfig?.pagSeguro?.email && 
                                               shopSettings.gatewayConfig?.pagSeguro?.token);
                           } else if (method.gateway === 'stripe') {
                              isConfigured = !!(shopSettings.gatewayConfig?.stripe?.enabled && 
                                               shopSettings.gatewayConfig?.stripe?.publishableKey && 
                                               shopSettings.gatewayConfig?.stripe?.secretKey);
                           } else if (method.gateway === 'any') {
                              // Cartão requer pelo menos um gateway configurado
                              isConfigured = !!(
                                 (shopSettings.gatewayConfig?.mercadoPago?.enabled && shopSettings.gatewayConfig?.mercadoPago?.publicKey) ||
                                 (shopSettings.gatewayConfig?.pagSeguro?.enabled && shopSettings.gatewayConfig?.pagSeguro?.email) ||
                                 (shopSettings.gatewayConfig?.stripe?.enabled && shopSettings.gatewayConfig?.stripe?.publishableKey)
                              );
                           } else if (method.value === PaymentMethod.PIX) {
                              isConfigured = !!(shopSettings.pixConfig?.key && shopSettings.pixConfig?.beneficiaryName);
                           }
                           
                           const canEnable = !method.requiresGateway || isConfigured;
                           
                           return (
                              <button
                                 key={method.value}
                                 onClick={() => {
                                    if (!canEnable) {
                                       alert(`Configure um gateway de pagamento primeiro na seção "Integrações de Gateway" abaixo.`);
                                       return;
                                    }
                                    const current = shopSettings.paymentSettings?.online || [];
                                    const updated = isEnabled 
                                       ? current.filter(m => m !== method.value)
                                       : [...current, method.value];
                                    updateShopSettings({ 
                                       paymentSettings: { 
                                          ...shopSettings.paymentSettings,
                                          inStore: shopSettings.paymentSettings?.inStore || [],
                                          online: updated
                                       } 
                                    });
                                 }}
                                 className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                                    isEnabled && canEnable
                                       ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                                       : !canEnable
                                       ? 'bg-zinc-900 border-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed'
                                       : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                 }`}
                                 disabled={!canEnable}
                              >
                                 <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{method.label}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    {!canEnable && (
                                       <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">Não Configurado</span>
                                    )}
                                    {isEnabled && canEnable && <Zap className="w-4 h-4 text-blue-500" />}
                                 </div>
                              </button>
                           );
                        })}
                     </div>
                  </div>
               </div>

               {/* INFO BOX */}
               <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex gap-3">
                     <Wallet className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                     <div className="text-sm">
                        <p className="text-amber-200 font-bold mb-1">Importante sobre Integrações</p>
                        <p className="text-amber-300/80 text-xs">
                           Configure abaixo suas integrações de pagamento para aceitar pagamentos online.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* GATEWAY INTEGRATIONS */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6">
               <div className="mb-6">
                  <h3 className="text-white font-bold text-2xl flex items-center gap-2 mb-2">
                    <Zap className="w-6 h-6 text-amber-500" /> Integrações de Gateway
                  </h3>
                  <p className="text-zinc-400">
                     Configure suas credenciais de API para processar pagamentos online.
                  </p>
               </div>

               <div className="space-y-4">
                  {/* MERCADO PAGO */}
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <Wallet className="w-5 h-5 text-blue-500" />
                           </div>
                           <div>
                              <h4 className="font-bold text-white">Mercado Pago</h4>
                              <p className="text-xs text-zinc-500">Gateway de pagamento da América Latina</p>
                           </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                              type="checkbox" 
                              checked={shopSettings.gatewayConfig?.mercadoPago?.enabled ?? false}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    mercadoPago: {
                                       ...shopSettings.gatewayConfig?.mercadoPago,
                                       enabled: e.target.checked,
                                       publicKey: shopSettings.gatewayConfig?.mercadoPago?.publicKey || '',
                                       accessToken: shopSettings.gatewayConfig?.mercadoPago?.accessToken || ''
                                    }
                                 }
                              })}
                              className="sr-only peer" 
                           />
                           <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Public Key</label>
                           <input 
                              type="text" 
                              value={shopSettings.gatewayConfig?.mercadoPago?.publicKey || ''}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    mercadoPago: {
                                       ...shopSettings.gatewayConfig?.mercadoPago,
                                       enabled: shopSettings.gatewayConfig?.mercadoPago?.enabled ?? false,
                                       publicKey: e.target.value,
                                       accessToken: shopSettings.gatewayConfig?.mercadoPago?.accessToken || ''
                                    }
                                 }
                              })}
                              placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Access Token</label>
                           <input 
                              type="password" 
                              value={shopSettings.gatewayConfig?.mercadoPago?.accessToken || ''}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    mercadoPago: {
                                       ...shopSettings.gatewayConfig?.mercadoPago,
                                       enabled: shopSettings.gatewayConfig?.mercadoPago?.enabled ?? false,
                                       publicKey: shopSettings.gatewayConfig?.mercadoPago?.publicKey || '',
                                       accessToken: e.target.value
                                    }
                                 }
                              })}
                              placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm focus:border-blue-500 outline-none"
                           />
                        </div>
                     </div>
                  </div>

                  {/* PAGSEGURO */}
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                              <Wallet className="w-5 h-5 text-emerald-500" />
                           </div>
                           <div>
                              <h4 className="font-bold text-white">PagSeguro</h4>
                              <p className="text-xs text-zinc-500">Gateway do UOL para pagamentos</p>
                           </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                              type="checkbox" 
                              checked={shopSettings.gatewayConfig?.pagSeguro?.enabled ?? false}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    pagSeguro: {
                                       ...shopSettings.gatewayConfig?.pagSeguro,
                                       enabled: e.target.checked,
                                       email: shopSettings.gatewayConfig?.pagSeguro?.email || '',
                                       token: shopSettings.gatewayConfig?.pagSeguro?.token || ''
                                    }
                                 }
                              })}
                              className="sr-only peer" 
                           />
                           <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Email</label>
                           <input 
                              type="email" 
                              value={shopSettings.gatewayConfig?.pagSeguro?.email || ''}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    pagSeguro: {
                                       ...shopSettings.gatewayConfig?.pagSeguro,
                                       enabled: shopSettings.gatewayConfig?.pagSeguro?.enabled ?? false,
                                       email: e.target.value,
                                       token: shopSettings.gatewayConfig?.pagSeguro?.token || ''
                                    }
                                 }
                              })}
                              placeholder="seu-email@pagseguro.com.br"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm focus:border-emerald-500 outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Token</label>
                           <input 
                              type="password" 
                              value={shopSettings.gatewayConfig?.pagSeguro?.token || ''}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    pagSeguro: {
                                       ...shopSettings.gatewayConfig?.pagSeguro,
                                       enabled: shopSettings.gatewayConfig?.pagSeguro?.enabled ?? false,
                                       email: shopSettings.gatewayConfig?.pagSeguro?.email || '',
                                       token: e.target.value
                                    }
                                 }
                              })}
                              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm focus:border-emerald-500 outline-none"
                           />
                        </div>
                     </div>
                  </div>

                  {/* STRIPE */}
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                              <Wallet className="w-5 h-5 text-purple-500" />
                           </div>
                           <div>
                              <h4 className="font-bold text-white">Stripe</h4>
                              <p className="text-xs text-zinc-500">Gateway internacional de pagamentos</p>
                           </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                              type="checkbox" 
                              checked={shopSettings.gatewayConfig?.stripe?.enabled ?? false}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    stripe: {
                                       ...shopSettings.gatewayConfig?.stripe,
                                       enabled: e.target.checked,
                                       publishableKey: shopSettings.gatewayConfig?.stripe?.publishableKey || '',
                                       secretKey: shopSettings.gatewayConfig?.stripe?.secretKey || ''
                                    }
                                 }
                              })}
                              className="sr-only peer" 
                           />
                           <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Publishable Key</label>
                           <input 
                              type="text" 
                              value={shopSettings.gatewayConfig?.stripe?.publishableKey || ''}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    stripe: {
                                       ...shopSettings.gatewayConfig?.stripe,
                                       enabled: shopSettings.gatewayConfig?.stripe?.enabled ?? false,
                                       publishableKey: e.target.value,
                                       secretKey: shopSettings.gatewayConfig?.stripe?.secretKey || ''
                                    }
                                 }
                              })}
                              placeholder="pk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm focus:border-purple-500 outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Secret Key</label>
                           <input 
                              type="password" 
                              value={shopSettings.gatewayConfig?.stripe?.secretKey || ''}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    stripe: {
                                       ...shopSettings.gatewayConfig?.stripe,
                                       enabled: shopSettings.gatewayConfig?.stripe?.enabled ?? false,
                                       publishableKey: shopSettings.gatewayConfig?.stripe?.publishableKey || '',
                                       secretKey: e.target.value
                                    }
                                 }
                              })}
                              placeholder="sk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm focus:border-purple-500 outline-none"
                           />
                        </div>
                     </div>
                  </div>

                  {/* INFINITEPAY */}
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                              <Wallet className="w-5 h-5 text-orange-500" />
                           </div>
                           <div>
                              <h4 className="font-bold text-white">InfinitePay</h4>
                              <p className="text-xs text-zinc-500">Maquininha e gateway brasileiro</p>
                           </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                              type="checkbox" 
                              checked={shopSettings.gatewayConfig?.infinitePay?.enabled ?? false}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    infinitePay: {
                                       ...shopSettings.gatewayConfig?.infinitePay,
                                       enabled: e.target.checked,
                                       apiKey: shopSettings.gatewayConfig?.infinitePay?.apiKey || '',
                                       appKey: shopSettings.gatewayConfig?.infinitePay?.appKey || ''
                                    }
                                 }
                              })}
                              className="sr-only peer" 
                           />
                           <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">API Key</label>
                           <input 
                              type="text" 
                              value={shopSettings.gatewayConfig?.infinitePay?.apiKey || ''}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    infinitePay: {
                                       ...shopSettings.gatewayConfig?.infinitePay,
                                       enabled: shopSettings.gatewayConfig?.infinitePay?.enabled ?? false,
                                       apiKey: e.target.value,
                                       appKey: shopSettings.gatewayConfig?.infinitePay?.appKey || ''
                                    }
                                 }
                              })}
                              placeholder="inf_api_xxxxxxxxxxxxxxxxxxxxxxxx"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm focus:border-orange-500 outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">App Key</label>
                           <input 
                              type="password" 
                              value={shopSettings.gatewayConfig?.infinitePay?.appKey || ''}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    infinitePay: {
                                       ...shopSettings.gatewayConfig?.infinitePay,
                                       enabled: shopSettings.gatewayConfig?.infinitePay?.enabled ?? false,
                                       apiKey: shopSettings.gatewayConfig?.infinitePay?.apiKey || '',
                                       appKey: e.target.value
                                    }
                                 }
                              })}
                              placeholder="inf_app_xxxxxxxxxxxxxxxxxxxxxxxx"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm focus:border-orange-500 outline-none"
                           />
                        </div>
                     </div>
                  </div>

                  {/* STONE */}
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                              <Wallet className="w-5 h-5 text-green-500" />
                           </div>
                           <div>
                              <h4 className="font-bold text-white">Stone</h4>
                              <p className="text-xs text-zinc-500">Maquininha e gateway Stone</p>
                           </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                              type="checkbox" 
                              checked={shopSettings.gatewayConfig?.stone?.enabled ?? false}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    stone: {
                                       ...shopSettings.gatewayConfig?.stone,
                                       enabled: e.target.checked,
                                       stoneCode: shopSettings.gatewayConfig?.stone?.stoneCode || '',
                                       apiKey: shopSettings.gatewayConfig?.stone?.apiKey || ''
                                    }
                                 }
                              })}
                              className="sr-only peer" 
                           />
                           <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Stone Code</label>
                           <input 
                              type="text" 
                              value={shopSettings.gatewayConfig?.stone?.stoneCode || ''}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    stone: {
                                       ...shopSettings.gatewayConfig?.stone,
                                       enabled: shopSettings.gatewayConfig?.stone?.enabled ?? false,
                                       stoneCode: e.target.value,
                                       apiKey: shopSettings.gatewayConfig?.stone?.apiKey || ''
                                    }
                                 }
                              })}
                              placeholder="stone_xxxxxxxxxxxxxxxx"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm focus:border-green-500 outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">API Key</label>
                           <input 
                              type="password" 
                              value={shopSettings.gatewayConfig?.stone?.apiKey || ''}
                              onChange={(e) => updateShopSettings({
                                 gatewayConfig: {
                                    ...shopSettings.gatewayConfig,
                                    stone: {
                                       ...shopSettings.gatewayConfig?.stone,
                                       enabled: shopSettings.gatewayConfig?.stone?.enabled ?? false,
                                       stoneCode: shopSettings.gatewayConfig?.stone?.stoneCode || '',
                                       apiKey: e.target.value
                                    }
                                 }
                              })}
                              placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxx"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm focus:border-green-500 outline-none"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* PIX CONFIGURATION */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6">
               <div className="mb-6">
                  <h3 className="text-white font-bold text-2xl flex items-center gap-2 mb-2">
                    <Smartphone className="w-6 h-6 text-emerald-500" /> Configuração PIX
                  </h3>
                  <p className="text-zinc-400">
                     Configure sua chave PIX para receber pagamentos instantâneos.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Tipo de Chave</label>
                        <select 
                           value={shopSettings.pixConfig?.keyType || 'CPF'}
                           onChange={(e) => updateShopSettings({
                              pixConfig: {
                                 ...shopSettings.pixConfig,
                                 keyType: e.target.value as any,
                                 key: shopSettings.pixConfig?.key || '',
                                 beneficiaryName: shopSettings.pixConfig?.beneficiaryName || ''
                              }
                           })}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-emerald-500 outline-none"
                        >
                           <option value="CPF">CPF/CNPJ</option>
                           <option value="EMAIL">E-mail</option>
                           <option value="PHONE">Telefone</option>
                           <option value="RANDOM">Chave Aleatória</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Chave PIX</label>
                        <input 
                           type="text" 
                           value={shopSettings.pixConfig?.key || ''}
                           onChange={(e) => updateShopSettings({
                              pixConfig: {
                                 ...shopSettings.pixConfig,
                                 keyType: shopSettings.pixConfig?.keyType || 'CPF',
                                 key: e.target.value,
                                 beneficiaryName: shopSettings.pixConfig?.beneficiaryName || ''
                              }
                           })}
                           placeholder="Digite sua chave PIX"
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-emerald-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Nome do Beneficiário</label>
                        <input 
                           type="text" 
                           value={shopSettings.pixConfig?.beneficiaryName || ''}
                           onChange={(e) => updateShopSettings({
                              pixConfig: {
                                 ...shopSettings.pixConfig,
                                 keyType: shopSettings.pixConfig?.keyType || 'CPF',
                                 key: shopSettings.pixConfig?.key || '',
                                 beneficiaryName: e.target.value
                              }
                           })}
                           placeholder="Nome completo ou Razão Social"
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-emerald-500 outline-none"
                        />
                     </div>
                  </div>
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
                     {shopSettings.pixConfig?.key && shopSettings.pixConfig?.beneficiaryName ? (
                        <>
                           <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mb-4 p-2">
                              <QRCodeSVG 
                                 value={generatePixPayload({
                                    pixKey: shopSettings.pixConfig.key,
                                    beneficiaryName: shopSettings.pixConfig.beneficiaryName,
                                    city: shopProfile.address?.split(',')[1]?.trim() || 'SAO PAULO'
                                 })}
                                 size={176}
                                 level="M"
                              />
                           </div>
                           <button 
                              onClick={() => {
                                 const payload = generatePixPayload({
                                    pixKey: shopSettings.pixConfig!.key,
                                    beneficiaryName: shopSettings.pixConfig!.beneficiaryName,
                                    city: shopProfile.address?.split(',')[1]?.trim() || 'SAO PAULO'
                                 });
                                 navigator.clipboard.writeText(payload);
                                 alert(t('settings.alerts.pixCodeCopied'));
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg transition-all"
                           >
                              <Copy className="w-4 h-4" /> Copiar Código PIX
                           </button>
                        </>
                     ) : (
                        <div className="text-center py-12">
                           <Smartphone className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                           <p className="text-zinc-500 text-sm font-bold">Configure sua chave PIX</p>
                           <p className="text-zinc-600 text-xs">Preencha os campos ao lado para gerar o QR Code</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* PAYMENT SETTINGS */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6">
               <div className="mb-6">
                  <h3 className="text-white font-bold text-2xl flex items-center gap-2 mb-2">
                    <CreditCard className="w-6 h-6 text-amber-500" /> Configurações de Parcelamento
                  </h3>
                  <p className="text-zinc-400">
                     Defina as regras de parcelamento para cartão de crédito.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Parcelas Máximas</label>
                        <select 
                           value={shopSettings.installmentConfig?.maxInstallments || 1}
                           onChange={(e) => updateShopSettings({
                              installmentConfig: {
                                 ...shopSettings.installmentConfig,
                                 maxInstallments: Number(e.target.value),
                                 minInstallmentValue: shopSettings.installmentConfig?.minInstallmentValue || 50,
                                 chargeInterest: shopSettings.installmentConfig?.chargeInterest || false,
                                 interestRate: shopSettings.installmentConfig?.interestRate || 0
                              }
                           })}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                        >
                           <option value={1}>1x (À vista)</option>
                           <option value={2}>2x</option>
                           <option value={3}>3x</option>
                           <option value={4}>4x</option>
                           <option value={6}>6x</option>
                           <option value={12}>12x</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Valor Mínimo por Parcela</label>
                        <div className="flex items-center gap-2">
                           <span className="text-zinc-400 font-bold">R$</span>
                           <input 
                              type="number" 
                              value={shopSettings.installmentConfig?.minInstallmentValue || 50}
                              onChange={(e) => updateShopSettings({
                                 installmentConfig: {
                                    ...shopSettings.installmentConfig,
                                    maxInstallments: shopSettings.installmentConfig?.maxInstallments || 1,
                                    minInstallmentValue: Number(e.target.value),
                                    chargeInterest: shopSettings.installmentConfig?.chargeInterest || false,
                                    interestRate: shopSettings.installmentConfig?.interestRate || 0
                                 }
                              })}
                              placeholder="50.00"
                              step="0.01"
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                           />
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                        <div>
                           <p className="text-white font-bold text-sm">Juros de Parcelamento</p>
                           <p className="text-xs text-zinc-500">Cobrar juros nas parcelas</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                              type="checkbox" 
                              checked={shopSettings.installmentConfig?.chargeInterest || false}
                              onChange={(e) => updateShopSettings({
                                 installmentConfig: {
                                    ...shopSettings.installmentConfig,
                                    maxInstallments: shopSettings.installmentConfig?.maxInstallments || 1,
                                    minInstallmentValue: shopSettings.installmentConfig?.minInstallmentValue || 50,
                                    chargeInterest: e.target.checked,
                                    interestRate: shopSettings.installmentConfig?.interestRate || 0
                                 }
                              })}
                              className="sr-only peer" 
                           />
                           <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Taxa de Juros (% ao mês)</label>
                        <div className="flex items-center gap-2">
                           <input 
                              type="number" 
                              value={shopSettings.installmentConfig?.interestRate || 0}
                              onChange={(e) => updateShopSettings({
                                 installmentConfig: {
                                    ...shopSettings.installmentConfig,
                                    maxInstallments: shopSettings.installmentConfig?.maxInstallments || 1,
                                    minInstallmentValue: shopSettings.installmentConfig?.minInstallmentValue || 50,
                                    chargeInterest: shopSettings.installmentConfig?.chargeInterest || false,
                                    interestRate: Number(e.target.value)
                                 }
                              })}
                              placeholder="2.99"
                              step="0.01"
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                           />
                           <span className="text-zinc-400 font-bold">%</span>
                        </div>
                     </div>
                     <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-blue-200 font-bold text-sm mb-1">Exemplo de Parcelamento</p>
                        <p className="text-blue-300/80 text-xs">
                           Compra de R$ 100,00 em 3x = R$ 33,33 + juros
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* BANK ACCOUNT */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6">
               <div className="mb-6">
                  <h3 className="text-white font-bold text-2xl flex items-center gap-2 mb-2">
                    <Briefcase className="w-6 h-6 text-amber-500" /> Conta para Recebimento
                  </h3>
                  <p className="text-zinc-400">
                     Configure a conta bancária onde deseja receber os pagamentos.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Banco</label>
                     <select 
                        value={shopSettings.bankAccount?.bank || ''}
                        onChange={(e) => updateShopSettings({
                           bankAccount: {
                              ...shopSettings.bankAccount,
                              bank: e.target.value,
                              accountType: shopSettings.bankAccount?.accountType || 'CHECKING',
                              agency: shopSettings.bankAccount?.agency || '',
                              account: shopSettings.bankAccount?.account || '',
                              accountHolder: shopSettings.bankAccount?.accountHolder || '',
                              holderDocument: shopSettings.bankAccount?.holderDocument || ''
                           }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                     >
                        <option value="">Selecione o banco</option>
                        <option value="001">001 - Banco do Brasil</option>
                        <option value="104">104 - Caixa Econômica</option>
                        <option value="237">237 - Bradesco</option>
                        <option value="341">341 - Itaú</option>
                        <option value="033">033 - Santander</option>
                        <option value="260">260 - Nubank</option>
                        <option value="077">077 - Inter</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Tipo de Conta</label>
                     <select 
                        value={shopSettings.bankAccount?.accountType || 'CHECKING'}
                        onChange={(e) => updateShopSettings({
                           bankAccount: {
                              ...shopSettings.bankAccount,
                              bank: shopSettings.bankAccount?.bank || '',
                              accountType: e.target.value as any,
                              agency: shopSettings.bankAccount?.agency || '',
                              account: shopSettings.bankAccount?.account || '',
                              accountHolder: shopSettings.bankAccount?.accountHolder || '',
                              holderDocument: shopSettings.bankAccount?.holderDocument || ''
                           }
                        })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                     >
                        <option value="CHECKING">Conta Corrente</option>
                        <option value="SAVINGS">Conta Poupança</option>
                        <option value="PAYMENT">Conta Pagamento</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Agência</label>
                     <input 
                        type="text" 
                        value={shopSettings.bankAccount?.agency || ''}
                        onChange={(e) => updateShopSettings({
                           bankAccount: {
                              ...shopSettings.bankAccount,
                              bank: shopSettings.bankAccount?.bank || '',
                              accountType: shopSettings.bankAccount?.accountType || 'CHECKING',
                              agency: e.target.value,
                              account: shopSettings.bankAccount?.account || '',
                              accountHolder: shopSettings.bankAccount?.accountHolder || '',
                              holderDocument: shopSettings.bankAccount?.holderDocument || ''
                           }
                        })}
                        placeholder="0001"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Conta</label>
                     <input 
                        type="text" 
                        value={shopSettings.bankAccount?.account || ''}
                        onChange={(e) => updateShopSettings({
                           bankAccount: {
                              ...shopSettings.bankAccount,
                              bank: shopSettings.bankAccount?.bank || '',
                              accountType: shopSettings.bankAccount?.accountType || 'CHECKING',
                              agency: shopSettings.bankAccount?.agency || '',
                              account: e.target.value,
                              accountHolder: shopSettings.bankAccount?.accountHolder || '',
                              holderDocument: shopSettings.bankAccount?.holderDocument || ''
                           }
                        })}
                        placeholder="12345-6"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                     />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Titular da Conta</label>
                     <input 
                        type="text" 
                        value={shopSettings.bankAccount?.accountHolder || ''}
                        onChange={(e) => updateShopSettings({
                           bankAccount: {
                              ...shopSettings.bankAccount,
                              bank: shopSettings.bankAccount?.bank || '',
                              accountType: shopSettings.bankAccount?.accountType || 'CHECKING',
                              agency: shopSettings.bankAccount?.agency || '',
                              account: shopSettings.bankAccount?.account || '',
                              accountHolder: e.target.value,
                              holderDocument: shopSettings.bankAccount?.holderDocument || ''
                           }
                        })}
                        placeholder="Nome completo do titular"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                     />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">CPF/CNPJ do Titular</label>
                     <input 
                        type="text" 
                        value={shopSettings.bankAccount?.holderDocument || ''}
                        onChange={(e) => updateShopSettings({
                           bankAccount: {
                              ...shopSettings.bankAccount,
                              bank: shopSettings.bankAccount?.bank || '',
                              accountType: shopSettings.bankAccount?.accountType || 'CHECKING',
                              agency: shopSettings.bankAccount?.agency || '',
                              account: shopSettings.bankAccount?.account || '',
                              accountHolder: shopSettings.bankAccount?.accountHolder || '',
                              holderDocument: e.target.value
                           }
                        })}
                        placeholder="000.000.000-00"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                     />
                  </div>
               </div>

               <div className="mt-6 flex justify-end">
                  <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition-all">
                     <Save className="w-4 h-4" /> Salvar Configurações
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* --- COMMISSIONS TAB --- */}
        {activeTab === 'COMMISSIONS' && isOwner && (
          <div className="space-y-8 animate-fade-in">
            {/* QUALITY ASSURANCE & TIPS - NEW */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
               <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
                  <div>
                     <h3 className="text-white font-bold text-lg flex items-center gap-2">
                       <ThumbsUp className="w-5 h-5 text-amber-500" /> Garantia de Qualidade e Gorjetas
                     </h3>
                     <p className="text-zinc-400 text-sm mt-1 max-w-xl">
                        Envie automaticamente links de pesquisa para clientes após atendimentos.
                        <br/><span className="text-xs text-zinc-500">Coleta feedback (1-5 estrelas) e sugere gorjeta para bom serviço.</span>
                     </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                     <input 
                        type="checkbox" 
                        checked={shopSettings.enableTipsReview}
                        onChange={(e) => updateShopSettings({ enableTipsReview: e.target.checked })}
                        className="sr-only peer"
                     />
                     <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
               </div>
               
               {shopSettings.enableTipsReview && (
                  <div className="mt-4 bg-zinc-950/50 rounded-lg p-4 text-xs text-zinc-400 border border-zinc-800 flex gap-4">
                     <div className="flex-1">
                        <span className="font-bold text-white block mb-1">Fluxo:</span>
                        1. Serviço Concluído {'>'} 2. Botão &quot;Enviar Link&quot; aparece no Painel {'>'} 3. Cliente avalia (Estrelas) {'>'} 4. Se Bom {'>'} 5. Pedir Gorjeta.
                     </div>
                     <div className="flex-1 border-l border-zinc-800 pl-4">
                        <span className="font-bold text-white block mb-1">Impacto:</span>
                        Aumenta ganhos da equipe e captura experiências ruins privadamente antes de chegarem ao Google.
                     </div>
                  </div>
               )}
            </div>

            {/* QUEUE DISTRIBUTION RULE */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
               <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                 <UserMinus className="w-5 h-5 text-amber-500" /> Lógica de Distribuição de Clientes Sem Agendamento
               </h3>
               <p className="text-zinc-400 text-sm mb-6">
                  Como o sistema deve atribuir ou recomendar automaticamente profissionais para clientes sem agendamento (novos/anônimos)?
               </p>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                     onClick={() => updateShopSettings({ queueDistributionRule: 'FAIRNESS' })}
                     className={`p-4 rounded-xl border flex flex-col gap-2 transition-all text-left ${shopSettings.queueDistributionRule === 'FAIRNESS' ? 'bg-zinc-800 border-amber-500 ring-1 ring-amber-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                  >
                     <div className="flex justify-between w-full">
                        <span className={`font-bold ${shopSettings.queueDistributionRule === 'FAIRNESS' ? 'text-amber-500' : 'text-white'}`}>FAIRNESS (Rodízio)</span>
                        {shopSettings.queueDistributionRule === 'FAIRNESS' && <Zap className="w-4 h-4 text-amber-500" />}
                     </div>
                     <p className="text-xs text-zinc-400">Prioriza profissional com MENOS cortes hoje. Equilibra a carga de trabalho para todos ganharem.</p>
                  </button>

                  <button 
                     onClick={() => updateShopSettings({ queueDistributionRule: 'SPEED' })}
                     className={`p-4 rounded-xl border flex flex-col gap-2 transition-all text-left ${shopSettings.queueDistributionRule === 'SPEED' ? 'bg-zinc-800 border-emerald-500 ring-1 ring-emerald-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                  >
                     <div className="flex justify-between w-full">
                        <span className={`font-bold ${shopSettings.queueDistributionRule === 'SPEED' ? 'text-emerald-500' : 'text-white'}`}>VELOCIDADE (Mais Rápido)</span>
                        {shopSettings.queueDistributionRule === 'SPEED' && <Zap className="w-4 h-4 text-emerald-500" />}
                     </div>
                     <p className="text-xs text-zinc-400">Prioriza profissional LIVRE PRIMEIRO. Minimiza tempo de espera do cliente acima de tudo.</p>
                  </button>

                  <button 
                     onClick={() => updateShopSettings({ queueDistributionRule: 'MANUAL' })}
                     className={`p-4 rounded-xl border flex flex-col gap-2 transition-all text-left ${shopSettings.queueDistributionRule === 'MANUAL' ? 'bg-zinc-800 border-blue-500 ring-1 ring-blue-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                  >
                     <div className="flex justify-between w-full">
                        <span className={`font-bold ${shopSettings.queueDistributionRule === 'MANUAL' ? 'text-blue-500' : 'text-white'}`}>MANUAL</span>
                        {shopSettings.queueDistributionRule === 'MANUAL' && <Zap className="w-4 h-4 text-blue-500" />}
                     </div>
                     <p className="text-xs text-zinc-400">Sem recomendação automática. Recepcionista escolhe baseado na situação.</p>
                  </button>
               </div>
            </div>

            {/* DISCOUNT LIABILITY RULE */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div>
                     <h3 className="text-white font-bold text-lg flex items-center gap-2">
                       <Scale className="w-5 h-5 text-amber-500" /> Regra de Responsabilidade por Desconto (Quem paga o prejuízo?)
                     </h3>
                     <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
                        Quando você dá um desconto (Aniversário, Fidelidade, etc), quem ganha menos?
                        <br/><span className="text-xs text-zinc-500">Define como a comissão da equipe é calculada em vendas com desconto.</span>
                     </p>
                  </div>

                  <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                     <button 
                        onClick={() => updateShopSettings({ discountAllocation: 'SHARED' })}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center ${
                           shopSettings.discountAllocation === 'SHARED' 
                           ? 'bg-zinc-800 text-white shadow-lg' 
                           : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                     >
                        <span>COMPARTILHADO (Dividido)</span>
                        <span className="text-[9px] opacity-60 font-normal">Comissão sobre Preço Líquido</span>
                     </button>
                     <button 
                        onClick={() => updateShopSettings({ discountAllocation: 'SHOP_ABSORBS' })}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center ${
                           shopSettings.discountAllocation === 'SHOP_ABSORBS' 
                           ? 'bg-emerald-500 text-zinc-900 shadow-lg' 
                           : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                     >
                        <span>LOJA ABSORVE</span>
                        <span className="text-[9px] opacity-60 font-normal">Comissão sobre Preço Cheio</span>
                     </button>
                  </div>
               </div>
               
               {/* Explanation Visual */}
               <div className="mt-4 bg-zinc-950/50 rounded-lg p-3 text-xs text-zinc-400 border border-zinc-800/50">
                  <span className="font-bold text-amber-500">Exemplo:</span> Serviço de R$ 50 com R$ 10 de Desconto (R$ 40 Pago). Profissional tem 50% de comissão.
                  <ul className="list-disc list-inside mt-1 space-y-1">
                     <li className={shopSettings.discountAllocation === 'SHARED' ? 'text-white font-bold' : ''}>
                        <b>Compartilhado:</b> Profissional recebe 50% de R$ 40 = <span className="text-white">R$ 20,00</span>. (Ambos perdem R$ 5).
                     </li>
                     <li className={shopSettings.discountAllocation === 'SHOP_ABSORBS' ? 'text-white font-bold' : ''}>
                        <b>Loja Absorve:</b> Profissional recebe 50% de R$ 50 = <span className="text-white">R$ 25,00</span>. (Loja perde R$ 10 completos).
                     </li>
                  </ul>
               </div>
            </div>

            {/* GROWTH & MARKETING RULES */}
            <div>
               <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-amber-500" /> Marketing e Fidelidade
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Goal Setting */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <Target className="w-4 h-4 text-emerald-500" />
                           <h4 className="font-bold text-white">Daily Revenue Goal</h4>
                        </div>
                        <p className="text-xs text-zinc-500">Team target for Dashboard.</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-zinc-400 font-bold">$</span>
                         <input 
                            type="number" 
                            value={shopSettings.dailyRevenueGoal}
                            onChange={(e) => updateShopSettings({ dailyRevenueGoal: Number(e.target.value) })}
                            className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white font-bold focus:border-amber-500 outline-none text-center"
                         />
                      </div>
                  </div>

                  {/* FIDELITY THRESHOLD (NEW) */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <Link className="w-4 h-4 text-amber-500" />
                           <h4 className="font-bold text-white">Client Fidelity Lock</h4>
                        </div>
                        <p className="text-xs text-zinc-500">Consecutive visits to secure client.</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <input 
                            type="number" 
                            min="1" 
                            max="10"
                            value={shopSettings.fidelityThreshold || 2}
                            onChange={(e) => updateShopSettings({ fidelityThreshold: Number(e.target.value) })}
                            className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white font-bold focus:border-amber-500 outline-none text-center"
                         />
                         <span className="text-xs font-bold text-zinc-500">visits</span>
                      </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Win-Back */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                          <CalendarClock className="w-4 h-4 text-zinc-400" />
                          <h4 className="font-bold text-white">Win-Back Campaign</h4>
                       </div>
                       <p className="text-xs text-zinc-500">Auto 5% discount for clients away for {shopSettings.winBackDays}+ days.</p>
                     </div>
                     <div className="flex items-center">
                        <input 
                           type="checkbox" 
                           checked={shopSettings.enableWinBackDiscount}
                           onChange={(e) => updateShopSettings({ enableWinBackDiscount: e.target.checked })}
                           className="w-5 h-5 accent-amber-500"
                        />
                     </div>
                  </div>

                  {/* Birthday */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                          <Gift className="w-4 h-4 text-zinc-400" />
                          <h4 className="font-bold text-white">Birthday Special</h4>
                       </div>
                       <p className="text-xs text-zinc-500">Auto 5% discount on client&apos;s birthday.</p>
                     </div>
                     <div className="flex items-center">
                        <input 
                           type="checkbox" 
                           checked={shopSettings.enableBirthdayDiscount}
                           onChange={(e) => updateShopSettings({ enableBirthdayDiscount: e.target.checked })}
                           className="w-5 h-5 accent-amber-500"
                        />
                     </div>
                  </div>

                  {/* Loyalty Card */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-zinc-400" />
                          <h4 className="font-bold text-white">Loyalty Club (10x1)</h4>
                       </div>
                       <p className="text-xs text-zinc-500">10 stamps = Reward. +2 stamps for complete profile.</p>
                     </div>
                     <div className="flex items-center">
                        <input 
                           type="checkbox" 
                           checked={shopSettings.enableLoyaltyCard}
                           onChange={(e) => updateShopSettings({ enableLoyaltyCard: e.target.checked })}
                           className="w-5 h-5 accent-amber-500"
                        />
                     </div>
                  </div>

                  {/* Referral System */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                          <Share2 className="w-4 h-4 text-zinc-400" />
                          <h4 className="font-bold text-white">Referral System</h4>
                       </div>
                       <p className="text-xs text-zinc-500">Referrer gets 1 stamp when friend cuts for first time.</p>
                     </div>
                     <div className="flex items-center">
                        <input 
                           type="checkbox" 
                           checked={shopSettings.enableReferralSystem}
                           onChange={(e) => updateShopSettings({ enableReferralSystem: e.target.checked })}
                           className="w-5 h-5 accent-amber-500"
                        />
                     </div>
                  </div>
               </div>

               {/* Communication & Alerts Config */}
               <div className="mt-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-500" /> Communication & Alerts
                  </h3>
                  
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                     {/* Standard Return Cycle */}
                     <div className="flex flex-col md:flex-row gap-6 border-b border-zinc-800 pb-6">
                        <div className="flex-1">
                           <h4 className="font-bold text-white mb-2">Cycle 1: Standard Return</h4>
                           <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm text-zinc-400">Trigger after</span>
                              <input 
                                type="number" 
                                value={shopSettings.returnReminderDays}
                                onChange={(e) => updateShopSettings({ returnReminderDays: Number(e.target.value) })}
                                className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg py-1 px-2 text-white text-center font-bold text-sm focus:border-amber-500 outline-none"
                              />
                              <span className="text-sm text-zinc-400">days</span>
                           </div>
                           <p className="text-xs text-amber-500 mb-2">Visual: Orange (approaching) &rarr; Red text (overdue)</p>
                        </div>
                        <div className="flex-[2]">
                           <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Message Template (Standard)</label>
                           <textarea 
                              value={shopSettings.messageTemplateOverdue}
                              onChange={(e) => updateShopSettings({ messageTemplateOverdue: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:border-amber-500 outline-none h-24 resize-none"
                           />
                           <p className="text-[10px] text-zinc-600 mt-1">Variables: {'{name}'}, {'{days}'}, {'{booking_link}'}</p>
                        </div>
                     </div>

                     {/* Win-Back Cycle */}
                     <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                           <h4 className="font-bold text-white mb-2">Cycle 2: Win-Back (Risk)</h4>
                           <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm text-zinc-400">Trigger after</span>
                              <input 
                                type="number" 
                                value={shopSettings.winBackDays}
                                onChange={(e) => updateShopSettings({ winBackDays: Number(e.target.value) })}
                                className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg py-1 px-2 text-white text-center font-bold text-sm focus:border-amber-500 outline-none"
                              />
                              <span className="text-sm text-zinc-400">days</span>
                           </div>
                           <p className="text-xs text-red-500 mb-2">Visual: Red Background (Critical)</p>
                        </div>
                        <div className="flex-[2]">
                           <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Message Template (Win-Back)</label>
                           <textarea 
                              value={shopSettings.messageTemplateWinBack}
                              onChange={(e) => updateShopSettings({ messageTemplateWinBack: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:border-amber-500 outline-none h-24 resize-none"
                           />
                           <p className="text-[10px] text-zinc-600 mt-1">Variables: {'{name}'}, {'{days}'}, {'{booking_link}'}</p>
                        </div>
                     </div>

                  </div>
               </div>
            </div>

            <hr className="border-zinc-800" />
            
            {/* Commission Plans */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">{t('settings.commissionPlans.structuresTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commissionPlans.map(plan => (
                   <div key={plan.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative group hover:border-amber-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                           <h4 className="font-bold text-white text-lg">{plan.name}</h4>
                           <p className="text-zinc-500 text-sm mt-1 h-10">{plan.description || t('settings.commissionPlans.noDescription')}</p>
                         </div>
                         <div className="bg-zinc-800 p-2 rounded-lg">
                           {plan.model === 'PERCENTAGE' ? <Percent className="w-5 h-5 text-emerald-500" /> : <Wallet className="w-5 h-5 text-blue-500" />}
                         </div>
                      </div>

                      <div className="space-y-3 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                         <div className="flex justify-between text-sm">
                           <span className="text-zinc-400">{t('settings.commissionPlans.serviceCommissionLabel')}</span>
                           <span className="text-white font-bold">{plan.serviceRate}%</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className="text-zinc-400">{t('settings.commissionPlans.productCommissionLabel')}</span>
                           <span className="text-white font-bold">{plan.productRate}%</span>
                         </div>
                         {plan.model === 'CHAIR_RENTAL' && (
                           <div className="flex justify-between text-sm pt-2 border-t border-zinc-800 mt-2">
                             <span className="text-zinc-400">{t('settings.commissionPlans.fixedRentLabel')}</span>
                             <span className="text-amber-500 font-bold">{formatCurrency(plan.rentalFee)}</span>
                           </div>
                         )}
                      </div>
                      <button onClick={() => deleteCommissionPlan(plan.id)} className="text-xs text-red-500 mt-4 hover:underline">{t('settings.commissionPlans.removePlanButton')}</button>
                   </div>
                ))}
                
                <button onClick={() => setIsPlanModalOpen(true)} className="border-2 border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-amber-500 hover:border-amber-500 transition-all min-h-[250px]">
                   <Plus className="w-10 h-10 mb-2" />
                   <span className="font-bold">{t('settings.commissionPlans.createNewPlanButton')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EXTRACTED MODALS */}
      <CommissionPlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} />
      <StaffModal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} staffToEdit={editingStaff} />

    </div>
  );
};
