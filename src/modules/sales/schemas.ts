import { z } from 'zod';

// ===================================
// SALES SCHEMAS
// ===================================

export const saleItemSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Nome do item é obrigatório'),
    type: z.enum(['SERVICE', 'PRODUCT'], {
        errorMap: () => ({ message: 'Tipo deve ser SERVICE ou PRODUCT' })
    }),
    price: z.number().positive('Preço deve ser positivo'),
    qty: z.number().int().positive('Quantidade deve ser positiva').default(1)
});

export const createSaleSchema = z.object({
    clientId: z.string().uuid().optional(),
    staffId: z.string().uuid('ID do staff inválido'),
    items: z.array(saleItemSchema).min(1, 'Venda deve ter pelo menos 1 item'),
    total: z.number().positive('Total deve ser positivo'),
    method: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'OTHER'], {
        errorMap: () => ({ message: 'Método de pagamento inválido' })
    }),
    tip: z.number().nonnegative('Gorjeta não pode ser negativa').optional(),
    discountApplied: z.string().optional()
});

export type SaleItem = z.infer<typeof saleItemSchema>;
export type CreateSaleInput = z.infer<typeof createSaleSchema>;
