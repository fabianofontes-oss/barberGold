'use client';

import React, { createContext, useContext, useState, useCallback, PropsWithChildren, useMemo } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useShopProfile } from '@/hooks/useShopProfile';
import { useShopSettings } from '@/hooks/useShopSettings';
import { useQueue } from '@/hooks/useQueue';
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
import { useSaasV2 } from './SaasV2Context';
import type { 
  StaffMember, ShopProfile, ShopSettings, ViewState, Appointment, Service, 
  Product, Sale, Client, InventoryItem, Supplier, Category, CommissionPlan,
  QueueItem, AppointmentStatus, PaymentMethod, CartItem, Review, Expense,
  StaffPayment, RegisterClosure, SupplyTransaction, CategoryType,
  Tenant, SupportTicket, GlobalInvoice, Integration, ReferralSource,
  LandingPageConfig, MarketingCampaign, GlobalSettings, SaasPlan, SaasPlanId
} from '@/types';

export interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  loading: boolean;
  currentUser: StaffMember | null;
  logout: () => Promise<void>;

  // Shop
  shopProfile: ShopProfile;
  updateShopProfile: (profile: ShopProfile) => Promise<void>;
  shopSettings: ShopSettings;
  updateShopSettings: (settings: Partial<ShopSettings>) => void;

  // Navigation
  currentView: ViewState;
  setView: (view: ViewState, params?: any) => void;

  // Data
  appointments: Appointment[];
  services: Service[];
  products: Product[];
  sales: Sale[];
  clients: Client[];
  staff: StaffMember[];
  inventory: InventoryItem[];
  suppliers: Supplier[];
  categories: Category[];
  commissionPlans: CommissionPlan[];
  queue: QueueItem[];
  expenses: Expense[];
  staffPayments: StaffPayment[];
  supplyTransactions: SupplyTransaction[];
  registerClosures: RegisterClosure[];
  reviews: Review[];
  todayRevenue: number;

  // Super Admin State
  tenants: Tenant[];
  tickets: SupportTicket[];
  globalInvoices: GlobalInvoice[];
  integrations: Integration[];
  referrals: ReferralSource[];
  landingPageConfig: LandingPageConfig;
  saasPlans: SaasPlan[];
  marketingCampaigns: MarketingCampaign[];
  globalSettings: GlobalSettings;

  // Multi-tenant
  currentTenantId: string | null;
  currentTenantStatus?: any;
  currentTenantPlanId?: any;
  isImpersonating: boolean;
  activeReviewAppointmentId?: string;

  // Actions - Auth
  login: (email: string, pass: string) => boolean;
  switchUser: (staffId: string) => void;

  // Actions - Appointments
  addAppointment: (appt: Omit<Appointment, 'id' | 'status'> & { status?: AppointmentStatus }) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;

  // Actions - Queue
  joinQueue: (item: Omit<QueueItem, 'id' | 'arrivalTime'>) => void;
  leaveQueue: (id: string) => void;

  // Actions - Sales
  processSale: (items: CartItem[], clientId: string | null, staffId: string, method: PaymentMethod, discountReason?: string, tip?: number) => void;
  submitReview: (review: Omit<Review, 'id' | 'date'>) => void;
  addLateTip: (appointmentId: string, amount: number, method: PaymentMethod) => void;

  // Actions - Clients
  addClient: (client: Omit<Client, 'id' | 'totalSpent' | 'lastVisit' | 'loyaltyPoints' | 'referralCode' | 'profileCompleted'> & { referrerCode?: string }) => Promise<string>;
  updateClient: (client: Client) => void;

  // Actions - Catalog
  updateService: (service: Service) => void;
  addService: (service: Omit<Service, 'id' | 'type'>) => void;
  deleteService: (id: string) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id' | 'type'>) => void;
  deleteProduct: (id: string) => void;

  // Actions - Staff
  addStaff: (staff: Omit<StaffMember, 'id'>) => void;
  updateStaff: (staff: StaffMember) => void;
  addCommissionPlan: (plan: Omit<CommissionPlan, 'id'>) => void;
  deleteCommissionPlan: (id: string) => void;

  // Actions - Inventory
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  adjustInventoryStock: (id: string, amount: number, type: 'ADD' | 'CONSUME') => void;
  restockInventoryItem: (itemId: string, quantity: number, unitCost: number, supplierId: string) => void;
  restockProduct: (productId: string, quantity: number, unitCost: number) => void;

  // Actions - Suppliers
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;

  // Actions - Categories
  addCategory: (name: string, type: CategoryType) => void;
  deleteCategory: (id: string) => void;

  // Actions - Finance
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  addStaffPayment: (payment: Omit<StaffPayment, 'id'>) => void;
  closeRegister: (closure: Omit<RegisterClosure, 'id'>) => void;

  // Actions - Referrals
  addReferralSource: (source: Omit<ReferralSource, 'id' | 'stats'>) => void;
  updateReferralSource: (source: ReferralSource) => void;
  deleteReferralSource: (id: string) => void;

  // Actions - Super Admin
  addTenant: (tenant: Omit<Tenant, 'id' | 'joinedDate' | 'status'>) => void;
  updateTenantStatus: (id: string, status: Tenant['status']) => void;
  updateTenantPlan: (tenantId: string, planId: SaasPlanId) => void;
  deleteTenant: (id: string) => void;
  impersonateTenant: (tenantId: string) => void;
  exitImpersonation: () => void;
  resolveTicket: (ticketId: string) => void;
  markInvoicePaid: (invoiceId: string) => void;
  updateIntegration: (integration: Integration) => void;
  updateLandingPageConfig: (config: Partial<LandingPageConfig>) => void;
  addSaasPlan: (plan: SaasPlan) => void;
  updateSaasPlan: (plan: SaasPlan) => void;
  addMarketingCampaign: (campaign: MarketingCampaign) => void;
  deleteMarketingCampaign: (id: string) => void;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;

  // Helper
  getAvailableSlots: (date: Date, staffId: string, durationMinutes: number) => Date[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  // Core hooks
  const { currentUser, isAuthenticated, loading: userLoading, logout } = useCurrentUser();
  const { shopProfile, loading: profileLoading, updateShopProfile } = useShopProfile();
  const { shopSettings, updateShopSettings } = useShopSettings();
  const { queue, joinQueue, leaveQueue } = useQueue();
  const { currentTenantId } = useSaasV2();

  // Data hooks
  const { appointments: rawAppointments } = useAppointments();
  const { services: rawServices } = useServices();
  const { products: rawProducts } = useProducts();
  const { sales: rawSales } = useSales();
  const { clients: rawClients } = useClients();
  const { staff: rawStaff } = useStaff();
  const { inventory: rawInventory } = useInventory();
  const { suppliers: rawSuppliers } = useSuppliers();
  const { categories: rawCategories } = useCategories();
  const { commissionPlans: rawCommissionPlans } = useCommissionPlans();

  // Navigation
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [activeReviewAppointmentId, setActiveReviewAppointmentId] = useState<string>();

  // Local state for features not in Supabase yet
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [staffPayments, setStaffPayments] = useState<StaffPayment[]>([]);
  const [supplyTransactions, setSupplyTransactions] = useState<SupplyTransaction[]>([]);
  const [registerClosures, setRegisterClosures] = useState<RegisterClosure[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [globalInvoices, setGlobalInvoices] = useState<GlobalInvoice[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [referrals, setReferrals] = useState<ReferralSource[]>([]);
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>([]);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const [landingPageConfig, setLandingPageConfig] = useState<LandingPageConfig>({
    heroHeadline: 'Aposente o Caderno.',
    heroSubheadline: 'Agenda, Financeiro e Marketing Automatico.',
    heroCtaText: 'Comecar Teste Gratis',
    seoTitle: 'BarberFlow',
    seoDescription: 'O melhor sistema para barbearias.',
    seoKeywords: 'barbearia, sistema',
    showPricing: true,
    showTestimonials: true,
    featuredPlanId: 'PRO',
    announcementBar: { enabled: true, text: 'BarberFlow no ar!', link: '#' },
  });

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    appName: 'BarberFlow',
    trialDays: 14,
    currency: 'USD',
    enableMaintenance: false,
    enableSignup: true,
  });

  const [saasPlans, setSaasPlans] = useState<SaasPlan[]>([]);

  // Cast data from hooks
  const appointments = rawAppointments as unknown as Appointment[];
  const services = rawServices as unknown as Service[];
  const products = rawProducts as unknown as Product[];
  const sales = rawSales as unknown as Sale[];
  const clients = rawClients as unknown as Client[];
  const staff = rawStaff as unknown as StaffMember[];
  const inventory = rawInventory as unknown as InventoryItem[];
  const suppliers = rawSuppliers as unknown as Supplier[];
  const categories = rawCategories as unknown as Category[];
  const commissionPlans = rawCommissionPlans as unknown as CommissionPlan[];

  const loading = userLoading || profileLoading;

  // ⚡ Bolt: Memoize revenue calculation to avoid re-calculation on every render
  const todayRevenue = useMemo(() => {
    return (sales || []).reduce((acc, sale) => acc + (sale?.total || 0), 0);
  }, [sales]);

  // Navigation
  const setView = useCallback((view: ViewState, params?: any) => {
    if (view === 'TIPS_REVIEW' && params?.appointmentId) {
      setActiveReviewAppointmentId(params.appointmentId);
    }
    setCurrentView(view);
  }, []);

  // Auth actions
  const login = useCallback(() => false, []);
  const switchUser = useCallback(() => {}, []);

  // Appointment actions
  const addAppointment = useCallback(async (appt: any) => {
    const { createAppointment } = await import('@/modules/appointments/actions');
    await createAppointment({
      clientId: appt.clientId,
      clientName: appt.clientName,
      staffId: appt.staffId,
      serviceId: appt.serviceId,
      date: appt.date.toISOString().split('T')[0],
      time: appt.date.toTimeString().split(' ')[0].substring(0, 5),
      price: appt.price,
      notes: appt.notes || '',
    });
    window.location.reload();
  }, []);

  const updateAppointmentStatus = useCallback(async (id: string, status: AppointmentStatus) => {
    const { updateAppointmentStatus: updateAction } = await import('@/modules/appointments/actions');
    await updateAction(id, status as any);
    window.location.reload();
  }, []);

  // Sales actions
  const processSale = useCallback(async (items: CartItem[], clientId: string | null, staffId: string, method: PaymentMethod, discountReason?: string, tip: number = 0) => {
    const { createSale } = await import('@/modules/sales/actions');
    const total = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    await createSale({
      clientId: clientId || undefined,
      staffId,
      items: items.map(item => ({ id: item.id, name: item.name, type: item.type, price: item.price, qty: item.qty || 1 })),
      total,
      method: method as any,
      tip,
      discountApplied: discountReason,
    });
    window.location.reload();
  }, []);

  const submitReview = useCallback((review: any) => {
    setReviews(prev => [...prev, { ...review, id: Math.random().toString(36).substr(2, 9), date: new Date() }]);
  }, []);

  const addLateTip = useCallback(() => {}, []);

  // Client actions
  const addClient = useCallback(async (client: any) => {
    const { createClientAction } = await import('@/modules/clients/actions');
    const saved = await createClientAction(client);
    window.location.reload();
    return saved.id;
  }, []);

  const updateClient = useCallback(async (client: Client) => {
    const { updateClientAction } = await import('@/modules/clients/actions');
    await updateClientAction(client.id, client as any);
    window.location.reload();
  }, []);

  // Catalog actions
  const updateService = useCallback(() => window.location.reload(), []);
  const addService = useCallback(() => window.location.reload(), []);
  const deleteService = useCallback(() => window.location.reload(), []);
  const updateProduct = useCallback(() => window.location.reload(), []);
  const addProduct = useCallback(() => window.location.reload(), []);
  const deleteProduct = useCallback(() => window.location.reload(), []);

  // Staff actions
  const addStaff = useCallback(async (s: any) => {
    const { createStaff } = await import('@/modules/staff/actions');
    await createStaff(s);
    window.location.reload();
  }, []);

  const updateStaff = useCallback(async (s: StaffMember) => {
    const { updateStaff: updateAction } = await import('@/modules/staff/actions');
    await updateAction(s as any);
    window.location.reload();
  }, []);

  const addCommissionPlan = useCallback(async (p: any) => {
    const { createCommissionPlan } = await import('@/modules/commission/actions');
    await createCommissionPlan(p);
    window.location.reload();
  }, []);

  const deleteCommissionPlan = useCallback(async (id: string) => {
    const { deleteCommissionPlan: deleteAction } = await import('@/modules/commission/actions');
    await deleteAction(id);
    window.location.reload();
  }, []);

  // Inventory actions
  const addInventoryItem = useCallback(() => {}, []);
  const updateInventoryItem = useCallback(() => {}, []);
  const deleteInventoryItem = useCallback(() => {}, []);
  const adjustInventoryStock = useCallback(() => {}, []);
  const restockInventoryItem = useCallback(() => {}, []);
  const restockProduct = useCallback(() => {}, []);

  // Supplier actions
  const addSupplier = useCallback(() => {}, []);
  const updateSupplier = useCallback(() => {}, []);
  const deleteSupplier = useCallback(() => {}, []);

  // Category actions
  const addCategory = useCallback(() => {}, []);
  const deleteCategory = useCallback(() => {}, []);

  // Finance actions
  const addExpense = useCallback(async (e: any) => {
    const { createExpense } = await import('@/modules/finance/actions');
    await createExpense(e);
    window.location.reload();
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const addStaffPayment = useCallback((p: any) => {
    setStaffPayments(prev => [...prev, { ...p, id: Math.random().toString(36).substr(2, 9) }]);
  }, []);

  const closeRegister = useCallback(async (c: any) => {
    const { createRegisterClosure } = await import('@/modules/finance/actions');
    await createRegisterClosure(c);
    window.location.reload();
  }, []);

  // Referral actions
  const addReferralSource = useCallback((s: any) => {
    setReferrals(prev => [...prev, { ...s, id: Math.random().toString(36).substr(2, 9), stats: { clicks: 0, conversions: 0 } }]);
  }, []);

  const updateReferralSource = useCallback((s: ReferralSource) => {
    setReferrals(prev => prev.map(r => r.id === s.id ? s : r));
  }, []);

  const deleteReferralSource = useCallback((id: string) => {
    setReferrals(prev => prev.filter(r => r.id !== id));
  }, []);

  // Super Admin actions
  const addTenant = useCallback((t: any) => {
    setTenants(prev => [...prev, { ...t, id: Math.random().toString(36).substr(2, 9), status: 'ACTIVE', joinedDate: new Date() }]);
  }, []);

  const updateTenantStatus = useCallback((id: string, status: any) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }, []);

  const updateTenantPlan = useCallback(() => {}, []);
  const deleteTenant = useCallback((id: string) => {
    setTenants(prev => prev.filter(t => t.id !== id));
  }, []);

  const impersonateTenant = useCallback(() => setIsImpersonating(true), []);
  const exitImpersonation = useCallback(() => setIsImpersonating(false), []);

  const resolveTicket = useCallback((id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED' } : t));
  }, []);

  const markInvoicePaid = useCallback((id: string) => {
    setGlobalInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'PAID' } : i));
  }, []);

  const updateIntegration = useCallback((i: Integration) => {
    setIntegrations(prev => prev.map(int => int.id === i.id ? i : int));
  }, []);

  const updateLandingPageConfig = useCallback((c: Partial<LandingPageConfig>) => {
    setLandingPageConfig(prev => ({ ...prev, ...c }));
  }, []);

  const addSaasPlan = useCallback((p: SaasPlan) => {
    setSaasPlans(prev => [...prev, p]);
  }, []);

  const updateSaasPlan = useCallback((p: SaasPlan) => {
    setSaasPlans(prev => prev.map(plan => plan.id === p.id ? p : plan));
  }, []);

  const addMarketingCampaign = useCallback((c: MarketingCampaign) => {
    setMarketingCampaigns(prev => [c, ...prev]);
  }, []);

  const deleteMarketingCampaign = useCallback((id: string) => {
    setMarketingCampaigns(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateGlobalSettings = useCallback((s: Partial<GlobalSettings>) => {
    setGlobalSettings(prev => ({ ...prev, ...s }));
  }, []);

  const getAvailableSlots = useCallback(() => [] as Date[], []);

  // ⚡ Bolt: Memoize context value to prevent unnecessary re-renders of all consumers
  // when AppProvider re-renders but the data hasn't changed.
  const value = useMemo<AppContextType>(() => ({
    isAuthenticated,
    loading,
    currentUser,
    logout,
    shopProfile,
    updateShopProfile,
    shopSettings,
    updateShopSettings,
    currentView,
    setView,
    appointments: appointments || [],
    services: services || [],
    products: products || [],
    sales: sales || [],
    clients: clients || [],
    staff: staff || [],
    inventory: inventory || [],
    suppliers: suppliers || [],
    categories: categories || [],
    commissionPlans: commissionPlans || [],
    queue,
    expenses,
    staffPayments,
    supplyTransactions,
    registerClosures,
    reviews,
    todayRevenue,
    tenants,
    tickets,
    globalInvoices,
    integrations,
    referrals,
    landingPageConfig,
    saasPlans,
    marketingCampaigns,
    globalSettings,
    currentTenantId,
    currentTenantStatus: undefined,
    currentTenantPlanId: undefined,
    isImpersonating,
    activeReviewAppointmentId,
    login,
    switchUser,
    addAppointment,
    updateAppointmentStatus,
    joinQueue,
    leaveQueue,
    processSale,
    submitReview,
    addLateTip,
    addClient,
    updateClient,
    updateService,
    addService,
    deleteService,
    updateProduct,
    addProduct,
    deleteProduct,
    addStaff,
    updateStaff,
    addCommissionPlan,
    deleteCommissionPlan,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustInventoryStock,
    restockInventoryItem,
    restockProduct,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addCategory,
    deleteCategory,
    addExpense,
    removeExpense,
    addStaffPayment,
    closeRegister,
    addReferralSource,
    updateReferralSource,
    deleteReferralSource,
    addTenant,
    updateTenantStatus,
    updateTenantPlan,
    deleteTenant,
    impersonateTenant,
    exitImpersonation,
    resolveTicket,
    markInvoicePaid,
    updateIntegration,
    updateLandingPageConfig,
    addSaasPlan,
    updateSaasPlan,
    addMarketingCampaign,
    deleteMarketingCampaign,
    updateGlobalSettings,
    getAvailableSlots,
  }), [
    isAuthenticated,
    loading,
    currentUser,
    logout,
    shopProfile,
    updateShopProfile,
    shopSettings,
    updateShopSettings,
    currentView,
    setView,
    appointments,
    services,
    products,
    sales,
    clients,
    staff,
    inventory,
    suppliers,
    categories,
    commissionPlans,
    queue,
    expenses,
    staffPayments,
    supplyTransactions,
    registerClosures,
    reviews,
    todayRevenue,
    tenants,
    tickets,
    globalInvoices,
    integrations,
    referrals,
    landingPageConfig,
    saasPlans,
    marketingCampaigns,
    globalSettings,
    currentTenantId,
    isImpersonating,
    activeReviewAppointmentId,
    login,
    switchUser,
    addAppointment,
    updateAppointmentStatus,
    joinQueue,
    leaveQueue,
    processSale,
    submitReview,
    addLateTip,
    addClient,
    updateClient,
    updateService,
    addService,
    deleteService,
    updateProduct,
    addProduct,
    deleteProduct,
    addStaff,
    updateStaff,
    addCommissionPlan,
    deleteCommissionPlan,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustInventoryStock,
    restockInventoryItem,
    restockProduct,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addCategory,
    deleteCategory,
    addExpense,
    removeExpense,
    addStaffPayment,
    closeRegister,
    addReferralSource,
    updateReferralSource,
    deleteReferralSource,
    addTenant,
    updateTenantStatus,
    updateTenantPlan,
    deleteTenant,
    impersonateTenant,
    exitImpersonation,
    resolveTicket,
    markInvoicePaid,
    updateIntegration,
    updateLandingPageConfig,
    addSaasPlan,
    updateSaasPlan,
    addMarketingCampaign,
    deleteMarketingCampaign,
    updateGlobalSettings,
    getAvailableSlots,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// Alias para compatibilidade com codigo existente
export const useBarber = useApp;
export const BarberProvider = AppProvider;
