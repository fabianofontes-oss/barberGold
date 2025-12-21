'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthContext } from '@/lib/auth/getTenantId';
import { createServicesRepository } from './repository';
import {
  createServiceInputSchema,
  updateServiceInputSchema,
  listServicesInputSchema,
} from './types';

export async function listServicesAction(input: unknown) {
  const parsed = listServicesInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createServicesRepository(supabase);

  const services = await repo.listServices({
    tenantId: auth.tenantId,
    isActive: parsed.isActive,
    categoryId: parsed.categoryId,
  });

  return services;
}

export async function createServiceAction(input: unknown) {
  const parsed = createServiceInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createServicesRepository(supabase);

  const result = await repo.createService({
    input: {
      tenant_id: auth.tenantId,
      name: parsed.name,
      description: parsed.description || null,
      price: parsed.price,
      duration_minutes: parsed.durationMinutes,
      category_id: parsed.categoryId || null,
      image_url: parsed.imageUrl || null,
      is_active: parsed.isActive ?? true,
      allow_online_booking: parsed.allowOnlineBooking ?? true,
    },
  });

  return result;
}

export async function updateServiceAction(input: unknown) {
  const parsed = updateServiceInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createServicesRepository(supabase);

  const updateData: any = {};
  if (parsed.name) updateData.name = parsed.name;
  if (parsed.description !== undefined) updateData.description = parsed.description;
  if (parsed.price) updateData.price = parsed.price;
  if (parsed.durationMinutes) updateData.duration_minutes = parsed.durationMinutes;
  if (parsed.categoryId !== undefined) updateData.category_id = parsed.categoryId;
  if (parsed.imageUrl !== undefined) updateData.image_url = parsed.imageUrl;
  if (parsed.allowOnlineBooking !== undefined) updateData.allow_online_booking = parsed.allowOnlineBooking;
  if (parsed.isActive !== undefined) updateData.is_active = parsed.isActive;
  if (parsed.sortOrder !== undefined) updateData.sort_order = parsed.sortOrder;

  await repo.updateService({
    serviceId: parsed.serviceId,
    input: updateData,
  });

  return { success: true };
}

export async function deleteServiceAction(serviceId: string) {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createServicesRepository(supabase);

  await repo.deleteService({ serviceId });

  return { success: true };
}
