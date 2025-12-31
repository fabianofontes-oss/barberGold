// Re-export do novo env.ts centralizado
// Mantido para retrocompatibilidade
export { 
  getAppMode, 
  isDemoMode, 
  isPilotMode, 
  isProdMode, 
  shouldUseSupabase,
  type AppMode 
} from './env';
