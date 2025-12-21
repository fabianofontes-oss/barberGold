'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthContext } from '@/lib/auth/getTenantId';
import { createProductsRepository } from './repository';
import { createProductInputSchema, updateProductInputSchema, listProductsInputSchema } from './types';

export async function listProductsAction(input: unknown) {
  const parsed = listProductsInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createProductsRepository(supabase);

  return await repo.listProducts({
    tenantId: auth.tenantId,
    isActive: parsed.isActive,
    categoryId: parsed.categoryId,
  });
}

export async function createProductAction(input: unknown) {
  const parsed = createProductInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createProductsRepository(supabase);

  return await repo.createProduct({
    input: {
      tenant_id: auth.tenantId,
      name: parsed.name,
      description: parsed.description || null,
      sku: parsed.sku || null,
      price: parsed.price,
      cost_price: parsed.costPrice || null,
      stock: parsed.stock,
      min_stock: parsed.minStock,
      category_id: parsed.categoryId || null,
      image_url: parsed.imageUrl || null,
      is_active: parsed.isActive,
    },
  });
}

export async function updateProductAction(input: unknown) {
  const parsed = updateProductInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createProductsRepository(supabase);

  const updateData: any = {};
  if (parsed.name) updateData.name = parsed.name;
  if (parsed.description !== undefined) updateData.description = parsed.description;
  if (parsed.price) updateData.price = parsed.price;
  if (parsed.costPrice !== undefined) updateData.cost_price = parsed.costPrice;
  if (parsed.stock !== undefined) updateData.stock = parsed.stock;
  if (parsed.minStock !== undefined) updateData.min_stock = parsed.minStock;
  if (parsed.categoryId !== undefined) updateData.category_id = parsed.categoryId;
  if (parsed.imageUrl !== undefined) updateData.image_url = parsed.imageUrl;
  if (parsed.isActive !== undefined) updateData.is_active = parsed.isActive;

  await repo.updateProduct({ productId: parsed.productId, input: updateData });
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createProductsRepository(supabase);

  await repo.deleteProduct({ productId });
  return { success: true };
}
