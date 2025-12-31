'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { 
  Puzzle, Plus, Edit2, CheckCircle2, AlertCircle, 
  MessageCircle, Calendar, CreditCard, Zap, Smartphone, Bot,
  TrendingUp, Download, Eye, Tag
} from 'lucide-react';
import { Integration } from '@/types';

const ICON_MAP: Record<string, any> = {
   'MessageCircle': MessageCircle,
   'Calendar': Calendar,
   'CreditCard': CreditCard,
   'Zap': Zap,
   'Smartphone': Smartphone,
   'Bot': Bot
};

export const SuperAdminMarketplace = () => {
   const { integrations, updateIntegration } = useBarber();
   const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'BETA' | 'COMMUNICATION' | 'PAYMENT'>('ALL');
   const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);

   const filtered = integrations.filter(i => {
      if (activeTab === 'ALL') return true;
      if (activeTab === 'ACTIVE') return i.status === 'ACTIVE';
      if (activeTab === 'BETA') return i.status === 'BETA';
      return i.category === activeTab;
   });

   const handleSave = () => {
      if (editingIntegration) {
         updateIntegration(editingIntegration);
         setEditingIntegration(null);
      }
   };

   return (
      <div className="min-h-screen bg-zinc-950 space-y-6 animate-fade-in pb-20">
         <div className="border-b border-zinc-800 pb-6 flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                  <Puzzle className="w-8 h-8 text-purple-500" /> App Store HQ
               </h2>
               <p className="text-zinc-400 text-sm">Manage integrations, add-ons, and platform extensions.</p>
            </div>
            <button 
               className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
            >
               <Plus className="w-5 h-5" /> New Integration
            </button>
         </div>

         {/* FILTER TABS */}
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-zinc-800/50">
            {['ALL', 'ACTIVE', 'BETA', 'COMMUNICATION', 'PAYMENT'].map(tab => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                     activeTab === tab 
                     ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                     : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                  }`}
               >
                  {tab}
               </button>
            ))}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => {
               const Icon = ICON_MAP[item.icon] || Zap;
               return (
                  <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-purple-500/30 transition-all relative">
                     {/* Status Badge */}
                     <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded uppercase border ${
                        item.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        item.status === 'BETA' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        item.status === 'DEPRECATED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-zinc-800 text-zinc-500 border-zinc-700'
                     }`}>
                        {item.status.replace('_', ' ')}
                     </div>

                     <div className="p-6">
                        <div className="w-14 h-14 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform duration-500">
                           <Icon className={`w-8 h-8 ${item.category === 'COMMUNICATION' ? 'text-green-500' : item.category === 'PAYMENT' ? 'text-blue-500' : 'text-purple-500'}`} />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-sm text-zinc-400 h-10 mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mb-6">
                           <span className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                              <Download className="w-3 h-3" /> {item.installCount} Installs
                           </span>
                           <span className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                              <Tag className="w-3 h-3" /> {item.price > 0 ? `$${item.price}/mo` : 'Free'}
                           </span>
                        </div>

                        <div className="flex gap-2">
                           <button 
                              onClick={() => setEditingIntegration(item)}
                              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                           >
                              <Edit2 className="w-4 h-4" /> Manage
                           </button>
                           {item.isFeatured ? (
                              <button 
                                 onClick={() => updateIntegration({...item, isFeatured: false})}
                                 className="px-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-all"
                                 title="Remove from Featured"
                              >
                                 <Zap className="w-4 h-4 fill-current" />
                              </button>
                           ) : (
                              <button 
                                 onClick={() => updateIntegration({...item, isFeatured: true})}
                                 className="px-3 bg-zinc-800 text-zinc-500 rounded-xl hover:text-amber-500 transition-all"
                                 title="Feature this App"
                              >
                                 <Zap className="w-4 h-4" />
                              </button>
                           )}
                        </div>
                     </div>
                     
                     {/* Revenue Mini-Chart Visual */}
                     <div className="h-1.5 w-full bg-zinc-950 flex">
                        <div className={`h-full ${item.installCount > 100 ? 'bg-emerald-500' : 'bg-purple-500'}`} style={{ width: `${Math.min(100, item.installCount / 3)}%` }}></div>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* EDIT MODAL */}
         {editingIntegration && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
               <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md p-6 shadow-2xl animate-fade-in">
                  <h3 className="text-xl font-bold text-white mb-6">Edit Integration</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Name</label>
                        <input type="text" value={editingIntegration.name} onChange={e => setEditingIntegration({...editingIntegration, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Pricing (Monthly)</label>
                        <input type="number" value={editingIntegration.price} onChange={e => setEditingIntegration({...editingIntegration, price: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Status</label>
                        <select value={editingIntegration.status} onChange={e => setEditingIntegration({...editingIntegration, status: e.target.value as any})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none">
                           <option value="ACTIVE">Active (Public)</option>
                           <option value="BETA">Beta (Invite Only)</option>
                           <option value="COMING_SOON">Coming Soon</option>
                           <option value="DEPRECATED">Deprecated</option>
                        </select>
                     </div>
                     <div className="flex gap-3 pt-4">
                        <button onClick={() => setEditingIntegration(null)} className="flex-1 py-3 text-zinc-500 hover:text-white font-bold">Cancel</button>
                        <button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl shadow-lg">Save Changes</button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
