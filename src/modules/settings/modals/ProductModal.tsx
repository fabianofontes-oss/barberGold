'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { useBarber } from '@/context/BarberContext';
import { Product } from '@/types';
import { ImageUpload } from '@/components/shared/ImageUpload';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProduct, categories } = useBarber();
  const [newProduct, setNewProduct] = useState({ name: '', price: '', costPrice: '', stock: '', image: '', category: '' });

  // Filter categories for PRODUCT type
  const productCategories = categories.filter(c => c.type === 'PRODUCT');

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setNewProduct({
          name: productToEdit.name,
          price: productToEdit.price.toString(),
          costPrice: productToEdit.costPrice.toString(),
          stock: productToEdit.stock.toString(),
          image: productToEdit.image || '',
          category: productToEdit.category || ''
        });
      } else {
        setNewProduct({ name: '', price: '', costPrice: '', stock: '', image: '', category: productCategories[0]?.name || '' });
      }
    }
  }, [isOpen, productToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productToEdit) {
      updateProduct({
        id: productToEdit.id,
        name: newProduct.name,
        price: Number(newProduct.price),
        costPrice: Number(newProduct.costPrice),
        stock: Number(newProduct.stock),
        image: newProduct.image,
        category: newProduct.category,
        type: 'PRODUCT'
      });
    } else {
      addProduct({
        name: newProduct.name,
        price: Number(newProduct.price),
        costPrice: Number(newProduct.costPrice),
        stock: Number(newProduct.stock),
        image: newProduct.image,
        category: newProduct.category
      });
    }
    onClose();
  };

  const calculateMargin = () => {
    const price = Number(newProduct.price) || 0;
    const cost = Number(newProduct.costPrice) || 0;
    const commAvg = 0.20; 
    const commValue = price * commAvg;
    const profit = price - cost - commValue;
    const margin = price > 0 ? (profit / price) * 100 : 0;
    return { profit, margin };
  };

  const { profit, margin } = calculateMargin();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-sm p-6 shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-bold text-white mb-4">{productToEdit ? 'Edit Product' : 'New Product'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Name</label>
              <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
           </div>
           
           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
              <select 
                value={newProduct.category} 
                onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
              >
                 <option value="">-- Select Category --</option>
                 {productCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                 ))}
              </select>
              {productCategories.length === 0 && (
                 <p className="text-[10px] text-red-500 mt-1">No categories found. Please add them in Settings.</p>
              )}
           </div>

           <div className="flex gap-3">
              <div className="flex-1">
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Price</label>
                 <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
              </div>
              <div className="flex-1">
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Cost</label>
                 <input required type="number" value={newProduct.costPrice} onChange={e => setNewProduct({...newProduct, costPrice: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
              </div>
           </div>
           
           {/* Margin Calc Visual */}
           <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                 <TrendingUp className="w-4 h-4 text-emerald-500" />
                 <span className="text-xs font-bold text-zinc-400">Profit Simulator</span>
              </div>
              <div className="flex justify-between items-center text-xs mb-1">
                 <span className="text-zinc-500">Est. Commission (20%)</span>
                 <span className="text-red-400">-${(Number(newProduct.price) * 0.20).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-2 mt-1">
                 <span className="text-zinc-300">Net Profit</span>
                 <span className={`font-bold ${profit > 0 ? 'text-emerald-500' : 'text-red-500'}`}>${profit.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-right text-zinc-500 mt-1">Margin: {margin.toFixed(1)}%</div>
           </div>

           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Stock</label>
              <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
           </div>
           
           <ImageUpload 
              label="Product Image" 
              value={newProduct.image} 
              onChange={(val) => setNewProduct({...newProduct, image: val})} 
           />

           <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2 text-zinc-500 hover:text-white">Cancel</button>
              <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2 rounded-lg">
                {productToEdit ? 'Save Changes' : 'Create'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};