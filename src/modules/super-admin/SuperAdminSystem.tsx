'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server, Activity, AlertTriangle, Terminal, 
  Send, Bell, CheckCircle, Database, Cpu, HardDrive, Wifi, Lock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const MOCK_LOGS = [
   { id: '1', level: 'INFO', msg: 'Backup completed successfully (2.4GB)', time: '10:00:01', source: 'System' },
   { id: '2', level: 'SUCCESS', msg: 'New tenant registered: BarberKing', time: '10:05:22', source: 'Auth' },
   { id: '3', level: 'WARNING', msg: 'High latency detected on US-East-1', time: '10:12:45', source: 'Network' },
   { id: '4', level: 'INFO', msg: 'Payment webhook received: $45.00', time: '10:15:30', source: 'Stripe' },
   { id: '5', level: 'ERROR', msg: 'Failed to send email to user@test.com', time: '10:18:11', source: 'EmailSvc' },
   { id: '6', level: 'INFO', msg: 'User login: admin_master', time: '10:20:00', source: 'Auth' },
];

const HEALTH_DATA = [
   { time: '00:00', cpu: 12, ram: 40 },
   { time: '04:00', cpu: 15, ram: 42 },
   { time: '08:00', cpu: 45, ram: 60 },
   { time: '12:00', cpu: 65, ram: 75 },
   { time: '16:00', cpu: 55, ram: 70 },
   { time: '20:00', cpu: 30, ram: 50 },
];

