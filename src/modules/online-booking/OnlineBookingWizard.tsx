'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { 
  Scissors, User, CheckCircle2, ChevronLeft, 
  MapPin, Clock, Home, ArrowRight,
  Gift, Lock, Unlock, Sparkles, Star, Copy, History, CalendarCheck,
  ShoppingBag, Package, Plus, Minus, Check, Users, UserPlus, X, Zap, AlertCircle,
  Baby, Heart, UserCheck, Smile, CreditCard, Banknote, Smartphone, Wallet, XCircle, RefreshCw,
  Calculator
} from 'lucide-react';
import { format, addDays, isSameDay, startOfToday, addMinutes, set, getDay } from 'date-fns';
import { AppointmentStatus, Client, Dependent, PaymentMethod } from '@/types';
import { ClubPromo } from '@/modules/barber-club/components/ClubPromo';
import { useBarberClub } from '@/modules/barber-club/hooks/useBarberClub';

type LucideIcon = React.ComponentType<{ className?: string }>;

// Interfaces for local state
interface BookingEntity {
  id: string; // 'MAIN' or 'GUEST_1', etc.
  name: string;
  isMain: boolean;
  serviceIds: string[];
  // New: Staff Assignment Per Entity
  assignedStaffId: string | null; 
}

const MIN_SPEND_FOR_LOYALTY = 20; // Threshold to earn a stamp

// Icon Map for dynamic payments
const PAYMENT_ICONS: Record<string, LucideIcon> = {
   [PaymentMethod.CASH]: Banknote,
   [PaymentMethod.CREDIT_CARD]: CreditCard,
   [PaymentMethod.DEBIT_CARD]: CreditCard,
   [PaymentMethod.PIX]: Smartphone,
   [PaymentMethod.GOOGLE_PAY]: Wallet,
   [PaymentMethod.APPLE_PAY]: Wallet,
   [PaymentMethod.MERCADO_PAGO]: ShoppingBag,
   [PaymentMethod.PAGSEGURO]: Calculator,
   [PaymentMethod.INFINITE_PAY]: Zap,
   [PaymentMethod.STONE]: Calculator,
   [PaymentMethod.OTHER]: Banknote
};

const PAYMENT_LABELS: Record<string, string> = {
   [PaymentMethod.CASH]: 'Dinheiro',
   [PaymentMethod.CREDIT_CARD]: 'Crédito',
   [PaymentMethod.DEBIT_CARD]: 'Débito',
   [PaymentMethod.PIX]: 'Pix',
   [PaymentMethod.GOOGLE_PAY]: 'Google Pay',
   [PaymentMethod.APPLE_PAY]: 'Apple Pay',
   [PaymentMethod.MERCADO_PAGO]: 'Mercado Pago',
   [PaymentMethod.PAGSEGURO]: 'PagSeguro',
   [PaymentMethod.INFINITE_PAY]: 'InfinitePay',
   [PaymentMethod.STONE]: 'Stone',
   [PaymentMethod.OTHER]: 'Outro'
};

