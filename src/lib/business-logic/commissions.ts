/**
 * Business Logic: Cálculo de Comissões
 * 
 * Implementa regras de comissionamento para diferentes tipos de profissionais
 */

/**
 * Tipos de comissionamento
 */
export type CommissionType = 'PERCENTAGE' | 'CHAIR_RENTAL' | 'OWNER';

/**
 * Item para cálculo de comissão
 */
export interface CommissionItem {
  price: number;
  qty: number;
  type: 'service' | 'product';
}

/**
 * Configuração de comissão do profissional
 */
export interface StaffCommissionConfig {
  commissionType: CommissionType;
  commissionRate?: number;  // Percentual (0-100) para PERCENTAGE
  chairRental?: number;     // Valor fixo para CHAIR_RENTAL
}

/**
 * Configuração da loja para descontos
 */
export interface ShopDiscountConfig {
  discountRule: 'SHARED' | 'SHOP_ABSORBS';
}

/**
 * Resultado do cálculo de comissão
 */
export interface CommissionResult {
  grossComm: number;        // Comissão bruta
  netComm: number;          // Comissão líquida
  servicesComm: number;     // Comissão de serviços
  productsComm: number;     // Comissão de produtos
  tipComm: number;          // Comissão da gorjeta
  discountImpact: number;   // Impacto do desconto
}

/**
 * Calcula a comissão de uma venda
 * 
 * @param items - Itens da venda
 * @param netTotal - Valor líquido (após desconto)
 * @param tip - Valor da gorjeta
 * @param staffConfig - Configuração de comissão do profissional
 * @param shopConfig - Configuração de desconto da loja
 * @returns Resultado detalhado do cálculo de comissões
 */
export function calculateCommission(
  items: CommissionItem[],
  netTotal: number,
  tip: number,
  staffConfig: StaffCommissionConfig,
  shopConfig: ShopDiscountConfig
): CommissionResult {
  const { commissionType, commissionRate = 0, chairRental = 0 } = staffConfig;

  // Separar serviços e produtos
  const servicesTotal = items
    .filter(i => i.type === 'service')
    .reduce((sum, i) => sum + i.price * i.qty, 0);
  
  const productsTotal = items
    .filter(i => i.type === 'product')
    .reduce((sum, i) => sum + i.price * i.qty, 0);

  const grossTotal = servicesTotal + productsTotal;
  const discountImpact = grossTotal - netTotal;

  let servicesComm = 0;
  let productsComm = 0;
  let grossComm = 0;
  let netComm = 0;

  switch (commissionType) {
    case 'PERCENTAGE':
      // Comissão percentual
      servicesComm = servicesTotal * (commissionRate / 100);
      productsComm = productsTotal * (commissionRate / 100);
      grossComm = servicesComm + productsComm;
      
      // Aplicar impacto do desconto se compartilhado
      if (shopConfig.discountRule === 'SHARED' && grossTotal > 0) {
        const discountRatio = netTotal / grossTotal;
        netComm = grossComm * discountRatio;
      } else {
        netComm = grossComm;
      }
      break;

    case 'CHAIR_RENTAL':
      // Profissional fica com tudo menos aluguel
      grossComm = Math.max(0, grossTotal - chairRental);
      netComm = Math.max(0, netTotal - chairRental);
      servicesComm = grossComm;
      productsComm = 0;
      break;

    case 'OWNER':
      // Owner fica com 100%
      grossComm = grossTotal;
      netComm = netTotal;
      servicesComm = servicesTotal;
      productsComm = productsTotal;
      break;
  }

  // Gorjeta vai 100% para o profissional
  const tipComm = tip;

  return {
    grossComm,
    netComm,
    servicesComm,
    productsComm,
    tipComm,
    discountImpact,
  };
}

