
import React, { createContext, useContext, useState, ReactNode, PropsWithChildren, useEffect } from 'react';
import { Appointment, Client, Product, Service, Sale, ViewState, AppointmentStatus, PaymentMethod, CartItem, RecurrenceType, StaffMember, CommissionPlan, Expense, ShopSettings, StaffPayment, ShopProfile, DaySchedule, InventoryItem, Supplier, SupplyTransaction, Category, CategoryType, RegisterClosure, QueueItem, Review, Tenant, SupportTicket, GlobalInvoice, Integration, ReferralSource, LandingPageConfig, MarketingCampaign, GlobalSettings, SaasV2TenantStatus, SaasV2PlanId, SaasPlan, SaasPlanId, CompensationModel } from '@/types';
// Removido imports de mocks
import { addDays, addWeeks, addMonths, isAfter, areIntervalsOverlapping, addMinutes, set, getDay, isSameDay } from 'date-fns';
import { useSaasV2 } from './SaasV2Context';
import { useTenantPlanSlice } from './slices/tenantPlanSlice';
import { useReferralSlice } from './slices/referralSlice';
import { createClient } from '@/lib/supabase/client';
import { useAppointments } from '@/modules/appointments';
import { useServices } from '@/modules/services/hooks/useServices';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { useSales } from '@/modules/sales/hooks/useSales';
import { useClients } from '@/modules/clients/hooks/useClients';
import { useStaff } from '@/modules/staff/hooks/useStaff';
import { useInventory } from '@/modules/inventory/hooks/useInventory';
import { useSuppliers } from '@/modules/suppliers/hooks/useSuppliers';
import { useCategories } from '@/modules/categories/hooks/useCategories';
import { useCommissionPlans } from '@/modules/commission/hooks/useCommissionPlans';

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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Reconverte strings para Dates
    return JSON.parse(raw, (key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });
  } catch (e) {
    console.warn('Erro ao carregar do localStorage:', e);
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
  loading: boolean; // Loading state para dados do Supabase
  currentUser: StaffMember | null; // Who is logged in? (null se não autenticado)
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

  addClient: (client: Omit<Client, 'id' | 'totalSpent' | 'lastVisit' | 'loyaltyPoints' | 'referralCode' | 'profileCompleted'> & { referrerCode?: string }) => Promise<string>; // Returns ID
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
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(null); 
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [commissionPlans, setCommissionPlans] = useState<CommissionPlan[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [staffPayments, setStaffPayments] = useState<StaffPayment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplyTransactions, setSupplyTransactions] = useState<SupplyTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [registerClosures, setRegisterClosures] = useState<RegisterClosure[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // SUPER ADMIN STATE (mantido vazio - não usado em produção)
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [globalInvoices, setGlobalInvoices] = useState<GlobalInvoice[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  
  // NEW: Office God State
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>(INITIAL_CAMPAIGNS);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(INITIAL_GLOBAL_SETTINGS);

  const referralSlice = useReferralSlice();
  const referrals = referralSlice.referrals;

  // Carregar dados reais do Supabase usando hooks
  const { appointments: realAppointments, loading: appointmentsLoading } = useAppointments();
  const { services: realServices, loading: servicesLoading } = useServices();
  const { products: realProducts, loading: productsLoading } = useProducts();
  const { sales: realSales, loading: salesLoading } = useSales();
  const { clients: realClients, loading: clientsLoading } = useClients();
  const { staff: realStaff, loading: staffLoading } = useStaff();
  const { inventory: realInventory, loading: inventoryLoading } = useInventory();
  const { suppliers: realSuppliers, loading: suppliersLoading } = useSuppliers();
  const { categories: realCategories, loading: categoriesLoading } = useCategories();
  const { commissionPlans: realCommissionPlans, loading: commissionPlansLoading } = useCommissionPlans();

  // Atualizar state quando dados reais chegarem
  useEffect(() => {
    if (!appointmentsLoading) {
      // Mapear appointments do Supabase para o formato do Context
      const mappedAppointments: Appointment[] = realAppointments.map((appt: any) => ({
        id: appt.id,
        clientId: appt.client_id,
        clientName: appt.client_name || 'Cliente',
        staffId: appt.staff_id,
        staffName: appt.staff_name || 'Barbeiro',
        serviceId: appt.service_id,
        serviceName: appt.service_name || 'Serviço',
        date: new Date(appt.scheduled_at),
        price: Number(appt.price),
        status: appt.status as AppointmentStatus,
        notes: appt.notes || '',
        recurrence: RecurrenceType.NONE
      }));
      setAppointments(mappedAppointments);
      console.log('✅ Appointments carregados do Supabase:', mappedAppointments.length);
    }
  }, [appointmentsLoading, realAppointments]);

  useEffect(() => {
    if (!servicesLoading) {
      const mappedServices: Service[] = realServices.map((svc: any) => ({
        id: svc.id,
        name: svc.name,
        price: Number(svc.price),
        durationMinutes: svc.duration_minutes,
        category: svc.category,
        type: 'SERVICE' as const
      }));
      setServices(mappedServices);
      console.log('✅ Services carregados do Supabase:', mappedServices.length);
    }
  }, [servicesLoading, realServices]);

  useEffect(() => {
    if (!productsLoading) {
      const mappedProducts: Product[] = realProducts.map((prod: any) => ({
        id: prod.id,
        name: prod.name,
        price: Number(prod.price),
        costPrice: Number(prod.cost_price),
        stock: prod.stock,
        image: prod.image_url,
        category: prod.category,
        type: 'PRODUCT' as const
      }));
      setProducts(mappedProducts);
      console.log('✅ Products carregados do Supabase:', mappedProducts.length);
    }
  }, [productsLoading, realProducts]);

  useEffect(() => {
    if (!clientsLoading) {
      const mappedClients: Client[] = realClients.map((client: any) => ({
        id: client.id,
        name: client.name,
        phone: client.phone || '',
        email: client.email || '',
        birthDate: client.birth_date || '',
        lastVisit: client.last_visit ? new Date(client.last_visit) : undefined,
        totalVisits: client.total_visits || 0,
        totalSpent: Number(client.total_spent) || 0,
        loyaltyPoints: client.loyalty_points || 0,
        tags: client.tags || [],
        notes: client.notes || '',
        preferences: client.preferences || {}
      }));
      setClients(mappedClients);
      console.log('✅ Clients carregados do Supabase:', mappedClients.length);
    }
  }, [clientsLoading, realClients]);

  useEffect(() => {
    if (!staffLoading) {
      const mappedStaff: StaffMember[] = realStaff.map((member: any) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone || '',
        role: member.role === 'RECEPTIONIST' ? 'STAFF' : member.role as 'OWNER' | 'BARBER' | 'ADMIN' | 'ASSISTANT' | 'STAFF' | 'SUPER_ADMIN',
        avatar: member.avatar_url || '',
        serviceCommissionRate: member.service_commission_rate || 50,
        productCommissionRate: member.product_commission_rate || 20,
        commissionModel: CompensationModel.PERCENTAGE,
        rentalFee: 0,
        paymentFrequency: 'WEEKLY' as const,
        workSchedule: Array.from({ length: 7 }, (_, i) => ({
          dayIndex: i,
          isActive: i !== 0,
          startTime: '09:00',
          endTime: i === 6 ? '14:00' : '20:00',
          breaks: []
        }))
      }));
      setStaff(mappedStaff);
      console.log('✅ Staff carregado do Supabase:', mappedStaff.length);
    }
  }, [staffLoading, realStaff]);

  useEffect(() => {
    if (!salesLoading) {
      const mappedSales: Sale[] = realSales.map((sale: any) => ({
        id: sale.id,
        clientId: sale.client_id,
        staffId: sale.staff_id,
        items: [], // TODO: carregar sale_items
        total: Number(sale.total),
        date: new Date(sale.created_at),
        method: sale.payment_method as PaymentMethod,
        tip: Number(sale.tip)
      }));
      setSales(mappedSales);
      console.log('✅ Sales carregadas do Supabase:', mappedSales.length);
    }
  }, [salesLoading, realSales]);

  useEffect(() => {
    if (!inventoryLoading) {
      setInventory(realInventory as InventoryItem[]);
      console.log('✅ Inventory carregado do Supabase:', realInventory.length);
    }
  }, [inventoryLoading, realInventory]);

  useEffect(() => {
    if (!suppliersLoading) {
      setSuppliers(realSuppliers as Supplier[]);
      console.log('✅ Suppliers carregados do Supabase:', realSuppliers.length);
    }
  }, [suppliersLoading, realSuppliers]);

  useEffect(() => {
    if (!categoriesLoading) {
      setCategories(realCategories as Category[]);
      console.log('✅ Categories carregadas do Supabase:', realCategories.length);
    }
  }, [categoriesLoading, realCategories]);

  useEffect(() => {
    if (!commissionPlansLoading) {
      setCommissionPlans(realCommissionPlans as CommissionPlan[]);
      console.log('✅ Commission Plans carregados do Supabase:', realCommissionPlans.length);
    }
  }, [commissionPlansLoading, realCommissionPlans]);

  // Carregar dados reais do Supabase - User e Tenant
  useEffect(() => {
    async function loadUserData() {
      try {
        const supabase = createClient();
        
        // 1. Verificar sessão
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.warn('⚠️ Sem sessão ativa');
          setLoading(false);
          return;
        }

        // 2. Buscar profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .single();

        if (profileError) {
          console.error('❌ Erro ao buscar profile:', profileError);
          setLoading(false);
          return;
        }

        if (profile) {
          console.log('✅ Profile carregado:', profile.name);
          
          // 3. Mapear para StaffMember
          const mappedUser: StaffMember = {
            id: profile.id,
            name: profile.name,
            role: profile.role,
            email: profile.email || '',
            phone: profile.phone || '',
            commissionModel: profile.commission_model || 'PERCENTAGE',
            serviceCommissionRate: Number(profile.commission_rate) || 50,
            productCommissionRate: Number(profile.commission_rate) || 50,
            rentalFee: 0,
            paymentFrequency: 'WEEKLY',
            workSchedule: profile.work_schedule || []
          };
          
          setCurrentUser(mappedUser);
          setIsAuthenticated(true);

          // 4. Buscar tenant
          const { data: tenant } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', profile.tenant_id)
            .single();

          if (tenant) {
            console.log('✅ Tenant carregado:', tenant.name);
            
            // Mapear operatingHours do tenant.settings ou usar padrão
            let operatingHours = Array.from({ length: 7 }, (_, i) => ({
              dayIndex: i,
              isActive: i !== 0, // Domingo fechado por padrão
              startTime: '09:00',
              endTime: i === 6 ? '14:00' : '20:00',
              breaks: []
            }));
            
            // Se tenant.settings tem operatingHours, usar eles
            if (tenant.settings && typeof tenant.settings === 'object') {
              const settings = tenant.settings as any;
              if (settings.operatingHours && Array.isArray(settings.operatingHours)) {
                operatingHours = settings.operatingHours;
              }
            }
            
            setShopProfile({
              name: tenant.name,
              slug: tenant.slug,
              logo: tenant.logo_url || '',
              address: tenant.address || '',
              phone: tenant.phone || '',
              whatsapp: tenant.whatsapp || '',
              instagram: tenant.instagram || '',
              operatingHours
            });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

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
  const updateShopProfile = async (profile: ShopProfile) => {
    setShopProfile(profile);
    
    // Persistir no Supabase
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('user_id', session.user.id)
        .single();
      
      if (!userProfile?.tenant_id) return;
      
      // Atualizar tenant com novos dados
      const { error } = await supabase
        .from('tenants')
        .update({
          name: profile.name,
          slug: profile.slug,
          logo_url: profile.logo,
          address: profile.address,
          phone: profile.phone,
          whatsapp: profile.whatsapp,
          instagram: profile.instagram,
          settings: {
            operatingHours: profile.operatingHours
          }
        })
        .eq('id', userProfile.tenant_id);
      
      if (error) {
        console.error('❌ Erro ao atualizar tenant:', error);
      } else {
        console.log('✅ Tenant atualizado no Supabase');
      }
    } catch (error) {
      console.error('❌ Erro ao persistir shopProfile:', error);
    }
  };
  const handleSetView = (view: ViewState, params?: any) => {
     if (view === 'TIPS_REVIEW' && params?.appointmentId) setActiveReviewAppointmentId(params.appointmentId);
     setView(view);
  };
  const addAppointment = async (appt: Omit<Appointment, 'id' | 'status'> & { status?: AppointmentStatus }) => {
    try {
      const { createAppointment } = await import('@/modules/appointments/actions');
      
      const appointmentData = {
        clientId: appt.clientId,
        clientName: appt.clientName,
        staffId: appt.staffId,
        serviceId: appt.serviceId,
        date: appt.date.toISOString().split('T')[0],
        time: appt.date.toTimeString().split(' ')[0].substring(0, 5),
        price: appt.price,
        notes: appt.notes || '',
      };
      
      const savedAppointment = await createAppointment(appointmentData);
      
      const mappedAppointment: Appointment = {
        id: savedAppointment.id,
        clientId: savedAppointment.client_id,
        clientName: clients.find(c => c.id === savedAppointment.client_id)?.name || 'Cliente',
        staffId: savedAppointment.staff_id,
        serviceId: savedAppointment.service_id,
        serviceName: services.find(s => s.id === savedAppointment.service_id)?.name || 'Serviço',
        date: new Date(`${savedAppointment.date}T${savedAppointment.start_time}`),
        price: Number(savedAppointment.total_amount),
        status: savedAppointment.status as AppointmentStatus,
        notes: savedAppointment.notes || '',
        recurrence: RecurrenceType.NONE,
      };
      
      setAppointments(prev => [...prev, mappedAppointment]);
      console.log('✅ Agendamento salvo');
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
      alert('Erro ao salvar agendamento');
      throw error;
    }
  };
  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const { updateAppointmentStatus: updateAction } = await import('@/modules/appointments/actions');
      await updateAction(id, status as any);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      console.log('✅ Status atualizado');
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };
  const joinQueue = (item: any) => setQueue(prev => [...prev, { ...item, id: Math.random().toString(36).substr(2, 9), arrivalTime: new Date() }]);
  const leaveQueue = (id: string) => setQueue(prev => prev.filter(i => i.id !== id));
  const processSale = async (items: CartItem[], clientId: string | null, staffId: string, method: PaymentMethod, discountReason?: string, tip: number = 0) => {
    try {
      const { createSale } = await import('@/modules/sales/actions');
      const total = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
      
      const saleItems = items.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        price: item.price,
        qty: item.qty || 1,
      }));
      
      const savedSale = await createSale({
        clientId: clientId || undefined,
        staffId,
        items: saleItems,
        total,
        method: method as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "OTHER",
        tip,
        discountApplied: discountReason,
      });
      
      const newSale: Sale = {
        id: savedSale.id,
        clientId: clientId || null,
        staffId,
        items,
        total,
        tip,
        date: new Date(savedSale.created_at),
        method,
        discountApplied: discountReason,
      };
      
      setSales(prev => [newSale, ...prev]);
      
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
      
      items.filter(i => i.type === 'PRODUCT').forEach(item => {
        const qty = item.qty || 1;
        setProducts(prev => prev.map(product => {
          if (product.id !== item.id) return product;
          return { ...product, stock: Math.max(0, product.stock - qty) };
        }));
      });
      
      console.log('✅ Venda processada');
    } catch (error) {
      console.error('❌ Erro ao processar venda:', error);
      alert('Erro ao processar venda');
      throw error;
    }
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
  const addClient = async (client: Omit<Client, 'id' | 'totalSpent' | 'lastVisit' | 'loyaltyPoints' | 'referralCode' | 'profileCompleted'> & { referrerCode?: string }) => {
    try {
      const { createClientAction } = await import('@/modules/clients/actions');
      
      const savedClient = await createClientAction({
        name: client.name,
        phone: client.phone,
        email: client.email,
        birthDate: client.birthDate,
        notes: client.notes,
        tags: client.tags,
      });
      
      const newClient: Client = {
        id: savedClient.id,
        name: savedClient.name,
        phone: savedClient.phone || '',
        email: savedClient.email || '',
        birthDate: savedClient.birth_date || '',
        lastVisit: savedClient.last_visit ? new Date(savedClient.last_visit) : undefined,
        totalSpent: Number(savedClient.total_spent) || 0,
        loyaltyPoints: savedClient.loyalty_points || 0,
        tags: savedClient.tags || [],
        notes: savedClient.notes || '',
        referralCode: 'NEW',
        profileCompleted: true,
      };
      
      setClients(prev => [newClient, ...prev]);
      console.log('✅ Cliente criado');
      return savedClient.id;
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      alert('Erro ao salvar cliente');
      throw error;
    }
  };

  const updateClient = async (client: Client) => {
    try {
      const { updateClientAction } = await import('@/modules/clients/actions');
      
      await updateClientAction(client.id, {
        name: client.name,
        phone: client.phone,
        email: client.email,
        birthDate: client.birthDate,
        notes: client.notes,
        tags: client.tags,
      });
      
      setClients(prev => prev.map(c => c.id === client.id ? client : c));
      console.log('✅ Cliente atualizado');
    } catch (error) {
      console.error('❌ Erro ao atualizar cliente:', error);
      alert('Erro ao atualizar cliente');
    }
  };
  const updateService = (s: Service) => setServices(prev => prev.map(srv => srv.id === s.id ? s : srv));
  const addService = (s: any) => setServices(prev => [...prev, { ...s, id: Math.random().toString(36).substr(2, 9), type: 'SERVICE' }]);
  const deleteService = (id: string) => setServices(prev => prev.filter(s => s.id !== id));
  const updateProduct = (p: Product) => setProducts(prev => prev.map(prod => prod.id === p.id ? p : prod));
  const addProduct = (p: any) => setProducts(prev => [...prev, { ...p, id: Math.random().toString(36).substr(2, 9), type: 'PRODUCT' }]);
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const addStaff = async (s: any) => {
    try {
      const { createStaff } = await import('@/modules/staff/actions');
      await createStaff({
        name: s.name,
        role: s.role,
        phone: s.phone || '',
        cpf: s.cpf,
        birthDate: s.birthDate,
        address: s.address,
        avatar: s.avatar,
        commissionModel: 'PERCENTAGE',
        serviceCommissionRate: s.serviceCommissionRate || 50,
        productCommissionRate: s.productCommissionRate || 20,
        rentalFee: s.rentalFee || 0,
        paymentFrequency: s.paymentFrequency || 'WEEKLY',
        workSchedule: s.workSchedule || [],
        allowedServices: s.allowedServices || [],
      });
      window.location.reload();
    } catch (error) {
      console.error('Erro ao criar staff:', error);
      alert('Erro ao criar membro da equipe');
    }
  };
  
  const updateStaff = async (s: StaffMember) => {
    try {
      const { updateStaff: updateAction } = await import('@/modules/staff/actions');
      await updateAction({
        id: s.id,
        name: s.name,
        role: s.role,
        phone: s.phone || '',
        cpf: s.cpf,
        birthDate: s.birthDate,
        address: s.address,
        avatar: s.avatar,
        commissionModel: 'PERCENTAGE',
        serviceCommissionRate: s.serviceCommissionRate || 50,
        productCommissionRate: s.productCommissionRate || 20,
        rentalFee: s.rentalFee || 0,
        paymentFrequency: s.paymentFrequency || 'WEEKLY',
        workSchedule: s.workSchedule || [],
        allowedServices: s.allowedServices || [],
      });
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar staff:', error);
      alert('Erro ao atualizar membro da equipe');
    }
  };
  const addCommissionPlan = async (p: any) => {
    try {
      const { createCommissionPlan } = await import('@/modules/commission/actions');
      await createCommissionPlan({
        name: p.name,
        model: p.model,
        serviceRate: p.serviceRate,
        productRate: p.productRate,
        rentalFee: p.rentalFee || 0,
      });
      // Recarregar dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao criar plano de comissão:', error);
      alert('Erro ao criar plano de comissão');
    }
  };
  
  const deleteCommissionPlan = async (id: string) => {
    try {
      const { deleteCommissionPlan: deleteAction } = await import('@/modules/commission/actions');
      await deleteAction(id);
      // Recarregar dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao deletar plano de comissão:', error);
      alert('Erro ao deletar plano de comissão');
    }
  };
  const addExpense = async (e: any) => {
    try {
      const { createExpense } = await import('@/modules/finance/actions');
      const savedExpense = await createExpense({
        category: e.category,
        amount: e.amount,
        date: e.date,
        description: e.description,
        supplierId: e.supplierId,
        paymentMethod: e.paymentMethod,
      });
      setExpenses(prev => [...prev, { ...e, id: savedExpense.id }]);
      console.log('✅ Despesa salva');
    } catch (error) {
      console.error('❌ Erro ao criar despesa:', error);
      alert('Erro ao salvar despesa');
    }
  };
  const removeExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));
  const addStaffPayment = (p: any) => setStaffPayments(prev => [...prev, { ...p, id: Math.random().toString(36).substr(2, 9) }]);
  const closeRegister = async (c: any) => {
    try {
      const { createRegisterClosure } = await import('@/modules/finance/actions');
      const savedClosure = await createRegisterClosure({
        staffId: c.staffId,
        openedAt: c.openedAt,
        closedAt: c.closedAt,
        openingBalance: c.openingBalance,
        closingBalance: c.closingBalance,
        totalSales: c.totalSales,
        totalCash: c.totalCash,
        totalCard: c.totalCard,
        totalPix: c.totalPix,
        notes: c.notes,
      });
      setRegisterClosures(prev => [...prev, { ...c, id: savedClosure.id }]);
      console.log('✅ Fechamento salvo');
    } catch (error) {
      console.error('❌ Erro ao criar fechamento:', error);
      alert('Erro ao fechar caixa');
    }
  };
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

  // Loading state - apenas para rotas protegidas
  // Não bloqueia rotas públicas (landing, login, register)
  if (loading && typeof window !== 'undefined') {
    const isPublicRoute = ['/login', '/register', '/forgot-password', '/reset-password', '/'].includes(window.location.pathname);
    
    if (!isPublicRoute) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-white">Carregando seus dados...</p>
          </div>
        </div>
      );
    }
  }

  // NÃO redireciona automaticamente - deixa middleware e AuthGuard fazerem isso
  // Apenas retorna null se não autenticado em rotas protegidas

  return (
    <BarberContext.Provider value={{
      isAuthenticated, loading, currentUser, shopProfile, currentView, appointments, queue, clients, products, services, sales, staff, commissionPlans, expenses, staffPayments, shopSettings, todayRevenue, inventory, suppliers, supplyTransactions, categories, registerClosures, reviews, tenants, tickets, globalInvoices, integrations, referrals, landingPageConfig, saasPlans: tenantPlanSlice.saasPlans, marketingCampaigns, globalSettings, currentTenantId: tenantPlanSlice.currentTenantId, currentTenantStatus: tenantPlanSlice.currentTenantStatus, currentTenantPlanId: tenantPlanSlice.currentTenantPlanId, isImpersonating: tenantPlanSlice.isImpersonating, activeReviewAppointmentId,
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
