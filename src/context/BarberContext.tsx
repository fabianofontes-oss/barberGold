
import React, { createContext, useContext, useState, ReactNode, PropsWithChildren, useEffect } from 'react';
import { Appointment, Client, Product, Service, Sale, ViewState, AppointmentStatus, PaymentMethod, CartItem, RecurrenceType, StaffMember, CommissionPlan, Expense, ShopSettings, StaffPayment, ShopProfile, DaySchedule, InventoryItem, Supplier, SupplyTransaction, Category, CategoryType, RegisterClosure, QueueItem, Review, Tenant, SupportTicket, GlobalInvoice, Integration, ReferralSource, LandingPageConfig, MarketingCampaign, GlobalSettings, SaasV2TenantStatus, SaasV2PlanId, SaasPlan, SaasPlanId } from '@/types';
import { MOCK_APPOINTMENTS, MOCK_CLIENTS, PRODUCTS, SERVICES, MOCK_STAFF, MOCK_PLANS, MOCK_INVENTORY, MOCK_SUPPLIERS, MOCK_SUPPLY_TRANSACTIONS, MOCK_CATEGORIES, MOCK_TENANTS, MOCK_TICKETS, MOCK_INVOICES, MOCK_INTEGRATIONS } from '@/constants';
import { addDays, addWeeks, addMonths, isAfter, areIntervalsOverlapping, addMinutes, set, getDay, isSameDay } from 'date-fns';
import { useSaasV2 } from './SaasV2Context';
import { useTenantPlanSlice } from './slices/tenantPlanSlice';
import { useReferralSlice } from './slices/referralSlice';

// --- LOCALSTORAGE HELPERS ---
const STORAGE_KEY = 'barberflow_data';

const saveToStorage = (data: any) => {
  try {
    // Converte Dates para strings antes de salvar
    const serialized = JSON.stringify(data, (key, value) => {
      if (value instanceof Date) return { __type: 'Date', value: value.toISOString() };
      return value;
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.warn('Erro ao salvar no localStorage:', e);
  }
};

const loadFromStorage = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    // Safety check: if raw is not valid JSON, catch block will handle it
    const data = JSON.parse(raw, (key, value) => {
      // Safe Date parsing
      if (value && typeof value === 'object' && value.__type === 'Date') {
        const date = new Date(value.value);
        return isNaN(date.getTime()) ? null : date;
      }
      // Detect ISO date strings if they were saved directly
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
         const date = new Date(value);
         return isNaN(date.getTime()) ? value : date;
      }
      return value;
    });

    return data;
  } catch (e) {
    console.error('❌ CRITICAL: Erro ao carregar localStorage (Dados corrompidos). Resetando...', e);
    // Em caso de erro crítico de parse, limpa o storage para recuperar o app
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    return null;
  }
};

// --- INITIAL DATA ---
const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
   { id: '1', title: 'Black Friday Boost', content: '50% off on "Pro" plan upgrades this week only!', type: 'BANNER', targetAudience: 'FREE_PLAN', status: 'ACTIVE', clicks: 142, views: 2500, createdAt: new Date() },
   { id: '2', title: 'New Finance Module', content: 'Check out the new Financial Reports in your dashboard.', type: 'MODAL', targetAudience: 'ALL', status: 'COMPLETED', clicks: 890, views: 1200, createdAt: new Date() },
];

/**
 * Configurações globais da aplicação (modo demo/localStorage)
 * IMPORTANTE: Chaves de API (Stripe, etc.) devem ser server-side only (env vars)
 */
const INITIAL_GLOBAL_SETTINGS: GlobalSettings = {
   appName: 'BarberFlow',
   trialDays: 14,
   currency: 'USD',
   enableMaintenance: false,
   enableSignup: true
};

