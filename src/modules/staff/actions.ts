'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthContext } from '@/lib/auth/getTenantId';
import { createStaffRepository } from './repository';
import {
  listStaffInputSchema,
  updateStaffInputSchema,
} from './types';

export async function listStaffAction(input: unknown) {
  const parsed = listStaffInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createStaffRepository(supabase);

  const staff = await repo.listStaff({
    tenantId: auth.tenantId,
    isActive: parsed.isActive,
  });

  return staff;
}

export async function updateStaffAction(input: unknown) {
  const parsed = updateStaffInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createStaffRepository(supabase);

  const updateData: any = {};
  if (parsed.name) updateData.name = parsed.name;
  if (parsed.phone !== undefined) updateData.phone = parsed.phone;
  if (parsed.avatarUrl !== undefined) updateData.avatar_url = parsed.avatarUrl;
  if (parsed.bio !== undefined) updateData.bio = parsed.bio;
  if (parsed.commissionRate !== undefined) updateData.commission_rate = parsed.commissionRate;
  if (parsed.workSchedule !== undefined) updateData.work_schedule = parsed.workSchedule;
  if (parsed.isActive !== undefined) updateData.is_active = parsed.isActive;

  await repo.updateStaff({
    staffId: parsed.staffId,
    input: updateData,
  });

  return { success: true };
}
