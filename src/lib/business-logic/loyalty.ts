/**
 * Business Logic: Programa de Fidelidade
 * 
 * Implementa regras de pontuação e recompensas
 */

/**
 * Configuração do programa de fidelidade
 */
export interface LoyaltyConfig {
  pointsPerVisit: number;        // Pontos por visita
  pointsToReward: number;        // Pontos necessários para recompensa
  rewardType: 'FREE_SERVICE' | 'DISCOUNT' | 'PRODUCT';
  rewardValue?: number;          // Valor do desconto se for DISCOUNT
}

/**
 * Status de fidelidade do cliente
 */
export interface LoyaltyStatus {
  currentPoints: number;
  pointsToNextReward: number;
  hasRewardAvailable: boolean;
  totalRewardsEarned: number;
}

/**
 * Calcula pontos a adicionar após uma compra
 */
export function calculateLoyaltyPoints(
  saleTotal: number,
  config: LoyaltyConfig
): number {
  // Por padrão, 1 ponto por visita
  // Pode ser expandido para pontos baseados em valor
  return config.pointsPerVisit;
}

/**
 * Verifica se cliente pode resgatar recompensa
 */
export function canRedeemReward(
  currentPoints: number,
  config: LoyaltyConfig
): boolean {
  return currentPoints >= config.pointsToReward;
}

/**
 * Calcula o status de fidelidade do cliente
 */
export function getLoyaltyStatus(
  currentPoints: number,
  totalRewardsEarned: number,
  config: LoyaltyConfig
): LoyaltyStatus {
  return {
    currentPoints,
    pointsToNextReward: Math.max(0, config.pointsToReward - currentPoints),
    hasRewardAvailable: currentPoints >= config.pointsToReward,
    totalRewardsEarned,
  };
}

/**
 * Processa resgate de recompensa
 */
export function processRewardRedemption(
  currentPoints: number,
  config: LoyaltyConfig
): { newPoints: number; success: boolean } {
  if (!canRedeemReward(currentPoints, config)) {
    return { newPoints: currentPoints, success: false };
  }

  return {
    newPoints: currentPoints - config.pointsToReward,
    success: true,
  };
}

/**
 * Configuração padrão de fidelidade
 */
export const DEFAULT_LOYALTY_CONFIG: LoyaltyConfig = {
  pointsPerVisit: 1,
  pointsToReward: 10,
  rewardType: 'FREE_SERVICE',
};


