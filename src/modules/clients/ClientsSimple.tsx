'use client';

import { useState } from 'react';
import { useClients } from './hooks/useClients';
import { Search, UserPlus, Phone, Loader2, Trash2, X } from 'lucide-react';

export const ClientsSimple = () => {
  const { clients, isLoading, addClient, removeClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', birthDate: '' });

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    await addClient({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      birthDate: formData.birthDate,
    });
    
    setFormData({ name: '', phone: '', email: '', birthDate: '' });
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Clientes</h2>
          <p className="text-zinc-400 text-sm">Gerencie sua base de clientes</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
        >
          <UserPlus className="w-5 h-5" /> Adicionar Cliente
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
        <input 
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-20">
        {filteredClients.map((client) => (
          <div 
            key={client.id}
            className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-xl p-5 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xl text-amber-500">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{client.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Phone className="w-3 h-3" />
                    {client.phone}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeClient(client.id)}
                className="text-zinc-600 hover:text-red-500 p-2 rounded-lg hover:bg-zinc-800 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
              <div className="bg-zinc-950/50 rounded-lg p-3">
                <p className="text-xs text-zinc-500 mb-1">Total Gasto</p>
                <p className="font-bold text-white">R$ {client.totalSpent.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-950/50 rounded-lg p-3">
                <p className="text-xs text-zinc-500 mb-1">Visitas</p>
                <p className="font-bold text-white">{client.totalVisits}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="col-span-full text-center py-20 text-zinc-500">
            <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Novo Cliente</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-zinc-800 p-2 rounded-full text-zinc-400 hover:text-white">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Nome Completo *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Telefone *</label>
                <input 
                  type="tel" 
                  required 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="cliente@email.com" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Data de Nascimento</label>
                <input 
                  type="date" 
                  value={formData.birthDate} 
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3 text-zinc-400 font-medium hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
