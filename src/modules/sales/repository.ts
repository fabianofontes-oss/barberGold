import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

type AppSupabaseClient = SupabaseClient<Database>;
type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

export type MappedSale = {
  id: string;
  clientId: string | null;
  staffId: string;
  appointmentId: string | null;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  tip: number;
  total: number;
  notes: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    type: 'SERVICE' | 'PRODUCT';
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
};

export type PromoCode = {
  id: string;
  code: string;
  description: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  validFrom: string | null;
  validUntil: string | null;
  maxUses: number | null;
  currentUses: number;
  minPurchaseAmount: number | null;
  appliesTo: 'ALL' | 'SERVICES' | 'PRODUCTS' | null;
  isActive: boolean;
};

export type SalePayment = {
  id: string;
  saleId: string;
  paymentMethod: string;
  amount: number;
  cardLastDigits: string | null;
  transactionId: string | null;
  status: string;
};

export function createSalesRepository(supabase: AppSupabaseClient) {
  return {
    async listSales({ tenantId, startDate, endDate, staffId, paymentMethod }: { 
      tenantId: string; 
      startDate?: string;
      endDate?: string;
      staffId?: string;
      paymentMethod?: string;
    }): Promise<MappedSale[]> {
      let query = supabase
        .from('sales')
        .select(`
          id,
          client_id,
          staff_id,
          appointment_id,
          payment_method,
          subtotal,
          discount,
          tip,
          total,
          notes,
          created_at,
          sale_items (
            id,
            item_type,
            item_id,
            name,
            price,
            quantity
          )
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      if (staffId) {
        query = query.eq('staff_id', staffId);
      }

      if (paymentMethod) {
        query = query.eq('payment_method', paymentMethod as any);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        clientId: row.client_id,
        staffId: row.staff_id,
        appointmentId: row.appointment_id,
        paymentMethod: row.payment_method,
        subtotal: Number(row.subtotal ?? 0),
        discount: Number(row.discount ?? 0),
        tip: Number(row.tip ?? 0),
        total: Number(row.total ?? 0),
        notes: row.notes,
        createdAt: row.created_at,
        items: (row.sale_items ?? []).map((item: any) => ({
          id: item.id,
          type: item.item_type,
          itemId: item.item_id,
          name: item.item_name,
          price: Number(item.price),
          quantity: Number(item.quantity ?? 1),
        })),
      }));
    },

    async createSale({ input, items }: { 
      input: TablesInsert<'sales'>; 
      items: Array<{
        type: 'SERVICE' | 'PRODUCT';
        itemId: string;
        name: string;
        price: number;
        quantity: number;
      }>;
    }) {
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert(input)
        .select('id')
        .single();

      if (saleError) throw saleError;

      const saleItems = items.map(item => ({
        sale_id: sale.id,
        item_type: item.type,
        item_id: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      return { id: sale.id };
    },

    async validatePromoCode({ tenantId, code }: { tenantId: string; code: string }): Promise<PromoCode | null> {
      const { data, error } = await (supabase as any)
        .from('promo_codes')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const now = new Date();
      if (data.valid_from && new Date(data.valid_from) > now) return null;
      if (data.valid_until && new Date(data.valid_until) < now) return null;
      if (data.max_uses && data.current_uses >= data.max_uses) return null;

      return {
        id: data.id,
        code: data.code,
        description: data.description,
        discountType: data.discount_type as 'PERCENTAGE' | 'FIXED',
        discountValue: Number(data.discount_value),
        validFrom: data.valid_from,
        validUntil: data.valid_until,
        maxUses: data.max_uses,
        currentUses: data.current_uses,
        minPurchaseAmount: data.min_purchase_amount ? Number(data.min_purchase_amount) : null,
        appliesTo: data.applies_to as any,
        isActive: data.is_active,
      };
    },

    async incrementPromoCodeUsage({ promoCodeId }: { promoCodeId: string }) {
      const { error } = await (supabase as any)
        .from('promo_codes')
        .update({ current_uses: (supabase as any).raw('current_uses + 1') })
        .eq('id', promoCodeId);

      if (error) throw error;
    },

    async createSalePayments({ saleId, payments }: { saleId: string; payments: Array<{ method: string; amount: number }> }) {
      const paymentRecords = payments.map(p => ({
        sale_id: saleId,
        payment_method: p.method,
        amount: p.amount,
        status: 'COMPLETED',
      }));

      const { error } = await (supabase as any)
        .from('sale_payments')
        .insert(paymentRecords);

      if (error) throw error;
    },
  };
}
