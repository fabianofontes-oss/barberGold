'use client';

import { useState, useEffect } from 'react';
import { getTenantAction, updateTenantAction } from '@/modules/tenant/actions';
import { listStaffAction, updateStaffAction } from '@/modules/staff/actions';
import { Store, Users, Loader2, Save } from 'lucide-react';

export const SettingsSimple = () => {
  const [tenant, setTenant] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'SHOP' | 'TEAM'>('SHOP');
  
  const [shopForm, setShopForm] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    async function loadData() {
      const [tenantData, staffData] = await Promise.all([
        getTenantAction(),
        listStaffAction({ isActive: true }),
      ]);
      
      setTenant(tenantData);
      setStaff(staffData);
      
      if (tenantData) {
        setShopForm({
          name: tenantData.name || '',
          phone: tenantData.phone || '',
          address: tenantData.address || '',
        });
      }
      
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSaveShop = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTenantAction({
      name: shopForm.name,
      phone: shopForm.phone,
      address: shopForm.address,
    });
    alert('Configurações salvas!');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Configurações</h2>
        <p className="text-zinc-400">Gerencie sua barbearia e equipe</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('SHOP')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'SHOP' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500'
          }`}
        >
          <Store className="w-4 h-4" /> Loja
        </button>
        <button
          onClick={() => setActiveTab('TEAM')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'TEAM' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500'
          }`}
        >
          <Users className="w-4 h-4" /> Equipe
        </button>
      </div>

      {activeTab === 'SHOP' && (
        <div className="max-w-2xl">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">Informações da Loja</h3>
            
            <form onSubmit={handleSaveShop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase">Nome da Barbearia</label>
                <input
                  type="text"
                  value={shopForm.name}
                  onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase">Telefone</label>
                <input
                  type="tel"
                  value={shopForm.phone}
                  onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase">Endereço</label>
                <input
                  type="text"
                  value={shopForm.address}
                  onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-3 px-6 rounded-xl flex items-center gap-2"
              >
                <Save className="w-5 h-5" /> Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'TEAM' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staff.map((member) => (
            <div key={member.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-amber-500">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{member.name}</h4>
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {member.role}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-950 p-3 rounded-lg">
                  <span className="block text-xs text-zinc-500 mb-1">Comissão</span>
                  <span className="text-white font-bold">{member.commissionRate}%</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg">
                  <span className="block text-xs text-zinc-500 mb-1">Email</span>
                  <span className="text-white text-sm">{member.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
