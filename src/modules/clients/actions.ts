'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthContext } from '@/lib/auth/getTenantId';
import { createClientsRepository } from './repository';
import {
  createClientInputSchema,
  updateClientInputSchema,
  listClientsInputSchema,
  type CreateClientInput,
  type UpdateClientInput,
} from './types';

export async function listClientsAction(input: unknown) {
  const parsed = listClientsInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createClientsRepository(supabase);

  const clients = await repo.listClients({
    tenantId: auth.tenantId,
    search: parsed.search,
    isActive: parsed.isActive ?? true,
  });

  return clients;
}

export async function createClientAction(input: unknown) {
  const parsed = createClientInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createClientsRepository(supabase);

  const result = await repo.createClient({
    input: {
      tenant_id: auth.tenantId,
      name: parsed.name,
      phone: parsed.phone,
      email: parsed.email || null,
      birth_date: parsed.birthDate || null,
      tags: parsed.tags || [],
      notes: parsed.notes || null,
      is_active: true,
    },
  });

  return result;
}

export async function updateClientAction(input: unknown) {
  const parsed = updateClientInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createClientsRepository(supabase);

  const updateData: any = {};
  if (parsed.name) updateData.name = parsed.name;
  if (parsed.phone) updateData.phone = parsed.phone;
  if (parsed.email !== undefined) updateData.email = parsed.email || null;
  if (parsed.birthDate !== undefined) updateData.birth_date = parsed.birthDate || null;
  if (parsed.tags) updateData.tags = parsed.tags;
  if (parsed.notes !== undefined) updateData.notes = parsed.notes;
  if (parsed.preferredStaffId !== undefined) updateData.preferred_staff_id = parsed.preferredStaffId;

  await repo.updateClient({
    clientId: parsed.clientId,
    input: updateData,
  });

  return { success: true };
}

export async function deleteClientAction(clientId: string) {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createClientsRepository(supabase);

  await repo.deleteClient({ clientId });

  return { success: true };
}

export async function listClientDependentsAction(clientId: string) {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createClientsRepository(supabase);

  return await repo.listDependents({ clientId });
}

export async function createClientDependentAction(clientId: string, data: { name: string; relationship?: string; preferredStaffId?: string }) {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createClientsRepository(supabase);

  return await repo.createDependent({
    input: {
      client_id: clientId,
      name: data.name,
      relationship: data.relationship || null,
      preferred_staff_id: data.preferredStaffId || null,
    },
  });
}

export async function deleteClientDependentAction(dependentId: string) {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createClientsRepository(supabase);

  await repo.deleteDependent({ dependentId });
  return { success: true };
}
