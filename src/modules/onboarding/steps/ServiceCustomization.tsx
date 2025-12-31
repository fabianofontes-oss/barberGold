'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Edit2, Check, X } from 'lucide-react';
import { BusinessType, ServiceWithCategory, GroupedServices } from '@/types/onboarding';

interface ServiceCustomizationProps {
  businessType: BusinessType;
  onComplete: (selectedServices: string[], customizedServices: Record<string, any>) => void;
}

export const ServiceCustomization: React.FC<ServiceCustomizationProps> = ({ 
  businessType, 
  onComplete 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [groupedServices, setGroupedServices] = useState<GroupedServices>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Buscar serviÃ§os do backend
    // Por enquanto, mock de dados
    setLoading(false);
  }, [businessType]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const handleContinue = () => {
    onComplete(Array.from(selectedServices), {});
  };

  const selectedCount = selectedServices.size;
  const totalCategories = Object.keys(groupedServices).length;

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-zinc-400">Carregando serviÃ§os...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Seus ServiÃ§os</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar serviÃ§o..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-400">
            ðŸ“Š {totalCategories} categorias â€¢ {selectedCount} serviÃ§os
          </span>
          {selectedCount > 0 && (
            <span className="text-amber-500 font-bold">
              ðŸ’° Ticket mÃ©dio: ~R$ 50
            </span>
          )}
        </div>
      </div>

      {/* Service List */}
      <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
        {Object.keys(groupedServices).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 mb-4">Nenhum serviÃ§o disponÃ­vel</p>
            <p className="text-zinc-600 text-sm">
              Selecione um pacote ou tipo de negÃ³cio diferente
            </p>
          </div>
        ) : (
          Object.entries(groupedServices).map(([categoryId, group]) => (
            <div key={categoryId} className="bg-zinc-800 rounded-xl overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(categoryId)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{group.category.icon}</span>
                  <div className="text-left">
                    <h3 className="text-white font-bold">
                      {group.category.name}
                    </h3>
                    <p className="text-zinc-500 text-xs">
                      {group.selectedCount}/{group.totalCount} selecionados
                    </p>
                  </div>
                </div>
                {expandedCategories.has(categoryId) ? (
                  <ChevronUp className="w-5 h-5 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                )}
              </button>

              {/* Services */}
              {expandedCategories.has(categoryId) && (
                <div className="border-t border-zinc-700">
                  {group.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center gap-3 p-4 hover:bg-zinc-700/50 transition-colors border-b border-zinc-700 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.has(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="w-5 h-5 accent-amber-500 rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{service.name}</h4>
                        <p className="text-zinc-500 text-sm">
                          {service.duration_min}min â€¢ R$ {(service.price_cents / 100).toFixed(2)}
                        </p>
                      </div>
                      <button className="p-2 text-zinc-500 hover:text-amber-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
        <button
          onClick={() => setSelectedServices(new Set())}
          className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
        >
          Limpar seleÃ§Ã£o
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedCount === 0}
          className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
        >
          Finalizar
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
