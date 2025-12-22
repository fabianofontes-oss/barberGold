/**
 * Tour do Dashboard
 */

import { Tour } from '@/components/onboarding/TourGuide'

export const dashboardTour: Tour = {
  id: 'dashboard',
  name: 'Tour do Dashboard',
  steps: [
    {
      id: 'welcome',
      title: 'Bem-vindo ao BarberGold! 🎉',
      description: 'Vamos fazer um tour rápido para você conhecer as principais funcionalidades do sistema. Leva apenas 2 minutos!',
    },
    {
      id: 'stats',
      title: 'Visão Geral',
      description: 'Aqui você vê um resumo do seu negócio: faturamento do dia, agendamentos, clientes atendidos e muito mais.',
      target: '[data-tour="dashboard-stats"]',
      position: 'bottom',
    },
    {
      id: 'recent-appointments',
      title: 'Próximos Agendamentos',
      description: 'Acompanhe os agendamentos do dia em tempo real. Clique em um agendamento para ver detalhes ou marcar como concluído.',
      target: '[data-tour="recent-appointments"]',
      position: 'top',
    },
    {
      id: 'quick-actions',
      title: 'Ações Rápidas',
      description: 'Acesse rapidamente as funções mais usadas: novo agendamento, nova venda, adicionar cliente.',
      target: '[data-tour="quick-actions"]',
      position: 'left',
    },
    {
      id: 'navigation',
      title: 'Menu de Navegação',
      description: 'Use o menu lateral para acessar todas as funcionalidades: Clientes, Agenda, PDV, Relatórios e muito mais.',
      target: '[data-tour="sidebar"]',
      position: 'right',
    },
  ],
}

