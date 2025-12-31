
export type ViewState = 'DASHBOARD' | 'AGENDA' | 'PDV' | 'CLIENTS' | 'FINANCE' | 'CATALOG' | 'SETTINGS' | 'MY_PLAN' | 'GROWTH' | 'SMART_PRICING' | 'BARBER_CLUB' | 'REFERRALS' | 'WEBSITE_EDITOR' | 'SUPER_ADMIN_DASHBOARD' | 'SUPER_ADMIN_TENANTS' | 'SUPER_ADMIN_PLANS' | 'SUPER_ADMIN_PARTNERS' | 'SUPER_ADMIN_SYSTEM' | 'SUPER_ADMIN_SUPPORT' | 'SUPER_ADMIN_BILLING' | 'SUPER_ADMIN_SETTINGS' | 'SUPER_ADMIN_MARKETING' | 'SUPER_ADMIN_MARKETPLACE' | 'SUPER_ADMIN_CMS' | 'SAAS_LANDING' | 'AUTH' | 'ONLINE_BOOKING' | 'TIPS_REVIEW' | 'PUBLIC_WEBSITE' | 'SUPER_OFFICE_V2';

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CHECKED_IN = 'CHECKED_IN',      // Cliente chegou
  IN_PROGRESS = 'IN_PROGRESS',    // Atendimento iniciado
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  BLOCKED = 'BLOCKED',
  NO_SHOW_PENDING = 'NO_SHOW_PENDING',  // Barbeiro marcou como no-show, aguardando aprovaÃ§Ã£o do dono
  NO_SHOW = 'NO_SHOW'                    // Confirmado pelo dono
}

export enum RecurrenceType {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  GOOGLE_PAY = 'GOOGLE_PAY',
  APPLE_PAY = 'APPLE_PAY',
  MERCADO_PAGO = 'MERCADO_PAGO',
  PAGSEGURO = 'PAGSEGURO',
  INFINITE_PAY = 'INFINITE_PAY',
  STONE = 'STONE',
  OTHER = 'OTHER'
}

export enum CompensationModel {
  PERCENTAGE = 'PERCENTAGE',
  CHAIR_RENTAL = 'CHAIR_RENTAL',
  OWNER = 'OWNER'
}

export type CategoryType = 'SERVICE' | 'PRODUCT' | 'SUPPLY' | 'SUPPLIER';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}

export interface BreakTime {
  id: string;
  startTime: string;
  endTime: string;
  type: 'LUNCH' | 'COFFEE' | 'OTHER';
}