interface BarberContextType {
  // State
  isAuthenticated: boolean; // NEW: Auth State
  currentUser: StaffMember; // Who is logged in?
  shopProfile: ShopProfile;
  currentView: ViewState;
  appointments: Appointment[];
  queue: QueueItem[]; // NEW: Walk-in Queue
  clients: Client[];
  products: Product[];
  services: Service[];
  sales: Sale[];
  staff: StaffMember[];
  commissionPlans: CommissionPlan[];
  expenses: Expense[];
  staffPayments: StaffPayment[]; 
  shopSettings: ShopSettings;
  todayRevenue: number;
  inventory: InventoryItem[]; 
  suppliers: Supplier[]; 
  supplyTransactions: SupplyTransaction[]; 
  categories: Category[]; 
  registerClosures: RegisterClosure[]; 
  reviews: Review[]; // NEW
  
  // SUPER ADMIN STATE
  tenants: Tenant[]; 
  tickets: SupportTicket[]; // NEW
  globalInvoices: GlobalInvoice[]; // NEW
  integrations: Integration[]; // NEW
  referrals: ReferralSource[]; // NEW
  landingPageConfig: LandingPageConfig; // NEW: SaaS Public Site Config
  
  // NEW: Office God State
  saasPlans: SaasPlan[];
  marketingCampaigns: MarketingCampaign[];
  globalSettings: GlobalSettings;

  // Multi-tenant / SaaS V2
  currentTenantId: string | null;
  currentTenantStatus?: SaasV2TenantStatus;
  currentTenantPlanId?: SaasV2PlanId;
  isImpersonating: boolean;

  // Navigation State for Wizard (Simulating URL params)
  activeReviewAppointmentId?: string;

  // Actions
  login: (email: string, pass: string) => boolean; // NEW
  logout: () => void; // NEW
  switchUser: (staffId: string) => void;
  updateShopProfile: (profile: ShopProfile) => void;
  setView: (view: ViewState, params?: any) => void; // Updated signature
  addAppointment: (appt: Omit<Appointment, 'id' | 'status'> & { status?: AppointmentStatus }) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  
  // Queue Actions
  joinQueue: (item: Omit<QueueItem, 'id' | 'arrivalTime'>) => void;
  leaveQueue: (id: string) => void;

  processSale: (items: CartItem[], clientId: string | null, staffId: string, method: PaymentMethod, discountReason?: string, tip?: number) => void;
  submitReview: (review: Omit<Review, 'id' | 'date'>) => void; // NEW
  addLateTip: (appointmentId: string, amount: number, method: PaymentMethod) => void; // NEW

  addClient: (client: Omit<Client, 'id' | 'totalSpent' | 'lastVisit' | 'loyaltyPoints' | 'referralCode' | 'profileCompleted'> & { referrerCode?: string }) => string; // Returns ID
  updateClient: (client: Client) => void;
  
  // Catalog & Staff Actions
  updateService: (service: Service) => void;
  addService: (service: Omit<Service, 'id' | 'type'>) => void;
  deleteService: (id: string) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id' | 'type'>) => void;
  deleteProduct: (id: string) => void;
  addStaff: (staff: Omit<StaffMember, 'id'>) => void;
  updateStaff: (staff: StaffMember) => void;
  addCommissionPlan: (plan: Omit<CommissionPlan, 'id'>) => void;
  deleteCommissionPlan: (id: string) => void;
  
  // Inventory & Supplier Actions
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  adjustInventoryStock: (id: string, amount: number, type: 'ADD' | 'CONSUME') => void;
  restockInventoryItem: (itemId: string, quantity: number, unitCost: number, supplierId: string) => void;
  restockProduct: (productId: string, quantity: number, unitCost: number) => void; // NEW
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;

  // Category Actions
  addCategory: (name: string, type: CategoryType) => void;
  deleteCategory: (id: string) => void;

  // Finance Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  addStaffPayment: (payment: Omit<StaffPayment, 'id'>) => void; 
  closeRegister: (closure: Omit<RegisterClosure, 'id'>) => void; // NEW

  // Settings Actions
  updateShopSettings: (settings: Partial<ShopSettings>) => void;

  // Growth Actions
  addReferralSource: (source: Omit<ReferralSource, 'id' | 'stats'>) => void;
  updateReferralSource: (source: ReferralSource) => void;
  deleteReferralSource: (id: string) => void;

