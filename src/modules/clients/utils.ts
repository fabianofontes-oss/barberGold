import { differenceInDays } from 'date-fns';
import { ShopSettings } from '@/types';

export const getReturnStatus = (lastVisit: Date | undefined, shopSettings: ShopSettings) => {
  if (!lastVisit) return { status: 'NEW', days: 0 };
  const daysSince = differenceInDays(new Date(), lastVisit);
  if (daysSince >= shopSettings.winBackDays) return { status: 'LOST', days: daysSince };
  if (daysSince >= shopSettings.returnReminderDays) return { status: 'OVERDUE', days: daysSince };
  if (daysSince >= (shopSettings.returnReminderDays - 7)) return { status: 'WARNING', days: daysSince };
  return { status: 'OK', days: daysSince };
};

export const getStatusStyles = (status: string) => {
   switch(status) {
      case 'LOST': return 'bg-red-600 border-red-600 hover:border-red-400 text-white';
      case 'OVERDUE': return 'bg-zinc-900 border-red-500/50 hover:border-red-400';
      case 'WARNING': return 'bg-zinc-900 border-amber-500/50 hover:border-amber-400';
      default: return 'bg-zinc-900 border-zinc-800 hover:border-amber-500/50';
   }
};
