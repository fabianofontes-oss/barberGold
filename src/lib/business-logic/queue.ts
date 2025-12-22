/**
 * Business Logic: Fila Inteligente
 * 
 * Implementa lógica de distribuição de clientes entre profissionais
 */

/**
 * Profissional na fila
 */
export interface QueueStaff {
  id: string;
  name: string;
  isAvailable: boolean;
  lastClientAt: Date | null;
  clientsToday: number;
  servicesCompleted: number;
}

/**
 * Cliente na fila
 */
export interface QueueClient {
  id: string;
  name: string;
  preferredStaffId?: string;
  serviceId: string;
  arrivedAt: Date;
  estimatedWaitMinutes: number;
}

/**
 * Configuração da fila
 */
export interface QueueConfig {
  distributionMode: 'ROUND_ROBIN' | 'LEAST_BUSY' | 'RANDOM' | 'CLIENT_CHOICE';
  respectPreferences: boolean;  // Respeita preferência do cliente
  balanceByRevenue: boolean;    // Balanceia por faturamento ao invés de quantidade
}

/**
 * Resultado da sugestão de profissional
 */
export interface StaffSuggestion {
  staffId: string;
  staffName: string;
  reason: string;
  estimatedWaitMinutes: number;
}

/**
 * Encontra o próximo profissional disponível para atender
 */
export function getNextAvailableStaff(
  availableStaff: QueueStaff[],
  client: QueueClient,
  config: QueueConfig
): StaffSuggestion | null {
  if (availableStaff.length === 0) {
    return null;
  }

  // Se cliente tem preferência e devemos respeitar
  if (config.respectPreferences && client.preferredStaffId) {
    const preferred = availableStaff.find(
      s => s.id === client.preferredStaffId && s.isAvailable
    );
    if (preferred) {
      return {
        staffId: preferred.id,
        staffName: preferred.name,
        reason: 'Profissional preferido do cliente',
        estimatedWaitMinutes: 0,
      };
    }
  }

  // Filtrar apenas disponíveis
  const available = availableStaff.filter(s => s.isAvailable);
  
  if (available.length === 0) {
    // Todos ocupados, sugerir quem tem menos na fila
    const leastBusy = [...availableStaff].sort(
      (a, b) => a.clientsToday - b.clientsToday
    )[0];
    
    return {
      staffId: leastBusy.id,
      staffName: leastBusy.name,
      reason: 'Próximo a ficar disponível',
      estimatedWaitMinutes: 30, // Estimativa padrão
    };
  }

  let selected: QueueStaff;

  switch (config.distributionMode) {
    case 'ROUND_ROBIN':
      // Quem atendeu há mais tempo
      selected = [...available].sort((a, b) => {
        if (!a.lastClientAt) return -1;
        if (!b.lastClientAt) return 1;
        return a.lastClientAt.getTime() - b.lastClientAt.getTime();
      })[0];
      break;

    case 'LEAST_BUSY':
      // Quem tem menos clientes hoje
      selected = [...available].sort(
        (a, b) => a.clientsToday - b.clientsToday
      )[0];
      break;

    case 'RANDOM':
      // Aleatório
      selected = available[Math.floor(Math.random() * available.length)];
      break;

    case 'CLIENT_CHOICE':
    default:
      // Primeiro disponível (cliente escolhe)
      selected = available[0];
      break;
  }

  return {
    staffId: selected.id,
    staffName: selected.name,
    reason: getReasonForMode(config.distributionMode),
    estimatedWaitMinutes: 0,
  };
}

/**
 * Retorna razão amigável para o modo de distribuição
 */
function getReasonForMode(mode: QueueConfig['distributionMode']): string {
  switch (mode) {
    case 'ROUND_ROBIN':
      return 'Próximo da vez';
    case 'LEAST_BUSY':
      return 'Menos ocupado';
    case 'RANDOM':
      return 'Selecionado aleatoriamente';
    case 'CLIENT_CHOICE':
      return 'Disponível para atender';
    default:
      return 'Disponível';
  }
}

/**
 * Calcula tempo estimado de espera
 */
export function calculateWaitTime(
  position: number,
  averageServiceMinutes: number
): number {
  return position * averageServiceMinutes;
}

/**
 * Configuração padrão da fila
 */
export const DEFAULT_QUEUE_CONFIG: QueueConfig = {
  distributionMode: 'ROUND_ROBIN',
  respectPreferences: true,
  balanceByRevenue: false,
};





