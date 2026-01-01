import React from 'react';
import {
  Phone,
  Trophy,
  Clock,
  AlertCircle,
  Gift,
  ShieldCheck,
  Users
 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Client } from '@/types';
import { ClientTagsBadges } from './ClientTagsManager';

interface ClientListItemProps {
  client: Client;
  currentUserId?: string;
  shopSettings: {
    winBackDays: number;
    returnReminderDays: number;
  };
  canViewContacts: boolean;
  hasLoyalty: boolean;
  onClick: (client: Client) => void;
}

export const ClientListItem = React.memo(({
  client,
  currentUserId,
  shopSettings,
  canViewContacts,
  hasLoyalty,
  onClick
}: ClientListItemProps) => {
  const getReturnStatus = (lastVisit?: Date) => {
    if (!lastVisit) return { status: 'NEW', days: 0 };
    const daysSince = differenceInDays(new Date(), lastVisit);
    if (daysSince >= shopSettings.winBackDays) return { status: 'LOST', days: daysSince };
    if (daysSince >= shopSettings.returnReminderDays) return { status: 'OVERDUE', days: daysSince };
    if (daysSince >= (shopSettings.returnReminderDays - 7)) return { status: 'WARNING', days: daysSince };
    return { status: 'OK', days: daysSince };
  };

  const getStatusStyles = (status: string) => {
     switch(status) {
        case 'LOST': return 'bg-red-600 border-red-600 hover:border-red-400 text-white';
        case 'OVERDUE': return 'bg-zinc-900 border-red-500/50 hover:border-red-400';
        case 'WARNING': return 'bg-zinc-900 border-amber-500/50 hover:border-amber-400';
        default: return 'bg-zinc-900 border-zinc-800 hover:border-amber-500/50';
     }
  };

  const returnStatus = getReturnStatus(client.lastVisit);
  const points = client.loyaltyPoints || 0;
  const cardStyle = getStatusStyles(returnStatus.status);
  const isLoyalToMe = currentUserId && client.preferredStaffId === currentUserId;
  const hasDependents = client.dependents && client.dependents.length > 0;

  const textPrimary = returnStatus.status === 'LOST' ? 'text-white' : 'text-white';
  const textSecondary = returnStatus.status === 'LOST' ? 'text-white/80' : 'text-zinc-400';
  const iconColor = returnStatus.status === 'LOST' ? 'text-white' : 'text-zinc-600';

  return (
    <button
      onClick={() => onClick(client)}
      className={`text-left rounded-xl p-5 border transition-all group relative overflow-hidden shadow-lg ${cardStyle} ${isLoyalToMe ? 'ring-1 ring-emerald-500/50' : ''}`}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border ${returnStatus.status === 'LOST' ? 'bg-white text-red-600 border-white' : 'bg-zinc-800 text-amber-500 border-zinc-700'}`}>
            {client.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
               <h3 className={`font-bold text-lg ${textPrimary}`}>{client.name}</h3>
               {isLoyalToMe && <span className="bg-emerald-500 text-zinc-900 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm"><ShieldCheck className="w-2.5 h-2.5" /> MY PORTFOLIO</span>}
            </div>

            {hasLoyalty && (
               <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${returnStatus.status === 'LOST' ? 'text-white/80' : (points >= 10 ? 'text-amber-400' : 'text-zinc-500')}`}>
                 {points >= 10 ? <Gift className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
                 {points >= 10 ? 'Reward Available' : `${points}/10 Stamps`}
               </div>
            )}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-col items-end gap-2">
           {returnStatus.status === 'WARNING' && <span className="text-amber-500 text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Due Soon</span>}
           {returnStatus.status === 'OVERDUE' && <div className="flex items-center gap-2"><span className="text-red-400 text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> {returnStatus.days} Days</span></div>}
        </div>
      </div>

      <div className="space-y-3 mb-6 relative z-10 min-h-[1.5rem]">
        {canViewContacts ? <div className={`flex items-center gap-3 text-sm ${textSecondary}`}><Phone className={`w-4 h-4 ${iconColor}`} /><span>{client.phone}</span></div> : <div className="h-5"></div>}
        {hasDependents && (
           <div className={`flex items-center gap-3 text-xs ${textSecondary}`}>
              <Users className={`w-4 h-4 ${iconColor}`} />
              <span>{client.dependents!.length} Dependents</span>
           </div>
        )}
        {client.tags && client.tags.length > 0 && (
           <ClientTagsBadges tags={client.tags} />
        )}
      </div>

      <div className={`grid grid-cols-2 gap-3 pt-4 border-t relative z-10 ${returnStatus.status === 'LOST' ? 'border-white/20' : 'border-zinc-800'}`}>
        <div className={`${returnStatus.status === 'LOST' ? 'bg-black/20 text-white' : 'bg-zinc-950/50 text-zinc-200'} rounded-lg p-3`}>
          <p className="font-medium text-sm">{client.lastVisit ? format(client.lastVisit, 'MMM d') : 'New'}</p>
        </div>
        <div className={`${returnStatus.status === 'LOST' ? 'bg-black/20 text-white' : 'bg-zinc-950/50 text-white'} rounded-lg p-3`}>
          <p className="font-bold text-sm">${client.totalSpent.toFixed(2)}</p>
        </div>
      </div>
    </button>
  );
});

ClientListItem.displayName = 'ClientListItem';
