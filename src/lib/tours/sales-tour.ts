/**
 * Tour de Vendas (PDV)
 */

import { Tour } from '@/components/onboarding/TourGuide'

export const salesTour: Tour = {
  id: 'sales',
  name: 'Tour do PDV',
  steps: [
    {
      id: 'intro',
      title: 'Ponto de Venda (PDV)',
      description: 'Registre vendas de serviços e produtos de forma rápida e organize. Calcule comissões automaticamente!',
    },
    {
      id: 'add-items',
      title: 'Adicionar Itens',
      description: 'Adicione serviços e produtos à venda. Você pode ajustar quantidades e aplicar descontos.',
      target: '[data-tour="add-items"]',
      position: 'top',
    },
    {
      id: 'cart',
      title: 'Carrinho de Venda',
      description: 'Veja os itens adicionados, o total da venda e aplique descontos se necessário.',
      target: '[data-tour="cart"]',
      position: 'left',
    },
    {
      id: 'payment',
      title: 'Forma de Pagamento',
      description: 'Selecione a forma de pagamento: Dinheiro, Débito, Crédito, PIX ou Outros.',
      target: '[data-tour="payment-method"]',
      position: 'top',
    },
    {
      id: 'complete',
      title: 'Finalizar Venda',
      description: 'Clique aqui para finalizar a venda. O sistema calculará automaticamente as comissões dos profissionais.',
      target: '[data-tour="complete-sale-button"]',
      position: 'bottom',
    },
    {
      id: 'history',
      title: 'Histórico de Vendas',
      description: 'Veja todas as vendas realizadas, filtre por período, profissional ou forma de pagamento.',
      target: '[data-tour="sales-history"]',
      position: 'top',
    },
  ],
}

