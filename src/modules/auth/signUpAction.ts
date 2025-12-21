'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  shopName: z.string().min(3, 'Nome da barbearia deve ter no mínimo 3 caracteres'),
  ownerName: z.string().min(3, 'Seu nome deve ter no mínimo 3 caracteres'),
  slug: z.string()
    .min(3, 'Slug deve ter no mínimo 3 caracteres')
    .max(20, 'Slug deve ter no máximo 20 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífen'),
});

export type SignUpResult = {
  success: boolean;
  error?: string;
};

export async function signUpWithTenantAction(formData: FormData): Promise<SignUpResult> {
  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      shopName: formData.get('shopName') as string,
      ownerName: formData.get('ownerName') as string,
      slug: formData.get('slug') as string,
    };

    const validated = signUpSchema.parse(data);
    
    const supabase = await createClient();

    const { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', validated.slug)
      .maybeSingle();

    if (existingTenant) {
      return {
        success: false,
        error: 'Este nome já está em uso. Escolha outro.',
      };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          name: validated.ownerName,
        },
      },
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Erro ao criar conta',
      };
    }

    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: validated.shopName,
        slug: validated.slug,
        owner_id: authData.user.id,
        plan_id: 'FREE',
        status: 'TRIAL',
      })
      .select()
      .single();

    if (tenantError || !tenant) {
      return {
        success: false,
        error: 'Erro ao criar barbearia',
      };
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        tenant_id: tenant.id,
        user_id: authData.user.id,
        name: validated.ownerName,
        email: validated.email,
        role: 'OWNER',
        is_active: true,
      });

    if (profileError) {
      return {
        success: false,
        error: 'Erro ao criar perfil',
      };
    }

    await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    revalidatePath('/', 'layout');
    redirect('/app/setup');

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }
    
    console.error('Erro no signup:', error);
    return {
      success: false,
      error: 'Erro ao processar cadastro',
    };
  }
}

export async function checkSlugAvailability(slug: string): Promise<{ available: boolean }> {
  const supabase = await createClient();
  
  const { data } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  return { available: !data };
}
