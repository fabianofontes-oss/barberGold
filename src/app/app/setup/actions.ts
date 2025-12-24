'use server';

import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createTenantAndProfile(formData: {
  displayName: string;
  phone: string;
  shopName: string;
  shopSlug: string;
}) {
  const supabase = await createSupabaseClient();

  try {
    // Obter usuário logado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    // Verificar se o slug já existe
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', formData.shopSlug)
      .single();

    if (existingStore) {
      throw new Error('Este subdomínio já está em uso. Escolha outro nome.');
    }

    // Criar a loja/tenant
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        name: formData.shopName,
        slug: formData.shopSlug,
        owner_id: user.id,
        plan_id: 'FREE',
        status: 'ACTIVE',
        settings: {
          phone: formData.phone,
          owner_name: formData.displayName,
        }
      })
      .select()
      .single();

    if (storeError) {
      throw storeError;
    }

    // Criar o perfil do dono como staff
    const { error: staffError } = await supabase
      .from('staff')
      .insert({
        store_id: store.id,
        user_id: user.id,
        name: formData.displayName,
        role: 'OWNER',
        email: user.email,
        phone: formData.phone,
        commission_model: 'OWNER',
        service_commission_rate: 100,
        product_commission_rate: 100
      });

    if (staffError) {
      throw staffError;
    }

    // Criar serviços padrão para a barbearia
    const defaultServices = [
      { name: 'Corte Tradicional', price: 35, duration_minutes: 30, category: 'Corte' },
      { name: 'Corte + Barba', price: 55, duration_minutes: 45, category: 'Combo' },
      { name: 'Barba Completa', price: 25, duration_minutes: 20, category: 'Barba' },
      { name: 'Sobrancelha', price: 15, duration_minutes: 10, category: 'Acabamento' },
      { name: 'Platinado', price: 120, duration_minutes: 90, category: 'Coloração' },
    ];

    const { error: servicesError } = await supabase
      .from('services')
      .insert(
        defaultServices.map(service => ({
          ...service,
          store_id: store.id,
          is_active: true
        }))
      );

    if (servicesError) {
      console.error('Erro ao criar serviços padrão:', servicesError);
    }

    return { success: true, storeId: store.id, slug: formData.shopSlug };
  } catch (error: any) {
    console.error('Erro no setup:', error);
    return { success: false, error: error.message || 'Erro ao configurar barbearia' };
  }
}
