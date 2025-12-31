'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { Supplier, InventoryItem } from '@/types';
import { Truck, Phone, Package, History, ArrowRightCircle, Save, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format } from 'date-fns';

interface SupplierDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export const SupplierDetailsModal: React.FC<SupplierDetailsModalProps> = ({ isOpen, onClose, supplier }) => {
  const { inventory, supplyTransactions, updateSupplier, restockInventoryItem } = useBarber();
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'HISTORY'>('PRODUCTS');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Supplier>>({});
  
  // Reorder State
  const [reorderItem, setReorderItem] = useState<string | null>(null);
  const [reorderQty, setReorderQty] = useState(1);
  const [reorderCost, setReorderCost] = useState(0);

  // Sync state when opening
  React.useEffect(() => {
     if (supplier) {
        setEditForm(supplier);
        setIsEditing(false);
        setActiveTab('PRODUCTS');
     }
  }, [supplier]);

  if (!isOpen || !supplier) return null;

  const supplierItems = inventory.filter(i => i.supplierId === supplier.id);
  const history = supplyTransactions.filter(t => t.supplierId === supplier.id).sort((a,b) => b.date.getTime() - a.date.getTime());

  const handleSaveDetails = () => {
     if (editForm.name && supplier) {
        updateSupplier({ ...supplier, ...editForm } as Supplier);
        setIsEditing(false);
     }
  };

  const startReorder = (item: InventoryItem) => {
     setReorderItem(item.id);
     setReorderQty(1); // Default
     setReorderCost(item.costPerUnit); // Default to last cost
  };

  const confirmReorder = () => {
     if (reorderItem && reorderQty > 0) {
        restockInventoryItem(reorderItem, reorderQty, reorderCost, supplier.id);
        setReorderItem(null); // Close mini form
     }
  };

