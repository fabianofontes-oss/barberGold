'use server';

import { createClient } from '@/lib/supabase/server';
import { BusinessType, PackageLevel, OnboardingStats } from '@/types/onboarding';

interface ProcessOnboardingParams {
  tenantId: string;
  businessType: BusinessType;
  packageLevel: PackageLevel;
  selectedServiceIds?: string[];
}

export async function processOnboarding(params: ProcessOnboardingParams): Promise<{ success: boolean; stats?: OnboardingStats; error?: string }> {
  const { tenantId, businessType, packageLevel, selectedServiceIds } = params;
  
  const supabase = await createClient();

  try {
    // 1. Buscar templates baseado no tipo de negócio e nível de pacote
    const maxPackageLevel = packageLevel === 'completo' ? 2 : packageLevel === 'essencial' ? 1 : 3;
    
    const { data: templates, error: templatesError } = await supabase
      .from('services_template')
      .select(`
        *,
        category:service_categories_template(*)
      `)
      .eq('service_categories_template.business_type', businessType)
      .lte('package_level', maxPackageLevel);

    if (templatesError) {
      return { success: false, error: templatesError.message };
    }

    if (!templates || templates.length === 0) {
      return { success: false, error: 'Nenhum template encontrado' };
    }

    // 2. Filtrar por serviços selecionados se for custom
    let servicesToCreate = templates;
    if (packageLevel === 'custom' && selectedServiceIds && selectedServiceIds.length > 0) {
      servicesToCreate = templates.filter(t => selectedServiceIds.includes(t.id));
    }

    // 3. Criar categorias únicas primeiro
    const uniqueCategories = Array.from(
      new Map(servicesToCreate.map(t => [t.category.id, t.category])).values()
    );

    const categoryMap: Record<string, string> = {};

    for (const catTemplate of uniqueCategories) {
      const { data: newCat, error: catError } = await supabase
        .from('service_categories')
        .insert({
          tenant_id: tenantId,
          template_id: catTemplate.id,
          name: catTemplate.name,
          icon: catTemplate.icon,
          sort_order: catTemplate.sort_order,
          is_active: true
        })
        .select()
        .single();

      if (catError) {
        console.error('Erro ao criar categoria:', catError);
        continue;
      }

      if (newCat) {
        categoryMap[catTemplate.id] = newCat.id;
      }
    }

    // 4. Criar serviços
    const serviceMap: Record<string, string> = {};

    for (const template of servicesToCreate) {
      const { data: newService, error: serviceError } = await supabase
        .from('services')
        .insert({
          tenant_id: tenantId,
          category_id: categoryMap[template.category_id],
          template_id: template.id,
          type: template.type,
          name: template.name,
          duration: template.duration_min,
          price: template.price_cents / 100, // converter cents para decimal
          tags: template.tags,
          is_active: packageLevel !== 'custom', // auto-ativar se não for custom
          sort_order: template.sort_order
        })
        .select()
        .single();

      if (serviceError) {
        console.error('Erro ao criar serviço:', serviceError);
        continue;
      }

      if (newService) {
        serviceMap[template.id] = newService.id;
      }
    }

    // 5. Criar bundle_items para combos
    const combos = servicesToCreate.filter(t => t.type === 'combo');
    
    for (const combo of combos) {
      const { data: bundleTemplates } = await supabase
        .from('bundle_items_template')
        .select('*')
        .eq('combo_service_id', combo.id);

      if (bundleTemplates && bundleTemplates.length > 0) {
        const bundleItems = bundleTemplates
          .filter(item => serviceMap[item.item_service_id]) // só itens que foram criados
          .map(item => ({
            combo_service_id: serviceMap[combo.id],
            item_service_id: serviceMap[item.item_service_id],
            quantity: item.quantity
          }));

        if (bundleItems.length > 0) {
          await supabase.from('bundle_items').insert(bundleItems);
        }
      }
    }

    // 6. Calcular estatísticas (só type='service')
    const mainServices = servicesToCreate.filter(s => s.type === 'service');
    
    const stats: OnboardingStats = {
      totalServices: mainServices.length,
      totalCombos: combos.length,
      totalCategories: uniqueCategories.length,
      avgPrice: Math.round(
        mainServices.reduce((sum, s) => sum + s.price_cents, 0) / mainServices.length / 100
      ),
      avgDuration: Math.round(
        mainServices.reduce((sum, s) => sum + s.duration_min, 0) / mainServices.length
      )
    };

    return { success: true, stats };

  } catch (error: any) {
    console.error('Erro no processamento de onboarding:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

export async function getServiceTemplates(businessType: BusinessType, packageLevel?: PackageLevel) {
  const supabase = await createClient();
  
  const maxPackageLevel = packageLevel === 'completo' ? 2 : packageLevel === 'essencial' ? 1 : 3;
  
  const { data, error } = await supabase
    .from('services_template')
    .select(`
      *,
      category:service_categories_template(*),
      bundleItems:bundle_items_template(*)
    `)
    .eq('service_categories_template.business_type', businessType)
    .lte('package_level', maxPackageLevel)
    .order('sort_order');

  if (error) {
    console.error('Erro ao buscar templates:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
