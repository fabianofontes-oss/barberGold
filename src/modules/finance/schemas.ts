import { z } from 'zod';

// ===================================
// FINANCE SCHEMAS
// ===================================

export const createExpenseSchema = z.object({
    category: z.string().min(1, 'Categoria Ã© obrigatÃ³ria'),
    amount: z.number().positive('Valor deve ser positivo'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
    description: z.string().optional(),
    supplierId: z.string().uuid('ID do fornecedor invÃ¡lido').optional(),
    paymentMethod: z.string().optional()
});

export const createRegisterClosureSchema = z.object({
    staffId: z.string().uuid('ID do staff invÃ¡lido'),
    openedAt: z.string().datetime('Data/hora de abertura invÃ¡lida'),
    closedAt: z.string().datetime('Data/hora de fechamento invÃ¡lida'),
    openingBalance: z.number().nonnegative('Saldo inicial nÃ£o pode ser negativo'),
    closingBalance: z.number().nonnegative('Saldo final nÃ£o pode ser negativo'),
    totalSales: z.number().nonnegative('Total de vendas nÃ£o pode ser negativo'),
    totalCash: z.number().nonnegative('Total em dinheiro nÃ£o pode ser negativo').optional(),
    totalCard: z.number().nonnegative('Total em cartÃ£o nÃ£o pode ser negativo').optional(),
    totalPix: z.number().nonnegative('Total em PIX nÃ£o pode ser negativo').optional(),
    notes: z.string().optional()
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type CreateRegisterClosureInput = z.infer<typeof createRegisterClosureSchema>;
