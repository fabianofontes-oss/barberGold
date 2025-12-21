import { z } from 'zod';

export const createCategoryInputSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['SERVICE', 'PRODUCT']),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const listCategoriesInputSchema = z.object({
  type: z.enum(['SERVICE', 'PRODUCT']).optional(),
  isActive: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;
export type ListCategoriesInput = z.infer<typeof listCategoriesInputSchema>;
