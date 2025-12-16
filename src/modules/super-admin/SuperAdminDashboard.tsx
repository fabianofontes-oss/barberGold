'use client';

import React, { useState, useEffect } from 'react';
import { useBarber } from '@/context/BarberContext';
import { SAAS_PLANS_BR } from '@/constants';
import { SaasPlanId } from '@/types';
import { 
  Building2, Users, DollarSign, Activity, Search, 
  Plus, Shield, Lock, ExternalLink, Trash2,
  CheckCircle, Globe, Server, Zap, RefreshCw, Eye,
  Ghost, Skull, Gift, AlertOctagon, Terminal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';

// MOCK LIVE EVENTS (Unchanged)
const EVENT_TEMPLATES = [
   { text: "Barbearia do Zé: Novo agendamento (Corte + Barba)", type: "BOOKING" },
   { text: "Premium Gold: Venda realizada ($85.00)", type: "SALE", value: 85 },
   { text: "Vintage Cuts: Novo cliente cadastrado", type: "USER" },
   { text: "Elite Grooming: Login do Admin", type: "AUTH" },
   { text: "Barbearia do Zé: Fechamento de Caixa", type: "FINANCE" },
   { text: "System: Backup automático iniciado", type: "SYSTEM" },
   { text: "System: High memory usage detected on Node-3", type: "ALERT" }
];

export const SuperAdminDashboard = () => {
  const { tenants, addTenant, updateTenantStatus, updateTenantPlan, impersonateTenant, saasPlans } = useBarber();
  const [searchQuery, setSearchQuery] = useState('');
  
  // LIVE FEED SIMULATION
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState(124);
  const [serverLoad, setServerLoad] = useState(12);

  useEffect(() => {
     const interval = setInterval(() => {
        const randomEvent = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
        const event = { ...randomEvent, id: Date.now(), time: new Date() };
        
        setLiveFeed(prev => [event, ...prev].slice(0, 10)); // Keep last 10
        setActiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1)); // Fluctuate users
        setServerLoad(prev => Math.min(100, Math.max(0, prev + (Math.random() * 4 - 2))));
     }, 2500);
     return () => clearInterval(interval);
  }, []);

  // Filter Logic
  const filteredTenants = tenants.filter(t => 
     t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalMRR = tenants.reduce((acc, t) => t.status === 'ACTIVE' ? acc + t.monthlyFee : acc, 0);
  const activeShops = tenants.filter(t => t.status === 'ACTIVE').length;
  const suspendedShops = tenants.filter(t => t.status === 'SUSPENDED').length;

  const getStatusColor = (status: string) => {
     switch(status) {
        case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'SUSPENDED': return 'bg-red-500/10 text-red-500 border-red-500/20';
        default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
     }
  };

  const chartData = [
     { name: 'Jan', mrr: 4000, users: 120 },
     { name: 'Feb', mrr: 4500, users: 180 },
     { name: 'Mar', mrr: 5200, users: 240 },
     { name: 'Apr', mrr: 6100, users: 310 },
     { name: 'May', mrr: 7500, users: 450 },
     { name: 'Jun', mrr: 8200, users: 520 },
  ];

  // GOD ACTIONS
  const handleNuke = (id: string) => {
     if (confirm('⚠️ GOD MODE ALERT: Suspend this tenant immediately? All access will be blocked.')) {
        updateTenantStatus(id, 'SUSPENDED');
     }
  };

  const handleBless = (id: string) => {
     alert('✨ Tenant Blessed! (Feature: Would apply 100% discount for next cycle)');
  };

  const handlePlanChange = (tenantId: string, newPlanId: string) => {
     updateTenantPlan(tenantId, newPlanId as SaasPlanId);
  };

  return (
    <div className="space-y-6 animate-fade-in bg-zinc-950 min-h-screen pb-20">
       {/* GOD MODE HEADER */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6 bg-zinc-950 sticky top-0 z-20 pt-2">
          <div>
             <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                <Shield className="w-8 h-8 text-indigo-500" /> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                   God Mode
                </span>
             </h2>
             <p className="text-zinc-400 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Healthy • Latency: 24ms
             </p>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Active Users</span>
                <span className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-2">
                   {activeUsers} <Users className="w-4 h-4 opacity-50" />
                </span>
             </div>
             <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Server Load</span>
                <span className={`text-xl font-bold font-mono flex items-center gap-2 ${serverLoad > 80 ? 'text-red-500' : 'text-blue-400'}`}>
                   {serverLoad.toFixed(1)}% <Server className="w-4 h-4 opacity-50" />
                </span>
             </div>
          </div>
       </div>

       {/* MAIN KPI GRID */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign className="w-16 h-16 text-indigo-500"/></div>
             <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Total SaaS MRR</p>
             <h3 className="text-3xl font-bold text-white mb-1">${totalMRR.toFixed(2)}</h3>
             <span className="text-emerald-500 text-xs font-bold flex items-center gap-1"><Zap className="w-3 h-3"/> +12% vs last month</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Globe className="w-16 h-16 text-emerald-500"/></div>
             <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Active Tenants</p>
             <h3 className="text-3xl font-bold text-white mb-1">{activeShops}</h3>
             <span className="text-zinc-400 text-xs">across 4 regions</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><AlertOctagon className="w-16 h-16 text-red-500"/></div>
             <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Churn / Suspended</p>
             <h3 className="text-3xl font-bold text-white mb-1">{suspendedShops}</h3>
             <span className="text-red-400 text-xs font-bold">Action Required</span>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-center items-center text-center cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => addTenant({ name: 'New Shop', ownerName: 'Owner', email: 'new@shop.com', phone: '', planId: 'SOLO', monthlyFee: 49 })}>
             <Plus className="w-10 h-10 text-white mb-2" />
             <h3 className="text-white font-bold">Deploy New Tenant</h3>
             <p className="text-indigo-200 text-xs">Manual Onboarding</p>
          </div>
       </div>

       {/* OPS CENTER: CHARTS & TERMINAL */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
          
          {/* GROWTH CHART */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative flex flex-col">
             <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" /> Revenue & Growth
             </h3>
             <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs>
                         <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                      <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* LIVE TERMINAL */}
          <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden flex flex-col font-mono text-xs shadow-2xl">
             <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex gap-2 items-center">
                <div className="flex gap-1.5 ml-1">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="ml-3 text-zinc-500 flex items-center gap-2"><Terminal className="w-3 h-3"/> live_ops.log</span>
             </div>
             <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-black/50">
                {liveFeed.map((event) => (
                   <div key={event.id} className="flex gap-3 animate-fade-in-up">
                      <span className="text-zinc-600 select-none">[{format(event.time, 'HH:mm:ss')}]</span>
                      <div className="flex-1">
                         <span className={`font-bold mr-2 ${
                            event.type === 'ALERT' ? 'text-red-500 bg-red-950/30 px-1 rounded' : 
                            event.type === 'SALE' ? 'text-emerald-400' : 
                            event.type === 'SYSTEM' ? 'text-blue-400' : 'text-zinc-300'
                         }`}>
                            {event.type}
                         </span>
                         <span className="text-zinc-400">{event.text}</span>
                      </div>
                   </div>
                ))}
                <div className="animate-pulse text-indigo-500">_</div>
             </div>
          </div>
       </div>

       {/* TENANT LIST (GOD VIEW) */}
       <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mt-2 shadow-xl">
          <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row justify-between gap-4 items-center bg-zinc-950/30">
             <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" /> Tenant Database
             </h3>
             
             <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input 
                   type="text" 
                   placeholder="Search ID, Name or Owner..." 
                   className="bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:border-indigo-500 outline-none w-full shadow-inner"
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold text-[10px] tracking-wider">
                   <tr>
                      <th className="px-6 py-4">Tenant Info</th>
                      <th className="px-6 py-4">Subscription</th>
                      <th className="px-6 py-4">Health</th>
                      <th className="px-6 py-4 text-right">Activity</th>
                      <th className="px-6 py-4 text-center">God Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                   {filteredTenants.map(tenant => {
                      // Lookup Plan Info
                      const plan = saasPlans.find(p => p.id === tenant.planId) || SAAS_PLANS_BR.find(p => p.id === tenant.planId);
                      
                      return (
                      <tr key={tenant.id} className="hover:bg-zinc-800/30 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center font-bold text-xs text-white border border-zinc-700">
                                  {tenant.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{tenant.name}</p>
                                  <p className="text-xs text-zinc-500">{tenant.ownerName}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                               {plan ? (
                                  <>
                                     <select 
                                        value={tenant.planId} 
                                        onChange={(e) => handlePlanChange(tenant.id, e.target.value)}
                                        className="bg-zinc-950 border border-zinc-800 px-2 py-1 rounded text-xs font-bold text-white outline-none focus:border-indigo-500 w-max"
                                     >
                                        {SAAS_PLANS_BR.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                     </select>
                                     <span className="text-[10px] text-zinc-500">
                                        R$ {plan.monthlyPriceBRL}/mo
                                     </span>
                                  </>
                               ) : (
                                  <span className="text-red-500 text-xs">Plan Missing ({tenant.planId})</span>
                               )}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 w-max ${getStatusColor(tenant.status)}`}>
                               {tenant.status === 'ACTIVE' && <CheckCircle className="w-3 h-3"/>}
                               {tenant.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right font-mono text-xs">
                            <div className="flex items-center justify-end gap-2">
                               <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500" style={{width: `${Math.random() * 100}%`}}></div>
                               </div>
                               <span className="text-zinc-500">2m</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                               <button 
                                  onClick={() => impersonateTenant(tenant.id)}
                                  className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
                                  title="Ghost Login (Impersonate)"
                               >
                                  <Ghost className="w-4 h-4" />
                               </button>
                               <button 
                                  onClick={() => handleBless(tenant.id)}
                                  className="p-2 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-500 rounded-lg transition-all"
                                  title="Bless (Credits/Fixes)"
                               >
                                  <Gift className="w-4 h-4" />
                               </button>
                               <button 
                                  onClick={() => handleNuke(tenant.id)}
                                  className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-all"
                                  title="Nuke (Suspend)"
                               >
                                  <Skull className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   );
                   })}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};
