'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { CompensationModel, CommissionPlan } from '@/types';

interface CommissionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommissionPlanModal: React.FC<CommissionPlanModalProps> = ({ isOpen, onClose }) => {
  const { addCommissionPlan } = useBarber();
  
  const [newPlan, setNewPlan] = useState<Partial<CommissionPlan>>({
    name: '',
    description: '',
    model: CompensationModel.PERCENTAGE,
    serviceRate: 50,
    productRate: 20,
    rentalFee: 0
  });

  if (!isOpen) return null;

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlan.name) {
      addCommissionPlan(newPlan as Omit<CommissionPlan, 'id'>);
      setNewPlan({
        name: '',
        description: '',
        model: CompensationModel.PERCENTAGE,
        serviceRate: 50,
        productRate: 20,
        rentalFee: 0
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md p-6 shadow-2xl animate-fade-in">
         <h3 className="text-xl font-bold text-white mb-6">Create Commission Plan</h3>
         <form onSubmit={handleCreatePlan} className="space-y-4">
            <div>
               <label className="block text-xs font-medium text-zinc-400 mb-1.5">Plan Name</label>
               <input required type="text" placeholder="e.g. Master Barber" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-white focus:border-amber-500 outline-none"/>
            </div>
            <div>
               <label className="block text-xs font-medium text-zinc-400 mb-1.5">Model Type</label>
               <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setNewPlan({...newPlan, model: CompensationModel.PERCENTAGE})} className={`py-2 text-xs font-bold rounded-lg border ${newPlan.model === CompensationModel.PERCENTAGE ? 'bg-amber-500 border-amber-500 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}>Percentage Split</button>
                  <button type="button" onClick={() => setNewPlan({...newPlan, model: CompensationModel.CHAIR_RENTAL})} className={`py-2 text-xs font-bold rounded-lg border ${newPlan.model === CompensationModel.CHAIR_RENTAL ? 'bg-amber-500 border-amber-500 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}>Chair Rental</button>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Service Comm. %</label>
                  <input type="number" min="0" max="100" value={newPlan.serviceRate} onChange={e => setNewPlan({...newPlan, serviceRate: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-white focus:border-amber-500 outline-none"/>
               </div>
               <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Product Comm. %</label>
                  <input type="number" min="0" max="100" value={newPlan.productRate} onChange={e => setNewPlan({...newPlan, productRate: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-white focus:border-amber-500 outline-none"/>
               </div>
            </div>

            {newPlan.model === CompensationModel.CHAIR_RENTAL && (
               <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Fixed Rent Fee ($)</label>
                  <input type="number" value={newPlan.rentalFee} onChange={e => setNewPlan({...newPlan, rentalFee: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-white focus:border-amber-500 outline-none"/>
               </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-zinc-800 mt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 text-zinc-500 hover:text-white font-medium">Cancel</button>
              <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl">Save Plan</button>
            </div>
         </form>
      </div>
    </div>
  );
};