import { z } from 'zod';

export const createSaleInputSchema = z.object({
  clientId: z.string().uuid().optional().nullable(),
  staffId: z.string().uuid(),
  items: z.array(z.object({
    type: z.enum(['SERVICE', 'PRODUCT']),
    itemId: z.string().uuid(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().positive().default(1),
  })),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'OTHER']),
  subtotal: z.number(),
  discount: z.number().default(0),
  tip: z.number().default(0),
  total: z.number(),
  notes: z.string().optional(),
});

export const listSalesInputSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  staffId: z.string().uuid().optional(),
  paymentMethod: z.string().optional(),
});

export type CreateSaleInput = z.infer<typeof createSaleInputSchema>;
export type ListSalesInput = z.infer<typeof listSalesInputSchema>;
