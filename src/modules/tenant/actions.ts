'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthContext } from '@/lib/auth/getTenantId';
import { createTenantRepository } from './repository';
import { updateTenantInputSchema } from './types';

export async function getTenantAction() {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createTenantRepository(supabase);

  return await repo.getTenant({ tenantId: auth.tenantId });
}

export async function updateTenantAction(input: unknown) {
  const parsed = updateTenantInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createTenantRepository(supabase);

  const updateData: any = {};
  if (parsed.name) updateData.name = parsed.name;
  if (parsed.phone !== undefined) updateData.phone = parsed.phone;
  if (parsed.address !== undefined) updateData.address = parsed.address;
  if (parsed.city !== undefined) updateData.city = parsed.city;
  if (parsed.state !== undefined) updateData.state = parsed.state;
  if (parsed.zipCode !== undefined) updateData.zip_code = parsed.zipCode;
  if (parsed.logoUrl !== undefined) updateData.logo_url = parsed.logoUrl;
  if (parsed.settings !== undefined) updateData.settings = parsed.settings;

  await repo.updateTenant({ tenantId: auth.tenantId, input: updateData });
  return { success: true };
}
