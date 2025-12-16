import type { Service } from '@/types';
import type { PlanSuggestion } from './types';

/**
 * Analisa os serviços cadastrados e gera sugestões inteligentes de planos de assinatura.
 * 
 * Lógica:
 * 1. Identifica o serviço mais popular (geralmente corte de cabelo)
 * 2. Calcula preço médio dos serviços
 * 3. Gera 3 planos baseados em frequência de visitas:
 *    - Básico: 1 corte/mês → desconto de ~10%
 *    - Popular: 2 cortes/mês → desconto de ~15%
 *    - VIP: 4 cortes/mês → desconto de ~20% + benefícios
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

  // Prioriza serviços com palavras-chave de corte
  const hairCutKeywords = ['corte', 'cabelo', 'hair', 'cut', 'tesoura', 'máquina', 'degradê', 'degrade', 'fade'];
  
  const mainService = services.find((s) =>
    hairCutKeywords.some((kw) => s.name.toLowerCase().includes(kw))
  );

  if (mainService) return mainService;

  // Se não encontrar, pega o serviço mais barato (geralmente o básico)
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

  // Gerar sugestões inteligentes
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
    description: `1 ${serviceName || 'corte'} por mês com ${Math.round(discountPercent * 100)}% de desconto`,
    monthlyPriceBRL: monthlyPrice,
    monthlyCredits: credits,
    extraServiceDiscountPercent: 5,
    productDiscountPercent: 5,
    perks: [],
    tier: 'BASIC',
    reasoning: `Baseado no preço de R$ ${mainServicePrice} do seu serviço principal, com ${Math.round(discountPercent * 100)}% de desconto para fidelizar clientes que vêm 1x por mês.`,
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
    description: `2 ${serviceName || 'cortes'} por mês com ${Math.round(discountPercent * 100)}% de desconto`,
    monthlyPriceBRL: monthlyPrice,
    monthlyCredits: credits,
    extraServiceDiscountPercent: 10,
    productDiscountPercent: 10,
    perks: ['Agendamento prioritário'],
    tier: 'POPULAR',
    reasoning: `Para clientes que cortam a cada 15 dias. Economia de R$ ${savings} por mês (${Math.round(discountPercent * 100)}% off).`,
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
    description: `4 ${serviceName || 'cortes'} por mês (1 por semana) com ${Math.round(discountPercent * 100)}% de desconto`,
    monthlyPriceBRL: monthlyPrice,
    monthlyCredits: credits,
    extraServiceDiscountPercent: 15,
    productDiscountPercent: 15,
    perks: ['Agendamento prioritário', 'Barba ou acabamento incluso', 'Cerveja/café grátis'],
    tier: 'PREMIUM',
    reasoning: `Para clientes frequentes que mantêm o visual impecável toda semana. Maior economia: R$ ${savings}/mês.`,
    savingsPerMonth: savings,
    pricePerVisit: monthlyPrice / credits,
    originalPricePerVisit: mainServicePrice,
  };
}

/**
 * Gera uma explicação resumida da análise para exibir ao dono
 */
export function generateAnalysisSummary(analysis: ServiceAnalysis): string {
  if (analysis.totalServices === 0) {
    return 'Cadastre seus serviços primeiro para receber sugestões inteligentes de planos.';
  }

  const mainName = analysis.mostLikelyMainService?.name ?? 'serviço principal';
  
  return `Analisei ${analysis.totalServices} serviço${analysis.totalServices > 1 ? 's' : ''}. ` +
    `O "${mainName}" (R$ ${analysis.mainServicePrice}) parece ser o serviço mais comum. ` +
    `Sugiro 3 planos com descontos progressivos para incentivar fidelização.`;
}
