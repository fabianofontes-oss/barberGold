/**
 * Tour de Agendamentos
 */

import { Tour } from '@/components/onboarding/TourGuide'

export const appointmentsTour: Tour = {
  id: 'appointments',
  name: 'Tour da Agenda',
  steps: [
    {
      id: 'intro',
      title: 'Agenda Inteligente',
      description: 'Gerencie todos os agendamentos da sua barbearia em uma agenda visual e fácil de usar.',
    },
    {
      id: 'calendar-view',
      title: 'Visualização de Calendário',
      description: 'Veja os agendamentos em formato de calendário. Clique em um dia para ver detalhes ou adicionar novo agendamento.',
      target: '[data-tour="calendar"]',
      position: 'top',
    },
    {
      id: 'new-appointment',
      title: 'Novo Agendamento',
      description: 'Clique aqui para criar um novo agendamento. Selecione cliente, serviço, profissional, data e horário.',
      target: '[data-tour="new-appointment-button"]',
      position: 'bottom',
    },
    {
      id: 'filters',
      title: 'Filtros de Agenda',
      description: 'Filtre agendamentos por profissional, status (agendado, confirmado, concluído) ou período.',
      target: '[data-tour="appointment-filters"]',
      position: 'left',
    },
    {
      id: 'status',
      title: 'Status dos Agendamentos',
      description: 'Acompanhe o status: Agendado (cinza), Confirmado (azul), Concluído (verde), Cancelado (vermelho).',
      target: '[data-tour="appointment-status"]',
      position: 'bottom',
    },
  ],
}

