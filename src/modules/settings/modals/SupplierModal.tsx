'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { Supplier } from '@/types';
import { Truck } from 'lucide-react';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose }) => {
  const { addSupplier, categories } = useBarber();
  
  // Filter categories for SUPPLIER type
  const supplierCategories = categories.filter(c => c.type === 'SUPPLIER');

  const [form, setForm] = useState({
    name: '',
    contactName: '',
    phone: '',
    category: supplierCategories[0]?.name || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    addSupplier(form);
    setForm({ name: '', contactName: '', phone: '', category: supplierCategories[0]?.name || '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md p-6 shadow-2xl animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
           <Truck className="w-5 h-5 text-amber-500" /> New Supplier
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Company Name</label>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Contact Person</label>
                 <input type="text" value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
              </div>
              <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Phone</label>
                 <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
              </div>
           </div>

           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
              <select 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none text-sm"
              >
                 <option value="">-- Select Category --</option>
                 {supplierCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                 ))}
              </select>
              {supplierCategories.length === 0 && (
                 <p className="text-[10px] text-red-500 mt-1">No categories defined.</p>
              )}
           </div>

           <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-2 text-zinc-500 hover:text-white">Cancel</button>
              <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2 rounded-lg">Add Supplier</button>
           </div>
        </form>
      </div>
    </div>
  );
};