'use client';

import React, { useState, useMemo } from 'react';
import { useBarber } from '@/context/BarberContext';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { useI18n } from '@/hooks/useI18n';
import { 
  Search, 
  UserPlus, 
  Phone, 
  Trophy,
  Star,
  X,
  History,
  FileText,
  Save,
  Clock,
  AlertCircle,
  Gift,
  Lock,
  Unlock,
  ShieldCheck,
  Users,
  Trash2
 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { AppointmentStatus, Client, Dependent, ClientTag } from '@/types';
import { ClientTagsBadges, ClientTagsManager } from './components/ClientTagsManager';
import { ClientPreferencesEditor } from './components/ClientPreferencesEditor';
import { ExportClients } from './components/ExportClients';

export const Clients = () => {
  const { clients, addClient, appointments, updateClient, shopSettings, currentUser, staff, services, products, shopProfile } = useBarber();
  const { canUseFeature } = useFeatureGate();
  const { t, formatCurrency } = useI18n();
  
  const hasLoyalty = canUseFeature('LOYALTY');

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{name: string, phone: string, email: string, birthDate: string, referrerCode: string, dependents: Dependent[]}>({ 
     name: '', phone: '', email: '', birthDate: '', referrerCode: '', dependents: [] 
  });
  
  // Dependent Form State
  const [newDependentName, setNewDependentName] = useState('');
  const [newDependentStaffId, setNewDependentStaffId] = useState('');

  // VIEW MODE
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'HISTORY'>('PORTFOLIO');
  const [activeDetailTab, setActiveDetailTab] = useState<'HISTORY' | 'NOTES' | 'DEPENDENTS'>('HISTORY');
  const [noteText, setNoteText] = useState('');

  // Validação de segurança
  if (!currentUser) return null;

  const isOwner = currentUser.role === 'OWNER';

  // STEALTH MODE CHECK
  const canViewContacts = isOwner || !shopSettings.hideClientContactInfo;

  // --- DATA PREPARATION ---
  const { myLoyalClients, myHistoryClients } = useMemo(() => {
    const loyal = clients.filter(c => c.preferredStaffId === currentUser.id);
    const servedIds = new Set(
       appointments
          .filter(a => a.staffId === currentUser.id)
          .map(a => a.clientId)
    );

    const history = clients.filter(c => {
       if (c.preferredStaffId === currentUser.id) return false;
       return servedIds.has(c.id);
    });

    return { myLoyalClients: loyal, myHistoryClients: history };
  }, [clients, appointments, currentUser.id]);

  const displayedClients = useMemo(() => {
    if (isOwner) {
       return clients;
    } else {
       if (activeTab === 'PORTFOLIO') {
          return myLoyalClients;
       } else {
          return myHistoryClients;
       }
    }
  }, [isOwner, clients, activeTab, myLoyalClients, myHistoryClients]);

  const filteredClients = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return displayedClients.filter(c => {
      return (
         c.name.toLowerCase().includes(query) ||
         (canViewContacts && c.phone.includes(searchQuery))
      );
    });
  }, [displayedClients, searchQuery, canViewContacts]);

  // --- HANDLERS ---

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    addClient({
      name: formData.name,
      phone: formData.phone,
      email: formData.email, 
      birthDate: formData.birthDate,
      referrerCode: formData.referrerCode,
      dependents: formData.dependents
    });
    setFormData({ name: '', phone: '', email: '', birthDate: '', referrerCode: '', dependents: [] });
    setIsModalOpen(false);
  };

  const handleAddDependent = () => {
     if (newDependentName.trim()) {
        const dep: Dependent = {
           id: Math.random().toString(36).substr(2, 9),
           name: newDependentName,
           preferredStaffId: newDependentStaffId || undefined
        };
        
        if (selectedClient) {
           // Editing existing client
           const updatedDependents = [...(selectedClient.dependents || []), dep];
           updateClient({ ...selectedClient, dependents: updatedDependents });
           setSelectedClient({ ...selectedClient, dependents: updatedDependents });
        } else {
           // Creating new client
           setFormData(prev => ({ ...prev, dependents: [...prev.dependents, dep] }));
        }
        setNewDependentName('');
        setNewDependentStaffId('');
     }
  };

  const removeDependent = (id: string) => {
     if (selectedClient) {
        const updated = (selectedClient.dependents || []).filter(d => d.id !== id);
        updateClient({ ...selectedClient, dependents: updated });
        setSelectedClient({ ...selectedClient, dependents: updated });
     } else {
        setFormData(prev => ({ ...prev, dependents: prev.dependents.filter(d => d.id !== id) }));
     }
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setNoteText(client.notes || '');
    setActiveDetailTab('HISTORY');
  };

  const saveNotes = () => {
    if (selectedClient) {
      updateClient({ ...selectedClient, notes: noteText });
    }
  };

  // Get Client History
  const clientHistory = appointments
    .filter(a => a.clientId === selectedClient?.id && a.status === AppointmentStatus.COMPLETED)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

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

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">{t('clients.title')}</h2>
          <p className="text-zinc-400 text-sm">
             {isOwner ? t('clients.client.notes') : t('clients.client.notes')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isOwner && <ExportClients clients={clients} shopName={shopProfile.name || 'Barbearia'} />}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <UserPlus className="w-5 h-5" /> {t('clients.newClient')}
          </button>
        </div>
      </div>

      {/* TABS (STAFF VIEW) */}
      {!isOwner && (
         <div className="flex space-x-2 bg-zinc-900 p-1 rounded-xl mb-6 border border-zinc-800 w-full md:w-max">
            <button onClick={() => setActiveTab('PORTFOLIO')} className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'PORTFOLIO' ? 'bg-zinc-800 text-amber-500 shadow-md ring-1 ring-amber-500/20' : 'text-zinc-500 hover:text-white'}`}><Lock className="w-3 h-3" /> {t('clients.stats.loyalPortfolio')} ({myLoyalClients.length})</button>
            <button onClick={() => setActiveTab('HISTORY')} className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'HISTORY' ? 'bg-zinc-800 text-blue-400 shadow-md' : 'text-zinc-500 hover:text-white'}`}><Unlock className="w-3 h-3" /> {t('clients.history.title')} ({myHistoryClients.length})</button>
         </div>
      )}

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
        <input 
          type="text"
          placeholder={canViewContacts ? t('clients.searchPlaceholder') : t('common.search') + '...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-all"
        />
      </div>

      {!hasLoyalty && (
        <div className="mb-4 rounded-xl border border-dashed border-amber-500/60 bg-zinc-900/60 p-3 text-[11px] text-amber-200">
          Programa de fidelidade disponível nos planos <strong>Solo PRO</strong> e acima.
        </div>
      )}

      {/* Client List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-20">
        {filteredClients.map((client) => {
             const returnStatus = getReturnStatus(client.lastVisit);
             const points = client.loyaltyPoints || 0;
             const cardStyle = getStatusStyles(returnStatus.status);
             const isLoyalToMe = client.preferredStaffId === currentUser.id;
             const hasDependents = client.dependents && client.dependents.length > 0;

             const textPrimary = returnStatus.status === 'LOST' ? 'text-white' : 'text-white';
             const textSecondary = returnStatus.status === 'LOST' ? 'text-white/80' : 'text-zinc-400';
             const iconColor = returnStatus.status === 'LOST' ? 'text-white' : 'text-zinc-600';

             return (
               <button 
                 key={client.id} 
                 onClick={() => handleClientClick(client)}
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
           })
        }
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 md:bg-black/70 md:backdrop-blur-sm p-0 md:p-4">
          <div className="bg-zinc-900 w-full h-full md:h-auto md:max-w-md md:rounded-2xl border-0 md:border border-zinc-800 p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white">Add New Client</h3>
               <button onClick={() => setIsModalOpen(false)} className="bg-zinc-800 p-2 rounded-full text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-4">
              <div><label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">Nome Completo *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 text-lg md:text-base" /></div>
              <div><label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">Número de Telefone *</label><input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 text-lg md:text-base" /></div>
              
              <div><label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="cliente@email.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 text-lg md:text-base" /></div>
              
              <div><label className="block text-sm md:text-xs font-bold text-zinc-500 uppercase mb-2">Data de Nascimento</label><input type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 text-lg md:text-base" /></div>
              
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4">
                <label className="block text-sm md:text-xs font-bold text-emerald-400 uppercase mb-2 flex items-center gap-2">
                  <Gift className="w-4 h-4" /> Código de Indicação
                </label>
                <input 
                  type="text" 
                  value={formData.referrerCode} 
                  onChange={(e) => setFormData({...formData, referrerCode: e.target.value.toUpperCase()})} 
                  placeholder="Ex: JOAO123"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 text-lg md:text-base uppercase"
                />
                <p className="text-[10px] text-zinc-500 mt-2">Se o cliente foi indicado por alguém, insira o código aqui.</p>
              </div>
              
              {/* Dependents Section */}
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                 <label className="block text-xs font-bold text-white mb-2 uppercase flex items-center gap-2"><Users className="w-3 h-3 text-amber-500" /> Dependents (Family)</label>
                 <div className="flex gap-2 mb-2">
                    <input type="text" placeholder="Name (e.g. Son)" value={newDependentName} onChange={e => setNewDependentName(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm text-white focus:border-amber-500 outline-none" />
                    <button type="button" onClick={handleAddDependent} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 rounded-lg text-sm font-bold">+</button>
                 </div>
                 <div className="space-y-2">
                    {formData.dependents.map((dep, idx) => (
                       <div key={idx} className="flex justify-between items-center text-sm bg-zinc-900 p-2 rounded border border-zinc-800">
                          <span className="text-zinc-300">{dep.name}</span>
                          <button type="button" onClick={() => removeDependent(dep.id)} className="text-red-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex gap-3 mt-8 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 md:py-3 text-zinc-400 font-medium hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-4 md:py-3 rounded-xl transition-all">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Detail / CRM Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900 md:bg-black/70 md:backdrop-blur-sm p-0 md:p-4">
           <div className="bg-zinc-900 w-full h-full md:h-[650px] md:max-w-2xl md:rounded-2xl border-0 md:border border-zinc-800 flex flex-col shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-950/50">
                 <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-zinc-950 font-bold text-2xl shadow-lg shadow-amber-500/20">{selectedClient.name.charAt(0)}</div>
                    <div className="flex-1">
                       <h2 className="text-2xl font-bold text-white">{selectedClient.name}</h2>
                       <div className="flex flex-col gap-2 mt-2">
                          {/* Contact Info */}
                          <div className="flex items-center gap-3 text-sm text-zinc-400">
                             {canViewContacts && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedClient.phone}</span>}
                          </div>
                          
                          {/* QUICK ADD DEPENDENT BUTTON */}
                          <button 
                             onClick={() => setActiveDetailTab('DEPENDENTS')}
                             className="w-max text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors"
                          >
                             <UserPlus className="w-3 h-3 text-amber-500" /> Add Dependent
                          </button>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedClient(null)} className="text-zinc-500 hover:text-white transition-colors bg-zinc-800 p-2 rounded-full"><X className="w-6 h-6" /></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-zinc-800 bg-zinc-900 overflow-x-auto">
                 <button onClick={() => setActiveDetailTab('HISTORY')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${activeDetailTab === 'HISTORY' ? 'border-amber-500 text-white bg-zinc-800/50' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}><History className="w-4 h-4" /> History</button>
                 <button onClick={() => setActiveDetailTab('DEPENDENTS')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${activeDetailTab === 'DEPENDENTS' ? 'border-amber-500 text-white bg-zinc-800/50' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}><Users className="w-4 h-4" /> Dependents</button>
                 <button onClick={() => setActiveDetailTab('NOTES')} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${activeDetailTab === 'NOTES' ? 'border-amber-500 text-white bg-zinc-800/50' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}><FileText className="w-4 h-4" /> Notes</button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-zinc-900">
                 {/* LOYALTY CARD SUMMARY (Always Visible on History Tab IF FEATURE ENABLED) */}
                 {activeDetailTab === 'HISTORY' && hasLoyalty && (
                    <div className="mb-6 bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                       <div>
                          <h4 className="text-amber-500 font-bold flex items-center gap-2 text-sm uppercase tracking-wide"><Gift className="w-4 h-4" /> Loyalty Card</h4>
                          <p className="text-zinc-400 text-xs mt-1">10 stamps = Free Cut</p>
                       </div>
                       <div className="flex items-center gap-1">
                          {Array.from({length: 10}).map((_, i) => (
                             <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center border ${i < (selectedClient.loyaltyPoints || 0) ? 'bg-amber-500 border-amber-500 text-zinc-900' : 'border-zinc-700 bg-zinc-800 text-zinc-600'}`}>
                                <Star className="w-3 h-3 fill-current" />
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {activeDetailTab === 'HISTORY' && (
                    <div className="space-y-4">
                       <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Recent Appointments</h4>
                       {clientHistory.length === 0 ? <div className="text-center py-10 text-zinc-500"><Clock className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No completed services yet.</p></div> : clientHistory.map(appt => (
                          <div key={appt.id} className="flex gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
                             <div className="flex flex-col items-center justify-center px-2 border-r border-zinc-800 text-zinc-400 min-w-[60px]"><span className="text-sm font-bold">{format(appt.date, 'MMM')}</span><span className="text-xl font-bold text-white">{format(appt.date, 'd')}</span></div>
                             <div><h4 className="font-bold text-white text-lg">{appt.serviceName}</h4><p className="text-sm text-zinc-500">Provided by <span className="text-amber-500">{appt.staffId}</span></p><p className="text-xs text-zinc-600 mt-2">{format(appt.date, 'HH:mm')} • ${appt.price}</p></div>
                          </div>
                       ))}
                    </div>
                 )}
                 {activeDetailTab === 'DEPENDENTS' && (
                    <div className="space-y-6">
                       <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <h4 className="text-sm font-bold text-white mb-3">Add Family Member</h4>
                          <div className="flex gap-2 mb-2">
                             <input type="text" placeholder="Name (e.g. Son)" value={newDependentName} onChange={e => setNewDependentName(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 outline-none" />
                             <select value={newDependentStaffId} onChange={e => setNewDependentStaffId(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:border-amber-500 outline-none">
                                <option value="">Preferred Staff (Optional)</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                             </select>
                             <button onClick={handleAddDependent} className="bg-amber-500 text-zinc-900 font-bold px-4 rounded-lg">Add</button>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-xs font-bold text-zinc-500 uppercase">Registered Dependents</h4>
                          {(selectedClient.dependents || []).length === 0 ? <p className="text-zinc-500 text-sm italic">No dependents listed.</p> : (selectedClient.dependents || []).map(dep => (
                             <div key={dep.id} className="flex justify-between items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">{dep.name.charAt(0)}</div>
                                   <div>
                                      <p className="font-bold text-white text-sm">{dep.name}</p>
                                      <p className="text-xs text-zinc-500">{dep.preferredStaffId ? `Prefers: ${staff.find(s => s.id === dep.preferredStaffId)?.name}` : 'No preference'}</p>
                                   </div>
                                </div>
                                <button onClick={() => removeDependent(dep.id)} className="text-zinc-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
                 {activeDetailTab === 'NOTES' && (
                    <div className="h-full flex flex-col space-y-6">
                       {/* Tags Section */}
                       <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <ClientTagsManager
                             tags={selectedClient.tags || []}
                             onToggleTag={(tag: ClientTag) => {
                                const currentTags = selectedClient.tags || [];
                                const newTags = currentTags.includes(tag)
                                   ? currentTags.filter(t => t !== tag)
                                   : [...currentTags, tag];
                                updateClient({ ...selectedClient, tags: newTags });
                                setSelectedClient({ ...selectedClient, tags: newTags });
                             }}
                          />
                       </div>

                       {/* Preferences Section */}
                       <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <ClientPreferencesEditor
                             preferences={selectedClient.preferences || {}}
                             services={services}
                             products={products}
                             onSave={(prefs) => {
                                updateClient({ ...selectedClient, preferences: prefs });
                                setSelectedClient({ ...selectedClient, preferences: prefs });
                             }}
                          />
                       </div>

                       {/* Notes Section */}
                       <div className="flex-1 flex flex-col">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Private Barber Notes</label>
                          <textarea className="flex-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:border-amber-500 outline-none resize-none leading-relaxed min-h-[100px]" placeholder="E.g. Likes skin fade..." value={noteText} onChange={(e) => setNoteText(e.target.value)}></textarea>
                          <div className="mt-4 flex justify-end"><button onClick={saveNotes} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 md:py-2.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all"><Save className="w-4 h-4" /> Save Notes</button></div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
