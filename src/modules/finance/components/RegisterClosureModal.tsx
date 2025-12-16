'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { PaymentMethod } from '@/types';
import { Calculator, CheckCircle2, AlertTriangle, Save, DollarSign, CreditCard, Smartphone, ShoppingBag, Wallet } from 'lucide-react';
import { isSameDay } from 'date-fns';

interface RegisterClosureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAYMENT_LABELS: Record<string, string> = {
   [PaymentMethod.CASH]: 'Dinheiro (Gaveta)',
   [PaymentMethod.CREDIT_CARD]: 'Cartão Crédito',
   [PaymentMethod.DEBIT_CARD]: 'Cartão Débito',
   [PaymentMethod.PIX]: 'Pix',
   [PaymentMethod.GOOGLE_PAY]: 'Google Pay',
   [PaymentMethod.APPLE_PAY]: 'Apple Pay',
   [PaymentMethod.MERCADO_PAGO]: 'Mercado Pago',
   [PaymentMethod.PAGSEGURO]: 'PagSeguro',
   [PaymentMethod.INFINITE_PAY]: 'InfinitePay',
   [PaymentMethod.STONE]: 'Stone',
};

export const RegisterClosureModal: React.FC<RegisterClosureModalProps> = ({ isOpen, onClose }) => {
  const { sales, closeRegister, currentUser, shopSettings } = useBarber();
  
  // Calculate Totals for Today
  const today = new Date();
  const todaysSales = sales.filter(s => isSameDay(s.date, today));
  
  // Use In-Store methods for register closure logic
  const enabledMethods = shopSettings.paymentSettings?.inStore || [PaymentMethod.CASH];

  const expectedTotals: Record<string, number> = {};
  
  // Calculate expected for each enabled method
  enabledMethods.forEach(method => {
     expectedTotals[method] = todaysSales.filter(s => s.method === method).reduce((sum: number, s) => sum + s.total, 0);
  });

  const totalExpected = Object.values(expectedTotals).reduce<number>((sum, val) => sum + val, 0);

  // Form State - Dynamic keys
  const [counted, setCounted] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Calculate Totals
  const totalCounted = Object.values(counted).reduce<number>((sum, val) => sum + (Number(val) || 0), 0);
  const totalDiff = totalCounted - totalExpected;

  const handleCloseRegister = (e: React.FormEvent) => {
     e.preventDefault();
     
     const breakdown: Record<string, { expected: number; counted: number }> = {};
     enabledMethods.forEach(method => {
        breakdown[method] = {
           expected: expectedTotals[method] || 0,
           counted: Number(counted[method]) || 0
        };
     });

     closeRegister({
        date: new Date(),
        closedByStaffId: currentUser.id,
        totalExpected,
        totalCounted,
        difference: totalDiff,
        breakdown,
        notes
     });
     onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-lg p-6 shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
            <div className="p-3 bg-amber-500/10 rounded-xl">
               <Calculator className="w-6 h-6 text-amber-500" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white">Close Register</h3>
               <p className="text-sm text-zinc-400">Reconcile today&apos;s sales with physical/digital balances.</p>
            </div>
         </div>

         <form onSubmit={handleCloseRegister} className="space-y-4 flex-1 overflow-y-auto pr-2">
            
            {/* Dynamic Fields */}
            {enabledMethods.map(method => {
               const expected = expectedTotals[method] || 0;
               const count = Number(counted[method]) || 0;
               const diff = count - expected;
               
               return (
                  <div key={method} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                     <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                           {method === PaymentMethod.CASH ? <DollarSign className="w-4 h-4 text-emerald-500"/> : <CreditCard className="w-4 h-4 text-zinc-500"/>}
                           {PAYMENT_LABELS[method] || method}
                        </span>
                        <span className="text-xs text-zinc-500">System: ${expected.toFixed(2)}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <input 
                           type="number" 
                           step="0.01" 
                           placeholder="0.00"
                           className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 outline-none"
                           value={counted[method] || ''}
                           onChange={e => setCounted({...counted, [method]: e.target.value})}
                        />
                     </div>
                     {diff !== 0 && (
                        <div className={`text-right text-[10px] font-bold mt-1 ${diff < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                           {diff > 0 ? '+' : ''}{diff.toFixed(2)} Diff
                        </div>
                     )}
                  </div>
               );
            })}

            {/* SUMMARY */}
            <div className={`p-4 rounded-xl border flex justify-between items-center ${totalDiff === 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
               <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Total Balance</span>
                  <span className={`text-xl font-bold ${totalDiff === 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                     {totalDiff === 0 ? 'Perfect Match' : `${totalDiff > 0 ? '+' : ''}$${totalDiff.toFixed(2)}`}
                  </span>
               </div>
               {totalDiff !== 0 && <AlertTriangle className="w-8 h-8 text-red-500" />}
               {totalDiff === 0 && <CheckCircle2 className="w-8 h-8 text-emerald-500" />}
            </div>

            <div>
               <label className="block text-xs font-medium text-zinc-400 mb-1.5">Closing Notes (Optional)</label>
               <input 
                  type="text" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-500 outline-none"
                  placeholder="e.g. Took $20 for coffee supplies from drawer"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
               />
            </div>

            <div className="flex gap-3 pt-4 border-t border-zinc-800">
               <button type="button" onClick={onClose} className="flex-1 py-3 text-zinc-500 hover:text-white font-medium">Cancel</button>
               <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Close Register
               </button>
            </div>
         </form>
      </div>
    </div>
  );
};