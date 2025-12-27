'use client';

import React, { useState, useEffect } from 'react';
import { useBarber } from '@/context/BarberContext';
import { InventoryItem } from '@/types';
import { PackageOpen, DollarSign, Archive } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: InventoryItem | null;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, itemToEdit }) => {
  const { addInventoryItem, updateInventoryItem, suppliers, categories } = useBarber();
  
  const initialForm = {
    name: '',
    category: '',
    quantity: '',
    minStock: '',
    unit: 'UNIT',
    costPerUnit: '',
    supplierId: ''
  };

  const [form, setForm] = useState(initialForm);

  // Filter categories for SUPPLY type
  const supplyCategories = categories.filter(c => c.type === 'SUPPLY');

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setForm({
          name: itemToEdit.name,
          category: itemToEdit.category,
          quantity: itemToEdit.quantity.toString(),
          minStock: itemToEdit.minStock.toString(),
          unit: itemToEdit.unit,
          costPerUnit: itemToEdit.costPerUnit.toString(),
          supplierId: itemToEdit.supplierId || ''
        });
      } else {
        setForm({ ...initialForm, category: supplyCategories[0]?.name || '' });
      }
    }
  }, [isOpen, itemToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) return;

    const payload = {
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity),
      minStock: Number(form.minStock),
      unit: form.unit as any,
      costPerUnit: Number(form.costPerUnit),
      supplierId: form.supplierId
    };

    if (itemToEdit) {
      updateInventoryItem({ ...payload, id: itemToEdit.id } as InventoryItem);
    } else {
      addInventoryItem(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md p-6 shadow-2xl animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
           <Archive className="w-5 h-5 text-amber-500" />
           {itemToEdit ? 'Edit Supply Item' : 'New Supply Item'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Item Name</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Shampoo Galão 5L" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
              />
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
                 <select 
                   value={form.category} 
                   onChange={e => setForm({...form, category: e.target.value})} 
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none text-sm"
                 >
                    <option value="">-- Select --</option>
                    {supplyCategories.map(c => (
                       <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                 </select>
                 {supplyCategories.length === 0 && (
                    <p className="text-[10px] text-red-500 mt-1">No categories.</p>
                 )}
              </div>
              <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Supplier</label>
                 <select 
                   value={form.supplierId} 
                   onChange={e => setForm({...form, supplierId: e.target.value})} 
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none text-sm"
                 >
                    <option value="">-- Select --</option>
                    {suppliers.map(s => (
                       <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                 </select>
              </div>
           </div>

           <div className="grid grid-cols-3 gap-3">
              <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Unit Type</label>
                 <select 
                   value={form.unit} 
                   onChange={e => setForm({...form, unit: e.target.value})} 
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-1 text-white focus:border-amber-500 outline-none text-sm"
                 >
                    <option value="UNIT">Unit</option>
                    <option value="LITRE">Litre</option>
                    <option value="BOX">Box</option>
                    <option value="PACK">Pack</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Current Qty</label>
                 <input 
                   required 
                   type="number" 
                   min="0"
                   value={form.quantity} 
                   onChange={e => setForm({...form, quantity: e.target.value})} 
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                 />
              </div>
              <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Min Stock</label>
                 <input 
                   required 
                   type="number" 
                   min="0"
                   value={form.minStock} 
                   onChange={e => setForm({...form, minStock: e.target.value})} 
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
                 />
              </div>
           </div>

           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Cost Per Unit ($)</label>
              <div className="relative">
                 <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                 <input 
                   required 
                   type="number" 
                   step="0.01"
                   min="0"
                   value={form.costPerUnit} 
                   onChange={e => setForm({...form, costPerUnit: e.target.value})} 
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-white focus:border-amber-500 outline-none"
                 />
              </div>
           </div>

           <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-2 text-zinc-500 hover:text-white">Cancelar</button>
              <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2 rounded-lg">
                {itemToEdit ? 'Salvar Alterações' : 'Criar Item'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};