  const getPriceTrend = (transactionCost: number, currentItemCost: number) => {
     if (transactionCost > currentItemCost) return <TrendingUp className="w-3 h-3 text-red-500" />; // Paid more than current
     if (transactionCost < currentItemCost) return <TrendingDown className="w-3 h-3 text-emerald-500" />; // Paid less
     return <Minus className="w-3 h-3 text-zinc-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-3xl h-[650px] flex flex-col shadow-2xl animate-fade-in overflow-hidden">
         
         {/* Header */}
         <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-start">
            <div className="flex gap-4">
               <div className="bg-zinc-800 p-4 rounded-full h-16 w-16 flex items-center justify-center border-2 border-zinc-700">
                  <Truck className="w-8 h-8 text-amber-500" />
               </div>
               <div>
                  {isEditing ? (
                     <input 
                        className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xl font-bold text-white mb-1 w-full"
                        value={editForm.name}
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                     />
                  ) : (
                     <h2 className="text-2xl font-bold text-white">{supplier.name}</h2>
                  )}
                  
                  <div className="text-sm text-zinc-400 flex items-center gap-3 mt-1">
                     {isEditing ? (
                        <>
                           <input placeholder="Contact Name" value={editForm.contactName} onChange={e => setEditForm({...editForm, contactName: e.target.value})} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-white" />
                           <input placeholder="Phone" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-xs text-white" />
                        </>
                     ) : (
                        <>
                           <span>{supplier.contactName || 'No Contact'}</span>
                           <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {supplier.phone}</span>
                        </>
                     )}
                  </div>
               </div>
            </div>
            <div>
               {isEditing ? (
                  <button onClick={handleSaveDetails} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2">
                     <Save className="w-4 h-4" /> Save
                  </button>
               ) : (
                  <div className="flex gap-2">
                     <button onClick={() => setIsEditing(true)} className="text-zinc-500 hover:text-white text-sm font-medium">Edit Info</button>
                     <button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-lg text-sm font-bold">Close</button>
                  </div>
               )}
            </div>
         </div>

         {/* Tabs */}
         <div className="flex border-b border-zinc-800">
            <button 
               onClick={() => setActiveTab('PRODUCTS')}
               className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'PRODUCTS' ? 'border-amber-500 text-white bg-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-300 bg-zinc-950/30'}`}
            >
               <Package className="w-4 h-4" /> Products ({supplierItems.length})
            </button>
            <button 
               onClick={() => setActiveTab('HISTORY')}
               className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'HISTORY' ? 'border-amber-500 text-white bg-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-300 bg-zinc-950/30'}`}
            >
               <History className="w-4 h-4" /> Purchase History
            </button>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto p-6 bg-zinc-900">
            {activeTab === 'PRODUCTS' ? (
               <div className="space-y-3">
                  {supplierItems.length === 0 ? (
                     <p className="text-center text-zinc-500 py-10">No products linked to this supplier yet.</p>
                  ) : (
                     supplierItems.map(item => (
                        <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div className="flex-1">
                              <h4 className="font-bold text-white">{item.name}</h4>
                              <p className="text-xs text-zinc-500">{item.category} � Cost: ${item.costPerUnit.toFixed(2)}</p>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="text-right">
                                 <p className="text-xs text-zinc-500">Stock</p>
                                 <p className={`font-bold ${item.quantity <= item.minStock ? 'text-red-500' : 'text-white'}`}>
                                    {item.quantity} {item.unit}
                                 </p>
                              </div>
                              
                              {/* Reorder Logic */}
                              {reorderItem === item.id ? (
                                 <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-lg border border-amber-500/50 animate-fade-in">
                                    <input 
                                       type="number" 
                                       min="1" 
                                       className="w-12 bg-zinc-950 border border-zinc-700 rounded px-1 text-white text-xs text-center focus:border-amber-500 outline-none" 
                                       value={reorderQty}
                                       onChange={e => setReorderQty(Number(e.target.value))}
                                    />
                                    <span className="text-xs text-zinc-500">x</span>
                                    <input 
                                       type="number" 
                                       min="0" 
                                       step="0.01"
                                       className="w-16 bg-zinc-950 border border-zinc-700 rounded px-1 text-white text-xs text-center focus:border-amber-500 outline-none" 
                                       value={reorderCost}
                                       onChange={e => setReorderCost(Number(e.target.value))}
                                    />
                                    <button onClick={confirmReorder} className="bg-emerald-500 text-zinc-900 p-1 rounded hover:bg-emerald-400">
                                       <ArrowRightCircle className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setReorderItem(null)} className="text-zinc-500 hover:text-white px-1">
                                       x
                                    </button>
                                 </div>
                              ) : (
                                 <button 
                                    onClick={() => startReorder(item)}
                                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition-all"
                                 >
                                    <Plus className="w-3 h-3" /> Reorder
                                 </button>
                              )}
                           </div>
                        </div>
                     ))
                  )}
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-400">
                     <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold text-xs border-b border-zinc-800">
                        <tr>
                           <th className="px-4 py-3">Date</th>
                           <th className="px-4 py-3">Item</th>
                           <th className="px-4 py-3 text-right">Qty</th>
                           <th className="px-4 py-3 text-right">Unit Cost</th>
                           <th className="px-4 py-3 text-right">Total</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-800">
                        {history.length === 0 ? (
                           <tr><td colSpan={5} className="text-center py-8">No purchase history available.</td></tr>
                        ) : (
                           history.map(t => {
                              // Find current item to compare cost
                              const item = inventory.find(i => i.id === t.itemId);
                              const currentCost = item ? item.costPerUnit : t.unitCost;
                              
                              return (
                                 <tr key={t.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-4 py-3">{format(t.date, 'dd/MM/yyyy')}</td>
                                    <td className="px-4 py-3 font-medium text-white">{t.itemName}</td>
                                    <td className="px-4 py-3 text-right">{t.quantity}</td>
                                    <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                                       ${t.unitCost.toFixed(2)}
                                       {item && getPriceTrend(t.unitCost, currentCost)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-emerald-500">${t.totalCost.toFixed(2)}</td>
                                 </tr>
                              );
                           })
                        )}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
