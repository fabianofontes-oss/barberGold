
import { 
  Appointment, Client, Product, Service, StaffMember, CommissionPlan, 
  InventoryItem, Supplier, SupplyTransaction, Category, Tenant, 
  SupportTicket, GlobalInvoice, Integration, ReferralSource, 
  SaasPlan, SaasV2Tenant, ReferralSettings, ReferralPartner, ReferralLink, ReferralSale, SaasV2SizeTier, SaasV2PlanId, AppointmentStatus, CompensationModel,
  ExpenseTemplate
} from './types';
import { subDays, addDays } from 'date-fns';

export const REFERRAL_SETTINGS_BR: ReferralSettings = {
  ownerAnnualCommissionPercent: 100,
  defaultPartnerPercent: 15,
  defaultInfluencerPercent: 18,
  bonusTargetCount: 100,
  bonusAmountBRL: 5000,
};

export const MOCK_REFERRAL_PARTNERS: ReferralPartner[] = [
  {
    id: 'refp_owner_001',
    tenantId: 't1',
    displayName: 'Alex Owner (Premium Gold)',
    partnerType: 'OWNER',
    baseCommissionPercent: 20,
    eligibleForBonus: false,
    isActive: true,
    ownerSharePercent: 100,
    staffSharePercent: 0
  },
  {
    id: 'refp_staff_001',
    tenantId: 't1',
    staffId: 'staff2',
    displayName: 'Mike The Barber',
    partnerType: 'STAFF',
    baseCommissionPercent: 20,
    eligibleForBonus: false,
    isActive: true,
    ownerSharePercent: 30,
    staffSharePercent: 70
  },
  {
    id: 'refp_influencer_001',
    displayName: 'Barber School Brasil',
    partnerType: 'PARTNER_PRO',
    baseCommissionPercent: 18,
    eligibleForBonus: true,
    isActive: true,
    ownerSharePercent: 0,
    staffSharePercent: 0
  },
];

export const MOCK_REFERRAL_LINKS: ReferralLink[] = [
  {
    id: 'refl_001',
    code: 'BARBERGOLD',
    partnerId: 'refp_owner_001',
    region: 'BR',
    createdAt: subDays(new Date(), 30),
    isActive: true,
  },
  {
    id: 'refl_002',
    code: 'BARBERSCHOOL',
    partnerId: 'refp_influencer_001',
    region: 'BR',
    createdAt: subDays(new Date(), 60),
    isActive: true,
  },
];

export const MOCK_REFERRAL_SALES: ReferralSale[] = [];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt1',
    clientId: 'c1',
    clientName: 'John Doe',
    staffId: 's1',
    serviceId: 'srv1',
    serviceName: 'Haircut',
    date: new Date(),
    price: 30,
    status: AppointmentStatus.SCHEDULED,
    notes: 'Regular customer'
  }
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'John Doe',
    phone: '(55) 99999-1234',
    totalSpent: 150,
    loyaltyPoints: 3,
    lastVisit: subDays(new Date(), 10),
    profileCompleted: true
  },
  {
    id: 'c2',
    name: 'Jane Smith',
    phone: '(55) 98888-5678',
    totalSpent: 80,
    loyaltyPoints: 1,
    lastVisit: subDays(new Date(), 45),
    profileCompleted: false
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Matte Pomade',
    price: 25,
    costPrice: 10,
    stock: 20,
    category: 'Styling',
    type: 'PRODUCT'
  },
  {
    id: 'p2',
    name: 'Beard Oil',
    price: 18,
    costPrice: 8,
    stock: 5,
    category: 'Beard Care',
    type: 'PRODUCT'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'srv1',
    name: 'Haircut',
    price: 30,
    durationMinutes: 45,
    category: 'Hair',
    type: 'SERVICE'
  },
  {
    id: 'srv2',
    name: 'Beard Trim',
    price: 20,
    durationMinutes: 30,
    category: 'Beard',
    type: 'SERVICE'
  }
];

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'super1',
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
    email: 'super@barberflow.com',
    password: 'super',
    commissionModel: CompensationModel.OWNER,
    serviceCommissionRate: 0,
    productCommissionRate: 0,
    rentalFee: 0,
    paymentFrequency: 'WEEKLY',
    workSchedule: []
  },
  {
    id: 's1',
    name: 'Alex Owner',
    role: 'OWNER',
    email: 'admin@barberflow.com',
    password: 'admin',
    commissionModel: CompensationModel.OWNER,
    serviceCommissionRate: 100,
    productCommissionRate: 100,
    rentalFee: 0,
    paymentFrequency: 'WEEKLY',
    workSchedule: Array.from({length: 7}, (_, i) => ({dayIndex: i, isActive: true, startTime: '09:00', endTime: '20:00', breaks: []}))
  },
  {
    id: 's2',
    name: 'Mike Barber',
    role: 'BARBER',
    email: 'mike@barberflow.com',
    password: 'mike',
    commissionModel: CompensationModel.PERCENTAGE,
    serviceCommissionRate: 50,
    productCommissionRate: 20,
    rentalFee: 0,
    paymentFrequency: 'WEEKLY',
    workSchedule: Array.from({length: 7}, (_, i) => ({dayIndex: i, isActive: i !== 0, startTime: '10:00', endTime: '18:00', breaks: []}))
  }
];

