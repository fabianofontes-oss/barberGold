'use server';

import { ClientsRepository } from './repository';
import { clientSchema, ClientFormData } from './types';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const repository = new ClientsRepository();

async function getStoreId() {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  // Por enquanto usando um store_id fixo para MVP
  // TODO: Buscar store_id do usuário logado
  return 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
}

export async function createClient(data: ClientFormData) {
  try {
    const storeId = await getStoreId();
    const validated = clientSchema.parse(data);
    
    // Verificar se telefone já existe
    const phoneExists = await repository.checkPhoneExists(validated.phone, storeId);
    if (phoneExists) {
      return { success: false, error: 'Telefone já cadastrado' };
    }
    
    const client = await repository.create(validated, storeId);
    revalidatePath('/clients');
    
    return { success: true, data: client };
  } catch (error) {
    console.error('Error creating client:', error);
    return { success: false, error: 'Erro ao criar cliente' };
  }
}

export async function updateClient(id: string, data: ClientFormData) {
  try {
    const storeId = await getStoreId();
    const validated = clientSchema.parse(data);
    
    // Verificar se telefone já existe (excluindo o próprio cliente)
    if (validated.phone) {
      const phoneExists = await repository.checkPhoneExists(validated.phone, storeId, id);
      if (phoneExists) {
        return { success: false, error: 'Telefone já cadastrado' };
      }
    }
    
    const client = await repository.update(id, validated, storeId);
    revalidatePath('/clients');
    
    return { success: true, data: client };
  } catch (error) {
    console.error('Error updating client:', error);
    return { success: false, error: 'Erro ao atualizar cliente' };
  }
}

export async function deleteClient(id: string) {
  try {
    const storeId = await getStoreId();
    await repository.delete(id, storeId);
    revalidatePath('/clients');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting client:', error);
    return { success: false, error: 'Erro ao excluir cliente' };
  }
}

export async function getClients(filters?: { search?: string; tags?: string[] }) {
  try {
    const storeId = await getStoreId();
    const clients = await repository.list(storeId, filters);
    return { success: true, data: clients };
  } catch (error) {
    console.error('Error fetching clients:', error);
    return { success: false, error: 'Erro ao buscar clientes' };
  }
}

export async function getClientById(id: string) {
  try {
    const storeId = await getStoreId();
    const client = await repository.getById(id, storeId);
    return { success: true, data: client };
  } catch (error) {
    console.error('Error fetching client:', error);
    return { success: false, error: 'Erro ao buscar cliente' };
  }
}

export async function getClientStats() {
  try {
    const storeId = await getStoreId();
    const stats = await repository.getStats(storeId);
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching client stats:', error);
    return { success: false, error: 'Erro ao buscar estatísticas' };
  }
}
