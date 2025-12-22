/**
 * Types & Zod Schemas para Módulo de Vendas (PDV)
 * 
 * Conecta com tabela `sales` e `sale_items` no Supabase
 */

import { z } from 'zod';

/**
 * ============================================
 * ENUMS
 * ============================================
 */

/**
 * Métodos de Pagamento
 */
export const PaymentMethod = z.enum([
  'CASH',         // Dinheiro
  'CREDIT_CARD',  // Cartão de Crédito
  'DEBIT_CARD',   // Cartão de Débito
  'PIX',          // PIX
  'OTHER',        // Outro
]);
export type PaymentMethod = z.infer<typeof PaymentMethod>;

/**
 * Tipo de Item
 */
export const ItemType = z.enum(['SERVICE', 'PRODUCT']);
export type ItemType = z.infer<typeof ItemType>;

/**
 * ============================================
 * SCHEMAS ZOD
 * ============================================
 */

/**
 * Schema de Item da Venda
 */
export const SaleItemSchema = z.object({
  id: z.string().uuid(),
  sale_id: z.string().uuid(),
  item_type: ItemType,
  item_id: z.string().uuid(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive().default(1),
});

/**
 * Schema de Snapshot de Comissão
 * 
 * Salva TODOS os detalhes da comissão no momento da venda
 * para preservar histórico exato (mesmo se regras mudarem depois)
 */
export const CommissionSnapshotSchema = z.object({
  // Modelo de comissão usado
  commission_type: z.enum(['PERCENTAGE', 'CHAIR_RENTAL', 'OWNER']),
  
  // Valores base
  commission_rate: z.number().optional(), // % (para PERCENTAGE)
  chair_rental: z.number().optional(),    // valor fixo (para CHAIR_RENTAL)
  
  // Regra de desconto
  discount_rule: z.enum(['SHARED', 'SHOP_ABSORBS']).optional(),
  
  // Valores calculados
  gross_commission: z.number(), // Comissão bruta (antes de descontos)
  net_commission: z.number(),   // Comissão líquida (após descontos)
  discount_impact: z.number(),  // Quanto o desconto afetou a comissão
  
  // Breakdown detalhado
  services_commission: z.number().default(0),
  products_commission: z.number().default(0),
  tip_commission: z.number().default(0),
});

/**
 * Schema Base da Sale (do banco)
 */
export const SaleSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  tenant_id: z.string().uuid(),
  client_id: z.string().uuid().nullable().optional(),
  staff_id: z.string().uuid(),
  total: z.number().nonnegative(),
  payment_method: PaymentMethod,
  tip: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  notes: z.string().nullable().optional(),
  // Snapshot de comissão (JSON no banco)
  commission_snapshot: CommissionSnapshotSchema.nullable().optional(),
});

/**
 * Schema para CRIAR sale (sem campos auto-gerados)
 */
export const CreateSaleSchema = z.object({
  client_id: z.string().uuid().nullable().optional(),
  staff_id: z.string().uuid(),
  items: z.array(z.object({
    item_type: ItemType,
    item_id: z.string().uuid(),
    name: z.string(),
    price: z.number().nonnegative(),
    quantity: z.number().int().positive().default(1),
  })).min(1, 'Adicione pelo menos 1 item'),
  payment_method: PaymentMethod,
  tip: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  notes: z.string().nullable().optional(),
});

/**
 * Schema para ATUALIZAR sale (não usado normalmente)
 */
export const UpdateSaleSchema = z.object({
  payment_method: PaymentMethod.optional(),
  notes: z.string().nullable().optional(),
});

/**
 * Schema para FILTROS de busca
 */
export const SaleFiltersSchema = z.object({
  client_id: z.string().uuid().optional(),
  staff_id: z.string().uuid().optional(),
  payment_method: PaymentMethod.optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  sort_by: z.enum(['created_at', 'total']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().int().positive().max(200).default(100),
  offset: z.number().int().nonnegative().default(0),
});

/**
 * ============================================
 * TYPES
 * ============================================
 */

/**
 * Sale completa (do banco)
 */
export type Sale = z.infer<typeof SaleSchema>;

/**
 * Item da venda
 */
export type SaleItem = z.infer<typeof SaleItemSchema>;

/**
 * Snapshot de comissão
 */
export type CommissionSnapshot = z.infer<typeof CommissionSnapshotSchema>;

/**
 * Dados para criar sale
 */
export type CreateSaleInput = z.infer<typeof CreateSaleSchema>;

/**
 * Dados para atualizar sale
 */
export type UpdateSaleInput = z.infer<typeof UpdateSaleSchema>;

/**
 * Filtros para listar sales
 */
export type SaleFilters = z.infer<typeof SaleFiltersSchema>;

/**
 * Sale com items (frontend)
 */
export interface SaleWithItems extends Sale {
  items: SaleItem[];
}

/**
 * Resultado paginado
 */
export interface PaginatedSales {
  data: Sale[];
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
}

/**
 * Stats de vendas
 */
export interface SalesStats {
  total_sales: number;
  total_revenue: number;
  avg_ticket: number;
  total_tips: number;
  total_discounts: number;
  total_commission: number;
}

/**
 * ============================================
 * HELPER FUNCTIONS (Type Guards)
 * ============================================
 */

/**
 * Valida se é uma sale válida
 */
export function isValidSale(data: unknown): data is Sale {
  return SaleSchema.safeParse(data).success;
}

/**
 * Valida input de criação
 */
export function isValidCreateInput(data: unknown): data is CreateSaleInput {
  return CreateSaleSchema.safeParse(data).success;
}