export const MOCK_PLANS: CommissionPlan[] = [
  {
    id: 'cp1',
    name: 'Standard Split',
    model: CompensationModel.PERCENTAGE,
    serviceRate: 50,
    productRate: 10,
    rentalFee: 0
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv1',
    name: 'Shampoo (Galão)',
    category: 'Washing',
    quantity: 2,
    minStock: 1,
    unit: 'UNIT',
    costPerUnit: 45
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup1',
    name: 'Barber Supply Co.',
    contactName: 'Carlos',
    phone: '(11) 9999-9999',
    category: 'General'
  }
];

export const MOCK_SUPPLY_TRANSACTIONS: SupplyTransaction[] = [];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Hair', type: 'SERVICE' },
  { id: 'cat2', name: 'Beard', type: 'SERVICE' },
  { id: 'cat3', name: 'Styling', type: 'PRODUCT' },
];

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 't1',
    name: 'Premium Gold Barber',
    ownerName: 'Alex Owner',
    email: 'alex@gold.com',
    phone: '5511999999999',
    status: 'ACTIVE',
    planId: 'SOLO_PRO',
    monthlyFee: 149,
    joinedDate: subDays(new Date(), 100)
  }
];

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'tk1',
    tenantId: 't1',
    tenantName: 'Premium Gold Barber',
    subject: 'Cannot access reports',
    lastMessage: 'I am getting a 403 error when accessing advanced reports.',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: new Date()
  }
];

export const MOCK_INVOICES: GlobalInvoice[] = [
  {
    id: 'inv_001',
    tenantId: 't1',
    tenantName: 'Premium Gold Barber',
    planName: 'Solo Pro',
    amount: 149,
    dueDate: addDays(new Date(), 5),
    status: 'PENDING'
  }
];

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'int1',
    name: 'WhatsApp Bot',
    description: 'Automated reminders via WhatsApp',
    icon: 'MessageCircle',
    category: 'COMMUNICATION',
    status: 'ACTIVE',
    installCount: 150,
    price: 49,
    isFeatured: true
  }
];

export const MOCK_REFERRALS: ReferralSource[] = [];

export const SAAS_PLANS_BR: SaasPlan[] = [
  {
    id: 'FREE',
    name: 'Free Solo',
    description: 'Caderno digital para começar.',
    monthlyPriceBRL: 0,
    yearlyPriceBRL: 0,
    maxStaff: 1,
    maxLocations: 1,
    featureFlags: { ONLINE_BOOKING: false, LOYALTY: false, ADVANCED_REPORTS: false, MULTI_SHOP: false, WEBSITE_PREMIUM: false },
    order: 1,
    isActive: true
  },
  {
    id: 'SOLO',
    name: 'Start',
    description: 'Organização com agendamento online.',
    monthlyPriceBRL: 49,
    yearlyPriceBRL: 490,
    maxStaff: 1,
    maxLocations: 1,
    featureFlags: { ONLINE_BOOKING: false, LOYALTY: false, ADVANCED_REPORTS: false, MULTI_SHOP: false, WEBSITE_PREMIUM: false },
    order: 2,
    isActive: true
  },
  {
    id: 'SOLO_PRO',
    name: 'Pro',
    description: 'Gestão completa de lucro e fidelização.',
    monthlyPriceBRL: 59,
    yearlyPriceBRL: 590,
    maxStaff: 1,
    maxLocations: 1,
    featureFlags: { ONLINE_BOOKING: true, LOYALTY: false, ADVANCED_REPORTS: false, MULTI_SHOP: false, WEBSITE_PREMIUM: false },
    order: 3,
    isActive: true
  },
  {
    id: 'EQUIPE',
    name: 'Equipe',
    description: 'Para barbearias com time',
    monthlyPriceBRL: 79,
    yearlyPriceBRL: 790,
    maxStaff: 3,
    maxLocations: 1,
    featureFlags: { ONLINE_BOOKING: true, LOYALTY: true, ADVANCED_REPORTS: true, MULTI_SHOP: false, WEBSITE_PREMIUM: false },
    order: 4,
    isActive: true
  },
  {
    id: 'STUDIO',
    name: 'Elite',
    description: 'Barbearias que querem marca própria forte.',
    monthlyPriceBRL: 119,
    yearlyPriceBRL: 1190,
    maxStaff: 6,
    maxLocations: 2,
    featureFlags: { ONLINE_BOOKING: true, LOYALTY: true, ADVANCED_REPORTS: true, MULTI_SHOP: true, WEBSITE_PREMIUM: true },
    order: 5,
    isActive: true
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    description: 'Redes e franquias',
    monthlyPriceBRL: 899,
    yearlyPriceBRL: 8990,
    maxStaff: 999,
    maxLocations: 999,
    featureFlags: { ONLINE_BOOKING: true, LOYALTY: true, ADVANCED_REPORTS: true, MULTI_SHOP: true, WEBSITE_PREMIUM: true },
    order: 6,
    isActive: true
  }
];

