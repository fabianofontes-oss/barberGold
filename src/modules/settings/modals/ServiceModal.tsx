'use client';

import React, { useState, useEffect } from 'react';
import { useBarber } from '@/context/BarberContext';
import { useI18n } from '@/hooks/useI18n';
import { Service } from '@/types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: Service | null;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, serviceToEdit }) => {
  const { addService, updateService, categories } = useBarber();
  const { t, currency } = useI18n();
  const [newService, setNewService] = useState({ name: '', price: '', durationMinutes: '', category: '' });

  // Filter categories for SERVICE type
  const serviceCategories = categories.filter(c => c.type === 'SERVICE');

  useEffect(() => {
    if (isOpen) {
      if (serviceToEdit) {
        setNewService({
          name: serviceToEdit.name,
          price: serviceToEdit.price.toString(),
          durationMinutes: serviceToEdit.durationMinutes.toString(),
          category: serviceToEdit.category || ''
        });
      } else {
        setNewService({ name: '', price: '', durationMinutes: '', category: serviceCategories[0]?.name || '' });
      }
    }
  }, [isOpen, serviceToEdit, categories]); // Depend on categories to re-sync if changed

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceToEdit) {
      updateService({
        id: serviceToEdit.id,
        name: newService.name,
        price: Number(newService.price),
        durationMinutes: Number(newService.durationMinutes),
        category: newService.category,
        type: 'SERVICE'
      });
    } else {
      addService({
        name: newService.name,
        price: Number(newService.price),
        durationMinutes: Number(newService.durationMinutes),
        category: newService.category
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-sm p-6 shadow-2xl animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-4">{serviceToEdit ? t('settings.services.modal.editTitle') : t('settings.services.modal.newTitle')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('settings.services.modal.nameLabel')}</label>
              <input required type="text" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
           </div>
           
           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('settings.services.modal.categoryLabel')}</label>
              <select 
                value={newService.category} 
                onChange={e => setNewService({...newService, category: e.target.value})} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
              >
                 <option value="">{t('settings.services.modal.categoryPlaceholder')}</option>
                 {serviceCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                 ))}
              </select>
              {serviceCategories.length === 0 && (
                 <p className="text-[10px] text-red-500 mt-1">{t('settings.services.modal.noCategoriesFound')}</p>
              )}
           </div>

           <div className="flex gap-3">
              <div className="flex-1">
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('settings.services.modal.priceLabel')} ({currency.symbol})</label>
                 <input required type="number" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
              </div>
              <div className="flex-1">
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('settings.services.modal.durationLabel')}</label>
                 <input required type="number" value={newService.durationMinutes} onChange={e => setNewService({...newService, durationMinutes: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
              </div>
           </div>
           <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2 text-zinc-500 hover:text-white">{t('common.cancel')}</button>
              <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2 rounded-lg">
                {serviceToEdit ? t('settings.services.modal.saveChangesButton') : t('settings.services.modal.createButton')}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};