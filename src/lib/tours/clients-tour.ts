/**
 * Tour de Clientes
 */

import { Tour } from '@/components/onboarding/TourGuide'

export const clientsTour: Tour = {
  id: 'clients',
  name: 'Tour de Clientes',
  steps: [
    {
      id: 'intro',
      title: 'Gestão de Clientes',
      description: 'Aqui você gerencia todos os seus clientes: adicionar, editar, ver histórico de atendimentos e muito mais.',
    },
    {
      id: 'add-client',
      title: 'Adicionar Cliente',
      description: 'Clique aqui para cadastrar um novo cliente. Você pode adicionar nome, telefone, email, CPF e observações.',
      target: '[data-tour="add-client-button"]',
      position: 'bottom',
    },
    {
      id: 'search',
      title: 'Buscar Clientes',
      description: 'Use a busca para encontrar clientes rapidamente por nome, telefone ou email.',
      target: '[data-tour="client-search"]',
      position: 'bottom',
    },
    {
      id: 'client-list',
      title: 'Lista de Clientes',
      description: 'Veja todos os seus clientes organizados. Clique em um cliente para ver detalhes, histórico e editar informações.',
      target: '[data-tour="client-list"]',
      position: 'top',
    },
    {
      id: 'filters',
      title: 'Filtros',
      description: 'Filtre clientes por data de cadastro, aniversariantes do mês, clientes VIP e mais.',
      target: '[data-tour="client-filters"]',
      position: 'left',
    },
  ],
}