export const SAAS_V2_MOCK_TENANTS: SaasV2Tenant[] = [
  {
    id: 't1',
    shopName: 'Premium Gold Barber',
    ownerName: 'Alex Owner',
    email: 'alex@gold.com',
    phone: '5511999999999',
    status: 'ACTIVE',
    planId: 'SOLO_PRO',
    sizeTier: 'SOLO',
    billingInterval: 'MONTHLY',
    mrr: 59,
    createdAt: subDays(new Date(), 120),
    country: 'BR',
    defaultLanguage: 'pt-BR',
    defaultCurrency: 'BRL',
    billingDay: 10
  }
];

export const EXPENSE_TEMPLATES: ExpenseTemplate[] = [
  { title: 'Aluguel', category: 'RENT', amount: 1500, type: 'FIXED', icon: 'Building2', context: 'BUSINESS', defaultAmount: 1500 },
  { title: 'Energia', category: 'UTILITIES', amount: 300, type: 'FIXED', icon: 'Zap', context: 'BUSINESS', defaultAmount: 300 },
  { title: 'Internet', category: 'UTILITIES', amount: 100, type: 'FIXED', icon: 'Wifi', context: 'BUSINESS', defaultAmount: 100 },
  { title: 'Água', category: 'UTILITIES', amount: 80, type: 'FIXED', icon: 'Droplets', context: 'BUSINESS', defaultAmount: 80 },
  { title: 'Produtos Limpeza', category: 'SUPPLIES', amount: 150, type: 'VARIABLE', icon: 'SprayCan', context: 'BUSINESS', defaultAmount: 150 },
  { title: 'Café & Água', category: 'SUPPLIES', amount: 200, type: 'VARIABLE', icon: 'Coffee', context: 'BUSINESS', defaultAmount: 200 },
  { title: 'Marketing (Ads)', category: 'MARKETING', amount: 500, type: 'VARIABLE', icon: 'Smartphone', context: 'BUSINESS', defaultAmount: 500 },
  { title: 'Sistema (BarberFlow)', category: 'SYSTEM', amount: 59, type: 'FIXED', icon: 'Laptop2', context: 'BUSINESS', defaultAmount: 59 },
  { title: 'Manutenção', category: 'OTHER', amount: 0, type: 'VARIABLE', icon: 'Wrench', context: 'BUSINESS', defaultAmount: 0 },
  { title: 'Aluguel Casa', category: 'RENT', amount: 1200, type: 'FIXED', icon: 'Home', context: 'PERSONAL', defaultAmount: 1200 },
  { title: 'Mercado', category: 'OTHER', amount: 800, type: 'VARIABLE', icon: 'ShoppingCart', context: 'PERSONAL', defaultAmount: 800 },
  { title: 'Academia', category: 'OTHER', amount: 100, type: 'FIXED', icon: 'Dumbbell', context: 'PERSONAL', defaultAmount: 100 },
  { title: 'Streaming', category: 'UTILITIES', amount: 50, type: 'FIXED', icon: 'Tv', context: 'PERSONAL', defaultAmount: 50 },
  { title: 'Lazer', category: 'OTHER', amount: 300, type: 'VARIABLE', icon: 'Beer', context: 'PERSONAL', defaultAmount: 300 },
].map(t => ({...t, id: Math.random().toString()})) as ExpenseTemplate[];

export const SAAS_V2_BR_PRICING: Record<SaasV2SizeTier, Record<SaasV2PlanId, number>> = {
  SOLO: { FREE: 0, SOLO: 49, SOLO_PRO: 59, EQUIPE: 79, STUDIO: 119, ENTERPRISE: 0 },
  UP_TO_3: { FREE: 0, SOLO: 49, SOLO_PRO: 59, EQUIPE: 79, STUDIO: 119, ENTERPRISE: 0 },
  UP_TO_6: { FREE: 0, SOLO: 49, SOLO_PRO: 59, EQUIPE: 79, STUDIO: 119, ENTERPRISE: 0 },
  PLUS_6: { FREE: 0, SOLO: 49, SOLO_PRO: 59, EQUIPE: 79, STUDIO: 119, ENTERPRISE: 0 },
};
