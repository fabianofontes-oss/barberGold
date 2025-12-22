/**
 * Módulo de Clients
 * 
 * Re-exports de actions e types
 */

// Re-export actions
export {
  listClientsAction,
  getClientAction,
  createClientAction,
  updateClientAction,
  deleteClientAction,
  searchClientsAction,
  getClientStatsAction,
} from './actions';

// Re-export types
export type {
  Client,
  ClientDB,
  CreateClientInput,
  UpdateClientInput,
  ClientFilters,
  PaginatedClients,
  ClientStats,
} from './actions';

