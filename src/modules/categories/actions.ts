'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthContext } from '@/lib/auth/getTenantId';
import { createCategoriesRepository } from './repository';
import { createCategoryInputSchema, listCategoriesInputSchema } from './types';

export async function listCategoriesAction(input: unknown) {
  const parsed = listCategoriesInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createCategoriesRepository(supabase);

  return await repo.listCategories({
    tenantId: auth.tenantId,
    type: parsed.type,
    isActive: parsed.isActive,
  });
}

export async function createCategoryAction(input: unknown) {
  const parsed = createCategoryInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createCategoriesRepository(supabase);

  return await repo.createCategory({
    input: {
      tenant_id: auth.tenantId,
      name: parsed.name,
      type: parsed.type,
      color: parsed.color || null,
      icon: parsed.icon || null,
      is_active: true,
    },
  });
}

export async function deleteCategoryAction(categoryId: string) {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createCategoriesRepository(supabase);

  await repo.deleteCategory({ categoryId });
  return { success: true };
}
