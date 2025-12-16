export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          owner_id: string
          plan_id: string
          status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED'
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
          owner_id: string
          plan_id?: string
          status?: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED'
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
          owner_id?: string
          plan_id?: string
          status?: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED'
          settings?: Json
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          user_id: string
          role: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF'
          name: string
          email: string
          phone: string | null
          avatar_url: string | null
          commission_rate: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          user_id: string
          role?: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF'
          name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          commission_rate?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          user_id?: string
          role?: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF'
          name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          commission_rate?: number
          is_active?: boolean
        }
      }
      clients: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          name: string
          phone: string
          email: string | null
          birth_date: string | null
          total_spent: number
          loyalty_points: number
          last_visit: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          name: string
          phone: string
          email?: string | null
          birth_date?: string | null
          total_spent?: number
          loyalty_points?: number
          last_visit?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          name?: string
          phone?: string
          email?: string | null
          birth_date?: string | null
          total_spent?: number
          loyalty_points?: number
          last_visit?: string | null
          notes?: string | null
        }
      }
      services: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          name: string
          price: number
          duration_minutes: number
          category: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          name: string
          price: number
          duration_minutes?: number
          category?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          name?: string
          price?: number
          duration_minutes?: number
          category?: string | null
          is_active?: boolean
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          name: string
          price: number
          cost_price: number
          stock: number
          category: string | null
          image_url: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          name: string
          price: number
          cost_price?: number
          stock?: number
          category?: string | null
          image_url?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          name?: string
          price?: number
          cost_price?: number
          stock?: number
          category?: string | null
          image_url?: string | null
          is_active?: boolean
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          client_id: string
          staff_id: string
          service_id: string
          scheduled_at: string
          price: number
          status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          client_id: string
          staff_id: string
          service_id: string
          scheduled_at: string
          price: number
          status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          client_id?: string
          staff_id?: string
          service_id?: string
          scheduled_at?: string
          price?: number
          status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
          notes?: string | null
        }
      }
      sales: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          client_id: string | null
          staff_id: string
          total: number
          payment_method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX'
          tip: number
          discount: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          client_id?: string | null
          staff_id: string
          total: number
          payment_method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX'
          tip?: number
          discount?: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          client_id?: string | null
          staff_id?: string
          total?: number
          payment_method?: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX'
          tip?: number
          discount?: number
          notes?: string | null
        }
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string
          item_type: 'SERVICE' | 'PRODUCT'
          item_id: string
          name: string
          price: number
          quantity: number
        }
        Insert: {
          id?: string
          sale_id: string
          item_type: 'SERVICE' | 'PRODUCT'
          item_id: string
          name: string
          price: number
          quantity?: number
        }
        Update: {
          id?: string
          sale_id?: string
          item_type?: 'SERVICE' | 'PRODUCT'
          item_id?: string
          name?: string
          price?: number
          quantity?: number
        }
      }
      expenses: {
        Row: {
          id: string
          created_at: string
          tenant_id: string
          title: string
          amount: number
          category: string
          date: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          tenant_id: string
          title: string
          amount: number
          category: string
          date: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          tenant_id?: string
          title?: string
          amount?: number
          category?: string
          date?: string
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