  // SUPER ADMIN ACTIONS
  addTenant: (tenant: Omit<Tenant, 'id' | 'joinedDate' | 'status'>) => void;
  updateTenantStatus: (id: string, status: Tenant['status']) => void;
  updateTenantPlan: (tenantId: string, planId: SaasPlanId) => void; // NEW ACTION
  deleteTenant: (id: string) => void;
  impersonateTenant: (tenantId: string) => void;
  exitImpersonation: () => void;
  resolveTicket: (ticketId: string) => void; // NEW
  markInvoicePaid: (invoiceId: string) => void; // NEW
  updateIntegration: (integration: Integration) => void; // NEW
  updateLandingPageConfig: (config: Partial<LandingPageConfig>) => void; // NEW
  
  // NEW: Office God Actions
  addSaasPlan: (plan: SaasPlan) => void;
  updateSaasPlan: (plan: SaasPlan) => void;
  addMarketingCampaign: (campaign: MarketingCampaign) => void;
  deleteMarketingCampaign: (id: string) => void;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;

  // Helper
  getAvailableSlots: (date: Date, staffId: string, durationMinutes: number) => Date[];
}

const BarberContext = createContext<BarberContextType | undefined>(undefined);

export const BarberProvider = ({ children }: PropsWithChildren) => {
  const { currentTenantId, setCurrentTenantId, getTenantById } = useSaasV2();
  // ... (keep existing state setup) ...
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [currentUser, setCurrentUser] = useState<StaffMember>(MOCK_STAFF[0]); 
  const [currentView, setView] = useState<ViewState>('SAAS_LANDING'); 
  const [activeReviewAppointmentId, setActiveReviewAppointmentId] = useState<string | undefined>();
  const [shopProfile, setShopProfile] = useState<ShopProfile>({
    name: 'Premium Gold',
    slug: 'premium-gold',
    logo: '', 
    address: '123 Main St, Downtown',
    phone: '(55) 99999-9999',
    whatsapp: '(55) 99999-9999',
    instagram: '@premiumgold',
    operatingHours: Array.from({ length: 7 }, (_, i) => ({
      dayIndex: i,
      isActive: i !== 0,
      startTime: '09:00',
      endTime: i === 6 ? '14:00' : '20:00',
      breaks: []
    }))
  });

  // Data State
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [sales, setSales] = useState<Sale[]>([]);
  const [commissionPlans, setCommissionPlans] = useState<CommissionPlan[]>(MOCK_PLANS);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [staffPayments, setStaffPayments] = useState<StaffPayment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [supplyTransactions, setSupplyTransactions] = useState<SupplyTransaction[]>(MOCK_SUPPLY_TRANSACTIONS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [registerClosures, setRegisterClosures] = useState<RegisterClosure[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // SUPER ADMIN STATE
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [globalInvoices, setGlobalInvoices] = useState<GlobalInvoice[]>(MOCK_INVOICES);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  
  // NEW: Office God State
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>(INITIAL_CAMPAIGNS);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(INITIAL_GLOBAL_SETTINGS);

  const referralSlice = useReferralSlice();
  const referrals = referralSlice.referrals;

  const tenantPlanSlice = useTenantPlanSlice({
    currentTenantId,
    setCurrentTenantId,
    getTenantById,
    tenants,
    setTenants,
    setView,
    setShopProfile,
  });

  // ... (keep Landing Page & Shop Settings State) ...
  const [landingPageConfig, setLandingPageConfig] = useState<LandingPageConfig>({
     heroHeadline: "Aposente o Caderno. Transforme sua Barbearia em uma Máquina de Lucro.",
     heroSubheadline: "Agenda, Financeiro e Marketing Automático em um só lugar. Tenha o controle total do seu negócio na palma da mão.",
     heroCtaText: "Começar Teste Grátis",
     seoTitle: "BarberFlow | Sistema de Gestão para Barbearias",
     seoDescription: "O melhor sistema para barbearias. Agenda online, controle financeiro e comissões automáticas.",
     seoKeywords: "barbearia, sistema, agenda, gestão",
     showPricing: true,
     showTestimonials: true,
     featuredPlanId: 'PRO',
     announcementBar: {
        enabled: true,
        text: "🎉 BarberFlow.com.br no ar! Aproveite 50% OFF no Plano Anual!",
        link: "#pricing"
     }
  });

  const [shopSettings, setShopSettings] = useState<ShopSettings>({
    dailyRevenueGoal: 1000, 
    returnReminderDays: 28,
    winBackDays: 60,
    fidelityThreshold: 2, 
    messageTemplateOverdue: "Olá {name}, já faz {days} dias que não te vemos! Agende agora: {booking_link}",
    messageTemplateWinBack: "Olá {name}, saudades! Volte essa semana e ganhe 5% OFF! Agende: {booking_link}",
    enableBirthdayDiscount: true,
    enableWinBackDiscount: true,
    enableLoyaltyCard: true,
    enableReferralSystem: true,
    enableTipsReview: true, 
    hideClientContactInfo: true, 
    enableCashControl: false, 
    discountAllocation: 'SHARED', 
    queueDistributionRule: 'FAIRNESS', 
    paymentSettings: {
       inStore: [PaymentMethod.CASH, PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD, PaymentMethod.PIX],
       online: [PaymentMethod.CREDIT_CARD, PaymentMethod.PIX] 
    },
    website: {
       themeTemplate: 'PREMIUM',
       customColors: { primary: '#09090b', secondary: '#18181b', accent: '#f59e0b', text: '#ffffff', borderRadius: '0.75rem' },
       heroTitle: "Estilo & Tradição",
       heroSubtitle: "A experiência premium que você merece. Cuidado clássico para o homem moderno.",
       heroImage: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000",
       aboutTitle: "Sobre a Premium Gold",
       aboutText: "Fundada com a missão de resgatar a barbearia clássica...",
       aboutImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000",
       sectionOrder: ['HERO', 'ABOUT', 'SERVICES', 'PRODUCTS', 'GALLERY', 'REVIEWS', 'LOCATION'],
       showTeam: true,
       showServices: true,
       showLocation: true,
       coverOpacity: 0.5,
       gallery: [],
       externalReviews: []
    },
    referralConfig: {
      enabled: true, // ALWAYS ON FOR OWNER
      ownerReferralCode: 'GOLD77', // MOCK CODE
      allowStaffToParticipate: false,
      staffSharePercent: 70, // FIXED 70
      ownerSharePercent: 30, // FIXED 30
    },
  });

  const todayRevenue = sales.reduce((acc, sale) => acc + sale.total, 0) + 
    appointments.filter(a => a.status === AppointmentStatus.COMPLETED).reduce((acc, a) => acc + a.price, 0);

  // --- LOCALSTORAGE: LOAD ON MOUNT ---
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      if (saved.appointments) setAppointments(saved.appointments);
      if (saved.clients) setClients(saved.clients);
      if (saved.products) setProducts(saved.products);
      if (saved.services) setServices(saved.services);
      if (saved.sales) setSales(saved.sales);
      if (saved.staff) setStaff(saved.staff);
      if (saved.expenses) setExpenses(saved.expenses);
      if (saved.staffPayments) setStaffPayments(saved.staffPayments);
      if (saved.inventory) setInventory(saved.inventory);
      if (saved.suppliers) setSuppliers(saved.suppliers);
      if (saved.categories) setCategories(saved.categories);
      if (saved.reviews) setReviews(saved.reviews);
      if (saved.shopProfile) setShopProfile(saved.shopProfile);
      if (saved.shopSettings) setShopSettings(prev => ({ ...prev, ...saved.shopSettings }));
      console.log('✅ Dados carregados do localStorage');
    }
    setIsHydrated(true);
  }, []);

  // --- LOCALSTORAGE: SAVE ON CHANGE ---
  useEffect(() => {
    if (!isHydrated) return;
    
    saveToStorage({
      appointments,
      clients,
      products,
      services,
      sales,
      staff,
      expenses,
      staffPayments,
      inventory,
      suppliers,
      categories,
      reviews,
      shopProfile,
      shopSettings
    });
  }, [isHydrated, appointments, clients, products, services, sales, staff, expenses, staffPayments, inventory, suppliers, categories, reviews, shopProfile, shopSettings]);

  // DEPRECATED: login fake removido - usar Supabase Auth via /login
  // Esta função agora só é usada para modo demo/fallback
  const login = (_email: string, _pass: string) => {
     console.warn('⚠️ login() está deprecated. Use Supabase Auth via /login');
     // Em modo demo, permite login fake para desenvolvimento
     if (process.env.NEXT_PUBLIC_APP_MODE === 'demo') {
        const demoUser = staff[1]; // Alex Owner
        if (demoUser) {
           setIsAuthenticated(true);
           setCurrentUser(demoUser);
           setView('DASHBOARD');
           return true;
        }
     }
     return false;
  };

  const logout = () => {
     setIsAuthenticated(false);
     setView('SAAS_LANDING');
  };

  const switchUser = (staffId: string) => {
    const user = staff.find(s => s.id === staffId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // ... (keep other actions) ...
  const updateShopProfile = (profile: ShopProfile) => setShopProfile(profile);
  const handleSetView = (view: ViewState, params?: any) => {
     if (view === 'TIPS_REVIEW' && params?.appointmentId) setActiveReviewAppointmentId(params.appointmentId);
     setView(view);
  };
  const addAppointment = (appt: any) => {
     const baseId = Math.random().toString(36).substr(2, 9);
     const newAppointments: any[] = [{ ...appt, id: baseId, status: appt.status || AppointmentStatus.SCHEDULED }];
     
     // Gera agendamentos recorrentes se configurado
     if (appt.recurrence && appt.recurrence !== RecurrenceType.NONE && appt.recurrenceEndDate) {
        let nextDate = new Date(appt.date);
        const endDate = new Date(appt.recurrenceEndDate);
        let count = 0;
        const maxRecurrences = 52; // Limite de segurança (1 ano semanal)
        
        while (count < maxRecurrences) {
           if (appt.recurrence === RecurrenceType.DAILY) {
              nextDate = addDays(nextDate, 1);
           } else if (appt.recurrence === RecurrenceType.WEEKLY) {
              nextDate = addWeeks(nextDate, 1);
           } else if (appt.recurrence === RecurrenceType.MONTHLY) {
              nextDate = addMonths(nextDate, 1);
           }
           
           if (nextDate > endDate) break;
           
           newAppointments.push({
              ...appt,
              id: Math.random().toString(36).substr(2, 9),
              date: new Date(nextDate),
              status: AppointmentStatus.SCHEDULED,
              notes: `${appt.notes || ''} [Recorrente de ${baseId}]`.trim()
           });
           count++;
        }
     }
     
     setAppointments(prev => [...prev, ...newAppointments]);
  };
  const updateAppointmentStatus = (id: string, status: any) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const joinQueue = (item: any) => setQueue(prev => [...prev, { ...item, id: Math.random().toString(36).substr(2, 9), arrivalTime: new Date() }]);
  const leaveQueue = (id: string) => setQueue(prev => prev.filter(i => i.id !== id));
  const processSale = (items: CartItem[], clientId: string | null, staffId: string, method: PaymentMethod, discountReason?: string, tip: number = 0) => {
     const total = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
     
     // Registra a venda
     setSales(prev => [...prev, { 
        id: Math.random().toString(36).substr(2, 9), 
        clientId, 
        staffId, 
        items, 
        total, 
        tip, 
        date: new Date(), 
        method, 
        discountApplied: discountReason 
     }]);
     
     // Atualiza cliente: totalSpent, lastVisit e loyaltyPoints
     if (clientId) {
        setClients(prev => prev.map(client => {
           if (client.id !== clientId) return client;
           const hasService = items.some(i => i.type === 'SERVICE');
           return {
              ...client,
              totalSpent: client.totalSpent + total,
              lastVisit: new Date(),
              loyaltyPoints: hasService ? (client.loyaltyPoints || 0) + 1 : client.loyaltyPoints
           };
        }));
     }
     
     // Deduz estoque dos produtos vendidos
     items.filter(i => i.type === 'PRODUCT').forEach(item => {
        const qty = item.qty || 1;
        setProducts(prev => prev.map(product => {
           if (product.id !== item.id) return product;
           return { ...product, stock: Math.max(0, product.stock - qty) };
        }));
     });
  };
  const submitReview = (review: any) => setReviews(prev => [...prev, { ...review, id: Math.random().toString(36).substr(2, 9), date: new Date() }]);
  const addLateTip = (appointmentId: string, amount: number, method: PaymentMethod) => {
     const appointment = appointments.find(a => a.id === appointmentId);
     if (!appointment) return;
     
     // Registra a gorjeta como uma venda separada
     setSales(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        clientId: appointment.clientId,
        staffId: appointment.staffId,
        items: [{ id: 'tip', name: 'Gorjeta', price: amount, type: 'SERVICE' as const }],
        total: amount,
        tip: amount,
        date: new Date(),
        method,
        discountApplied: undefined
     }]);
  };
  const addClient = (client: any) => {
     const id = Math.random().toString(36).substr(2, 9);
     setClients(prev => [{ ...client, id, totalSpent: 0, loyaltyPoints: 0, referralCode: 'NEW', profileCompleted: true }, ...prev]);
     return id;
  };
  const updateClient = (c: Client) => setClients(prev => prev.map(cl => cl.id === c.id ? c : cl));
  const updateService = (s: Service) => setServices(prev => prev.map(srv => srv.id === s.id ? s : srv));
  const addService = (s: any) => setServices(prev => [...prev, { ...s, id: Math.random().toString(36).substr(2, 9), type: 'SERVICE' }]);
  const deleteService = (id: string) => setServices(prev => prev.filter(s => s.id !== id));
  const updateProduct = (p: Product) => setProducts(prev => prev.map(prod => prod.id === p.id ? p : prod));
  const addProduct = (p: any) => setProducts(prev => [...prev, { ...p, id: Math.random().toString(36).substr(2, 9), type: 'PRODUCT' }]);
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const addStaff = (s: any) => setStaff(prev => [...prev, { ...s, id: Math.random().toString(36).substr(2, 9) }]);
  const updateStaff = (s: StaffMember) => setStaff(prev => prev.map(st => st.id === s.id ? s : st));
  const addCommissionPlan = (p: any) => setCommissionPlans(prev => [...prev, { ...p, id: Math.random().toString(36).substr(2, 9) }]);
  const deleteCommissionPlan = (id: string) => setCommissionPlans(prev => prev.filter(p => p.id !== id));
  const addExpense = (e: any) => setExpenses(prev => [...prev, { ...e, id: Math.random().toString(36).substr(2, 9) }]);
  const removeExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));
  const addStaffPayment = (p: any) => setStaffPayments(prev => [...prev, { ...p, id: Math.random().toString(36).substr(2, 9) }]);
  const closeRegister = (c: any) => setRegisterClosures(prev => [...prev, { ...c, id: Math.random().toString(36).substr(2, 9) }]);
  const updateShopSettings = (s: any) => setShopSettings(prev => ({ ...prev, ...s }));
  const addInventoryItem = (i: any) => setInventory(prev => [...prev, { ...i, id: Math.random().toString(36).substr(2, 9), lastRestockDate: new Date() }]);
  const updateInventoryItem = (i: any) => setInventory(prev => prev.map(inv => inv.id === i.id ? i : inv));
  const deleteInventoryItem = (id: string) => setInventory(prev => prev.filter(i => i.id !== id));
  const adjustInventoryStock = (id: string, amount: number, type: 'ADD' | 'CONSUME') => {
     setInventory(prev => prev.map(item => {
        if (item.id !== id) return item;
        const newQuantity = type === 'ADD' 
           ? item.quantity + amount 
           : Math.max(0, item.quantity - amount);
        return { ...item, quantity: newQuantity };
     }));
  };
  const restockInventoryItem = (itemId: string, quantity: number, unitCost: number, supplierId: string) => {
     // Atualiza estoque do item
     setInventory(prev => prev.map(item => {
        if (item.id !== itemId) return item;
        return { 
           ...item, 
           quantity: item.quantity + quantity,
           costPerUnit: unitCost,
           lastRestockDate: new Date()
        };
     }));
     
     // Registra transação de suprimento
     const item = inventory.find(i => i.id === itemId);
     if (item) {
        setSupplyTransactions(prev => [...prev, {
           id: Math.random().toString(36).substr(2, 9),
           itemId,
           itemName: item.name,
           itemType: 'INVENTORY',
           quantity,
           unitCost,
           totalCost: quantity * unitCost,
           supplierId,
           date: new Date()
        }]);
     }
  };
  const restockProduct = (productId: string, quantity: number, unitCost: number) => {
     setProducts(prev => prev.map(product => {
        if (product.id !== productId) return product;
        return { 
           ...product, 
           stock: product.stock + quantity,
           costPrice: unitCost
        };
     }));
  };
  const addSupplier = (s: any) => setSuppliers(prev => [...prev, { ...s, id: Math.random().toString(36).substr(2, 9) }]);
  const updateSupplier = (s: any) => setSuppliers(prev => prev.map(sup => sup.id === s.id ? s : sup));
  const deleteSupplier = (id: string) => setSuppliers(prev => prev.filter(s => s.id !== id));
  const addCategory = (n: string, t: any) => setCategories(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name: n, type: t }]);
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));
  const getAvailableSlots = (date: Date, staffId: string, durationMinutes: number): Date[] => {
     const staffMember = staff.find(s => s.id === staffId);
     if (!staffMember) return [];
     
     const dayIndex = getDay(date);
     const daySchedule = staffMember.workSchedule.find(ws => ws.dayIndex === dayIndex);
     if (!daySchedule || !daySchedule.isActive) return [];
     
     const slots: Date[] = [];
     const [startHour, startMin] = daySchedule.startTime.split(':').map(Number);
     const [endHour, endMin] = daySchedule.endTime.split(':').map(Number);
     
     let slotStart = set(date, { hours: startHour, minutes: startMin, seconds: 0, milliseconds: 0 });
     const dayEnd = set(date, { hours: endHour, minutes: endMin, seconds: 0, milliseconds: 0 });
     
     // Agendamentos do dia para este staff
     const dayAppointments = appointments.filter(a => 
        a.staffId === staffId && 
        isSameDay(a.date, date) && 
        a.status !== AppointmentStatus.CANCELLED
     );
     
     // Pausas do staff
     const breaks = daySchedule.breaks || [];
     
     while (slotStart < dayEnd) {
        const slotEnd = addMinutes(slotStart, durationMinutes);
        if (slotEnd > dayEnd) break;
        
        const slotInterval = { start: slotStart, end: slotEnd };
        
        // Verifica conflito com agendamentos
        const hasConflict = dayAppointments.some(appt => {
           const service = services.find(s => s.id === appt.serviceId);
           const apptDuration = service?.durationMinutes || 30;
           const apptInterval = { start: appt.date, end: addMinutes(appt.date, apptDuration) };
           return areIntervalsOverlapping(slotInterval, apptInterval);
        });
        
        // Verifica conflito com pausas
        const hasBreakConflict = breaks.some(brk => {
           const [bStartH, bStartM] = brk.startTime.split(':').map(Number);
           const [bEndH, bEndM] = brk.endTime.split(':').map(Number);
           const breakStart = set(date, { hours: bStartH, minutes: bStartM });
           const breakEnd = set(date, { hours: bEndH, minutes: bEndM });
           return areIntervalsOverlapping(slotInterval, { start: breakStart, end: breakEnd });
        });
        
        if (!hasConflict && !hasBreakConflict) {
           slots.push(slotStart);
        }
        
        slotStart = addMinutes(slotStart, 15); // Incremento de 15 min
     }
     
     return slots;
  };
  
  // --- SUPER ADMIN ACTIONS ---
  const addTenant = (t: any) => setTenants(prev => [...prev, { ...t, id: Math.random().toString(36).substr(2, 9), status: 'ACTIVE', joinedDate: new Date() }]);
  const updateTenantStatus = (id: string, status: any) => setTenants(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  const deleteTenant = (id: string) => { if(confirm('Delete?')) setTenants(prev => prev.filter(t => t.id !== id)); };
  
  const updateTenantPlan = tenantPlanSlice.updateTenantPlan;

  const impersonateTenant = tenantPlanSlice.impersonateTenant;
  const exitImpersonation = tenantPlanSlice.exitImpersonation;
  
  // ... (rest of actions) ...
  const resolveTicket = (id: string) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED' } : t));
  const markInvoicePaid = (id: string) => setGlobalInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'PAID' } : i));
  const updateIntegration = (i: any) => setIntegrations(prev => prev.map(int => int.id === i.id ? i : int));
  const updateLandingPageConfig = (c: any) => setLandingPageConfig(prev => ({ ...prev, ...c }));
  const addReferralSource = referralSlice.addReferralSource;
  const updateReferralSource = referralSlice.updateReferralSource;
  const deleteReferralSource = referralSlice.deleteReferralSource;
  const addSaasPlan = tenantPlanSlice.addSaasPlan;
  const updateSaasPlan = tenantPlanSlice.updateSaasPlan;
  const addMarketingCampaign = (c: any) => setMarketingCampaigns(prev => [c, ...prev]);
  const deleteMarketingCampaign = (id: string) => setMarketingCampaigns(prev => prev.filter(c => c.id !== id));
  const updateGlobalSettings = (s: any) => setGlobalSettings(prev => ({ ...prev, ...s }));

  return (
    <BarberContext.Provider value={{
      isAuthenticated, currentUser, shopProfile, currentView, appointments, queue, clients, products, services, sales, staff, commissionPlans, expenses, staffPayments, shopSettings, todayRevenue, inventory, suppliers, supplyTransactions, categories, registerClosures, reviews, tenants, tickets, globalInvoices, integrations, referrals, landingPageConfig, saasPlans: tenantPlanSlice.saasPlans, marketingCampaigns, globalSettings, currentTenantId: tenantPlanSlice.currentTenantId, currentTenantStatus: tenantPlanSlice.currentTenantStatus, currentTenantPlanId: tenantPlanSlice.currentTenantPlanId, isImpersonating: tenantPlanSlice.isImpersonating, activeReviewAppointmentId,
      login, logout, switchUser, updateShopProfile, setView: handleSetView, addAppointment, updateAppointmentStatus, joinQueue, leaveQueue, processSale, submitReview, addLateTip, addClient, updateClient, updateService, addService, deleteService, updateProduct, addProduct, deleteProduct, addStaff, updateStaff, addCommissionPlan, deleteCommissionPlan, addExpense, removeExpense, addStaffPayment, closeRegister, updateShopSettings, addInventoryItem, updateInventoryItem, deleteInventoryItem, adjustInventoryStock, restockInventoryItem, restockProduct, addSupplier, updateSupplier, deleteSupplier, addCategory, deleteCategory, getAvailableSlots, addTenant, updateTenantStatus, 
      updateTenantPlan, // EXPOSED
      deleteTenant, impersonateTenant, exitImpersonation, resolveTicket, markInvoicePaid, updateIntegration, updateLandingPageConfig, addReferralSource, updateReferralSource, deleteReferralSource, addSaasPlan, updateSaasPlan, addMarketingCampaign, deleteMarketingCampaign, updateGlobalSettings
    }}>
      {children}
    </BarberContext.Provider>
  );
};

export const useBarber = () => {
  const context = useContext(BarberContext);
  if (context === undefined) {
    throw new Error('useBarber must be used within a BarberProvider');
  }
  return context;
};
