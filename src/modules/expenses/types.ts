import { z } from 'zod';

export const createExpenseInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  amount: z.number().positive(),
  category: z.enum(['RENT', 'UTILITIES', 'SUPPLIES', 'EQUIPMENT', 'MARKETING', 'SALARIES', 'TAXES', 'MAINTENANCE', 'OTHER']),
  expenseDate: z.string(),
  paymentMethod: z.string().optional(),
  receiptUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const listExpensesInputSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseInputSchema>;
export type ListExpensesInput = z.infer<typeof listExpensesInputSchema>;
