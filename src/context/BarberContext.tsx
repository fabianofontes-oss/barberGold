'use client';

/**
 * DEPRECATED: Este arquivo existe apenas para compatibilidade.
 * O BarberContext foi substituido pelo AppContext.
 * 
 * useBarber() agora e um alias para useApp()
 * BarberProvider agora e um alias para AppProvider
 */

export { useApp as useBarber, AppProvider as BarberProvider, type AppContextType as BarberContextType } from './AppContext';
