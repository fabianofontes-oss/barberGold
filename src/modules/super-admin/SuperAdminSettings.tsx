'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { 
  Settings, Save, Globe, Lock, CreditCard, Clock, 
  AlertTriangle, RefreshCw, Key, ShieldCheck 
} from 'lucide-react';

export const SuperAdminSettings = () => {
   const { globalSettings, updateGlobalSettings } = useBarber();
   const [activeTab, setActiveTab] = useState<'GENERAL' | 'PAYMENTS' | 'SECURITY'>('GENERAL');
   const [isSaving, setIsSaving] = useState(false);
   
   // Local state for form, synced with context on load
   const [config, setConfig] = useState(globalSettings);

   const handleSave = () => {
      setIsSaving(true);
      updateGlobalSettings(config);
      setTimeout(() => setIsSaving(false), 1000);
   };

   return (
      <div className="min-h-screen bg-zinc-950 space-y-6 animate-fade-in pb-20">
         <div className="border-b border-zinc-800 pb-6 flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                  <Settings className="w-8 h-8 text-zinc-400" /> Global Settings
               </h2>
               <p className="text-zinc-400 text-sm">Configure platform-wide variables and integrations.</p>
            </div>
            <button 
               onClick={handleSave}
               className="bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
               {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
         </div>

         {/* Tabs */}
         <div className="flex border-b border-zinc-800">
            <button onClick={() => setActiveTab('GENERAL')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'GENERAL' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>General</button>
            <button onClick={() => setActiveTab('PAYMENTS')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PAYMENTS' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Gateways</button>
            <button onClick={() => setActiveTab('SECURITY')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'SECURITY' ? 'border-red-500 text-red-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Danger Zone</button>
         </div>

         <div className="max-w-4xl pt-4">
            
            {/* GENERAL TAB */}
            {activeTab === 'GENERAL' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                     <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-indigo-500" /> Platform Identity</h3>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Platform Name</label>
                           <input 
                              type="text" 
                              value={config.appName}
                              onChange={e => setConfig({...config, appName: e.target.value})}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Base Currency</label>
                           <select 
                              value={config.currency}
                              onChange={e => setConfig({...config, currency: e.target.value})}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                           >
                              <option value="USD">USD ($)</option>
                              <option value="BRL">BRL (R$)</option>
                              <option value="EUR">EUR (€)</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                     <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /> Onboarding & Trial</h3>
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm text-zinc-300 font-medium">Default Free Trial Duration</p>
                           <p className="text-xs text-zinc-500">Days given to new tenants upon signup.</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <input 
                              type="number" 
                              value={config.trialDays}
                              onChange={e => setConfig({...config, trialDays: Number(e.target.value)})}
                              className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white text-center font-bold"
                           />
                           <span className="text-zinc-500 text-sm">days</span>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'PAYMENTS' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                     <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-emerald-500" /> Master Billing Gateway</h3>
                     <p className="text-sm text-zinc-400 mb-6">
                        This API Key is used to process subscription payments for all tenants.
                     </p>
                     
                     <div className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Stripe Secret Key</label>
                           <div className="relative">
                              <Key className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                              <input 
                                 type="password" 
                                 value={config.stripeKey}
                                 onChange={e => setConfig({...config, stripeKey: e.target.value})}
                                 className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-300 font-mono focus:border-emerald-500 outline-none"
                              />
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-lg transition-colors">Test Connection</button>
                           <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-lg transition-colors">Rotate Keys</button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'SECURITY' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-6">
                     <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Operational Controls</h3>
                     
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm text-white font-bold">New Signups</p>
                              <p className="text-xs text-zinc-500">Allow new tenants to register automatically.</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={config.enableSignup} onChange={e => setConfig({...config, enableSignup: e.target.checked})} className="sr-only peer" />
                              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                           </label>
                        </div>

                        <hr className="border-red-900/20" />

                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm text-red-200 font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Global Maintenance Mode</p>
                              <p className="text-xs text-red-300/50">Disconnects all users and shows maintenance page. Danger!</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={config.enableMaintenance} onChange={e => setConfig({...config, enableMaintenance: e.target.checked})} className="sr-only peer" />
                              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                           </label>
                        </div>
                     </div>
                  </div>
               </div>
            )}

         </div>
      </div>
   );
};
