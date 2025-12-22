/**
 * Limites e Restrições por Plano
 * 
 * Define o que cada plano pode ou não fazer
 */

export type PlanSlug = 'free' | 'solo' | 'solo-pro' | 'team' | 'premium' | 'enterprise'

export interface PlanLimits {
  // Staff/Profissionais
  max_staff: number | null // null = ilimitado
  
  // Agendamentos
  max_appointments_per_month: number | null
  
  // Clientes
  max_clients: number | null
  
  // Produtos
  max_products: number | null
  
  // Serviços
  max_services: number | null
  
  // Unidades/Filiais
  max_locations: number
  
  // Features booleanas
  features: {
    online_booking: boolean // Agendamento online para clientes
    commissions: boolean // Sistema de comissões
    loyalty_program: boolean // Programa de fidelidade
    advanced_reports: boolean // Relatórios avançados
    whatsapp_integration: boolean // Integração WhatsApp
    inventory_management: boolean // Gestão de estoque
    multi_calendar: boolean // Múltiplas agendas
    advanced_cash_control: boolean // Controle de caixa avançado
    per_staff_reports: boolean // Relatórios por profissional
    api_access: boolean // Acesso à API
    custom_dashboards: boolean // Dashboards personalizados
    auto_backup: boolean // Backup automático
    support_24_7: boolean // Suporte 24/7
    white_label: boolean // Marca própria
    dedicated_server: boolean // Servidor dedicado
    sla_guarantee: boolean // SLA garantido
    account_manager: boolean // Gerente de conta
    custom_training: boolean // Treinamento personalizado
  }
}

/**
 * Definição de limites por plano
 */
export const PLAN_LIMITS: Record<PlanSlug, PlanLimits> = {
  free: {
    max_staff: 1,
    max_appointments_per_month: 30,
    max_clients: 100,
    max_products: 10,
    max_services: 10,
    max_locations: 1,
    features: {
      online_booking: false,
      commissions: false,
      loyalty_program: false,
      advanced_reports: false,
      whatsapp_integration: false,
      inventory_management: false,
      multi_calendar: false,
      advanced_cash_control: false,
      per_staff_reports: false,
      api_access: false,
      custom_dashboards: false,
      auto_backup: false,
      support_24_7: false,
      white_label: false,
      dedicated_server: false,
      sla_guarantee: false,
      account_manager: false,
      custom_training: false,
    },
  },
  
  solo: {
    max_staff: 1,
    max_appointments_per_month: null, // Ilimitado
    max_clients: null,
    max_products: 100,
    max_services: 50,
    max_locations: 1,
    features: {
      online_booking: false,
      commissions: false,
      loyalty_program: false,
      advanced_reports: false,
      whatsapp_integration: false,
      inventory_management: false,
      multi_calendar: false,
      advanced_cash_control: false,
      per_staff_reports: false,
      api_access: false,
      custom_dashboards: false,
      auto_backup: false,
      support_24_7: false,
      white_label: false,
      dedicated_server: false,
      sla_guarantee: false,
      account_manager: false,
      custom_training: false,
    },
  },
  
  'solo-pro': {
    max_staff: 1,
    max_appointments_per_month: null,
    max_clients: null,
    max_products: null,
    max_services: null,
    max_locations: 1,
    features: {
      online_booking: true, // ✅
      commissions: true, // ✅
      loyalty_program: true, // ✅
      advanced_reports: true, // ✅
      whatsapp_integration: true, // ✅
      inventory_management: false,
      multi_calendar: false,
      advanced_cash_control: false,
      per_staff_reports: false,
      api_access: false,
      custom_dashboards: false,
      auto_backup: false,
      support_24_7: false,
      white_label: false,
      dedicated_server: false,
      sla_guarantee: false,
      account_manager: false,
      custom_training: false,
    },
  },
  
  team: {
    max_staff: 5,
    max_appointments_per_month: null,
    max_clients: null,
    max_products: null,
    max_services: null,
    max_locations: 1,
    features: {
      online_booking: true,
      commissions: true,
      loyalty_program: true,
      advanced_reports: true,
      whatsapp_integration: true,
      inventory_management: true, // ✅
      multi_calendar: true, // ✅
      advanced_cash_control: true, // ✅
      per_staff_reports: true, // ✅
      api_access: false,
      custom_dashboards: false,
      auto_backup: false,
      support_24_7: false,
      white_label: false,
      dedicated_server: false,
      sla_guarantee: false,
      account_manager: false,
      custom_training: false,
    },
  },
  
  premium: {
    max_staff: 10,
    max_appointments_per_month: null,
    max_clients: null,
    max_products: null,
    max_services: null,
    max_locations: 3,
    features: {
      online_booking: true,
      commissions: true,
      loyalty_program: true,
      advanced_reports: true,
      whatsapp_integration: true,
      inventory_management: true,
      multi_calendar: true,
      advanced_cash_control: true,
      per_staff_reports: true,
      api_access: true, // ✅
      custom_dashboards: true, // ✅
      auto_backup: true, // ✅
      support_24_7: true, // ✅
      white_label: false,
      dedicated_server: false,
      sla_guarantee: false,
      account_manager: false,
      custom_training: false,
    },
  },
  
  enterprise: {
    max_staff: null, // Ilimitado
    max_appointments_per_month: null,
    max_clients: null,
    max_products: null,
    max_services: null,
    max_locations: 999, // "Ilimitado" (limite prático)
    features: {
      online_booking: true,
      commissions: true,
      loyalty_program: true,
      advanced_reports: true,
      whatsapp_integration: true,
      inventory_management: true,
      multi_calendar: true,
      advanced_cash_control: true,
      per_staff_reports: true,
      api_access: true,
      custom_dashboards: true,
      auto_backup: true,
      support_24_7: true,
      white_label: true, // ✅
      dedicated_server: true, // ✅
      sla_guarantee: true, // ✅
      account_manager: true, // ✅
      custom_training: true, // ✅
    },
  },
}

/**
 * Pega limites de um plano específico
 */
export function getPlanLimits(planSlug: PlanSlug): PlanLimits {
  return PLAN_LIMITS[planSlug] || PLAN_LIMITS.free
}

/**
 * Verifica se um plano tem uma feature específica
 */
export function planHasFeature(planSlug: PlanSlug, feature: keyof PlanLimits['features']): boolean {
  return PLAN_LIMITS[planSlug].features[feature] || false
}

/**
 * Verifica se um valor está dentro do limite
 */
export function isWithinLimit(current: number, limit: number | null): boolean {
  if (limit === null) return true // Ilimitado
  return current < limit
}

/**
 * Calcula % de uso de um limite
 */
export function calculateUsagePercent(current: number, limit: number | null): number {
  if (limit === null) return 0 // Ilimitado
  if (limit === 0) return 100
  return Math.min(Math.round((current / limit) * 100), 100)
}

