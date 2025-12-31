'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category_id: string;
}

interface StaffServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  staffName: string;
}

export const StaffServicesModal: React.FC<StaffServicesModalProps> = ({
  isOpen,
  onClose,
  staffId,
  staffName
}) => {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadServices();
      loadStaffServices();
    }
  }, [isOpen, staffId]);

  const loadServices = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('user_id', session.user.id)
        .single();

      if (!profile?.store_id) return;

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('store_id', profile.store_id)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setAllServices(data || []);
    } catch (err) {
      console.error('Erro ao carregar serviÃ§os:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStaffServices = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('staff_services')
        .select('service_id')
        .eq('staff_id', staffId);

      if (error) throw error;
      setSelectedServices(data?.map(s => s.service_id) || []);
    } catch (err) {
      console.error('Erro ao carregar serviÃ§os do staff:', err);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();

      // Deletar todos os serviÃ§os atuais
      await supabase
        .from('staff_services')
        .delete()
        .eq('staff_id', staffId);

      // Inserir novos serviÃ§os selecionados
      if (selectedServices.length > 0) {
        const { error } = await supabase
          .from('staff_services')
          .insert(
            selectedServices.map(serviceId => ({
              staff_id: staffId,
              service_id: serviceId
            }))
          );

        if (error) throw error;
      }

      onClose();
    } catch (err) {
      console.error('Erro ao salvar serviÃ§os:', err);
      alert('Erro ao salvar configuraÃ§Ãµes');
    } finally {
      setSaving(false);
    }
  };

  const filteredServices = allServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Configurar ServiÃ§os</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Selecione os serviÃ§os que <span className="text-amber-500 font-bold">{staffName}</span> oferece
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar serviÃ§o..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="mt-3 text-sm text-zinc-400">
            <span className="font-bold text-amber-500">{selectedServices.length}</span> de {allServices.length} serviÃ§os selecionados
          </div>
        </div>

        {/* Services List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {loading ? (
            <div className="text-center py-12 text-zinc-500">Carregando serviÃ§os...</div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              {searchQuery ? 'Nenhum serviÃ§o encontrado' : 'Nenhum serviÃ§o disponÃ­vel'}
            </div>
          ) : (
            filteredServices.map(service => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{service.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-zinc-400">
                        <span>{service.duration}min</span>
                        <span>â€¢</span>
                        <span className="text-amber-500 font-bold">R$ {service.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-amber-500 border-amber-500'
                          : 'border-zinc-700'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-zinc-900" />}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar ConfiguraÃ§Ãµes'}
          </button>
        </div>
      </div>
    </div>
  );
};
