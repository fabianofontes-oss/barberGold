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
import { MaskedInput } from '@/components/shared/MaskedInput';
import { ViaCepResponse } from '@/lib/masks';
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
  const { t, currency, formatCurrency, locale } = useI18n();
  
  const isOwner = currentUser?.role === 'OWNER';
  
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
  const [myProfileForm, setMyProfileForm] = useState<StaffMember | null>(currentUser);
  
  // Update local form when currentUser changes
  useEffect(() => {
     if (!currentUser) {
        setMyProfileForm(null);
        return;
     }
     // Ensure legacy compatibility for breaks
     const safeSchedule = currentUser.workSchedule?.map(day => ({
        ...day,
        breaks: day.breaks || []
     })) || [];
     setMyProfileForm({ ...currentUser, workSchedule: safeSchedule });
  }, [currentUser]);

  if (!currentUser || !myProfileForm) return null;

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

  const baseSunday = new Date(Date.UTC(2021, 0, 3));
  const days = Array.from({ length: 7 }, (_, index) => {
     const date = new Date(baseSunday);
     date.setUTCDate(baseSunday.getUTCDate() + index);
     const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
     return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  });

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{isOwner ? t('settings.header.titleOwner') : t('settings.header.titleStaff')}</h2>
        <p className="text-zinc-400">
           {isOwner ? t('settings.header.descriptionOwner') : t('settings.header.descriptionStaff')}
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
                  <Store className="w-4 h-4" /> {t('settings.tabs.shop')}
                </button>
                 <button
                  onClick={() => setActiveTab('TEAM')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'TEAM' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Users className="w-4 h-4" /> {t('settings.tabs.team')}
                </button>
                <button
                  onClick={() => setActiveTab('PAYMENTS')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'PAYMENTS' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Wallet className="w-4 h-4" /> {t('settings.tabs.payments')}
                </button>
                <button
                  onClick={() => setActiveTab('COMMISSIONS')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'COMMISSIONS' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> {t('settings.tabs.commissions')}
                </button>
                <button
                  onClick={() => setActiveTab('REFERRAL')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'REFERRAL' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Handshake className="w-4 h-4" /> {t('settings.tabs.referral')}
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
              <User className="w-4 h-4" /> {t('settings.tabs.myProfile')}
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
            <Plus className="w-4 h-4" /> {activeTab === 'TEAM' ? t('settings.actions.newMember') : t('settings.actions.newPlan')}
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
                   <Store className="w-5 h-5 text-amber-500" /> {t('settings.shop.basicInfoTitle')}
                </h3>
                
                {/* LOGO UPLOAD SECTION */}
                <div className="mb-6 border-b border-zinc-800 pb-6">
                   <ImageUpload 
                      label={t('settings.shop.logoLabel')} 
                      value={shopProfile.logo} 
                      onChange={(val) => updateShopProfile({ ...shopProfile, logo: val })} 
                      placeholder={t('settings.shop.logoPlaceholder')}
                      className="w-full max-w-xs"
                   />
                   <p className="text-[10px] text-zinc-500 mt-2">
                      {t('settings.shop.logoHelperText')}
                   </p>
                </div>

                <div className="space-y-4">
                   {/* Nome da Barbearia */}
                   <div>
                      <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Nome da Barbearia</label>
                      <input 
                         type="text" 
                         value={shopProfile.name}
                         onChange={(e) => updateShopProfile({ ...shopProfile, name: e.target.value })}
                         className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                         placeholder="Ex: Barbearia do João"
                      />
                   </div>

                   {/* Telefone / Contato */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Telefone / Contato</label>
                         <MaskedInput
                            type="phone"
                            value={shopProfile.phone || ''}
                            onChange={(val) => updateShopProfile({ ...shopProfile, phone: val })}
                            icon={<Phone className="w-4 h-4" />}
                            placeholder="(11) 91234-5678"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">WhatsApp</label>
                         <MaskedInput
                            type="whatsapp"
                            value={shopProfile.whatsapp || ''}
                            onChange={(val) => updateShopProfile({ ...shopProfile, whatsapp: val })}
                            icon={<MessageSquare className="w-4 h-4" />}
                            placeholder="(11) 91234-5678"
                         />
                      </div>
                   </div>

                   {/* Instagram */}
                   <div>
                      <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Instagram</label>
                      <MaskedInput
                         type="instagram"
                         value={shopProfile.instagram || ''}
                         onChange={(val) => updateShopProfile({ ...shopProfile, instagram: val })}
                         icon={<Instagram className="w-4 h-4" />}
                         placeholder="seuperfil"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">Digite apenas o nome de usuário, sem @</p>
                   </div>

                   {/* CEP com busca automática */}
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">CEP</label>
                         <MaskedInput
                            type="cep"
                            value={shopProfile.cep || ''}
                            onChange={(val) => updateShopProfile({ ...shopProfile, cep: val })}
                            onAddressFetched={(address: ViaCepResponse) => {
                               updateShopProfile({
                                  ...shopProfile,
                                  cep: address.cep,
                                  street: address.logradouro,
                                  neighborhood: address.bairro,
                                  city: address.localidade,
                                  state: address.uf,
                                  address: `${address.logradouro}, ${address.bairro}, ${address.localidade} - ${address.uf}`
                               });
                            }}
                            icon={<MapPin className="w-4 h-4" />}
                            placeholder="12345-678"
                         />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Rua</label>
                         <input 
                            type="text" 
                            value={shopProfile.street || ''}
                            onChange={(e) => updateShopProfile({ ...shopProfile, street: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                            placeholder="Rua Reginaldo de Souza Lima"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Número</label>
                         <input 
                            type="text" 
                            value={shopProfile.number || ''}
                            onChange={(e) => updateShopProfile({ ...shopProfile, number: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                            placeholder="712"
                         />
                      </div>
                   </div>

                   {/* Bairro */}
                   <div>
                      <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Bairro</label>
                      <input 
                         type="text" 
                         value={shopProfile.neighborhood || ''}
                         onChange={(e) => updateShopProfile({ ...shopProfile, neighborhood: e.target.value })}
                         className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                         placeholder="Bernardo Monteiro"
                      />
                   </div>

                   {/* Cidade e Estado */}
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Cidade</label>
                         <input 
                            type="text" 
                            value={shopProfile.city || ''}
                            onChange={(e) => updateShopProfile({ ...shopProfile, city: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                            placeholder="São Paulo"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Estado</label>
                         <input 
                            type="text" 
                            value={shopProfile.state || ''}
                            onChange={(e) => updateShopProfile({ ...shopProfile, state: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                            placeholder="SP"
                            maxLength={2}
                         />
                      </div>
                   </div>
                </div>
             </div>

             {/* Share Your Shop */}
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6">
               <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                   <Share2 className="w-5 h-5 text-purple-400" /> {t('settings.shop.shareTitle')}
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                   {t('settings.shop.shareDescription')}
                </p>
                <div className="flex flex-wrap gap-3">
                   <button
                      onClick={() => {
                         const slug = shopProfile.name.replace(/\s/g, '').toLowerCase();
                         const bookingUrl = `${window.location.origin}/book/${slug}`;
                         const text = t('settings.shop.share.whatsappMessage', { shopName: shopProfile.name, bookingUrl });
                         window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all"
                   >
                      <MessageSquare className="w-4 h-4" /> {t('settings.shop.share.whatsappButton')}
                   </button>
                   <button
                      onClick={() => {
                         const slug = shopProfile.name.replace(/\s/g, '').toLowerCase();
                         const url = `${window.location.origin}/book/${slug}`;
                         const text = t('settings.shop.share.facebookQuote', { shopName: shopProfile.name });
                         window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
                   >
                      <Share2 className="w-4 h-4" /> {t('settings.shop.share.facebookButton')}
                   </button>
                   <button
                      onClick={() => {
                         const slug = shopProfile.name.replace(/\s/g, '').toLowerCase();
                         navigator.clipboard.writeText(`${window.location.origin}/book/${slug}`);
                         alert(t('settings.alerts.instagramLinkCopied'));
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-xl transition-all"
                   >
                      <Instagram className="w-4 h-4" /> {t('settings.shop.share.copyInstagramButton')}
                   </button>
                   <button
                      onClick={() => {
                         const slug = shopProfile.name.replace(/\s/g, '').toLowerCase();
                         const link = `${window.location.origin}/book/${slug}`;
                         navigator.clipboard.writeText(link);
                         alert(t('settings.alerts.bookingLinkCopied'));
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl transition-all"
                   >
                      <Link className="w-4 h-4" /> {t('settings.shop.share.copyLinkButton')}
                   </button>
                </div>
             </div>

             {/* Operating Hours */}
             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-500" /> {t('settings.shop.operatingHoursTitle')}
                   </h3>
                   <button 
                      onClick={copyMondayToWeekdays}
                      className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1"
                   >
                      <Copy className="w-3 h-3" /> {t('settings.shop.copyMonToFriButton')}
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
                               <span className="text-sm text-zinc-500 font-medium italic">{t('settings.shop.closedLabel')}</span>
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
                            <span className="block text-xs text-zinc-500 mb-1">{t('settings.team.commissionLabel')}</span>
                            <span className="text-white font-bold">{member.serviceCommissionRate}% / {member.productCommissionRate}%</span>
                         </div>
                         <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <span className="block text-xs text-zinc-500 mb-1">{t('settings.team.estimatedRevenueLabel', { days: 7 })}</span>
                            <span className="text-emerald-500 font-bold">{formatCurrency(metrics.totalRevenue)}</span>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between text-xs text-zinc-400">
                            <span>{t('settings.team.occupancyLabel', { hours: metrics.weeklyAvailableHours.toFixed(1) })}</span>
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
                <span className="font-bold">{t('settings.team.addMemberButton')}</span>
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
                       <span className="flex items-center gap-1"><Wallet className="w-3 h-3" /> {myProfileForm.serviceCommissionRate}% {t('settings.myProfile.commissionLabel')}</span>
                    </div>
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          placeholder={t('settings.myProfile.photoUrlPlaceholder')} 
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
                    <Save className="w-5 h-5" /> {t('settings.myProfile.saveChangesButton')}
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="space-y-8">
                     {/* My Weekly Schedule - EDITABLE */}
                     <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              <CalendarClock className="w-5 h-5 text-amber-500" /> {t('settings.myProfile.weeklyScheduleTitle')}
                           </h3>
                           <span className="text-xs text-zinc-500">{t('settings.myProfile.weeklyScheduleHint')}</span>
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
                                             <Plus className="w-3 h-3" /> {t('settings.myProfile.breakButton')}
                                          </button>
                                       )}
                                       <button 
                                          type="button"
                                          onClick={() => updateMySchedule(idx, 'isActive', !day.isActive)}
                                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${day.isActive ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                                       >
                                          {day.isActive ? t('settings.myProfile.toggleOff') : t('settings.myProfile.toggleWork')}
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
                                                   <option value="LUNCH">{t('settings.myProfile.breakTypes.lunch')}</option>
                                                   <option value="COFFEE">{t('settings.myProfile.breakTypes.coffee')}</option>
                                                   <option value="OTHER">{t('settings.myProfile.breakTypes.away')}</option>
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
                              <Coffee className="w-5 h-5 text-amber-500" /> {t('settings.myProfile.workRhythmTitle')}
                           </h3>
                        </div>
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 mb-4">
                           <p className="text-xs text-zinc-400 mb-3">
                              {t('settings.myProfile.workRhythmDescription')}
                           </p>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.myProfile.clientsPerCycleLabel')}</label>
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
                                 <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.myProfile.breakDurationLabel')}</label>
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
                    <Wallet className="w-6 h-6 text-amber-500" /> {t('settings.payments.methodsTitle')}
                  </h3>
                  <p className="text-zinc-400">
                     {t('settings.payments.methodsDescription')}
                  </p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* IN-STORE PAYMENTS */}
                  <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-5">
                     <div className="flex items-center gap-2 mb-4">
                        <Store className="w-5 h-5 text-emerald-500" />
                        <h4 className="font-bold text-white text-lg">{t('settings.payments.inStoreTitle')}</h4>
                     </div>
                     <p className="text-xs text-zinc-500 mb-4">{t('settings.payments.inStoreDescription')}</p>
                     
                     <div className="space-y-2">
                        {[
                           { value: PaymentMethod.CASH, label: t('settings.payments.methodLabels.cash'), icon: Banknote, requiresGateway: false },
                           { value: PaymentMethod.CREDIT_CARD, label: t('settings.payments.methodLabels.creditCard'), icon: CreditCard, requiresGateway: false },
                           { value: PaymentMethod.DEBIT_CARD, label: t('settings.payments.methodLabels.debitCard'), icon: CreditCard, requiresGateway: false },
                           { value: PaymentMethod.PIX, label: t('settings.payments.methodLabels.pix'), icon: Smartphone, requiresGateway: false },
                           { value: PaymentMethod.GOOGLE_PAY, label: t('settings.payments.methodLabels.googlePay'), icon: Smartphone, requiresGateway: true, gateway: 'stripe' },
                           { value: PaymentMethod.APPLE_PAY, label: t('settings.payments.methodLabels.applePay'), icon: Smartphone, requiresGateway: true, gateway: 'stripe' },
                           { value: PaymentMethod.MERCADO_PAGO, label: t('settings.payments.methodLabels.mercadoPago'), icon: Wallet, requiresGateway: true, gateway: 'mercadoPago' },
                           { value: PaymentMethod.PAGSEGURO, label: t('settings.payments.methodLabels.pagSeguro'), icon: Wallet, requiresGateway: true, gateway: 'pagSeguro' },
                           { value: PaymentMethod.INFINITE_PAY, label: t('settings.payments.methodLabels.infinitePay'), icon: Wallet, requiresGateway: true, gateway: 'infinitePay' },
                           { value: PaymentMethod.STONE, label: t('settings.payments.methodLabels.stone'), icon: Wallet, requiresGateway: true, gateway: 'stone' },
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
                                       alert(t('settings.alerts.configureGatewayFirst', { gateway: method.label }));
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
                                       <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">{t('settings.payments.notConfiguredBadge')}</span>
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
                        <h4 className="font-bold text-white text-lg">{t('settings.payments.onlineTitle')}</h4>
                     </div>
                     <p className="text-xs text-zinc-500 mb-4">{t('settings.payments.onlineDescription')}</p>
                     
                     <div className="space-y-2">
                        {[
                           { value: PaymentMethod.CREDIT_CARD, label: t('settings.payments.methodLabels.creditCard'), icon: CreditCard, requiresGateway: true, gateway: 'any' },
                           { value: PaymentMethod.DEBIT_CARD, label: t('settings.payments.methodLabels.debitCard'), icon: CreditCard, requiresGateway: true, gateway: 'any' },
                           { value: PaymentMethod.PIX, label: t('settings.payments.methodLabels.pix'), icon: Smartphone, requiresGateway: false },
                           { value: PaymentMethod.GOOGLE_PAY, label: t('settings.payments.methodLabels.googlePay'), icon: Smartphone, requiresGateway: true, gateway: 'stripe' },
                           { value: PaymentMethod.APPLE_PAY, label: t('settings.payments.methodLabels.applePay'), icon: Smartphone, requiresGateway: true, gateway: 'stripe' },
                           { value: PaymentMethod.MERCADO_PAGO, label: t('settings.payments.methodLabels.mercadoPago'), icon: Wallet, requiresGateway: true, gateway: 'mercadoPago' },
                           { value: PaymentMethod.PAGSEGURO, label: t('settings.payments.methodLabels.pagSeguro'), icon: Wallet, requiresGateway: true, gateway: 'pagSeguro' },
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
                                       alert(t('settings.alerts.configurePaymentGatewayFirst'));
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
                                       <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">{t('settings.payments.notConfiguredBadge')}</span>
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
                        <p className="text-amber-200 font-bold mb-1">{t('settings.payments.integrationsInfoTitle')}</p>
                        <p className="text-amber-300/80 text-xs">{t('settings.payments.integrationsInfoDescription')}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* GATEWAY INTEGRATIONS */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6">
               <div className="mb-6">
                  <h3 className="text-white font-bold text-2xl flex items-center gap-2 mb-2">
                    <Zap className="w-6 h-6 text-amber-500" /> {t('settings.payments.gatewayTitle')}
                  </h3>
                  <p className="text-zinc-400">
                     {t('settings.payments.gatewayDescription')}
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
                              <h4 className="font-bold text-white">{t('settings.payments.gateways.mercadoPago.name')}</h4>
                              <p className="text-xs text-zinc-500">{t('settings.payments.gateways.mercadoPago.description')}</p>
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
                              <h4 className="font-bold text-white">{t('settings.payments.gateways.pagSeguro.name')}</h4>
                              <p className="text-xs text-zinc-500">{t('settings.payments.gateways.pagSeguro.description')}</p>
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
                              <h4 className="font-bold text-white">{t('settings.payments.gateways.stripe.name')}</h4>
                              <p className="text-xs text-zinc-500">{t('settings.payments.gateways.stripe.description')}</p>
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
                              <h4 className="font-bold text-white">{t('settings.payments.gateways.infinitePay.name')}</h4>
                              <p className="text-xs text-zinc-500">{t('settings.payments.gateways.infinitePay.description')}</p>
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
                              <h4 className="font-bold text-white">{t('settings.payments.gateways.stone.name')}</h4>
                              <p className="text-xs text-zinc-500">{t('settings.payments.gateways.stone.description')}</p>
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
                    <Smartphone className="w-6 h-6 text-emerald-500" /> {t('settings.payments.pix.title')}
                  </h3>
                  <p className="text-zinc-400">
                     {t('settings.payments.pix.description')}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.pix.keyTypeLabel')}</label>
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
                           <option value="CPF">{t('settings.payments.pix.keyTypes.cpfCnpj')}</option>
                           <option value="EMAIL">{t('settings.payments.pix.keyTypes.email')}</option>
                           <option value="PHONE">{t('settings.payments.pix.keyTypes.phone')}</option>
                           <option value="RANDOM">{t('settings.payments.pix.keyTypes.random')}</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.pix.keyLabel')}</label>
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
                           placeholder={t('settings.payments.pix.keyPlaceholder')}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-emerald-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.pix.beneficiaryLabel')}</label>
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
                           placeholder={t('settings.payments.pix.beneficiaryPlaceholder')}
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
                              <Copy className="w-4 h-4" /> {t('settings.payments.pix.copyButton')}
                           </button>
                        </>
                     ) : (
                        <div className="text-center py-12">
                           <Smartphone className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                           <p className="text-zinc-500 text-sm font-bold">{t('settings.payments.pix.emptyTitle')}</p>
                           <p className="text-zinc-600 text-xs">{t('settings.payments.pix.emptyDescription')}</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* PAYMENT SETTINGS */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6">
               <div className="mb-6">
                  <h3 className="text-white font-bold text-2xl flex items-center gap-2 mb-2">
                    <CreditCard className="w-6 h-6 text-amber-500" /> {t('settings.payments.installments.title')}
                  </h3>
                  <p className="text-zinc-400">
                     {t('settings.payments.installments.description')}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.installments.maxInstallmentsLabel')}</label>
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
                           <option value={1}>{t('settings.payments.installments.options.cash')}</option>
                           <option value={2}>2x</option>
                           <option value={3}>3x</option>
                           <option value={4}>4x</option>
                           <option value={6}>6x</option>
                           <option value={12}>12x</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.installments.minValueLabel')}</label>
                        <div className="flex items-center gap-2">
                           <span className="text-zinc-400 font-bold">{currency.symbol}</span>
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
                           <p className="text-white font-bold text-sm">{t('settings.payments.installments.interestTitle')}</p>
                           <p className="text-xs text-zinc-500">{t('settings.payments.installments.interestDescription')}</p>
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
                        <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.installments.interestRateLabel')}</label>
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
                        <p className="text-blue-200 font-bold text-sm mb-1">{t('settings.payments.installmentsExampleTitle')}</p>
                        <p className="text-blue-300/80 text-xs">
                           {t('settings.payments.installmentsExampleDescription', { total: formatCurrency(100), installments: 3, installmentValue: formatCurrency(100 / 3) })}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* BANK ACCOUNT */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6">
               <div className="mb-6">
                  <h3 className="text-white font-bold text-2xl flex items-center gap-2 mb-2">
                    <Briefcase className="w-6 h-6 text-amber-500" /> {t('settings.payments.bankAccount.title')}
                  </h3>
                  <p className="text-zinc-400">
                     {t('settings.payments.bankAccount.description')}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.bankAccount.bankLabel')}</label>
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
                        <option value="">{t('settings.payments.bankAccount.selectBank')}</option>
                        <option value="001">{t('settings.payments.bankAccount.banks.bancoDoBrasil')}</option>
                        <option value="104">{t('settings.payments.bankAccount.banks.caixa')}</option>
                        <option value="237">{t('settings.payments.bankAccount.banks.bradesco')}</option>
                        <option value="341">{t('settings.payments.bankAccount.banks.itau')}</option>
                        <option value="033">{t('settings.payments.bankAccount.banks.santander')}</option>
                        <option value="260">{t('settings.payments.bankAccount.banks.nubank')}</option>
                        <option value="077">{t('settings.payments.bankAccount.banks.inter')}</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.bankAccount.accountTypeLabel')}</label>
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
                        <option value="CHECKING">{t('settings.payments.bankAccount.accountTypes.checking')}</option>
                        <option value="SAVINGS">{t('settings.payments.bankAccount.accountTypes.savings')}</option>
                        <option value="PAYMENT">{t('settings.payments.bankAccount.accountTypes.payment')}</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.bankAccount.agencyLabel')}</label>
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
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.bankAccount.accountLabel')}</label>
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
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.bankAccount.holderLabel')}</label>
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
                        placeholder={t('settings.payments.bankAccount.holderPlaceholder')}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                     />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">{t('settings.payments.bankAccount.documentLabel')}</label>
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
                     <Save className="w-4 h-4" /> {t('settings.payments.saveButton')}
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
                       <ThumbsUp className="w-5 h-5 text-amber-500" /> {t('settings.commissions.qualityTipsTitle')}
                     </h3>
                     <p className="text-zinc-400 text-sm mt-1 max-w-xl">
                        {t('settings.commissions.qualityTipsDescription')}
                        <br/><span className="text-xs text-zinc-500">{t('settings.commissions.qualityTipsSubDescription')}</span>
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
                        <span className="font-bold text-white block mb-1">{t('settings.commissions.qualityTipsFlowLabel')}:</span>
                        {t('settings.commissions.qualityTipsFlowDescription')}
                     </div>
                     <div className="flex-1 border-l border-zinc-800 pl-4">
                        <span className="font-bold text-white block mb-1">{t('settings.commissions.qualityTipsImpactLabel')}:</span>
                        {t('settings.commissions.qualityTipsImpactDescription')}
                     </div>
                  </div>
               )}
            </div>

            {/* QUEUE DISTRIBUTION RULE */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
               <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                 <UserMinus className="w-5 h-5 text-amber-500" /> {t('settings.commissions.queueDistributionTitle')}
               </h3>
               <p className="text-zinc-400 text-sm mb-6">
                  {t('settings.commissions.queueDistributionDescription')}
               </p>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                     onClick={() => updateShopSettings({ queueDistributionRule: 'FAIRNESS' })}
                     className={`p-4 rounded-xl border flex flex-col gap-2 transition-all text-left ${shopSettings.queueDistributionRule === 'FAIRNESS' ? 'bg-zinc-800 border-amber-500 ring-1 ring-amber-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                  >
                     <div className="flex justify-between w-full">
                        <span className={`font-bold ${shopSettings.queueDistributionRule === 'FAIRNESS' ? 'text-amber-500' : 'text-white'}`}>{t('settings.commissions.queueRules.fairness.title')}</span>
                        {shopSettings.queueDistributionRule === 'FAIRNESS' && <Zap className="w-4 h-4 text-amber-500" />}
                     </div>
                     <p className="text-xs text-zinc-400">{t('settings.commissions.queueRules.fairness.description')}</p>
                  </button>

                  <button 
                     onClick={() => updateShopSettings({ queueDistributionRule: 'SPEED' })}
                     className={`p-4 rounded-xl border flex flex-col gap-2 transition-all text-left ${shopSettings.queueDistributionRule === 'SPEED' ? 'bg-zinc-800 border-emerald-500 ring-1 ring-emerald-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                  >
                     <div className="flex justify-between w-full">
                        <span className={`font-bold ${shopSettings.queueDistributionRule === 'SPEED' ? 'text-emerald-500' : 'text-white'}`}>{t('settings.commissions.queueRules.speed.title')}</span>
                        {shopSettings.queueDistributionRule === 'SPEED' && <Zap className="w-4 h-4 text-emerald-500" />}
                     </div>
                     <p className="text-xs text-zinc-400">{t('settings.commissions.queueRules.speed.description')}</p>
                  </button>

                  <button 
                     onClick={() => updateShopSettings({ queueDistributionRule: 'MANUAL' })}
                     className={`p-4 rounded-xl border flex flex-col gap-2 transition-all text-left ${shopSettings.queueDistributionRule === 'MANUAL' ? 'bg-zinc-800 border-blue-500 ring-1 ring-blue-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                  >
                     <div className="flex justify-between w-full">
                        <span className={`font-bold ${shopSettings.queueDistributionRule === 'MANUAL' ? 'text-blue-500' : 'text-white'}`}>{t('settings.commissions.queueRules.manual.title')}</span>
                        {shopSettings.queueDistributionRule === 'MANUAL' && <Zap className="w-4 h-4 text-blue-500" />}
                     </div>
                     <p className="text-xs text-zinc-400">{t('settings.commissions.queueRules.manual.description')}</p>
                  </button>
               </div>
            </div>

            {/* DISCOUNT LIABILITY RULE */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div>
                     <h3 className="text-white font-bold text-lg flex items-center gap-2">
                       <Scale className="w-5 h-5 text-amber-500" /> {t('settings.commissions.discountLiabilityTitle')}
                     </h3>
                     <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
                        {t('settings.commissions.discountLiabilityDescription')}
                        <br/><span className="text-xs text-zinc-500">{t('settings.commissions.discountLiabilitySubDescription')}</span>
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
                        <span>{t('settings.commissions.discountOptions.shared.title')}</span>
                        <span className="text-[9px] opacity-60 font-normal">{t('settings.commissions.discountOptions.shared.subtitle')}</span>
                     </button>
                     <button 
                        onClick={() => updateShopSettings({ discountAllocation: 'SHOP_ABSORBS' })}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center ${
                           shopSettings.discountAllocation === 'SHOP_ABSORBS' 
                           ? 'bg-emerald-500 text-zinc-900 shadow-lg' 
                           : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                     >
                        <span>{t('settings.commissions.discountOptions.shopAbsorbs.title')}</span>
                        <span className="text-[9px] opacity-60 font-normal">{t('settings.commissions.discountOptions.shopAbsorbs.subtitle')}</span>
                     </button>
                  </div>
               </div>
               
               {/* Explanation Visual */}
               <div className="mt-4 bg-zinc-950/50 rounded-lg p-3 text-xs text-zinc-400 border border-zinc-800/50">
                  <span className="font-bold text-amber-500">{t('settings.commissions.discountAllocationExampleLabel')}:</span> {t('settings.commissions.discountAllocationExampleIntro', { servicePrice: formatCurrency(50), discount: formatCurrency(10), paid: formatCurrency(40), rate: 50 })}
                  <ul className="list-disc list-inside mt-1 space-y-1">
                     <li className={shopSettings.discountAllocation === 'SHARED' ? 'text-white font-bold' : ''}>
                        <b>{t('settings.commissions.discountAllocationSharedLabel')}:</b> {t('settings.commissions.discountAllocationSharedPrefix', { rate: 50, paid: formatCurrency(40) })} <span className="text-white">{formatCurrency(20)}</span>. {t('settings.commissions.discountAllocationSharedSuffix', { loss: formatCurrency(5) })}
                     </li>
                     <li className={shopSettings.discountAllocation === 'SHOP_ABSORBS' ? 'text-white font-bold' : ''}>
                        <b>{t('settings.commissions.discountAllocationShopAbsorbsLabel')}:</b> {t('settings.commissions.discountAllocationShopAbsorbsPrefix', { rate: 50, servicePrice: formatCurrency(50) })} <span className="text-white">{formatCurrency(25)}</span>. {t('settings.commissions.discountAllocationShopAbsorbsSuffix', { discount: formatCurrency(10) })}
                     </li>
                  </ul>
               </div>
            </div>

            {/* GROWTH & MARKETING RULES */}
            <div>
               <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-amber-500" /> {t('settings.commissions.marketingLoyaltyTitle')}
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Goal Setting */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <Target className="w-4 h-4 text-emerald-500" />
                           <h4 className="font-bold text-white">{t('settings.marketing.dailyRevenueGoalTitle')}</h4>
                        </div>
                        <p className="text-xs text-zinc-500">{t('settings.marketing.dailyRevenueGoalDescription')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-zinc-400 font-bold">{currency.symbol}</span>
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
                           <h4 className="font-bold text-white">{t('settings.marketing.clientFidelityLockTitle')}</h4>
                        </div>
                        <p className="text-xs text-zinc-500">{t('settings.marketing.clientFidelityLockDescription')}</p>
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
                         <span className="text-xs font-bold text-zinc-500">{t('settings.marketing.visitsLabel')}</span>
                      </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Win-Back */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                          <CalendarClock className="w-4 h-4 text-zinc-400" />
                          <h4 className="font-bold text-white">{t('settings.marketing.winBackCampaignTitle')}</h4>
                        </div>
                       <p className="text-xs text-zinc-500">{t('settings.marketing.winBackCampaignDescription', { days: shopSettings.winBackDays })}</p>
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
                          <h4 className="font-bold text-white">{t('settings.marketing.birthdaySpecialTitle')}</h4>
                        </div>
                       <p className="text-xs text-zinc-500">{t('settings.marketing.birthdaySpecialDescription')}</p>
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
                         <h4 className="font-bold text-white">{t('settings.marketing.loyaltyClubTitle')}</h4>
                      </div>
                      <p className="text-xs text-zinc-500">{t('settings.marketing.loyaltyClubDescription')}</p>
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
                         <h4 className="font-bold text-white">{t('settings.marketing.referralSystemTitle')}</h4>
                      </div>
                      <p className="text-xs text-zinc-500">{t('settings.marketing.referralSystemDescription')}</p>
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
                    <MessageSquare className="w-5 h-5 text-amber-500" /> {t('settings.templates.communicationAlertsTitle')}
                  </h3>
                  
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                     {/* Standard Return Cycle */}
                     <div className="flex flex-col md:flex-row gap-6 border-b border-zinc-800 pb-6">
                        <div className="flex-1">
                           <h4 className="font-bold text-white mb-2">{t('settings.templates.cycle1StandardReturnTitle')}</h4>
                           <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm text-zinc-400">{t('settings.templates.triggerAfterLabel')}</span>
                              <input 
                                type="number" 
                                value={shopSettings.returnReminderDays}
                                onChange={(e) => updateShopSettings({ returnReminderDays: Number(e.target.value) })}
                                className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg py-1 px-2 text-white text-center font-bold text-sm focus:border-amber-500 outline-none"
                              />
                              <span className="text-sm text-zinc-400">{t('settings.templates.daysLabel')}</span>
                           </div>
                           <p className="text-xs text-amber-500 mb-2">{t('settings.templates.visualOrangeToRedHint')}</p>
                        </div>
                        <div className="flex-[2]">
                           <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('settings.templates.messageTemplateStandardLabel')}</label>
                           <textarea 
                              value={shopSettings.messageTemplateOverdue}
                              onChange={(e) => updateShopSettings({ messageTemplateOverdue: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:border-amber-500 outline-none h-24 resize-none"
                           />
                           <p className="text-[10px] text-zinc-600 mt-1">{t('settings.templates.variablesHint', { name: '{name}', days: '{days}', booking_link: '{booking_link}' })}</p>
                        </div>
                     </div>

                     {/* Win-Back Cycle */}
                     <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                           <h4 className="font-bold text-white mb-2">{t('settings.templates.cycle2WinBackRiskTitle')}</h4>
                           <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm text-zinc-400">{t('settings.templates.triggerAfterLabel')}</span>
                              <input 
                                type="number" 
                                value={shopSettings.winBackDays}
                                onChange={(e) => updateShopSettings({ winBackDays: Number(e.target.value) })}
                                className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg py-1 px-2 text-white text-center font-bold text-sm focus:border-amber-500 outline-none"
                              />
                              <span className="text-sm text-zinc-400">{t('settings.templates.daysLabel')}</span>
                           </div>
                           <p className="text-xs text-red-500 mb-2">{t('settings.templates.criticalVisualRedBackground')}</p>
                        </div>
                        <div className="flex-[2]">
                           <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('settings.templates.messageTemplateWinBackLabel')}</label>
                           <textarea 
                              value={shopSettings.messageTemplateWinBack}
                              onChange={(e) => updateShopSettings({ messageTemplateWinBack: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:border-amber-500 outline-none h-24 resize-none"
                           />
                           <p className="text-[10px] text-zinc-600 mt-1">{t('settings.templates.variablesHint', { name: '{name}', days: '{days}', booking_link: '{booking_link}' })}</p>
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
