/**
 * BARBERFLOW - Database Types (Supabase)
 * Gerado a partir do schema-complete.sql v2.0
 * Multi-tenant SaaS Architecture
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =============================================
// ENUMS (Union Types)
// =============================================

export type TenantStatus = 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED' | 'OVERDUE'
export type TenantPlanId = 'FREE' | 'SOLO' | 'SOLO_PRO' | 'EQUIPE' | 'STUDIO' | 'ENTERPRISE'

export type ProfileRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'BARBER' | 'ASSISTANT' | 'RECEPTIONIST' | 'STAFF'
export type CommissionModel = 'PERCENTAGE' | 'FIXED' | 'TIERED' | 'NONE'

export type CategoryType = 'SERVICE' | 'PRODUCT'

export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'EXPIRE' | 'ADJUST' | 'BONUS'
export type LoyaltyRewardType = 'SERVICE' | 'PRODUCT' | 'DISCOUNT_PERCENTAGE' | 'DISCOUNT_FIXED' | 'FREE_ITEM'

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'BLOCKED'
export type AppointmentSource = 'MANUAL' | 'ONLINE' | 'WHATSAPP' | 'INSTAGRAM' | 'PHONE'

export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'VOUCHER' | 'LOYALTY' | 'MIXED' | 'OTHER'
export type SaleStatus = 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'
export type SaleItemType = 'SERVICE' | 'PRODUCT'

export type CashClosureStatus = 'OPEN' | 'CLOSED' | 'REVIEWED'

export type ExpenseCategory = 'RENT' | 'UTILITIES' | 'SUPPLIES' | 'EQUIPMENT' | 'MARKETING' | 'SALARIES' | 'TAXES' | 'MAINTENANCE' | 'OTHER'

export type CommissionStatus = 'PENDING' | 'PAID' | 'CANCELLED'

export type WebsiteThemeTemplate = 'PREMIUM' | 'CLASSIC' | 'CUSTOM'
export type WebsitePremiumBackground = 'DARK' | 'GRAY' | 'LIGHT'

export type ReferralRewardType = 'PERCENTAGE' | 'FIXED' | 'POINTS' | 'NONE'
export type ReferralLinkType = 'CLIENT' | 'STAFF' | 'PARTNER'
export type ReferralConversionStatus = 'PENDING' | 'VALIDATED' | 'PAID' | 'CANCELLED'

export type NotificationType = 'APPOINTMENT_REMINDER' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'LOYALTY_POINTS_EARNED' | 'LOYALTY_TIER_UP' | 'BIRTHDAY' | 'PROMOTION' | 'SYSTEM'
export type NotificationRecipientType = 'STAFF' | 'CLIENT'

export type SaasInvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'

export type SupportTicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type SupportTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_RESPONSE' | 'RESOLVED' | 'CLOSED'
export type SupportMessageSenderType = 'TENANT' | 'SUPPORT'

// =============================================
// DATABASE INTERFACE
// =============================================

export interface Database {
  public: {
    Tables: {
      // =============================================
      // MÓDULO 1: CORE (Tenants & Auth)
      // =============================================
      tenants: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          owner_id: string
          plan_id: TenantPlanId
          status: TenantStatus
          trial_ends_at: string | null
          phone: string | null
          email: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          instagram: string | null
          facebook: string | null
          whatsapp: string | null
          logo_url: string | null
          cover_url: string | null
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          owner_id: string
          plan_id?: TenantPlanId
          status?: TenantStatus
          trial_ends_at?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          instagram?: string | null
          facebook?: string | null
          whatsapp?: string | null
          logo_url?: string | null
          cover_url?: string | null
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          owner_id?: string
          plan_id?: TenantPlanId
          status?: TenantStatus
          trial_ends_at?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          instagram?: string | null
          facebook?: string | null
          whatsapp?: string | null
          logo_url?: string | null
          cover_url?: string | null
          settings?: Json
        }
        Relationships: []
      }

      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tenant_id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          avatar_url: string | null
          bio: string | null
          role: ProfileRole
          is_active: boolean
          commission_model: CommissionModel
          commission_rate: number
          commission_config: Json
          work_schedule: Json
          daily_goal: number
          monthly_goal: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: ProfileRole
          is_active?: boolean
          commission_model?: CommissionModel
          commission_rate?: number
          commission_config?: Json
          work_schedule?: Json
          daily_goal?: number
          monthly_goal?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: ProfileRole
          is_active?: boolean
          commission_model?: CommissionModel
          commission_rate?: number
          commission_config?: Json
          work_schedule?: Json
          daily_goal?: number
          monthly_goal?: number
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 2: CATÁLOGO (Services & Products)
      // =============================================
      categories: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          name: string
          type: CategoryType
          color: string
          icon: string | null
          sort_order: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          name: string
          type: CategoryType
          color?: string
          icon?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          name?: string
          type?: CategoryType
          color?: string
          icon?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Relationships: []
      }

      services: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tenant_id: string
          name: string
          description: string | null
          price: number
          duration_minutes: number
          category_id: string | null
          image_url: string | null
          is_active: boolean
          allow_online_booking: boolean
          requires_deposit: boolean
          deposit_amount: number
          commission_override: number | null
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id: string
          name: string
          description?: string | null
          price: number
          duration_minutes?: number
          category_id?: string | null
          image_url?: string | null
          is_active?: boolean
          allow_online_booking?: boolean
          requires_deposit?: boolean
          deposit_amount?: number
          commission_override?: number | null
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id?: string
          name?: string
          description?: string | null
          price?: number
          duration_minutes?: number
          category_id?: string | null
          image_url?: string | null
          is_active?: boolean
          allow_online_booking?: boolean
          requires_deposit?: boolean
          deposit_amount?: number
          commission_override?: number | null
          sort_order?: number
        }
        Relationships: []
      }

      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tenant_id: string
          name: string
          description: string | null
          sku: string | null
          barcode: string | null
          price: number
          cost_price: number
          stock: number
          min_stock: number
          track_stock: boolean
          category_id: string | null
          image_url: string | null
          is_active: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id: string
          name: string
          description?: string | null
          sku?: string | null
          barcode?: string | null
          price: number
          cost_price?: number
          stock?: number
          min_stock?: number
          track_stock?: boolean
          category_id?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id?: string
          name?: string
          description?: string | null
          sku?: string | null
          barcode?: string | null
          price?: number
          cost_price?: number
          stock?: number
          min_stock?: number
          track_stock?: boolean
          category_id?: string | null
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 3: CRM (Clients)
      // =============================================
      clients: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tenant_id: string
          name: string
          phone: string
          email: string | null
          cpf: string | null
          birth_date: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          avatar_url: string | null
          total_spent: number
          total_visits: number
          last_visit: string | null
          average_ticket: number
          loyalty_points: number
          loyalty_tier: LoyaltyTier
          referral_code: string | null
          referred_by: string | null
          tags: string[]
          notes: string | null
          preferred_staff_id: string | null
          preferred_services: string[]
          is_active: boolean
          is_blocked: boolean
          blocked_reason: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id: string
          name: string
          phone: string
          email?: string | null
          cpf?: string | null
          birth_date?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          avatar_url?: string | null
          total_spent?: number
          total_visits?: number
          last_visit?: string | null
          average_ticket?: number
          loyalty_points?: number
          loyalty_tier?: LoyaltyTier
          referral_code?: string | null
          referred_by?: string | null
          tags?: string[]
          notes?: string | null
          preferred_staff_id?: string | null
          preferred_services?: string[]
          is_active?: boolean
          is_blocked?: boolean
          blocked_reason?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id?: string
          name?: string
          phone?: string
          email?: string | null
          cpf?: string | null
          birth_date?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          avatar_url?: string | null
          total_spent?: number
          total_visits?: number
          last_visit?: string | null
          average_ticket?: number
          loyalty_points?: number
          loyalty_tier?: LoyaltyTier
          referral_code?: string | null
          referred_by?: string | null
          tags?: string[]
          notes?: string | null
          preferred_staff_id?: string | null
          preferred_services?: string[]
          is_active?: boolean
          is_blocked?: boolean
          blocked_reason?: string | null
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 4: AGENDAMENTO
      // =============================================
      appointments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tenant_id: string
          client_id: string | null
          staff_id: string
          service_id: string
          scheduled_at: string
          duration_minutes: number
          price: number
          status: AppointmentStatus
          source: AppointmentSource
          is_recurring: boolean
          recurrence_rule: string | null
          parent_appointment_id: string | null
          notes: string | null
          internal_notes: string | null
          confirmed_at: string | null
          reminder_sent_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id: string
          client_id?: string | null
          staff_id: string
          service_id: string
          scheduled_at: string
          duration_minutes: number
          price: number
          status?: AppointmentStatus
          source?: AppointmentSource
          is_recurring?: boolean
          recurrence_rule?: string | null
          parent_appointment_id?: string | null
          notes?: string | null
          internal_notes?: string | null
          confirmed_at?: string | null
          reminder_sent_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id?: string
          client_id?: string | null
          staff_id?: string
          service_id?: string
          scheduled_at?: string
          duration_minutes?: number
          price?: number
          status?: AppointmentStatus
          source?: AppointmentSource
          is_recurring?: boolean
          recurrence_rule?: string | null
          parent_appointment_id?: string | null
          notes?: string | null
          internal_notes?: string | null
          confirmed_at?: string | null
          reminder_sent_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 5: VENDAS & PDV
      // =============================================
      sales: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          client_id: string | null
          staff_id: string
          appointment_id: string | null
          subtotal: number
          discount: number
          discount_type: 'PERCENTAGE' | 'FIXED' | null
          discount_reason: string | null
          tip: number
          total: number
          payment_method: PaymentMethod
          payment_details: Json
          status: SaleStatus
          notes: string | null
          cash_closure_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          client_id?: string | null
          staff_id: string
          appointment_id?: string | null
          subtotal: number
          discount?: number
          discount_type?: 'PERCENTAGE' | 'FIXED' | null
          discount_reason?: string | null
          tip?: number
          total: number
          payment_method: PaymentMethod
          payment_details?: Json
          status?: SaleStatus
          notes?: string | null
          cash_closure_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          client_id?: string | null
          staff_id?: string
          appointment_id?: string | null
          subtotal?: number
          discount?: number
          discount_type?: 'PERCENTAGE' | 'FIXED' | null
          discount_reason?: string | null
          tip?: number
          total?: number
          payment_method?: PaymentMethod
          payment_details?: Json
          status?: SaleStatus
          notes?: string | null
          cash_closure_id?: string | null
        }
        Relationships: []
      }

      sale_items: {
        Row: {
          id: string
          sale_id: string
          item_type: SaleItemType
          item_id: string
          name: string
          price: number
          quantity: number
          commission_rate: number | null
          commission_amount: number | null
          executed_by: string | null
        }
        Insert: {
          id?: string
          sale_id: string
          item_type: SaleItemType
          item_id: string
          name: string
          price: number
          quantity?: number
          commission_rate?: number | null
          commission_amount?: number | null
          executed_by?: string | null
        }
        Update: {
          id?: string
          sale_id?: string
          item_type?: SaleItemType
          item_id?: string
          name?: string
          price?: number
          quantity?: number
          commission_rate?: number | null
          commission_amount?: number | null
          executed_by?: string | null
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 6: FINANCEIRO
      // =============================================
      cash_closures: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          opened_at: string
          closed_at: string | null
          closed_by: string | null
          expected_cash: number
          expected_card: number
          expected_pix: number
          expected_total: number
          actual_cash: number | null
          actual_card: number | null
          actual_pix: number | null
          actual_total: number | null
          difference: number | null
          status: CashClosureStatus
          is_blind: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          opened_at: string
          closed_at?: string | null
          closed_by?: string | null
          expected_cash?: number
          expected_card?: number
          expected_pix?: number
          expected_total?: number
          actual_cash?: number | null
          actual_card?: number | null
          actual_pix?: number | null
          actual_total?: number | null
          difference?: number | null
          status?: CashClosureStatus
          is_blind?: boolean
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          opened_at?: string
          closed_at?: string | null
          closed_by?: string | null
          expected_cash?: number
          expected_card?: number
          expected_pix?: number
          expected_total?: number
          actual_cash?: number | null
          actual_card?: number | null
          actual_pix?: number | null
          actual_total?: number | null
          difference?: number | null
          status?: CashClosureStatus
          is_blind?: boolean
          notes?: string | null
        }
        Relationships: []
      }

      expenses: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          title: string
          description: string | null
          amount: number
          category: ExpenseCategory
          expense_date: string
          payment_method: string | null
          is_recurring: boolean
          recurrence_rule: string | null
          receipt_url: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          title: string
          description?: string | null
          amount: number
          category: ExpenseCategory
          expense_date: string
          payment_method?: string | null
          is_recurring?: boolean
          recurrence_rule?: string | null
          receipt_url?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          title?: string
          description?: string | null
          amount?: number
          category?: ExpenseCategory
          expense_date?: string
          payment_method?: string | null
          is_recurring?: boolean
          recurrence_rule?: string | null
          receipt_url?: string | null
          notes?: string | null
        }
        Relationships: []
      }

      commissions: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          staff_id: string
          sale_id: string | null
          sale_item_id: string | null
          sale_amount: number
          commission_rate: number
          commission_amount: number
          status: CommissionStatus
          paid_at: string | null
          reference_date: string
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          staff_id: string
          sale_id?: string | null
          sale_item_id?: string | null
          sale_amount: number
          commission_rate: number
          commission_amount: number
          status?: CommissionStatus
          paid_at?: string | null
          reference_date: string
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          staff_id?: string
          sale_id?: string | null
          sale_item_id?: string | null
          sale_amount?: number
          commission_rate?: number
          commission_amount?: number
          status?: CommissionStatus
          paid_at?: string | null
          reference_date?: string
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 7: WEBSITE & BRAND
      // =============================================
      website_config: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tenant_id: string
          theme_template: WebsiteThemeTemplate
          premium_background: WebsitePremiumBackground
          custom_colors: Json
          hero_title: string
          hero_subtitle: string
          hero_image: string | null
          cover_opacity: number
          about_title: string
          about_text: string | null
          about_image: string | null
          section_order: string[]
          gallery: Json
          meta_title: string | null
          meta_description: string | null
          google_analytics_id: string | null
          facebook_pixel_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id: string
          theme_template?: WebsiteThemeTemplate
          premium_background?: WebsitePremiumBackground
          custom_colors?: Json
          hero_title?: string
          hero_subtitle?: string
          hero_image?: string | null
          cover_opacity?: number
          about_title?: string
          about_text?: string | null
          about_image?: string | null
          section_order?: string[]
          gallery?: Json
          meta_title?: string | null
          meta_description?: string | null
          google_analytics_id?: string | null
          facebook_pixel_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id?: string
          theme_template?: WebsiteThemeTemplate
          premium_background?: WebsitePremiumBackground
          custom_colors?: Json
          hero_title?: string
          hero_subtitle?: string
          hero_image?: string | null
          cover_opacity?: number
          about_title?: string
          about_text?: string | null
          about_image?: string | null
          section_order?: string[]
          gallery?: Json
          meta_title?: string | null
          meta_description?: string | null
          google_analytics_id?: string | null
          facebook_pixel_id?: string | null
        }
        Relationships: []
      }

      website_reviews: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          client_id: string | null
          sale_id: string | null
          rating: number
          comment: string | null
          is_published: boolean
          is_featured: boolean
          owner_reply: string | null
          replied_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          client_id?: string | null
          sale_id?: string | null
          rating: number
          comment?: string | null
          is_published?: boolean
          is_featured?: boolean
          owner_reply?: string | null
          replied_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          client_id?: string | null
          sale_id?: string | null
          rating?: number
          comment?: string | null
          is_published?: boolean
          is_featured?: boolean
          owner_reply?: string | null
          replied_at?: string | null
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 8: FIDELIDADE (Loyalty / Barber Club)
      // =============================================
      loyalty_config: {
        Row: {
          id: string
          tenant_id: string
          is_enabled: boolean
          points_per_currency: number
          points_currency_value: number
          tier_multipliers: Json
          tier_thresholds: Json
          points_expiration_days: number
        }
        Insert: {
          id?: string
          tenant_id: string
          is_enabled?: boolean
          points_per_currency?: number
          points_currency_value?: number
          tier_multipliers?: Json
          tier_thresholds?: Json
          points_expiration_days?: number
        }
        Update: {
          id?: string
          tenant_id?: string
          is_enabled?: boolean
          points_per_currency?: number
          points_currency_value?: number
          tier_multipliers?: Json
          tier_thresholds?: Json
          points_expiration_days?: number
        }
        Relationships: []
      }

      loyalty_transactions: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          client_id: string
          type: LoyaltyTransactionType
          points: number
          balance_after: number
          sale_id: string | null
          description: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          client_id: string
          type: LoyaltyTransactionType
          points: number
          balance_after: number
          sale_id?: string | null
          description?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          client_id?: string
          type?: LoyaltyTransactionType
          points?: number
          balance_after?: number
          sale_id?: string | null
          description?: string | null
          expires_at?: string | null
        }
        Relationships: []
      }

      loyalty_rewards: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          name: string
          description: string | null
          points_cost: number
          reward_type: LoyaltyRewardType
          reward_value: number | null
          reward_item_id: string | null
          min_tier: LoyaltyTier
          max_redemptions_per_client: number | null
          total_available: number | null
          valid_from: string | null
          valid_until: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          name: string
          description?: string | null
          points_cost: number
          reward_type: LoyaltyRewardType
          reward_value?: number | null
          reward_item_id?: string | null
          min_tier?: LoyaltyTier
          max_redemptions_per_client?: number | null
          total_available?: number | null
          valid_from?: string | null
          valid_until?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          name?: string
          description?: string | null
          points_cost?: number
          reward_type?: LoyaltyRewardType
          reward_value?: number | null
          reward_item_id?: string | null
          min_tier?: LoyaltyTier
          max_redemptions_per_client?: number | null
          total_available?: number | null
          valid_from?: string | null
          valid_until?: string | null
          is_active?: boolean
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 9: INDICAÇÕES (Referrals)
      // =============================================
      referral_config: {
        Row: {
          id: string
          tenant_id: string
          is_enabled: boolean
          referrer_reward_type: ReferralRewardType
          referrer_reward_value: number
          referee_reward_type: ReferralRewardType
          referee_reward_value: number
          min_purchase_amount: number
          max_referrals_per_month: number | null
          owner_referral_code: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          is_enabled?: boolean
          referrer_reward_type?: ReferralRewardType
          referrer_reward_value?: number
          referee_reward_type?: ReferralRewardType
          referee_reward_value?: number
          min_purchase_amount?: number
          max_referrals_per_month?: number | null
          owner_referral_code?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string
          is_enabled?: boolean
          referrer_reward_type?: ReferralRewardType
          referrer_reward_value?: number
          referee_reward_type?: ReferralRewardType
          referee_reward_value?: number
          min_purchase_amount?: number
          max_referrals_per_month?: number | null
          owner_referral_code?: string | null
        }
        Relationships: []
      }

      referral_links: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          referrer_type: ReferralLinkType
          referrer_id: string
          code: string
          clicks: number
          conversions: number
          total_revenue: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          referrer_type: ReferralLinkType
          referrer_id: string
          code: string
          clicks?: number
          conversions?: number
          total_revenue?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          referrer_type?: ReferralLinkType
          referrer_id?: string
          code?: string
          clicks?: number
          conversions?: number
          total_revenue?: number
          is_active?: boolean
        }
        Relationships: []
      }

      referral_conversions: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          referral_link_id: string
          new_client_id: string
          sale_id: string | null
          sale_amount: number | null
          referrer_reward: number | null
          referee_reward: number | null
          status: ReferralConversionStatus
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          referral_link_id: string
          new_client_id: string
          sale_id?: string | null
          sale_amount?: number | null
          referrer_reward?: number | null
          referee_reward?: number | null
          status?: ReferralConversionStatus
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          referral_link_id?: string
          new_client_id?: string
          sale_id?: string | null
          sale_amount?: number | null
          referrer_reward?: number | null
          referee_reward?: number | null
          status?: ReferralConversionStatus
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 10: GORJETAS (Tips)
      // =============================================
      tips: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          sale_id: string | null
          staff_id: string
          client_id: string | null
          amount: number
          payment_method: string
          rating: number | null
          comment: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          sale_id?: string | null
          staff_id: string
          client_id?: string | null
          amount: number
          payment_method: string
          rating?: number | null
          comment?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          sale_id?: string | null
          staff_id?: string
          client_id?: string | null
          amount?: number
          payment_method?: string
          rating?: number | null
          comment?: string | null
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 11: NOTIFICAÇÕES
      // =============================================
      notifications: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          recipient_type: NotificationRecipientType
          recipient_id: string
          title: string
          body: string
          type: NotificationType
          metadata: Json
          is_read: boolean
          read_at: string | null
          sent_via: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          recipient_type: NotificationRecipientType
          recipient_id: string
          title: string
          body: string
          type: NotificationType
          metadata?: Json
          is_read?: boolean
          read_at?: string | null
          sent_via?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          recipient_type?: NotificationRecipientType
          recipient_id?: string
          title?: string
          body?: string
          type?: NotificationType
          metadata?: Json
          is_read?: boolean
          read_at?: string | null
          sent_via?: string[]
        }
        Relationships: []
      }

      // =============================================
      // MÓDULO 12: SUPER ADMIN (SaaS Management)
      // =============================================
      saas_plans: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          monthly_price_brl: number
          yearly_price_brl: number | null
          max_staff: number
          max_locations: number
          features: Json
          is_active: boolean
          sort_order: number
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          description?: string | null
          monthly_price_brl: number
          yearly_price_brl?: number | null
          max_staff?: number
          max_locations?: number
          features?: Json
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          monthly_price_brl?: number
          yearly_price_brl?: number | null
          max_staff?: number
          max_locations?: number
          features?: Json
          is_active?: boolean
          sort_order?: number
        }
        Relationships: []
      }

      saas_invoices: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          period_start: string
          period_end: string
          amount: number
          discount: number
          total: number
          status: SaasInvoiceStatus
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          due_date: string
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          period_start: string
          period_end: string
          amount: number
          discount?: number
          total: number
          status?: SaasInvoiceStatus
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          due_date: string
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          period_start?: string
          period_end?: string
          amount?: number
          discount?: number
          total?: number
          status?: SaasInvoiceStatus
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          due_date?: string
        }
        Relationships: []
      }

      support_tickets: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tenant_id: string
          subject: string
          description: string
          priority: SupportTicketPriority
          status: SupportTicketStatus
          assigned_to: string | null
          resolved_at: string | null
          resolution_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id: string
          subject: string
          description: string
          priority?: SupportTicketPriority
          status?: SupportTicketStatus
          assigned_to?: string | null
          resolved_at?: string | null
          resolution_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tenant_id?: string
          subject?: string
          description?: string
          priority?: SupportTicketPriority
          status?: SupportTicketStatus
          assigned_to?: string | null
          resolved_at?: string | null
          resolution_notes?: string | null
        }
        Relationships: []
      }

      support_messages: {
        Row: {
          id: string
          created_at: string
          ticket_id: string
          sender_type: SupportMessageSenderType
          sender_id: string
          message: string
          attachments: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          ticket_id: string
          sender_type: SupportMessageSenderType
          sender_id: string
          message: string
          attachments?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          ticket_id?: string
          sender_type?: SupportMessageSenderType
          sender_id?: string
          message?: string
          attachments?: string[]
        }
        Relationships: []
      }
    }

    Views: {
      [_ in never]: never
    }

    Functions: {
      get_user_tenant_id: {
        Args: Record<string, never>
        Returns: string
      }
      is_tenant_owner: {
        Args: { tenant_uuid: string }
        Returns: boolean
      }
    }

    Enums: {
      tenant_status: TenantStatus
      tenant_plan_id: TenantPlanId
      profile_role: ProfileRole
      commission_model: CommissionModel
      category_type: CategoryType
      loyalty_tier: LoyaltyTier
      loyalty_transaction_type: LoyaltyTransactionType
      loyalty_reward_type: LoyaltyRewardType
      appointment_status: AppointmentStatus
      appointment_source: AppointmentSource
      payment_method: PaymentMethod
      sale_status: SaleStatus
      sale_item_type: SaleItemType
      cash_closure_status: CashClosureStatus
      expense_category: ExpenseCategory
      commission_status: CommissionStatus
      website_theme_template: WebsiteThemeTemplate
      website_premium_background: WebsitePremiumBackground
      referral_reward_type: ReferralRewardType
      referral_link_type: ReferralLinkType
      referral_conversion_status: ReferralConversionStatus
      notification_type: NotificationType
      notification_recipient_type: NotificationRecipientType
      saas_invoice_status: SaasInvoiceStatus
      support_ticket_priority: SupportTicketPriority
      support_ticket_status: SupportTicketStatus
      support_message_sender_type: SupportMessageSenderType
    }
  }
}

// =============================================
// HELPER TYPES (para uso nos módulos)
// =============================================

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Aliases comuns para facilitar importação
export type TenantRow = Tables<'tenants'>
export type ProfileRow = Tables<'profiles'>
export type ClientRow = Tables<'clients'>
export type ServiceRow = Tables<'services'>
export type ProductRow = Tables<'products'>
export type CategoryRow = Tables<'categories'>
export type AppointmentRow = Tables<'appointments'>
export type SaleRow = Tables<'sales'>
export type SaleItemRow = Tables<'sale_items'>
export type ExpenseRow = Tables<'expenses'>
export type CommissionRow = Tables<'commissions'>
export type CashClosureRow = Tables<'cash_closures'>
export type WebsiteConfigRow = Tables<'website_config'>
export type WebsiteReviewRow = Tables<'website_reviews'>
export type LoyaltyConfigRow = Tables<'loyalty_config'>
export type LoyaltyTransactionRow = Tables<'loyalty_transactions'>
export type LoyaltyRewardRow = Tables<'loyalty_rewards'>
export type ReferralConfigRow = Tables<'referral_config'>
export type ReferralLinkRow = Tables<'referral_links'>
export type ReferralConversionRow = Tables<'referral_conversions'>
export type TipRow = Tables<'tips'>
export type NotificationRow = Tables<'notifications'>
export type SaasPlanRow = Tables<'saas_plans'>
export type SaasInvoiceRow = Tables<'saas_invoices'>
export type SupportTicketRow = Tables<'support_tickets'>
export type SupportMessageRow = Tables<'support_messages'>
