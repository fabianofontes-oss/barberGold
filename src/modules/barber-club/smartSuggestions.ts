import type { Service } from '@/types';
import type { PlanSuggestion } from './types';

/**
 * Analisa os serviÃ§os cadastrados e gera sugestÃµes inteligentes de planos de assinatura.
 * 
 * LÃ³gica:
 * 1. Identifica o serviÃ§o mais popular (geralmente corte de cabelo)
 * 2. Calcula preÃ§o mÃ©dio dos serviÃ§os
 * 3. Gera 3 planos baseados em frequÃªncia de visitas:
 *    - BÃ¡sico: 1 corte/mÃªs â†’ desconto de ~10%
 *    - Popular: 2 cortes/mÃªs â†’ desconto de ~15%
 *    - VIP: 4 cortes/mÃªs â†’ desconto de ~20% + benefÃ­cios
 */

export type SmartPlanSuggestion = PlanSuggestion & {
  reasoning: string;
  savingsPerMonth: number;
  pricePerVisit: number;
  originalPricePerVisit: number;
};

export type ServiceAnalysis = {
  totalServices: number;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  mostLikelyMainService: Service | null;
  mainServicePrice: number;
  suggestions: SmartPlanSuggestion[];
};

function findMainService(services: Service[]): Service | null {
  if (services.length === 0) return null;

  // Prioriza serviÃ§os com palavras-chave de corte
  const hairCutKeywords = ['corte', 'cabelo', 'hair', 'cut', 'tesoura', 'mÃ¡quina', 'degradÃª', 'degrade', 'fade'];
  
  const mainService = services.find((s) =>
    hairCutKeywords.some((kw) => s.name.toLowerCase().includes(kw))
  );

  if (mainService) return mainService;

  // Se nÃ£o encontrar, pega o serviÃ§o mais barato (geralmente o bÃ¡sico)
  const sorted = [...services].sort((a, b) => a.price - b.price);
  return sorted[0];
}

export function analyzeServicesAndSuggestPlans(services: Service[]): ServiceAnalysis {
  const onlyServices = services.filter((s) => s.type === 'SERVICE');

  if (onlyServices.length === 0) {
    return {
      totalServices: 0,
      averagePrice: 0,
      lowestPrice: 0,
      highestPrice: 0,
      mostLikelyMainService: null,
      mainServicePrice: 0,
      suggestions: [],
    };
  }

  const prices = onlyServices.map((s) => s.price);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const mainService = findMainService(onlyServices);
  const mainServicePrice = mainService?.price ?? avgPrice;

  // Gerar sugestÃµes inteligentes
  const suggestions: SmartPlanSuggestion[] = [
    generateBasicPlan(mainServicePrice, mainService?.name),
    generatePopularPlan(mainServicePrice, mainService?.name),
    generateVIPPlan(mainServicePrice, mainService?.name),
  ];

  return {
    totalServices: onlyServices.length,
    averagePrice: Math.round(avgPrice),
    lowestPrice: minPrice,
    highestPrice: maxPrice,
    mostLikelyMainService: mainService,
    mainServicePrice,
    suggestions,
  };
}

function generateBasicPlan(mainServicePrice: number, serviceName?: string): SmartPlanSuggestion {
  const credits = 1;
  const discountPercent = 0.10; // 10% de desconto
  const originalTotal = mainServicePrice * credits;
  const monthlyPrice = Math.round(originalTotal * (1 - discountPercent));
  const savings = originalTotal - monthlyPrice;

  return {
    templateId: 'smart_basic',
    name: 'Plano Mensal',
    description: `1 ${serviceName || 'corte'} por mÃªs com ${Math.round(discountPercent * 100)}% de desconto`,
    monthlyPriceBRL: monthlyPrice,
    monthlyCredits: credits,
    extraServiceDiscountPercent: 5,
    productDiscountPercent: 5,
    perks: [],
    tier: 'BASIC',
    reasoning: `Baseado no preÃ§o de R$ ${mainServicePrice} do seu serviÃ§o principal, com ${Math.round(discountPercent * 100)}% de desconto para fidelizar clientes que vÃªm 1x por mÃªs.`,
    savingsPerMonth: savings,
    pricePerVisit: monthlyPrice / credits,
    originalPricePerVisit: mainServicePrice,
  };
}

function generatePopularPlan(mainServicePrice: number, serviceName?: string): SmartPlanSuggestion {
  const credits = 2;
  const discountPercent = 0.15; // 15% de desconto
  const originalTotal = mainServicePrice * credits;
  const monthlyPrice = Math.round(originalTotal * (1 - discountPercent));
  const savings = originalTotal - monthlyPrice;

  return {
    templateId: 'smart_popular',
    name: 'Plano Quinzenal',
    description: `2 ${serviceName || 'cortes'} por mÃªs com ${Math.round(discountPercent * 100)}% de desconto`,
    monthlyPriceBRL: monthlyPrice,
    monthlyCredits: credits,
    extraServiceDiscountPercent: 10,
    productDiscountPercent: 10,
    perks: ['Agendamento prioritÃ¡rio'],
    tier: 'POPULAR',
    reasoning: `Para clientes que cortam a cada 15 dias. Economia de R$ ${savings} por mÃªs (${Math.round(discountPercent * 100)}% off).`,
    savingsPerMonth: savings,
    pricePerVisit: monthlyPrice / credits,
    originalPricePerVisit: mainServicePrice,
  };
}

function generateVIPPlan(mainServicePrice: number, serviceName?: string): SmartPlanSuggestion {
  const credits = 4;
  const discountPercent = 0.25; // 25% de desconto (maior volume = maior desconto)
  const originalTotal = mainServicePrice * credits;
  const monthlyPrice = Math.round(originalTotal * (1 - discountPercent));
  const savings = originalTotal - monthlyPrice;

  return {
    templateId: 'smart_vip',
    name: 'Plano VIP Semanal',
    description: `4 ${serviceName || 'cortes'} por mÃªs (1 por semana) com ${Math.round(discountPercent * 100)}% de desconto`,
    monthlyPriceBRL: monthlyPrice,
    monthlyCredits: credits,
    extraServiceDiscountPercent: 15,
    productDiscountPercent: 15,
    perks: ['Agendamento prioritÃ¡rio', 'Barba ou acabamento incluso', 'Cerveja/cafÃ© grÃ¡tis'],
    tier: 'PREMIUM',
    reasoning: `Para clientes frequentes que mantÃªm o visual impecÃ¡vel toda semana. Maior economia: R$ ${savings}/mÃªs.`,
    savingsPerMonth: savings,
    pricePerVisit: monthlyPrice / credits,
    originalPricePerVisit: mainServicePrice,
  };
}

/**
 * Gera uma explicaÃ§Ã£o resumida da anÃ¡lise para exibir ao dono
 */
export function generateAnalysisSummary(analysis: ServiceAnalysis): string {
  if (analysis.totalServices === 0) {
    return 'Cadastre seus serviÃ§os primeiro para receber sugestÃµes inteligentes de planos.';
  }

  const mainName = analysis.mostLikelyMainService?.name ?? 'serviÃ§o principal';
  
  return `Analisei ${analysis.totalServices} serviÃ§o${analysis.totalServices > 1 ? 's' : ''}. ` +
    `O "${mainName}" (R$ ${analysis.mainServicePrice}) parece ser o serviÃ§o mais comum. ` +
    `Sugiro 3 planos com descontos progressivos para incentivar fidelizaÃ§Ã£o.`;
}