export const SuperAdminSystem = () => {
   const [logs, setLogs] = useState(MOCK_LOGS);
   const [broadcastMsg, setBroadcastMsg] = useState('');
   const [broadcastType, setBroadcastType] = useState<'INFO' | 'WARNING' | 'CRITICAL'>('INFO');
   const [isSending, setIsSending] = useState(false);

   // Mock Live Logs
   useEffect(() => {
      const interval = setInterval(() => {
         const newLog = {
            id: Date.now().toString(),
            level: Math.random() > 0.9 ? 'WARNING' : 'INFO',
            msg: `Heartbeat check: Service ${Math.random() > 0.5 ? 'OK' : 'Syncing'}`,
            time: format(new Date(), 'HH:mm:ss'),
            source: 'Monitor'
         };
         setLogs(prev => [newLog, ...prev].slice(0, 10));
      }, 3000);
      return () => clearInterval(interval);
   }, []);

   const handleBroadcast = (e: React.FormEvent) => {
      e.preventDefault();
      if (!broadcastMsg) return;
      
      setIsSending(true);
      setTimeout(() => {
         alert(`Broadcast Sent to ALL Tenants: [${broadcastType}] ${broadcastMsg}`);
         setBroadcastMsg('');
         setIsSending(false);
         // Add to logs
         setLogs(prev => [{
            id: Date.now().toString(),
            level: 'SUCCESS',
            msg: `BROADCAST SENT: ${broadcastMsg}`,
            time: format(new Date(), 'HH:mm:ss'),
            source: 'Admin'
         }, ...prev]);
      }, 1500);
   };

   return (
      <div className="min-h-screen bg-zinc-950 space-y-6 animate-fade-in pb-20">
         <div className="border-b border-zinc-800 pb-6 flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                  <Server className="w-8 h-8 text-red-500" /> System Operations
               </h2>
               <p className="text-zinc-400 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Production Environment • v2.4.0
               </p>
            </div>
            <div className="flex gap-4">
               <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-right">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Uptime</span>
                  <span className="text-emerald-400 font-mono font-bold">99.98%</span>
               </div>
               <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-right">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Latency</span>
                  <span className="text-white font-mono font-bold">24ms</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* HEALTH METRICS */}
            <div className="lg:col-span-2 space-y-6">
               <div className="grid grid-cols-3 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
                     <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Cpu className="w-6 h-6"/></div>
                     <div>
                        <p className="text-xs text-zinc-500 font-bold uppercase">CPU Load</p>
                        <p className="text-xl font-bold text-white font-mono">42%</p>
                     </div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
                     <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500"><HardDrive className="w-6 h-6"/></div>
                     <div>
                        <p className="text-xs text-zinc-500 font-bold uppercase">RAM Usage</p>
                        <p className="text-xl font-bold text-white font-mono">6.2GB</p>
                     </div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
                     <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500"><Database className="w-6 h-6"/></div>
                     <div>
                        <p className="text-xs text-zinc-500 font-bold uppercase">DB Connections</p>
                        <p className="text-xl font-bold text-white font-mono">342</p>
                     </div>
                  </div>
               </div>

               <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                     <Activity className="w-5 h-5 text-zinc-500" /> Resource Usage (24h)
                  </h3>
                  <div className="h-[250px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={HEALTH_DATA}>
                           <defs>
                              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                           <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                           <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                           <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                           <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                           <Area type="monotone" dataKey="ram" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" name="RAM %" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* TERMINAL LOGS */}
               <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden font-mono text-xs">
                  <div className="bg-zinc-900 border-b border-zinc-800 p-2 flex gap-2 items-center">
                     <div className="flex gap-1.5 ml-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                     </div>
                     <span className="ml-2 text-zinc-500 flex items-center gap-1"><Terminal className="w-3 h-3"/> system.log</span>
                  </div>
                  <div className="p-4 h-[200px] overflow-y-auto space-y-1">
                     {logs.map(log => (
                        <div key={log.id} className="flex gap-3">
                           <span className="text-zinc-600">[{log.time}]</span>
                           <span className={`font-bold w-16 ${
                              log.level === 'ERROR' ? 'text-red-500' : 
                              log.level === 'WARNING' ? 'text-amber-500' : 
                              log.level === 'SUCCESS' ? 'text-emerald-500' : 'text-blue-400'
                           }`}>{log.level}</span>
                           <span className="text-zinc-500 w-20">[{log.source}]</span>
                           <span className="text-zinc-300">{log.msg}</span>
                        </div>
                     ))}
                     <div className="animate-pulse text-zinc-500">_</div>
                  </div>
               </div>
            </div>

            {/* BROADCAST CONTROL */}
            <div className="space-y-6">
               <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <Wifi className="w-24 h-24 text-white" />
                  </div>
                  
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                     <Bell className="w-5 h-5 text-amber-500" /> Global Broadcast
                  </h3>
                  <p className="text-zinc-400 text-xs mb-4">
                     Send a push notification to ALL active tenants instantly. Use for maintenance alerts or critical updates.
                  </p>

                  <form onSubmit={handleBroadcast} className="space-y-4 relative z-10">
                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Severity Level</label>
                        <div className="grid grid-cols-3 gap-2">
                           <button type="button" onClick={() => setBroadcastType('INFO')} className={`py-2 rounded-lg text-xs font-bold border ${broadcastType === 'INFO' ? 'bg-blue-500/20 text-blue-400 border-blue-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>INFO</button>
                           <button type="button" onClick={() => setBroadcastType('WARNING')} className={`py-2 rounded-lg text-xs font-bold border ${broadcastType === 'WARNING' ? 'bg-amber-500/20 text-amber-500 border-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>WARN</button>
                           <button type="button" onClick={() => setBroadcastType('CRITICAL')} className={`py-2 rounded-lg text-xs font-bold border ${broadcastType === 'CRITICAL' ? 'bg-red-500/20 text-red-500 border-red-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>CRIT</button>
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Message</label>
                        <textarea 
                           required
                           value={broadcastMsg}
                           onChange={e => setBroadcastMsg(e.target.value)}
                           placeholder="System will undergo maintenance..."
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none h-32 resize-none"
                        />
                     </div>

                     <button 
                        type="submit" 
                        disabled={isSending || !broadcastMsg}
                        className="w-full bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20"
                     >
                        {isSending ? 'Transmitting...' : (
                           <><Send className="w-4 h-4" /> DISPATCH BROADCAST</>
                        )}
                     </button>
                  </form>
               </div>

               {/* MAINTENANCE MODE */}
               <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                     <Lock className="w-5 h-5 text-red-500" />
                     <h3 className="font-bold text-red-100">Emergency Lockdown</h3>
                  </div>
                  <p className="text-xs text-red-300/60 mb-4">
                     Immediately prevent new logins and enable maintenance page for all tenants.
                  </p>
                  <button className="w-full border border-red-800 text-red-500 hover:bg-red-900/20 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">
                     Enable Maintenance Mode
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};