export interface DaySchedule {
  dayIndex: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
  breaks: BreakTime[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF' | 'SUPER_ADMIN';
  email?: string;
  // password removido - auth via Supabase
  avatar?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  commissionModel: CompensationModel;
  serviceCommissionRate: number;
  productCommissionRate: number;
  rentalFee: number;
  paymentFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  workSchedule: DaySchedule[];
  allowedServices?: string[];
  smartBreak?: {
    enabled: boolean;
    clientsPerCycle: number;
    durationMinutes: number;
  };
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  category?: string;
  type: 'SERVICE';
}

export interface ProductVariant {
  id: string;
  name: string; // Ex: "100ml", "250ml", "500ml"
  price: number;
  costPrice: number;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  image?: string;
  category?: string;
  type: 'PRODUCT';
  variants?: ProductVariant[];
  hasVariants?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'SERVICE' | 'PRODUCT';
  category?: string;
  image?: string;
  qty?: number;
}

export interface Sale {
  id: string;
  clientId: string | null;
  staffId: string;
  items: CartItem[];
  total: number;
  date: Date;
  method: PaymentMethod;
  discountApplied?: string;
  tip?: number;
}

export interface Dependent {
  id: string;
  name: string;
  preferredStaffId?: string;
}

export type ClientTag = 'VIP' | 'PONTUAL' | 'ATRASA' | 'EXIGENTE' | 'FACIL' | 'NOVO' | 'FIEL';

export interface ClientPreferences {
  preferredService?: string;
  preferredProduct?: string;
  preferredDay?: string;
  preferredTime?: string;
  allergies?: string;
  observations?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  totalSpent: number;
  lastVisit?: Date;
  loyaltyPoints?: number;
  referralCode?: string;
  referredBy?: string;
  profileCompleted?: boolean;
  preferredStaffId?: string;
  notes?: string;
  dependents?: Dependent[];
  tags?: ClientTag[];
  preferences?: ClientPreferences;
  photo?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  staffId: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  recurrence?: RecurrenceType;
  recurrenceEndDate?: Date;
}

export interface QueueItem {
  id: string;
  clientName: string;
  clientId: string;
  serviceId: string;
  serviceName: string;
  arrivalTime: Date;
  preferredStaffId?: string;
}

export interface CommissionPlan {
  id: string;
  name: string;
  description?: string;
  model: CompensationModel;
  serviceRate: number;
  productRate: number;
  rentalFee: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'RENT' | 'UTILITIES' | 'SUPPLIES' | 'MARKETING' | 'SYSTEM' | 'OTHER' | 'PERSONAL';
  context: 'BUSINESS' | 'PERSONAL';
  date: Date;
}

export interface ExpenseTemplate extends Partial<Expense> {
  type: 'FIXED' | 'VARIABLE';
  icon: string;
  defaultAmount: number;
}

export interface StaffPayment {
  id: string;
  staffId: string;
  amount: number;
  type: 'PAYOUT' | 'ADVANCE';
  date: Date;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: 'UNIT' | 'LITRE' | 'BOX' | 'PACK';
  costPerUnit: number;
  supplierId?: string;
  lastRestockDate?: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  category: string;
}

export interface SupplyTransaction {
  id: string;
  itemId: string;
  itemName: string;
  itemType: 'INVENTORY' | 'PRODUCT';
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplierId: string;
  date: Date;
}

export interface RegisterClosure {
  id: string;
  date: Date;
  closedByStaffId: string;
  totalExpected: number;
  totalCounted: number;
  difference: number;
  breakdown: Record<string, { expected: number; counted: number }>;
  notes?: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  borderRadius: string;
}

export type ThemeTemplate = 'PREMIUM' | 'CLASSIC' | 'CUSTOM';
export type WebsiteSectionType = 'HERO' | 'ABOUT' | 'SERVICES' | 'TEAM' | 'PRODUCTS' | 'GALLERY' | 'REVIEWS' | 'LOCATION';

export interface WebsiteConfig {
  themeTemplate: ThemeTemplate;
  premiumBackground?: 'DARK' | 'GRAY' | 'LIGHT';
  customColors?: ThemeColors;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  sectionOrder: WebsiteSectionType[];
  showTeam: boolean;
  showServices: boolean;
  showLocation: boolean;
  coverOpacity: number;
  gallery: { id: string; url: string; caption?: string }[];
  externalReviews: { id: string; name: string; date: string; rating: number; text: string; source: 'GOOGLE' | 'FACEBOOK' | 'SYSTEM' }[];
}

export interface ShopSettings {
  dailyRevenueGoal: number;
  returnReminderDays: number;
  winBackDays: number;
  fidelityThreshold?: number;
  messageTemplateOverdue: string;
  messageTemplateWinBack: string;
  enableBirthdayDiscount: boolean;
  enableWinBackDiscount: boolean;
  enableLoyaltyCard: boolean;
  enableReferralSystem: boolean;
  enableTipsReview?: boolean;
  enableCashControl?: boolean;
  hideClientContactInfo: boolean;
  discountAllocation: 'SHARED' | 'SHOP_ABSORBS';
  queueDistributionRule?: 'FAIRNESS' | 'SPEED' | 'MANUAL';
  paymentSettings?: {
    inStore: PaymentMethod[];
    online: PaymentMethod[];
  };
  gatewayConfig?: {
    mercadoPago?: {
      enabled: boolean;
      publicKey: string;
      accessToken: string;
    };
    pagSeguro?: {
      enabled: boolean;
      email: string;
      token: string;
    };
    stripe?: {
      enabled: boolean;
      publishableKey: string;
      secretKey: string;
    };
    infinitePay?: {
      enabled: boolean;
      apiKey: string;
      appKey: string;
    };
    stone?: {
      enabled: boolean;
      stoneCode: string;
      apiKey: string;
    };
  };
  pixConfig?: {
    keyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM';
    key: string;
    beneficiaryName: string;
  };
  installmentConfig?: {
    maxInstallments: number;
    minInstallmentValue: number;
    chargeInterest: boolean;
    interestRate: number;
  };
  bankAccount?: {
    bank: string;
    accountType: 'CHECKING' | 'SAVINGS' | 'PAYMENT';
    agency: string;
    account: string;
    accountHolder: string;
    holderDocument: string;
  };
  website: WebsiteConfig;
  referralConfig?: {
    enabled: boolean;
    ownerReferralCode?: string;
    allowStaffToParticipate: boolean;
    programCommissionPercent?: number;
    staffSharePercent: number;
    ownerSharePercent: number;
  };
}

export interface ShopProfile {
  name: string;
  slug?: string;
  customDomain?: string;
  logo?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  address: string;
  city?: string;
  state?: string;
  phone: string;
  whatsapp: string;
  instagram?: string;
  operatingHours: DaySchedule[];
}

// SAAS & SUPER ADMIN TYPES

export type SaasPlanId = 'FREE' | 'SOLO' | 'SOLO_PRO' | 'EQUIPE' | 'STUDIO' | 'ENTERPRISE';

export interface SaasPlan {
  id: SaasPlanId;
  name: string;
  description: string;
  monthlyPriceBRL: number;
  yearlyPriceBRL: number;
  maxStaff: number;
  maxLocations: number;
  featureFlags: {
    ONLINE_BOOKING: boolean;
    LOYALTY: boolean;
    ADVANCED_REPORTS: boolean;
    MULTI_SHOP: boolean;
    WEBSITE_PREMIUM: boolean;
  };
  isActive?: boolean;
  order: number;
}

export type SaasV2TenantStatus = 'ACTIVE' | 'TRIAL' | 'OVERDUE' | 'SUSPENDED';
export type SaasV2BillingInterval = 'MONTHLY' | 'ANNUAL';
export type SaasV2SizeTier = 'SOLO' | 'UP_TO_3' | 'UP_TO_6' | 'PLUS_6';
export type SaasV2FeatureKey = keyof SaasPlan['featureFlags'];
export type SaasV2PlanId = SaasPlanId;

export interface Tenant {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CANCELLED';
  planId: SaasPlanId;
  monthlyFee: number;
  joinedDate: Date;
}

export interface SaasV2Tenant {
  id: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: SaasV2TenantStatus;
  planId: SaasPlanId;
  sizeTier: SaasV2SizeTier;
  billingInterval: SaasV2BillingInterval;
  mrr: number;
  createdAt: Date;
  country: 'BR' | 'US' | 'CL';
  defaultLanguage: 'pt-BR' | 'en-US' | 'es-CL';
  defaultCurrency: 'BRL' | 'USD' | 'CLP';
  billingDay: number;
  lastPaymentDate?: Date;
  nextDueDate?: Date;
  overdueDays?: number;
  notesInternal?: string;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  tenantName: string;
  subject: string;
  lastMessage: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: Date;
}

export interface GlobalInvoice {
  id: string;
  tenantId: string;
  tenantName: string;
  planName: string;
  amount: number;
  dueDate: Date;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'COMMUNICATION' | 'PAYMENT' | 'MARKETING' | 'OTHER';
  status: 'ACTIVE' | 'BETA' | 'COMING_SOON' | 'DEPRECATED';
  installCount: number;
  price: number;
  isFeatured: boolean;
}

export interface ReferralSource {
  id: string;
  name: string;
  code: string;
  stats: {
    clicks: number;
    conversions: number;
    revenueGenerated: number;
  };
}

export interface LandingPageConfig {
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  showPricing: boolean;
  showTestimonials: boolean;
  featuredPlanId: string;
  announcementBar: {
    enabled: boolean;
    text: string;
    link: string;
  };
}

export interface MarketingCampaign {
  id: string;
  title: string;
  content: string;
  type: 'BANNER' | 'MODAL' | 'PUSH' | 'EMAIL';
  targetAudience: 'ALL' | 'FREE_PLAN' | 'PRO_PLAN' | 'INACTIVE';
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  clicks: number;
  views: number;
  createdAt: Date;
}

export interface GlobalSettings {
  appName: string;
  trialDays: number;
  currency: string;
  stripeKey?: string; // Deprecated: nÃ£o deve ser usado no client-side
  enableMaintenance: boolean;
  enableSignup: boolean;
}

// REFERRAL SYSTEM TYPES
export type ReferralPartnerType = 'OWNER' | 'STAFF' | 'PARTNER_GENERAL' | 'PARTNER_PRO';

export interface ReferralPartner {
  id: string;
  tenantId?: string;
  staffId?: string;
  displayName: string;
  partnerType: ReferralPartnerType;
  baseCommissionPercent: number;
  eligibleForBonus: boolean;
  isActive: boolean;
  ownerSharePercent?: number;
  staffSharePercent?: number;
}

export interface ReferralLink {
  id: string;
  code: string;
  partnerId: string;
  region: 'BR' | 'CL' | 'US';
  createdAt: Date;
  isActive: boolean;
}

export type ReferralSaleStatus = 'PENDING' | 'AVAILABLE' | 'CANCELLED' | 'ADJUSTED';
export type BillingPeriod = 'MONTHLY' | 'ANNUAL';

export interface ReferralSale {
  id: string;
  referralCode: string;
  partnerId: string;
  referredTenantId: string;
  planId: SaasPlanId;
  billingPeriod: BillingPeriod;
  saleValueBRL: number;
  commissionBaseBRL: number;
  commissionPercent: number;
  commissionAmountBRL: number;
  eligibleForBonus: boolean;
  status: ReferralSaleStatus;
  createdAt: Date;
  paidAt?: Date;
  availableAt?: Date;
  cancelledAt?: Date;
  chargebackAt?: Date;
  staffSharePercent?: number;
  ownerSharePercent?: number;
  staffCommissionAmountBRL?: number;
  ownerCommissionAmountBRL?: number;
}

export interface ReferralSettings {
  ownerAnnualCommissionPercent: number;
  defaultPartnerPercent: number;
  defaultInfluencerPercent: number;
  bonusTargetCount: number;
  bonusAmountBRL: number;
}
