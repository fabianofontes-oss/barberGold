'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { 
  Megaphone, Plus, Bell, Smartphone, Monitor, Zap, 
  Target, Rocket, MousePointer2, Eye, BarChart2, X, Check
} from 'lucide-react';
import { MarketingCampaign } from '@/types';
import { format } from 'date-fns';

export const SuperAdminMarketing = () => {
   const { marketingCampaigns, addMarketingCampaign, deleteMarketingCampaign } = useBarber();
   const [isCreating, setIsCreating] = useState(false);
   const [newCampaign, setNewCampaign] = useState<Partial<MarketingCampaign>>({
      title: '',
      content: '',
      type: 'BANNER',
      targetAudience: 'ALL',
      status: 'DRAFT'
   });

   const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      if (newCampaign.title && newCampaign.content) {
         addMarketingCampaign({
            ...newCampaign,
            id: Date.now().toString(),
            clicks: 0,
            views: 0,
            createdAt: new Date()
         } as MarketingCampaign);
         setIsCreating(false);
         setNewCampaign({ title: '', content: '', type: 'BANNER', targetAudience: 'ALL', status: 'DRAFT' });
      }
   };

   return (
      <div className="min-h-screen bg-zinc-950 space-y-6 animate-fade-in pb-20">
         <div className="border-b border-zinc-800 pb-6 flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                  <Megaphone className="w-8 h-8 text-pink-500" /> Marketing HQ
               </h2>
               <p className="text-zinc-400 text-sm">Create global announcements, upsell campaigns, and system alerts.</p>
            </div>
            <button 
               onClick={() => setIsCreating(true)}
               className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all"
            >
               <Plus className="w-5 h-5" /> New Campaign
            </button>
         </div>

         {/* STATS OVERVIEW */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
               <div className="p-3 bg-pink-500/10 rounded-lg text-pink-500"><Rocket className="w-6 h-6"/></div>
               <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase">Active Campaigns</p>
                  <p className="text-2xl font-bold text-white">{marketingCampaigns.filter(c => c.status === 'ACTIVE').length}</p>
               </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
               <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Eye className="w-6 h-6"/></div>
               <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase">Total Impressions</p>
                  <p className="text-2xl font-bold text-white">{marketingCampaigns.reduce((acc, c) => acc + c.views, 0).toLocaleString()}</p>
               </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
               <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500"><MousePointer2 className="w-6 h-6"/></div>
               <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase">Total Clicks</p>
                  <p className="text-2xl font-bold text-white">{marketingCampaigns.reduce((acc, c) => acc + c.clicks, 0).toLocaleString()}</p>
               </div>
            </div>
         </div>

         {/* CAMPAIGN LIST */}
         <div className="grid grid-cols-1 gap-4">
            {marketingCampaigns.map(camp => (
               <div key={camp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 relative group overflow-hidden">
                  {/* Status Indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${camp.status === 'ACTIVE' ? 'bg-emerald-500' : camp.status === 'DRAFT' ? 'bg-zinc-700' : 'bg-blue-500'}`}></div>

                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${camp.type === 'BANNER' ? 'bg-purple-500/10 text-purple-400' : camp.type === 'MODAL' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                           {camp.type}
                        </span>
                        <h3 className="font-bold text-white text-lg">{camp.title}</h3>
                        {camp.status === 'ACTIVE' && <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase animate-pulse"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Live</span>}
                     </div>
                     <p className="text-zinc-400 text-sm mb-4">{camp.content}</p>
                     
                     <div className="flex items-center gap-6 text-xs text-zinc-500">
                        <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Target: <b className="text-zinc-300">{camp.targetAudience.replace('_', ' ')}</b></span>
                        <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> Created: {format(camp.createdAt, 'dd MMM')}</span>
                     </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6">
                     <div className="text-center">
                        <span className="block text-xl font-bold text-white">{camp.views}</span>
                        <span className="text-[10px] text-zinc-500 uppercase">Views</span>
                     </div>
                     <div className="text-center">
                        <span className="block text-xl font-bold text-emerald-400">{camp.clicks}</span>
                        <span className="text-[10px] text-zinc-500 uppercase">Clicks</span>
                     </div>
                     <div className="text-center">
                        <span className="block text-xl font-bold text-blue-400">{camp.views > 0 ? ((camp.clicks / camp.views) * 100).toFixed(1) : 0}%</span>
                        <span className="text-[10px] text-zinc-500 uppercase">CTR</span>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                     <button onClick={() => deleteMarketingCampaign(camp.id)} className="p-2 bg-zinc-800 hover:bg-red-500 hover:text-white text-zinc-500 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            ))}
         </div>

         {/* CREATE MODAL */}
         {isCreating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
               <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-lg p-6 shadow-2xl animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2"><Rocket className="w-5 h-5 text-pink-500" /> Launch Campaign</h3>
                     <button onClick={() => setIsCreating(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Campaign Title</label>
                        <input required type="text" value={newCampaign.title} onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-pink-500 outline-none" placeholder="e.g. Black Friday Deal" />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Type</label>
                           <select value={newCampaign.type} onChange={e => setNewCampaign({...newCampaign, type: e.target.value as any})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-pink-500 outline-none">
                              <option value="BANNER">Top Banner (Subtle)</option>
                              <option value="MODAL">Modal Popup (Aggressive)</option>
                              <option value="PUSH">Push Notification</option>
                              <option value="EMAIL">Email Blast</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Target Audience</label>
                           <select value={newCampaign.targetAudience} onChange={e => setNewCampaign({...newCampaign, targetAudience: e.target.value as any})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-pink-500 outline-none">
                              <option value="ALL">All Tenants</option>
                              <option value="FREE_PLAN">Free Plan Only (Upsell)</option>
                              <option value="PRO_PLAN">Pro Plan Only (Feature)</option>
                              <option value="INACTIVE">Inactive Shops (Winback)</option>
                           </select>
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Content / Message</label>
                        <textarea required rows={4} value={newCampaign.content} onChange={e => setNewCampaign({...newCampaign, content: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-pink-500 outline-none resize-none" placeholder="Enter your announcement..." />
                     </div>

                     <div className="grid grid-cols-2 gap-3 pt-4">
                        <button type="button" onClick={() => setNewCampaign({...newCampaign, status: 'DRAFT'})} className="py-3 rounded-xl border border-zinc-700 text-zinc-300 font-bold hover:bg-zinc-800">Save Draft</button>
                        <button type="submit" onClick={() => setNewCampaign({...newCampaign, status: 'ACTIVE'})} className="py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-lg shadow-pink-500/20">Launch Now</button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};
