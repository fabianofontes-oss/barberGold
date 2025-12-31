export type Database = {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          plan_id: string;
          status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CANCELLED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          plan_id: string;
          status?: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CANCELLED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          plan_id?: string;
          status?: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CANCELLED';
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          phone: string;
          email: string | null;
          birth_date: string | null;
          document: string | null;
          tags: string[] | null;
          notes: string | null;
          preferred_staff_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name: string;
          phone: string;
          email?: string | null;
          birth_date?: string | null;
          document?: string | null;
          tags?: string[] | null;
          notes?: string | null;
          preferred_staff_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          birth_date?: string | null;
          document?: string | null;
          tags?: string[] | null;
          notes?: string | null;
          preferred_staff_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          store_id: string;
          user_id: string | null;
          name: string;
          role: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF';
          email: string | null;
          phone: string | null;
          commission_model: 'PERCENTAGE' | 'CHAIR_RENTAL' | 'OWNER';
          service_commission_rate: number;
          product_commission_rate: number;
          chair_rental_amount: number | null;
          work_schedule: any;
          smart_break: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          user_id?: string | null;
          name: string;
          role: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF';
          email?: string | null;
          phone?: string | null;
          commission_model?: 'PERCENTAGE' | 'CHAIR_RENTAL' | 'OWNER';
          service_commission_rate?: number;
          product_commission_rate?: number;
          chair_rental_amount?: number | null;
          work_schedule?: any;
          smart_break?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          user_id?: string | null;
          name?: string;
          role?: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF';
          email?: string | null;
          phone?: string | null;
          commission_model?: 'PERCENTAGE' | 'CHAIR_RENTAL' | 'OWNER';
          service_commission_rate?: number;
          product_commission_rate?: number;
          chair_rental_amount?: number | null;
          work_schedule?: any;
          smart_break?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          description: string | null;
          price: number;
          duration_minutes: number;
          category: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name: string;
          description?: string | null;
          price: number;
          duration_minutes: number;
          category?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          duration_minutes?: number;
          category?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          store_id: string;
          client_id: string;
          staff_id: string;
          service_id: string;
          date: string;
          start_time: string;
          end_time: string;
          status: 'SCHEDULED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
          total_amount: number;
          discount_amount: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          client_id: string;
          staff_id: string;
          service_id: string;
          date: string;
          start_time: string;
          end_time: string;
          status?: 'SCHEDULED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
          total_amount: number;
          discount_amount?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          client_id?: string;
          staff_id?: string;
          service_id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          status?: 'SCHEDULED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
          total_amount?: number;
          discount_amount?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          store_id: string;
          client_id: string | null;
          staff_id: string;
          appointment_id: string | null;
          total_amount: number;
          discount_amount: number | null;
          tip_amount: number | null;
          payment_method: string;
          payment_status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          client_id?: string | null;
          staff_id: string;
          appointment_id?: string | null;
          total_amount: number;
          discount_amount?: number | null;
          tip_amount?: number | null;
          payment_method: string;
          payment_status?: 'PENDING' | 'COMPLETED' | 'REFUNDED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          client_id?: string | null;
          staff_id?: string;
          appointment_id?: string | null;
          total_amount?: number;
          discount_amount?: number | null;
          tip_amount?: number | null;
          payment_method?: string;
          payment_status?: 'PENDING' | 'COMPLETED' | 'REFUNDED';
          created_at?: string;
          updated_at?: string;
        };
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          item_type: 'SERVICE' | 'PRODUCT';
          item_id: string;
          item_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sale_id: string;
          item_type: 'SERVICE' | 'PRODUCT';
          item_id: string;
          item_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sale_id?: string;
          item_type?: 'SERVICE' | 'PRODUCT';
          item_id?: string;
          item_name?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
    };
  };
};
