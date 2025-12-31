// =====================================================
// TIPOS DO KIT PREGUIÃ‡OSO - ONBOARDING
// =====================================================

export type BusinessType = 'barber' | 'salon' | 'unisex';
export type PackageLevel = 'essencial' | 'completo' | 'custom';
export type ServiceType = 'service' | 'addon' | 'combo';

export interface ServiceCategoryTemplate {
  id: string;
  business_type: BusinessType;
  name: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ServiceTemplate {
  id: string;
  category_id: string;
  category?: ServiceCategoryTemplate;
  type: ServiceType;
  name: string;
  duration_min: number;
  price_cents: number;
  price_from: boolean;
  tags: string[];
  sort_order: number;
  is_popular: boolean;
  package_level: 1 | 2 | 3;
  created_at: string;
}

export interface BundleItemTemplate {
  id: string;
  combo_service_id: string;
  item_service_id: string;
  quantity: number;
}

export interface OnboardingData {
  businessType: BusinessType | null;
  packageLevel: PackageLevel | null;
  selectedServices: string[]; // IDs dos serviÃ§os selecionados
  customizedServices: Record<string, Partial<ServiceTemplate>>; // EdiÃ§Ãµes customizadas
}

export interface OnboardingStats {
  totalServices: number;
  totalCombos: number;
  totalCategories: number;
  avgPrice: number;
  avgDuration: number;
}

export interface BusinessTypeOption {
  type: BusinessType | 'skip';
  icon: string;
  title: string;
  description: string;
  recommended?: boolean;
}

export interface PackageOption {
  level: PackageLevel;
  icon: string;
  title: string;
  description: string;
  itemCount: number;
  features: string[];
  recommended?: boolean;
}

export interface ServiceWithCategory extends ServiceTemplate {
  category: ServiceCategoryTemplate;
  bundleItems?: BundleItemTemplate[];
  isSelected?: boolean;
  isEdited?: boolean;
}

export interface GroupedServices {
  [categoryId: string]: {
    category: ServiceCategoryTemplate;
    services: ServiceWithCategory[];
    selectedCount: number;
    totalCount: number;
  };
}
