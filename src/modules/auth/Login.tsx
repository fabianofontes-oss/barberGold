'use client';


import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { Scissors, Lock, Mail, ArrowRight, Shield, User, ChevronLeft } from 'lucide-react';

export const Login = () => {
  const { login, setView } = useBarber();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STAFF' | 'ADMIN'>('STAFF');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password);
    if (!success) {
       setError('Credenciais invÃ¡lidas. Tente novamente.');
    }
  };

  const handleDemoLogin = (type: 'OWNER' | 'ADMIN' | 'BARBER') => {
     if (type === 'OWNER') {
        setEmail('admin@barberflow.com');
        setPassword('admin');
        setRole('STAFF');
     } else if (type === 'ADMIN') {
        setEmail('master@hq.com');
        setPassword('root');
        setRole('ADMIN');
     } else {
        setEmail('mike@barberflow.com');
        setPassword('mike');
        setRole('STAFF');
     }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
       {/* Background Effect */}
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 z-0"></div>
       
       <button 
          onClick={() => setView('SAAS_LANDING')}
          className="absolute top-6 left-6 z-20 text-zinc-500 hover:text-white flex items-center gap-1 text-sm font-bold transition-colors"
       >
          <ChevronLeft className="w-4 h-4" /> Voltar para Home
       </button>

       <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
             <div className="w-20 h-20 bg-amber-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-2xl shadow-amber-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                <Scissors className="w-10 h-10 text-zinc-900" />
             </div>
             <h1 className="text-3xl font-bold text-white mb-2">BarberFlow</h1>
             <p className="text-zinc-400">Entre para gerenciar seu negÃ³cio.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
             {/* Role Switcher */}
             <div className="flex bg-zinc-950 p-1 rounded-xl mb-6 border border-zinc-800">
                <button 
                   onClick={() => setRole('STAFF')}
                   className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${role === 'STAFF' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                   <User className="w-4 h-4" /> Barbearia
                </button>
                <button 
                   onClick={() => setRole('ADMIN')}
                   className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 shadow border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                   <Shield className="w-4 h-4" /> HQ Office
                </button>
             </div>

             <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                   <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center font-bold">
                      {error}
                   </div>
                )}
                
                <div>
                   <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">E-mail</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                      <input 
                         type="email" 
                         value={email}
                         onChange={e => setEmail(e.target.value)}
                         className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-amber-500 outline-none transition-all"
                         placeholder="seu@email.com"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Senha</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                      <input 
                         type="password" 
                         value={password}
                         onChange={e => setPassword(e.target.value)}
                         className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-amber-500 outline-none transition-all"
                         placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      />
                   </div>
                </div>

                <button 
                   type="submit"
                   className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ${role === 'ADMIN' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-zinc-900'}`}
                >
                   Entrar <ArrowRight className="w-5 h-5" />
                </button>
             </form>

             <div className="mt-6 pt-6 border-t border-zinc-800">
                <p className="text-[10px] text-zinc-500 text-center mb-3 uppercase font-bold">Acesso RÃ¡pido (Demo)</p>
                <div className="flex gap-2 justify-center">
                   <button onClick={() => handleDemoLogin('OWNER')} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg border border-zinc-700">Dono</button>
                   <button onClick={() => handleDemoLogin('BARBER')} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg border border-zinc-700">Barbeiro</button>
                   <button onClick={() => handleDemoLogin('ADMIN')} className="text-xs bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/30">Super Admin</button>
                </div>
             </div>
          </div>
          
          <p className="text-center text-zinc-600 text-xs mt-8">
             &copy; {new Date().getFullYear()} BarberFlow SaaS. All rights reserved.
          </p>
       </div>
    </div>
  );
};
