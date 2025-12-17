'use client';

import React, { useState, useEffect } from 'react';
import { useBarber } from '@/context/BarberContext';
import { StaffModal } from './modals/StaffModal';
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
  Utensils, DoorOpen, Trash2, Handshake
} from 'lucide-react';
import { StaffMember, DaySchedule, AppointmentStatus, PaymentMethod, BreakTime } from '@/types';

export const Settings = () => {
  const { 
    staff, commissionPlans, shopSettings, shopProfile, currentUser,
    deleteCommissionPlan, updateShopSettings, updateShopProfile, updateStaff,
    appointments
  } = useBarber();
  
  const isOwner = currentUser.role === 'OWNER';
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'SHOP' | 'TEAM' | 'COMMISSIONS' | 'MY_PROFILE' | 'REFERRAL'>('SHOP');
  
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
     alert('Profile Updated Successfully!');
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

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{isOwner ? 'Settings' : 'My Profile'}</h2>
        <p className="text-zinc-400">
           {isOwner ? 'Manage shop details, team members, and business rules.' : 'Manage your schedule and preferences.'}
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
                  <Store className="w-4 h-4" /> Shop Profile
                </button>
                 <button
                  onClick={() => setActiveTab('TEAM')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'TEAM' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Users className="w-4 h-4" /> Team
                </button>
                <button
                  onClick={() => setActiveTab('COMMISSIONS')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'COMMISSIONS' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> Rules & Growth
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
              <User className="w-4 h-4" /> My Profile
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
            <Plus className="w-4 h-4" /> New {activeTab === 'TEAM' ? 'Staff' : 'Plan'}
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
                   <Store className="w-5 h-5 text-amber-500" /> Basic Information
                </h3>
                
                {/* LOGO UPLOAD SECTION */}
                <div className="mb-6 border-b border-zinc-800 pb-6">
                   <ImageUpload 
                      label="Barbershop Logo" 
                      value={shopProfile.logo} 
                      onChange={(val) => updateShopProfile({ ...shopProfile, logo: val })} 
                      placeholder="Upload your brand logo (PNG/JPG)"
                      className="w-full max-w-xs"
                   />
                   <p className="text-[10px] text-zinc-500 mt-2">
                      This logo will replace the &quot;BarberFlow&quot; text in the sidebar, mobile header, and website.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Barbershop Name</label>
                         <input 
                            type="text" 
                            value={shopProfile.name}
                            onChange={(e) => updateShopProfile({ ...shopProfile, name: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Address</label>
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
                         <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Phone / Contact</label>
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
                         alert('Link copiado! Cole no seu Instagram.');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-xl transition-all"
                   >
                      <Instagram className="w-4 h-4" /> Copiar para Instagram
                   </button>
                   <button
                      onClick={() => {
                         const link = `${window.location.origin}/book/${shopProfile.name.replace(/\s/g, '').toLowerCase()}`;
                         navigator.clipboard.writeText(link);
                         alert('Link de agendamento copiado!');
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
                      <Clock className="w-5 h-5 text-amber-500" /> Opening Hours
                   </h3>
                   <button 
                      onClick={copyMondayToWeekdays}
                      className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1"
                   >
                      <Copy className="w-3 h-3" /> Copy Mon to Fri
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
                               <span className="text-sm text-zinc-500 font-medium italic">Closed</span>
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
             {staff.map(member => {
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
                            <span className="block text-xs text-zinc-500 mb-1">Commission</span>
                            <span className="text-white font-bold">{member.serviceCommissionRate}% / {member.productCommissionRate}%</span>
                         </div>
                         <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                            <span className="block text-xs text-zinc-500 mb-1">Est. Revenue (7d)</span>
                            <span className="text-emerald-500 font-bold">${metrics.totalRevenue.toFixed(0)}</span>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between text-xs text-zinc-400">
                            <span>Occupancy ({metrics.weeklyAvailableHours.toFixed(1)}h avail)</span>
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
                <span className="font-bold">Add Team Member</span>
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

        {/* --- COMMISSIONS TAB --- */}
        {activeTab === 'COMMISSIONS' && isOwner && (
          <div className="space-y-8 animate-fade-in">
            {/* QUALITY ASSURANCE & TIPS - NEW */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
               <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
                  <div>
                     <h3 className="text-white font-bold text-lg flex items-center gap-2">
                       <ThumbsUp className="w-5 h-5 text-amber-500" /> Quality Assurance & Tips
                     </h3>
                     <p className="text-zinc-400 text-sm mt-1 max-w-xl">
                        Automatically send survey links to clients after appointments.
                        <br/><span className="text-xs text-zinc-500">Collects feedback (1-5 stars) and suggests a late tip for good service.</span>
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
                        <span className="font-bold text-white block mb-1">Flow:</span>
                        1. Service Completed {'>'} 2. &quot;Send Link&quot; button appears in Dashboard {'>'} 3. Client rates (Stars) {'>'} 4. If Good {'>'} 5. Ask for Tip.
                     </div>
                     <div className="flex-1 border-l border-zinc-800 pl-4">
                        <span className="font-bold text-white block mb-1">Impact:</span>
                        Increases staff earnings and catches bad experiences privately before they hit Google Reviews.
                     </div>
                  </div>
               )}
            </div>

            {/* QUEUE DISTRIBUTION RULE */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
               <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                 <UserMinus className="w-5 h-5 text-amber-500" /> Walk-in Distribution Logic
               </h3>
               <p className="text-zinc-400 text-sm mb-6">
                  How should the system automatically assign or recommend staff for Walk-in clients (new/anonymous)?
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
                     <p className="text-xs text-zinc-400">Prioritizes staff with FEWEST cuts today. Balances the workload so everyone eats.</p>
                  </button>

                  <button 
                     onClick={() => updateShopSettings({ queueDistributionRule: 'SPEED' })}
                     className={`p-4 rounded-xl border flex flex-col gap-2 transition-all text-left ${shopSettings.queueDistributionRule === 'SPEED' ? 'bg-zinc-800 border-emerald-500 ring-1 ring-emerald-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                  >
                     <div className="flex justify-between w-full">
                        <span className={`font-bold ${shopSettings.queueDistributionRule === 'SPEED' ? 'text-emerald-500' : 'text-white'}`}>SPEED (Fastest)</span>
                        {shopSettings.queueDistributionRule === 'SPEED' && <Zap className="w-4 h-4 text-emerald-500" />}
                     </div>
                     <p className="text-xs text-zinc-400">Prioritizes staff who is FREE FIRST. Minimizes customer wait time above all.</p>
                  </button>

                  <button 
                     onClick={() => updateShopSettings({ queueDistributionRule: 'MANUAL' })}
                     className={`p-4 rounded-xl border flex flex-col gap-2 transition-all text-left ${shopSettings.queueDistributionRule === 'MANUAL' ? 'bg-zinc-800 border-blue-500 ring-1 ring-blue-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                  >
                     <div className="flex justify-between w-full">
                        <span className={`font-bold ${shopSettings.queueDistributionRule === 'MANUAL' ? 'text-blue-500' : 'text-white'}`}>MANUAL</span>
                        {shopSettings.queueDistributionRule === 'MANUAL' && <Zap className="w-4 h-4 text-blue-500" />}
                     </div>
                     <p className="text-xs text-zinc-400">No auto-recommendation. Receptionist chooses based on feeling/situation.</p>
                  </button>
               </div>
            </div>

            {/* DISCOUNT LIABILITY RULE */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div>
                     <h3 className="text-white font-bold text-lg flex items-center gap-2">
                       <Scale className="w-5 h-5 text-amber-500" /> Discount Liability Rule (Quem paga o prejuízo?)
                     </h3>
                     <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
                        When you give a discount (Birthday, Loyalty, etc), who earns less?
                        <br/><span className="text-xs text-zinc-500">Defines how staff commission is calculated on discounted sales.</span>
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
                        <span>SHARED (Split)</span>
                        <span className="text-[9px] opacity-60 font-normal">Commission on Net Price</span>
                     </button>
                     <button 
                        onClick={() => updateShopSettings({ discountAllocation: 'SHOP_ABSORBS' })}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center ${
                           shopSettings.discountAllocation === 'SHOP_ABSORBS' 
                           ? 'bg-emerald-500 text-zinc-900 shadow-lg' 
                           : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                     >
                        <span>SHOP ABSORBS</span>
                        <span className="text-[9px] opacity-60 font-normal">Commission on Full Price</span>
                     </button>
                  </div>
               </div>
               
               {/* Explanation Visual */}
               <div className="mt-4 bg-zinc-950/50 rounded-lg p-3 text-xs text-zinc-400 border border-zinc-800/50">
                  <span className="font-bold text-amber-500">Example:</span> $50 Service with $10 Discount ($40 Paid). Staff has 50% commission.
                  <ul className="list-disc list-inside mt-1 space-y-1">
                     <li className={shopSettings.discountAllocation === 'SHARED' ? 'text-white font-bold' : ''}>
                        <b>Shared:</b> Staff gets 50% of $40 = <span className="text-white">$20.00</span>. (Both lose $5).
                     </li>
                     <li className={shopSettings.discountAllocation === 'SHOP_ABSORBS' ? 'text-white font-bold' : ''}>
                        <b>Shop Absorbs:</b> Staff gets 50% of $50 = <span className="text-white">$25.00</span>. (Shop loses full $10).
                     </li>
                  </ul>
               </div>
            </div>

            {/* GROWTH & MARKETING RULES */}
            <div>
               <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-amber-500" /> Marketing & Loyalty
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
              <h3 className="text-white font-bold text-lg mb-4">Commission Structures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commissionPlans.map(plan => (
                   <div key={plan.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative group hover:border-amber-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                           <h4 className="font-bold text-white text-lg">{plan.name}</h4>
                           <p className="text-zinc-500 text-sm mt-1 h-10">{plan.description || 'No description'}</p>
                         </div>
                         <div className="bg-zinc-800 p-2 rounded-lg">
                           {plan.model === 'PERCENTAGE' ? <Percent className="w-5 h-5 text-emerald-500" /> : <Wallet className="w-5 h-5 text-blue-500" />}
                         </div>
                      </div>

                      <div className="space-y-3 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                         <div className="flex justify-between text-sm">
                           <span className="text-zinc-400">Service Commission</span>
                           <span className="text-white font-bold">{plan.serviceRate}%</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className="text-zinc-400">Product Commission</span>
                           <span className="text-white font-bold">{plan.productRate}%</span>
                         </div>
                         {plan.model === 'CHAIR_RENTAL' && (
                           <div className="flex justify-between text-sm pt-2 border-t border-zinc-800 mt-2">
                             <span className="text-zinc-400">Fixed Rent</span>
                             <span className="text-amber-500 font-bold">${plan.rentalFee}</span>
                           </div>
                         )}
                      </div>
                      <button onClick={() => deleteCommissionPlan(plan.id)} className="text-xs text-red-500 mt-4 hover:underline">Remove Plan</button>
                   </div>
                ))}
                
                <button onClick={() => setIsPlanModalOpen(true)} className="border-2 border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-amber-500 hover:border-amber-500 transition-all min-h-[250px]">
                   <Plus className="w-10 h-10 mb-2" />
                   <span className="font-bold">Create New Plan</span>
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