export const OnlineBookingWizard = () => {
  const { 
    shopProfile, 
    services, 
    products, 
    staff, 
    getAvailableSlots, 
    addAppointment, 
    updateAppointmentStatus, // Needed for Cancel/Reschedule
    clients, 
    addClient,
    setView,
    appointments,
    updateClient,
    shopSettings
  } = useBarber();

  const { canUseFeature } = useFeatureGate();
  const hasOnlineBooking = canUseFeature('ONLINE_BOOKING');

  // Barber Club
  const { plans: clubPlans } = useBarberClub();
  const activePlans = clubPlans.filter(p => p.isActive);

  // FLOW STEPS:
  // 0: Intro, 1: ID, 2: Reg, 3: Dash, 4: Service, 5: Product, 6: Staff, 7: Time, 8: Review, 9: Success
  const [step, setStep] = useState(0);
  
  // Flow Control
  const [entryPoint, setEntryPoint] = useState<'SERVICE' | 'PRODUCT'>('SERVICE');

  // --- NEW: MULTI-ENTITY STATE ---
  const [bookingEntities, setBookingEntities] = useState<BookingEntity[]>([
     { id: 'MAIN', name: 'Você', isMain: true, serviceIds: [], assignedStaffId: null }
  ]);
  const [activeEntityId, setActiveEntityId] = useState<string>('MAIN');
  const [isAddingGuestMode, setIsAddingGuestMode] = useState(false); // Toggle the guest addition UI
  const [tempGuestName, setTempGuestName] = useState('');

  // Payment Preference
  const [paymentPreference, setPaymentPreference] = useState<'SHOP' | 'ONLINE'>('SHOP');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // NEW: Gateway Modal

  // Product State (Shared for the whole order)
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  
  // Appointment Details
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  
  // Client State
  const [phoneInput, setPhoneInput] = useState('');
  const [clientForm, setClientForm] = useState({ name: '', email: '', birthDate: '' });
  const [isExistingClient, setIsExistingClient] = useState(false);
  const [activeClientProfile, setActiveClientProfile] = useState<Partial<Client> | null>(null);

  if (!hasOnlineBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">Agendamento online indisponível</h1>
          <p className="text-sm text-zinc-400">
            Esta barbearia ainda não ativou o módulo de agendamento online do BarberFlow.
          </p>
        </div>
      </div>
    );
  }

  // --- COMPUTED VALUES ---
  
  // Generate dates for the next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  // Flatten all services from all entities to calculate total stats
  const allSelectedServiceIds = bookingEntities.flatMap(e => e.serviceIds);
  const hasServices = allSelectedServiceIds.length > 0;

  // Calculate Price
  const totalServicePrice = bookingEntities.reduce((acc, entity) => {
     const entityServices = services.filter(s => entity.serviceIds.includes(s.id));
     return acc + entityServices.reduce((sum, s) => sum + s.price, 0);
  }, 0);

  // Calculate Stamps (One per Person, if spend > Threshold)
  const stampsEarned = bookingEntities.reduce((acc, entity) => {
     const entityServices = services.filter(s => entity.serviceIds.includes(s.id));
     const entityTotal = entityServices.reduce((sum, s) => sum + s.price, 0);
     return acc + (entityTotal >= MIN_SPEND_FOR_LOYALTY ? 1 : 0);
  }, 0);

  const selectedProductsList = products
    .filter(p => (productQuantities[p.id] || 0) > 0)
    .map(p => ({ ...p, qty: productQuantities[p.id] }));
  
  const totalProductPrice = selectedProductsList.reduce((acc, p) => acc + (p.price * p.qty), 0);
  const totalPrice = totalServicePrice + totalProductPrice;
  
  // --- ACTIONS ---

  const handleAddGuest = (name: string, dependentId?: string, preferredStaffId?: string) => {
     if (!name.trim()) return;
     const newId = dependentId || `GUEST_${Date.now()}`;
     let preAssigned = null;
     if (preferredStaffId) preAssigned = preferredStaffId;

     let finalName = name;
     const similarNames = bookingEntities.filter(e => e.name.startsWith(name)).length;
     if (similarNames > 0 && ['Filho', 'Filha', 'Amigo'].some(n => name.includes(n))) {
        finalName = `${name} ${similarNames + 1}`;
     }

     setBookingEntities(prev => [
        ...prev, 
        { 
           id: newId, 
           name: finalName, 
           isMain: false, 
           serviceIds: [], 
           assignedStaffId: preAssigned
        }
     ]);
     setTempGuestName('');
     setIsAddingGuestMode(false);
     setActiveEntityId(newId); 
  };

  const removeGuest = (id: string) => {
     setBookingEntities(prev => prev.filter(e => e.id !== id));
     if (activeEntityId === id) setActiveEntityId('MAIN');
  };

  const toggleServiceForEntity = (serviceId: string) => {
     setBookingEntities(prev => prev.map(entity => {
        if (entity.id !== activeEntityId) return entity;
        const exists = entity.serviceIds.includes(serviceId);
        const newIds = exists ? entity.serviceIds.filter(id => id !== serviceId) : [...entity.serviceIds, serviceId];
        return { ...entity, serviceIds: newIds };
     }));
  };

  const assignStaffToEntity = (entityId: string, staffId: string) => {
     setBookingEntities(prev => prev.map(e => e.id === entityId ? { ...e, assignedStaffId: staffId } : e));
  };

  const updateProductQty = (id: string, delta: number) => {
     setProductQuantities(prev => {
        const currentQty = prev[id] || 0;
        const newQty = Math.max(0, currentQty + delta);
        if (newQty === 0) {
           const next = { ...prev };
           delete next[id];
           return next;
        }
        return { ...prev, [id]: newQty };
     });
  };

  const handleBack = () => {
     // If in Upsell Service (Step 4) and came from Product (Step 5)
     if (step === 4 && entryPoint === 'PRODUCT') {
        setStep(5);
        return;
     }
     
     if (step === 4) setStep(3); 
     else if (step === 5 && entryPoint === 'SERVICE') setStep(4);
     else if (step === 5 && entryPoint === 'PRODUCT') setStep(3); // Cancel product flow
     
     else if (step === 6 && !hasServices) setStep(5);
     else if (step === 7) {
        if (!hasServices && entryPoint === 'PRODUCT') setStep(4); // Back to Upsell
        else setStep(6); // Back to Staff
     }
     else setStep(prev => prev - 1);
  };

  const handleNextStep = () => {
     if (step === 4) {
        // From Service Selection
        if (entryPoint === 'PRODUCT') {
           // UPSELL LOGIC:
           if (hasServices) {
              setStep(6); // Has service -> Go to Staff
           } else {
              setStep(7); // No service -> Go to Time (Pickup)
           }
        } else {
           // Normal Service Flow
           setStep(5); // Go to Products
        }
     }
     else if (step === 5) {
        // From Product Selection
        if (entryPoint === 'PRODUCT') {
           // Go to Service Upsell
           setStep(4); 
        } else {
           // Normal Flow: Service -> Product -> Staff (or Time if no service selected?)
           // If we are in normal flow, we must have services selected at step 4 theoretically, 
           // but if user deselected all, handle gracefully.
           if (hasServices) {
              if (!bookingEntities[0].assignedStaffId && activeClientProfile?.preferredStaffId) {
                 assignStaffToEntity('MAIN', activeClientProfile.preferredStaffId);
              }
              setStep(6); 
           } else {
              setStep(7); // Just products
           }
        }
     }
     else if (step === 6) setStep(7);
     else if (step === 7) setStep(8);
  };

  // --- APPOINTMENT MANAGEMENT (DASHBOARD) ---
  const handleCancelAppointment = (id: string) => {
     if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        updateAppointmentStatus(id, AppointmentStatus.CANCELLED);
     }
  };

  const handleRescheduleAppointment = (id: string) => {
     if (confirm('Para reagendar, vamos cancelar o atual e iniciar um novo. Continuar?')) {
        updateAppointmentStatus(id, AppointmentStatus.CANCELLED);
        startFlow('SERVICE');
     }
  };

  // --- IDENTIFICATION ---
  const handleIdentify = () => {
     if (phoneInput.length < 8) return; 
     const foundClient = clients.find(c => c.phone.includes(phoneInput) || c.phone.replace(/\D/g, '') === phoneInput.replace(/\D/g, ''));
     if (foundClient) {
        setIsExistingClient(true);
        setActiveClientProfile(foundClient);
        setBookingEntities([{ 
           id: 'MAIN', 
           name: foundClient.name.split(' ')[0], 
           isMain: true, 
           serviceIds: [], 
           assignedStaffId: foundClient.preferredStaffId || null
        }]);
        setStep(3);
     } else {
        setIsExistingClient(false);
        setStep(2);
     }
  };

  const handleRegister = () => {
     if (!clientForm.name || !clientForm.birthDate) return;
     const tempProfile: Partial<Client> = {
        name: clientForm.name,
        phone: phoneInput,
        email: clientForm.email,
        birthDate: clientForm.birthDate,
        loyaltyPoints: 2,
        referralCode: (clientForm.name.substring(0, 3) + '123').toUpperCase(),
        id: 'TEMP_NEW',
        dependents: []
     };
     setActiveClientProfile(tempProfile);
     setBookingEntities([{ id: 'MAIN', name: clientForm.name.split(' ')[0], isMain: true, serviceIds: [], assignedStaffId: null }]);
     setStep(3);
  };

  const startFlow = (type: 'SERVICE' | 'PRODUCT') => {
     setEntryPoint(type);
     setBookingEntities([{ 
        id: 'MAIN', 
        name: activeClientProfile?.name?.split(' ')[0] || 'Eu', 
        isMain: true, 
        serviceIds: [], 
        assignedStaffId: activeClientProfile?.preferredStaffId || null
     }]);
     setProductQuantities({});
     
     // ROUTING:
     if (type === 'PRODUCT') {
        setStep(5); // Start at Product List
     } else {
        setStep(4); // Start at Service List
     }
  };

  // --- TIME & LOGIC ---
  const getEntityDuration = (entity: BookingEntity) => {
     return services.filter(s => entity.serviceIds.includes(s.id)).reduce((acc, s) => acc + s.durationMinutes, 0);
  };

  const calculateGroupTiming = () => {
     const staffLoad: Record<string, number> = {};
     let sequentialTotal = 0; 

     bookingEntities.forEach(entity => {
        const staffId = entity.assignedStaffId || 'unassigned';
        const duration = getEntityDuration(entity);
        sequentialTotal += duration;
        
        if (staffId !== 'unassigned') {
           staffLoad[staffId] = (staffLoad[staffId] || 0) + duration;
        }
     });

     const staffLoads = Object.values(staffLoad);
     const maxStaffLoad = staffLoads.length > 0 ? Math.max(...staffLoads) : 0;
     
     return {
        sequential: sequentialTotal,
        parallelOptimized: maxStaffLoad,
        isFaster: maxStaffLoad < sequentialTotal && staffLoads.length > 1
     };
  };

  // 1. Staff Based Slots (Services)
  const getMultiEntityAvailableSlots = (date: Date) => {
     const staffAssignments: Record<string, number> = {}; 
     
     bookingEntities.forEach(entity => {
        if (!entity.serviceIds.length) return;
        const staffId = entity.assignedStaffId || staff[0].id; 
        const duration = getEntityDuration(entity);
        staffAssignments[staffId] = (staffAssignments[staffId] || 0) + duration;
     });

     const involvedStaffIds = Object.keys(staffAssignments);
     if (involvedStaffIds.length === 0) return [];

     const slotsPerStaff: Record<string, Date[]> = {};
     involvedStaffIds.forEach(staffId => {
        slotsPerStaff[staffId] = getAvailableSlots(date, staffId, staffAssignments[staffId]);
     });

     const baseStaffId = involvedStaffIds[0];
     const baseSlots = slotsPerStaff[baseStaffId] || [];

     return baseSlots.filter(slot => {
        const slotTime = slot.getTime();
        return involvedStaffIds.every(id => {
           if (id === baseStaffId) return true;
           return slotsPerStaff[id].some(s => s.getTime() === slotTime);
        });
     });
  };

  // 2. Shop Based Slots (Pickup Only)
  const getShopPickupSlots = (date: Date) => {
     const dayIndex = getDay(date);
     const schedule = shopProfile.operatingHours?.find(d => d.dayIndex === dayIndex);
     
     if (!schedule || !schedule.isActive) return [];

     const [startHour, startMin] = schedule.startTime.split(':').map(Number);
     const [endHour, endMin] = schedule.endTime.split(':').map(Number);

     let currentSlot = set(date, { hours: startHour, minutes: startMin, seconds: 0, milliseconds: 0 });
     const endOfDay = set(date, { hours: endHour, minutes: endMin, seconds: 0, milliseconds: 0 });

     const slots: Date[] = [];
     while (currentSlot < endOfDay) {
        if (!isSameDay(date, new Date()) || currentSlot > new Date()) {
           slots.push(new Date(currentSlot));
        }
        currentSlot = addMinutes(currentSlot, 30); // 30 min intervals for pickup
     }
     return slots;
  };

  const availableSlots = hasServices 
      ? getMultiEntityAvailableSlots(selectedDate) 
      : getShopPickupSlots(selectedDate);
      
  const timingInfo = calculateGroupTiming();

  // --- CONFIRMATION ---
  const handlePreConfirm = () => {
     if (paymentPreference === 'ONLINE') {
        setIsPaymentModalOpen(true);
     } else {
        handleFinalBooking();
     }
  };

  const handleFinalBooking = async () => {
     if (!hasServices && selectedProductsList.length === 0) return;

     let finalClientId = '';
     if (isExistingClient && activeClientProfile?.id) {
        finalClientId = activeClientProfile.id;
     } else {
        // addClient retorna o ID do novo cliente
        finalClientId = await addClient({
           name: clientForm.name,
           phone: phoneInput,
           email: clientForm.email,
           birthDate: clientForm.birthDate
        });
     }

     if (hasServices) {
        // ... SERVICE BOOKING LOGIC ...
        const groupId = `GROUP-${Math.random().toString(36).substr(2, 5)}`;
        bookingEntities.forEach(entity => {
           if (entity.serviceIds.length === 0) return;
           const entityServices = services.filter(s => entity.serviceIds.includes(s.id));
           const serviceName = entityServices.map(s => s.name).join(' + ');
           const price = entityServices.reduce((acc, s) => acc + s.price, 0);
           const staffId = entity.assignedStaffId || staff[0].id; 
           const paymentNote = paymentPreference === 'ONLINE' ? ' [PAGO ONLINE]' : ' [PAGAR NA LOJA]';
           const productNote = (entity.isMain && selectedProductsList.length > 0)
              ? ` [Produtos: ${selectedProductsList.map(p => `${p.qty}x ${p.name}`).join(', ')}]` 
              : '';

           addAppointment({
              clientId: entity.isMain ? finalClientId : 'GUEST',
              clientName: entity.isMain ? (activeClientProfile?.name || 'Client') : `${entity.name} (via ${activeClientProfile?.name})`,
              staffId: staffId,
              serviceId: entityServices[0].id, 
              serviceName: `${serviceName} (${entity.name})`,
              date: selectedTimeSlot!,
              price: price,
              status: AppointmentStatus.SCHEDULED,
              notes: `Online Booking Group: ${groupId}.${productNote}${paymentNote}`
           });
        });
     } else {
        // ... PRODUCT PICKUP LOGIC ...
        const productNote = `Pedido de Produtos: ${selectedProductsList.map(p => `${p.qty}x ${p.name}`).join(', ')}`;
        const paymentNote = paymentPreference === 'ONLINE' ? ' [PAGO ONLINE]' : ' [PAGAR NA RETIRADA]';
        
        addAppointment({
           clientId: finalClientId,
           clientName: activeClientProfile?.name || 'Client',
           staffId: staff[0].id, // Assign to Shop Owner/Admin
           serviceId: 'PICKUP', // Special ID or just first service
           serviceName: 'Retirada de Produtos',
           date: selectedTimeSlot!,
           price: totalPrice,
           status: AppointmentStatus.SCHEDULED,
           notes: `${productNote}${paymentNote}`
        });
     }

     setIsPaymentModalOpen(false);
     setStep(9);
  };

  // --- HELPERS ---
  const getClientHistory = () => {
     if (!activeClientProfile || !activeClientProfile.id || activeClientProfile.id === 'TEMP_NEW') return [];
     return appointments
        .filter(a => a.clientId === activeClientProfile.id)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 3);
  };

  const activeEntity = bookingEntities.find(e => e.id === activeEntityId) || bookingEntities[0];

  const RELATIONSHIP_SHORTCUTS = [
     { label: 'Filho(a)', icon: Baby },
     { label: 'Cônjuge', icon: Heart },
     { label: 'Pai/Mãe', icon: UserCheck },
     { label: 'Sobrinho(a)', icon: Smile },
     { label: 'Amigo(a)', icon: Users },
  ];

  // --- RENDER COMPONENTS ---

  const BottomBar = ({ 
     label = "Avançar", 
     onClick, 
     disabled = false, 
     showTotal = true, 
     secondaryLabel = "",
     onSecondaryClick
  }: {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    showTotal?: boolean;
    secondaryLabel?: string;
    onSecondaryClick?: () => void;
  }) => {
     if (totalPrice === 0 && !secondaryLabel && !label) return null;

     return (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 z-50 safe-area-bottom">
           <div className="max-w-md mx-auto flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                 {showTotal && (
                    <div>
                       <p className="text-zinc-400 text-[10px] uppercase font-bold">Total Estimado</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-white font-bold text-xl">${totalPrice.toFixed(2)}</span>
                       </div>
                    </div>
                 )}
                 <button 
                    onClick={onClick}
                    disabled={disabled}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                 >
                    {label} <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
              
              {secondaryLabel && (
                 <button 
                    onClick={onSecondaryClick}
                    className="w-full text-zinc-500 hover:text-white text-xs font-bold py-2 underline decoration-zinc-700 underline-offset-4"
                 >
                    {secondaryLabel}
                 </button>
              )}
           </div>
        </div>
     );
  };

  // 0. INTRO (Unchanged)
  if (step === 0) {
     return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-zinc-900 to-transparent z-0"></div>
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/30">
                 <Scissors className="w-12 h-12 text-zinc-950" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{shopProfile.name}</h1>
              <p className="text-zinc-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                 O jeito mais fácil de agendar seu corte. <br/> Acesse seu perfil e histórico.
              </p>
              <button onClick={() => setStep(1)} className="w-full max-w-sm bg-white hover:bg-zinc-200 text-zinc-900 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group">
                 Entrar / Agendar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="mt-8 text-sm text-zinc-500 flex flex-col gap-2">
                 <span className="flex items-center justify-center gap-2"><MapPin className="w-4 h-4" /> {shopProfile.address}</span>
              </div>
           </div>
           <button onClick={() => setView('DASHBOARD')} className="fixed bottom-4 left-4 text-xs text-zinc-700 hover:text-white flex items-center gap-1 z-20">
              <Home className="w-3 h-3" /> Admin
           </button>
        </div>
     );
  }

  // 1. IDENTIFICATION
  if (step === 1) {
     return (
        <div className="min-h-screen bg-zinc-950 p-6 flex flex-col">
           <button onClick={() => setStep(0)} className="w-8 h-8 flex items-center justify-center bg-zinc-900 rounded-full text-zinc-400 mb-8">
              <ChevronLeft className="w-5 h-5" />
           </button>
           <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Qual seu número?</h2>
              <p className="text-zinc-400 text-sm mb-8">Digite seu celular para acessar seu perfil.</p>
              <div className="space-y-4">
                 <label className="text-xs font-bold text-amber-500 uppercase tracking-wider">Celular / WhatsApp</label>
                 <input type="tel" placeholder="(00) 00000-0000" autoFocus value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-amber-500 text-3xl font-bold text-white py-4 outline-none transition-colors placeholder:text-zinc-800" />
              </div>
           </div>
           <button onClick={handleIdentify} disabled={phoneInput.length < 8} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              Continuar <ArrowRight className="w-4 h-4" />
           </button>
        </div>
     );
  }

  // 2. REGISTRATION
  if (step === 2) {
     const isFormValid = clientForm.name.length > 2 && clientForm.birthDate;
     return (
        <div className="min-h-screen bg-zinc-950 p-6 flex flex-col">
           <button onClick={() => setStep(1)} className="w-8 h-8 flex items-center justify-center bg-zinc-900 rounded-full text-zinc-400 mb-6">
              <ChevronLeft className="w-5 h-5" />
           </button>
           <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                 <h2 className="text-2xl font-bold text-white">Criar Perfil</h2>
                 <span className="bg-amber-500 text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded">NOVO</span>
              </div>
              <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-4 mb-8 relative overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="text-amber-500 font-bold flex items-center gap-2 mb-1">
                       <Sparkles className="w-4 h-4" /> Quase lá!
                    </h3>
                    <p className="text-zinc-300 text-sm mb-3">Preencha para ganhar <b>2 selos de fidelidade</b>.</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Nome Completo</label><input type="text" placeholder="Ex: João Silva" value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none" /></div>
                 <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Data de Nascimento</label><input type="date" value={clientForm.birthDate} onChange={e => setClientForm({...clientForm, birthDate: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none" /></div>
                 <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-2">E-mail (Opcional)</label><input type="email" placeholder="joao@email.com" value={clientForm.email} onChange={e => setClientForm({...clientForm, email: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none" /></div>
              </div>
           </div>
           <button onClick={handleRegister} disabled={!isFormValid} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              {isFormValid ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />} {isFormValid ? 'Criar Perfil' : 'Preencha para Continuar'}
           </button>
        </div>
     );
  }

  // 3. DASHBOARD (Profile View)
  if (step === 3 && activeClientProfile) {
     const history = getClientHistory();
     const nextAppt = history.find(a => a.status === AppointmentStatus.SCHEDULED && a.date > new Date());
     const points = activeClientProfile.loyaltyPoints || 0;

     return (
        <div className="min-h-screen bg-zinc-950 pb-28 relative">
           <div className="bg-zinc-900 p-6 pb-10 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-center relative z-10 mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-zinc-900 font-bold text-xl shadow-lg">{activeClientProfile.name?.charAt(0)}</div>
                    <div><p className="text-zinc-400 text-xs">Bem-vindo,</p><h2 className="text-xl font-bold text-white">{activeClientProfile.name?.split(' ')[0]}</h2></div>
                 </div>
                 <button onClick={() => setStep(0)} className="text-zinc-500 hover:text-white text-xs font-medium bg-zinc-800 px-3 py-1.5 rounded-lg">Sair</button>
              </div>
              <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                 <div className="flex justify-between items-center mb-4"><h3 className="text-amber-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Gift className="w-4 h-4" /> Fidelidade</h3><span className="text-white font-bold text-lg">{points}/10</span></div>
                 <div className="grid grid-cols-5 gap-3">
                    {Array.from({length: 10}).map((_, i) => (
                       <div key={i} className={`aspect-square rounded-full flex items-center justify-center border ${i < points ? 'bg-amber-500 border-amber-500 text-zinc-900 shadow-lg' : 'border-zinc-800 bg-zinc-900/50 text-zinc-700'}`}>
                          {i < points ? <Star className="w-4 h-4 fill-current" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                       </div>
                    ))}
                 </div>
                 {points >= 10 && <div className="mt-4 bg-white text-zinc-900 text-center text-xs font-bold py-2 rounded-lg animate-pulse">🎉 Corte Grátis Disponível!</div>}
              </div>
           </div>
           <div className="p-6 space-y-6">
              
              {/* MEUS DEPENDENTES NO DASHBOARD */}
              {activeClientProfile && (
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                       <h3 className="text-zinc-300 font-bold flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-amber-500" /> Família & Amigos</h3>
                       <button onClick={() => setIsAddingGuestMode(true)} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg border border-zinc-700 font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Adicionar</button>
                    </div>
                    {(!activeClientProfile.dependents || activeClientProfile.dependents.length === 0) ? (
                       <p className="text-zinc-600 text-xs italic">Nenhum dependente cadastrado ainda.</p>
                    ) : (
                       <div className="flex flex-wrap gap-2">
                          {activeClientProfile.dependents.map(dep => (
                             <div key={dep.id} className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-400 flex items-center gap-2">
                                <User className="w-3 h-3" /> {dep.name}
                             </div>
                          ))}
                       </div>
                    )}
                    
                    {isAddingGuestMode && (
                        <div className="mt-3 bg-zinc-950 p-3 rounded-lg border border-zinc-800 animate-fade-in">
                           <p className="text-xs font-bold text-zinc-500 mb-2">Quem você quer cadastrar?</p>
                           <div className="flex gap-2 flex-wrap mb-2">
                              {RELATIONSHIP_SHORTCUTS.map(rel => (
                                 <button 
                                    key={rel.label}
                                    onClick={() => {
                                       const name = rel.label;
                                       if (activeClientProfile && activeClientProfile.id) {
                                          const newDep: Dependent = { id: Date.now().toString(), name: `${name} ${activeClientProfile.dependents?.length ? activeClientProfile.dependents.length + 1 : 1}` };
                                          const updatedDeps = [...(activeClientProfile.dependents || []), newDep];
                                          updateClient({ ...activeClientProfile as Client, dependents: updatedDeps });
                                          setIsAddingGuestMode(false);
                                       }
                                    }}
                                    className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded border border-zinc-700"
                                 >
                                    {rel.label}
                                 </button>
                              ))}
                           </div>
                           <button onClick={() => setIsAddingGuestMode(false)} className="text-xs text-red-500 hover:underline w-full text-center mt-1">Cancelar</button>
                        </div>
                    )}
                 </div>
              )}

              {/* NEXT APPOINTMENT */}
              {nextAppt && (
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center gap-4 mb-3">
                       <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-500"><CalendarCheck className="w-6 h-6" /></div>
                       <div><p className="text-xs text-zinc-500 font-bold uppercase">Próximo Agendamento</p><p className="text-white font-bold">{format(nextAppt.date, "dd 'de' MMM, HH:mm")}</p><p className="text-sm text-zinc-400">{nextAppt.serviceName}</p></div>
                    </div>
                    {/* ACTIONS */}
                    <div className="flex gap-2 pt-2 border-t border-zinc-800">
                       <button onClick={() => handleRescheduleAppointment(nextAppt.id)} className="flex-1 text-xs font-bold text-amber-500 hover:bg-zinc-800 py-2 rounded flex items-center justify-center gap-1 transition-colors"><RefreshCw className="w-3 h-3" /> Mudar</button>
                       <button onClick={() => handleCancelAppointment(nextAppt.id)} className="flex-1 text-xs font-bold text-red-500 hover:bg-zinc-800 py-2 rounded flex items-center justify-center gap-1 transition-colors"><XCircle className="w-3 h-3" /> Cancelar</button>
                    </div>
                 </div>
              )}

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                 <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-amber-500" /><h3 className="text-white font-bold">Indique e Ganhe</h3></div>
                 <p className="text-zinc-400 text-xs mb-4">Compartilhe seu código. Você e seu amigo ganham 1 selo após o corte dele.</p>
                 <div className="flex gap-2">
                    <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-center font-mono font-bold text-white tracking-widest text-lg">{activeClientProfile.referralCode || '----'}</div>
                    <button onClick={() => { navigator.clipboard.writeText(activeClientProfile.referralCode || ''); alert('Código copiado!'); }} className="bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-lg transition-colors"><Copy className="w-5 h-5" /></button>
                 </div>
              </div>

              {/* BARBER CLUB PROMO */}
              {activePlans.length > 0 && (
                 <ClubPromo
                    plans={activePlans.map(p => ({
                       id: p.id,
                       name: p.name,
                       price: p.monthlyPriceBRL,
                       billingCycle: 'MONTHLY' as const,
                       credits: p.monthlyCredits,
                       benefits: p.description ? [p.description] : ['Desconto em serviços', 'Créditos mensais']
                    }))}
                    shopName={shopProfile.name}
                    compact={true}
                    onSelectPlan={() => {
                       // Futuramente: abrir modal de assinatura
                       alert('Em breve você poderá assinar direto pelo app!');
                    }}
                 />
              )}

              <div>
                 <h3 className="text-zinc-500 text-xs font-bold uppercase mb-3 flex items-center gap-2"><History className="w-4 h-4" /> Histórico Recente</h3>
                 <div className="space-y-3">
                    {history.length === 0 ? <p className="text-zinc-600 text-sm italic text-center py-4">Nenhum histórico ainda.</p> : history.map(appt => (
                       <div key={appt.id} className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                          <div><p className="text-white text-sm font-medium">{appt.serviceName}</p><p className="text-zinc-500 text-xs">{format(appt.date, "dd/MM/yyyy")}</p></div><span className="text-zinc-400 text-sm">${appt.price}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
           <div className="fixed bottom-0 left-0 w-full p-4 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 z-50 flex gap-3">
              <button onClick={() => startFlow('SERVICE')} className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"><Scissors className="w-5 h-5" /> Agendar</button>
              <button onClick={() => startFlow('PRODUCT')} className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"><ShoppingBag className="w-5 h-5 text-zinc-400" /> Produtos</button>
           </div>
        </div>
     );
  }

  // ... (Rest of component rendered via steps 4-9 as normal)
  // For brevity, assuming the rest of the flow follows existing logic
  // The crucial part is the feature gate at the beginning.
  
  // 4. SERVICE SELECTION (UPSELL AWARE)
  if (step === 4) {
     const isUpsell = entryPoint === 'PRODUCT';
     
     return (
        <div className="min-h-screen bg-zinc-950 pb-32">
           <div className="p-4 bg-zinc-950 sticky top-0 z-40 border-b border-zinc-800">
              <Header 
                 title={isUpsell ? "Aproveitar a viagem?" : "Quem vai cortar?"} 
                 onBack={handleBack} 
                 step={1} 
                 total={4} 
              />
              
              {isUpsell && (
                 <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl mb-2 flex items-center gap-3 animate-fade-in">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <p className="text-xs text-amber-200">
                       Já que vai passar aqui para retirar, que tal dar um tapa no visual?
                    </p>
                 </div>
              )}

              {/* Guest Tabs - Only show if standard service flow */}
              {!isUpsell && (
                 <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {bookingEntities.map(entity => (
                       <button
                          key={entity.id}
                          onClick={() => setActiveEntityId(entity.id)}
                          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                             activeEntityId === entity.id 
                             ? 'bg-zinc-100 text-zinc-900 border-white' 
                             : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                          }`}
                       >
                          <User className="w-3 h-3" />
                          {entity.name}
                          {entity.serviceIds.length > 0 && (
                             <span className="bg-amber-500 text-zinc-900 text-[9px] px-1.5 rounded-full">{entity.serviceIds.length}</span>
                          )}
                          {!entity.isMain && (
                             <div 
                                onClick={(e) => { e.stopPropagation(); removeGuest(entity.id); }}
                                className="ml-2 p-0.5 rounded-full hover:bg-red-500 hover:text-white"
                             >
                                <X className="w-3 h-3" />
                             </div>
                          )}
                       </button>
                    ))}
                    
                    <button 
                       onClick={() => setIsAddingGuestMode(!isAddingGuestMode)}
                       className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border flex items-center gap-2 transition-all ${isAddingGuestMode ? 'bg-amber-500 text-zinc-900 border-amber-500' : 'bg-zinc-900 border-dashed border-zinc-700 text-zinc-400'}`}
                    >
                       {isAddingGuestMode ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                       {isAddingGuestMode ? 'Cancelar' : 'Add Pessoa'}
                    </button>
                 </div>
              )}

              {isAddingGuestMode && !isUpsell && (
                 <div className="mt-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800 animate-fade-in shadow-xl">
                    <p className="text-xs text-zinc-500 font-bold mb-3 uppercase flex items-center gap-2">
                       <UserPlus className="w-3 h-3 text-amber-500" /> Quem será atendido?
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                       {RELATIONSHIP_SHORTCUTS.map(rel => {
                          const Icon = rel.icon;
                          return (
                             <button
                                key={rel.label}
                                onClick={() => handleAddGuest(rel.label)}
                                className="bg-zinc-800 hover:bg-zinc-700 hover:text-amber-500 text-zinc-300 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 border border-zinc-700 transition-all"
                             >
                                <Icon className="w-3 h-3" /> {rel.label}
                             </button>
                          );
                       })}
                    </div>
                    {/* Manual Name Input */}
                    <div className="flex items-center gap-2">
                       <input 
                          autoFocus
                          type="text" 
                          placeholder="Ou digite o nome aqui..." 
                          className="flex-1 bg-zinc-950 text-white text-sm border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-amber-500"
                          value={tempGuestName}
                          onChange={e => setTempGuestName(e.target.value)}
                       />
                       <button 
                          onClick={() => handleAddGuest(tempGuestName)} 
                          className="bg-amber-500 text-zinc-900 rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!tempGuestName.trim()}
                       >
                          Add
                       </button>
                    </div>
                 </div>
              )}
           </div>

           <div className="p-4 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-white font-bold text-lg">Serviços para {activeEntity.name}</h3>
              </div>
              <div className="space-y-3">
                 {services.map(service => {
                    const isSelected = activeEntity.serviceIds.includes(service.id);
                    return (
                       <button
                          key={service.id}
                          onClick={() => toggleServiceForEntity(service.id)}
                          className={`w-full p-4 rounded-xl flex justify-between items-center transition-all border ${isSelected ? 'bg-amber-500/10 border-amber-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                       >
                          <div className="text-left">
                             <h3 className={`font-bold ${isSelected ? 'text-amber-500' : 'text-white'}`}>{service.name}</h3>
                             <p className="text-xs text-zinc-500 mt-1">{service.durationMinutes} min • {service.category}</p>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className="font-bold text-zinc-300">${service.price}</span>
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${isSelected ? 'bg-amber-500 border-amber-500 text-zinc-900' : 'border-zinc-600 bg-transparent'}`}>
                                {isSelected && <Check className="w-4 h-4" />}
                             </div>
                          </div>
                       </button>
                    );
                 })}
              </div>
           </div>

           <BottomBar 
              label={isUpsell && !hasServices ? "Apenas Retirar Produtos" : "Avançar"}
              onClick={handleNextStep}
              disabled={!isUpsell && !hasServices} // Disable only if NOT in upsell mode (normal service flow requires service)
              secondaryLabel={isUpsell && hasServices ? "Não, apenas produtos" : ""}
              onSecondaryClick={() => setStep(7)} // Skip to Time
           />
        </div>
     );
  }

  // 5. PRODUCT UPSELL
  if (step === 5) {
     return (
        <div className="min-h-screen bg-zinc-950 pb-28">
           <div className="p-4 bg-zinc-950 sticky top-0 z-40 border-b border-zinc-800">
              <Header title="Levar algo da Loja?" onBack={handleBack} step={2} total={4} />
              <p className="text-zinc-400 text-sm mt-2">Aproveite a visita para complementar seu pedido.</p>
              
              {/* Entity Tabs - ONLY SHOW IF NOT PRODUCT-FIRST FLOW */}
              {entryPoint !== 'PRODUCT' && (
                 <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-4 scrollbar-hide">
                    {bookingEntities.map(entity => (
                       <div
                          key={entity.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border bg-zinc-900 border-zinc-800 text-zinc-400`}
                       >
                          <User className="w-3 h-3" />
                          {entity.name}
                       </div>
                    ))}
                 </div>
              )}
           </div>

           <div className="p-4 space-y-3">
              {products.map(product => {
                 const qty = productQuantities[product.id] || 0;
                 return (
                    <div
                       key={product.id}
                       className={`w-full p-3 rounded-xl flex gap-3 items-center transition-all border ${qty > 0 ? 'bg-amber-500/10 border-amber-500' : 'bg-zinc-900 border-zinc-800'}`}
                    >
                       <div className="w-16 h-16 bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                          {product.image ? (
                             <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-zinc-600" /></div>
                          )}
                       </div>
                       <div className="flex-1 text-left">
                          <h3 className={`font-bold text-sm ${qty > 0 ? 'text-amber-500' : 'text-white'}`}>{product.name}</h3>
                          <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{product.category}</p>
                          <span className="font-bold text-zinc-300 text-sm mt-1 block">${product.price}</span>
                       </div>
                       
                       <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-700">
                          <button onClick={() => updateProductQty(product.id, -1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                          <div className="w-6 text-center text-sm font-bold text-white">{qty}</div>
                          <button onClick={() => updateProductQty(product.id, 1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                       </div>
                    </div>
                 );
              })}
              {products.length === 0 && <div className="text-center py-10 text-zinc-500">Nenhum produto disponível.</div>}
           </div>

           <BottomBar 
              label={entryPoint === 'PRODUCT' ? "Continuar" : (totalPrice > 0 ? "Revisar & Finalizar" : "Pular")}
              onClick={handleNextStep}
              secondaryLabel={entryPoint !== 'PRODUCT' ? "Pular" : ""}
           />
        </div>
     );
  }

  // 6. SELECT STAFF
  if (step === 6) {
     const entitiesWithServices = bookingEntities.filter(e => e.serviceIds.length > 0);
     const allAssigned = entitiesWithServices.every(e => e.assignedStaffId);
     const timingInfo = calculateGroupTiming();

     return (
        <div className="min-h-screen bg-zinc-950 p-4 pb-32">
           <Header title="Escolha o Profissional" onBack={handleBack} step={3} total={4} />
           
           <p className="text-zinc-400 text-sm mb-4">
              {entitiesWithServices.length > 1 ? 'Para economizar tempo, escolha profissionais diferentes.' : 'Escolha quem vai te atender.'}
           </p>

           <div className="space-y-6">
              {entitiesWithServices.map((entity, idx) => {
                 const entityDuration = getEntityDuration(entity);
                 
                 return (
                    <div key={entity.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-fade-in" style={{animationDelay: `${idx * 100}ms`}}>
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                <User className="w-5 h-5 text-white" />
                             </div>
                             <div>
                                <h4 className="font-bold text-white">{entity.name}</h4>
                                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 mt-1 w-max">
                                   <Clock className="w-3 h-3 text-amber-500" /> {entityDuration} min
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                          {staff.map(member => {
                             const canPerform = entity.serviceIds.every(sId => member.allowedServices?.includes(sId));
                             if (!canPerform) return null; 

                             const isSelected = entity.assignedStaffId === member.id;
                             const isAssignedToOther = bookingEntities.some(e => e.id !== entity.id && e.assignedStaffId === member.id);

                             return (
                                <button
                                   key={member.id}
                                   onClick={() => assignStaffToEntity(entity.id, member.id)}
                                   className={`relative p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                                      isSelected 
                                      ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50' 
                                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                                   }`}
                                >
                                   <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${isSelected ? 'border-amber-500' : 'border-zinc-700'}`}>
                                      {member.avatar ? (
                                         <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                      ) : (
                                         <div className="w-full h-full bg-zinc-800 flex items-center justify-center"><User className="w-6 h-6 text-zinc-500" /></div>
                                      )}
                                   </div>
                                   <span className={`text-xs font-bold ${isSelected ? 'text-amber-500' : 'text-zinc-400'}`}>
                                      {member.name}
                                   </span>
                                   
                                   {isAssignedToOther && (
                                      <div className={`absolute top-2 right-2 flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded-full w-5 h-5 shadow-sm z-10`} title="Ocupado">
                                         <Clock className="w-3 h-3 text-red-500" />
                                      </div>
                                   )}
                                </button>
                             );
                          })}
                       </div>
                       
                       {bookingEntities.some(e => e.id !== entity.id && e.assignedStaffId === entity.assignedStaffId && entity.assignedStaffId) && (
                          <div className="mt-3 text-[10px] text-red-200 bg-red-500/20 border border-red-500/30 px-3 py-2 rounded-lg flex items-center gap-2">
                             <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" /> 
                             <span><b>Atenção:</b> {entity.name} terá que esperar. Escolha outro profissional para atendimento simultâneo.</span>
                          </div>
                       )}
                    </div>
                 );
              })}
           </div>

           <div className="fixed bottom-0 left-0 w-full p-4 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 z-50">
              <div className="max-w-md mx-auto">
                 {bookingEntities.length > 1 && (
                    <div className="flex justify-between items-center mb-3 text-xs">
                       <span className="text-zinc-400">Tempo Total da Experiência:</span>
                       <div className="text-right">
                          <span className={`font-bold text-lg ${timingInfo.isFaster ? 'text-emerald-400' : 'text-white'}`}>
                             {timingInfo.parallelOptimized} min
                          </span>
                          {timingInfo.isFaster && (
                             <span className="block text-[10px] text-emerald-500">
                                ⚡ {timingInfo.sequential - timingInfo.parallelOptimized} min mais rápido (Simultâneo)
                             </span>
                          )}
                          {!timingInfo.isFaster && (
                             <span className="block text-[10px] text-zinc-500">
                                Sequencial (Um após o outro)
                             </span>
                          )}
                       </div>
                    </div>
                 )}
                 
                 <button 
                    onClick={() => setStep(7)}
                    disabled={!allAssigned}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                 >
                    Ver Horários <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
     );
  }

  // 7. SELECT DATE & TIME
  if (step === 7) {
     return (
        <div className="min-h-screen bg-zinc-950 p-4 flex flex-col">
           <Header title="Data e Hora" onBack={handleBack} step={3} total={4} />
           
           <div className="flex gap-3 overflow-x-auto pb-4 mt-2 scrollbar-hide">
              {availableDates.map(date => {
                 const isSelected = isSameDay(date, selectedDate);
                 return (
                    <button
                       key={date.toString()}
                       onClick={() => { setSelectedDate(date); setSelectedTimeSlot(null); }}
                       className={`min-w-[70px] p-3 rounded-xl flex flex-col items-center justify-center border transition-all ${isSelected ? 'bg-amber-500 border-amber-500 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                    >
                       <span className="text-[10px] font-bold uppercase">{format(date, 'EEE')}</span>
                       <span className="text-xl font-bold">{format(date, 'dd')}</span>
                    </button>
                 );
              })}
           </div>
           <div className="flex-1 overflow-y-auto mt-2 pb-24">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                 <Clock className="w-4 h-4 text-amber-500" /> 
                 {hasServices ? 'Horários Compatíveis' : 'Horários de Retirada'}
              </h4>
              {availableSlots.length === 0 ? (
                 <div className="text-center py-10 bg-zinc-900 rounded-xl border border-zinc-800 border-dashed">
                    <p className="text-zinc-500 text-sm">
                       {hasServices ? 'Sem horários livres para todos nesta data.' : 'Loja fechada nesta data.'}
                    </p>
                    <p className="text-xs text-zinc-600 mt-2">Tente mudar {hasServices ? 'o profissional ou ' : ''}a data.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-2 gap-3">
                    {availableSlots.map((slot, idx) => {
                       const endTime = addMinutes(slot, hasServices ? timingInfo.parallelOptimized : 30);
                       return (
                          <button
                             key={idx}
                             onClick={() => { setSelectedTimeSlot(slot); setStep(8); }}
                             className="py-3 px-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-amber-500 text-white font-medium text-sm transition-all flex justify-between items-center"
                          >
                             <span>{format(slot, 'HH:mm')}</span>
                             <span className="text-xs text-zinc-500">até {format(endTime, 'HH:mm')}</span>
                          </button>
                       );
                    })}
                 </div>
              )}
           </div>
        </div>
     );
  }

  // 8. INFO & CONFIRM & PAYMENT
  if (step === 8) {
     const onlineMethods = shopSettings.paymentSettings?.online || [PaymentMethod.CREDIT_CARD, PaymentMethod.PIX];

     return (
        <div className="min-h-screen bg-zinc-950 p-4 pb-32">
           <Header title="Revisão" onBack={handleBack} step={4} total={4} />
           
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mt-4 mb-6">
              <h4 className="text-zinc-500 text-xs font-bold uppercase mb-4">Resumo do Pedido</h4>
              
              <div className="space-y-4">
                 <div className="flex justify-between">
                    <span className="text-zinc-400">Cliente Principal</span>
                    <span className="text-white font-bold text-right">{activeClientProfile?.name}<br/><span className="text-zinc-500 font-normal text-xs">{phoneInput}</span></span>
                 </div>
                 
                 <div className="flex justify-between">
                    <span className="text-zinc-400">{hasServices ? 'Data e Hora' : 'Previsão de Retirada'}</span>
                    <span className="text-amber-500 font-bold">{format(selectedTimeSlot!, "dd/MM 'às' HH:mm")}</span>
                 </div>

                 <hr className="border-zinc-800" />
                 
                 {/* Services List Per Entity */}
                 {hasServices && bookingEntities.map(entity => {
                    const entityServices = services.filter(s => entity.serviceIds.includes(s.id));
                    if (entityServices.length === 0) return null;
                    const assignedStaff = staff.find(s => s.id === entity.assignedStaffId);

                    return (
                       <div key={entity.id} className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                             <p className="text-xs text-white font-bold uppercase flex items-center gap-1">
                                <User className="w-3 h-3 text-zinc-500" /> {entity.name}
                             </p>
                             <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                                com {assignedStaff?.name}
                             </span>
                          </div>
                          {entityServices.map(s => (
                             <div key={s.id} className="flex justify-between mb-1 text-sm pl-4 border-l-2 border-zinc-800">
                                <span className="text-zinc-300">{s.name}</span>
                                <span className="text-zinc-400">${s.price}</span>
                             </div>
                          ))}
                       </div>
                    );
                 })}

                 {/* Products List */}
                 {selectedProductsList.length > 0 && (
                    <div>
                       <p className="text-xs text-amber-500 font-bold uppercase mb-2 mt-4">Produtos (Retirada)</p>
                       {selectedProductsList.map(p => (
                          <div key={p.id} className="flex justify-between mb-1 text-sm">
                             <span className="text-white">{p.qty}x {p.name}</span>
                             <span className="text-zinc-400">${(p.price * p.qty).toFixed(2)}</span>
                          </div>
                       ))}
                    </div>
                 )}

                 <hr className="border-zinc-800" />
                 
                 <div className="flex justify-between items-center">
                    <span className="text-zinc-300 font-bold">Total</span>
                    <span className="text-white font-bold text-2xl">${totalPrice.toFixed(2)}</span>
                 </div>
              </div>
           </div>

           {/* PAYMENT SELECTOR */}
           <div className="mb-6">
              <h4 className="text-zinc-400 text-xs font-bold uppercase mb-3">Forma de Pagamento</h4>
              <div className="grid grid-cols-2 gap-3">
                 <button 
                    onClick={() => setPaymentPreference('SHOP')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentPreference === 'SHOP' ? 'bg-zinc-800 border-amber-500 ring-1 ring-amber-500/50' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                 >
                    <Home className={`w-6 h-6 ${paymentPreference === 'SHOP' ? 'text-amber-500' : 'text-zinc-500'}`} />
                    <span className={`text-xs font-bold ${paymentPreference === 'SHOP' ? 'text-white' : 'text-zinc-400'}`}>
                       {hasServices ? 'Pagar na Loja' : 'Pagar na Retirada'}
                    </span>
                 </button>
                 <button 
                    onClick={() => setPaymentPreference('ONLINE')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentPreference === 'ONLINE' ? 'bg-zinc-800 border-emerald-500 ring-1 ring-emerald-500/50' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                 >
                    <Smartphone className={`w-6 h-6 ${paymentPreference === 'ONLINE' ? 'text-emerald-500' : 'text-zinc-500'}`} />
                    <span className={`text-xs font-bold ${paymentPreference === 'ONLINE' ? 'text-white' : 'text-zinc-400'}`}>Pagar Online</span>
                 </button>
              </div>
           </div>

           <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <p className="text-emerald-200 text-xs">
                 Ao confirmar, você ganhará <b>+{stampsEarned} selos</b> no seu cartão fidelidade!
              </p>
           </div>

           <button 
              onClick={handlePreConfirm} 
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-4 rounded-xl shadow-lg mt-4 transition-all"
           >
              {paymentPreference === 'ONLINE' ? 'Pagar & Confirmar' : 'Confirmar Agendamento'}
           </button>

           {/* PAYMENT GATEWAY MODAL (SIMULATED) */}
           {isPaymentModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                 <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md p-6 shadow-2xl animate-fade-in relative">
                    <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
                    
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                       <Lock className="w-5 h-5 text-emerald-500" /> Pagamento Seguro
                    </h3>
                    <p className="text-zinc-400 text-sm mb-6">Escolha como deseja finalizar seu pagamento de <b>${totalPrice.toFixed(2)}</b>.</p>

                    <div className="space-y-3">
                       {/* DYNAMIC ONLINE METHODS */}
                       {onlineMethods.map(method => {
                          const Icon = PAYMENT_ICONS[method] || CreditCard;
                          const label = PAYMENT_LABELS[method] || method;
                          
                          return (
                             <button 
                                key={method}
                                onClick={handleFinalBooking} 
                                className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-emerald-500 transition-all group"
                             >
                                <div className="flex items-center gap-3">
                                   <Icon className="w-6 h-6 text-zinc-400 group-hover:text-emerald-500" />
                                   <div className="text-left">
                                      <span className="block font-bold text-white text-sm">{label}</span>
                                      <span className="block text-[10px] text-zinc-500">Redirecionar para app</span>
                                   </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-500" />
                             </button>
                          );
                       })}
                    </div>
                    
                    <p className="text-[10px] text-center text-zinc-600 mt-6 flex items-center justify-center gap-1">
                       <Lock className="w-3 h-3" /> Seus dados são criptografados de ponta a ponta.
                    </p>
                 </div>
              </div>
           )}
        </div>
     );
  }

  // 9. SUCCESS (Unchanged)
  if (step === 9) {
     return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
           <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 animate-bounce"><CheckCircle2 className="w-10 h-10 text-zinc-900" /></div>
           <h2 className="text-2xl font-bold text-white mb-2">Tudo Certo!</h2>
           <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
              {hasServices ? `Te esperamos no dia ${format(selectedTimeSlot!, "dd/MM")} às ${format(selectedTimeSlot!, "HH:mm")}.` : 'Seus produtos foram reservados para retirada.'}
           </p>
           {bookingEntities.length > 1 && (
              <p className="text-xs text-zinc-500 mb-4 bg-zinc-900 p-2 rounded">
                 Agendamento múltiplo confirmado para {bookingEntities.length} pessoas.
              </p>
           )}
           <button onClick={() => { setStep(3); setSelectedTimeSlot(null); setBookingEntities([]); setProductQuantities({}); }} className="text-amber-500 hover:text-amber-400 font-bold text-sm">Voltar ao Meu Perfil</button>
        </div>
     );
  }

  return null;
};

// Simple Header Component
const Header = ({ title, onBack, step, total }: { title: string, onBack: () => void, step: number, total: number }) => (
   <div className="flex items-center justify-between mb-2">
      <button onClick={onBack} className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white border border-zinc-800"><ChevronLeft className="w-5 h-5" /></button>
      <div className="text-center">
         <h2 className="text-white font-bold">{title}</h2>
         <div className="flex gap-1 justify-center mt-1">
            {Array.from({length: total}).map((_, i) => (
               <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < step ? 'bg-amber-500' : 'bg-zinc-800'}`}></div>
            ))}
         </div>
      </div>
      <div className="w-9"></div>
   </div>
);
