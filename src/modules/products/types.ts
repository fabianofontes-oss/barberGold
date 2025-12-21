import { z } from 'zod';

export const createProductInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().positive(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().min(0).default(0),
  minStock: z.number().int().min(0).default(0),
  categoryId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export const updateProductInputSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  minStock: z.number().int().min(0).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal('')).nullable(),
  isActive: z.boolean().optional(),
});

export const listProductsInputSchema = z.object({
  isActive: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;
export type ListProductsInput = z.infer<typeof listProductsInputSchema>;
