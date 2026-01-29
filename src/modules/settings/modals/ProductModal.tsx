'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Trash2, Layers } from 'lucide-react';
import { useBarber } from '@/context/BarberContext';
import { useI18n } from '@/hooks/useI18n';
import { Product, ProductVariant } from '@/types';
import { ImageUpload } from '@/components/shared/ImageUpload';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProduct, categories } = useBarber();
  const { t, currency, formatCurrency } = useI18n();
  const [newProduct, setNewProduct] = useState({ name: '', price: '', costPrice: '', stock: '', image: '', category: '' });
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariant, setNewVariant] = useState({ name: '', price: '', costPrice: '', stock: '' });

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
        setHasVariants(productToEdit.hasVariants || false);
        setVariants(productToEdit.variants || []);
      } else {
        setNewProduct({ name: '', price: '', costPrice: '', stock: '', image: '', category: productCategories[0]?.name || '' });
        setHasVariants(false);
        setVariants([]);
      }
    }
  }, [isOpen, productToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalStock = hasVariants ? variants.reduce((sum, v) => sum + v.stock, 0) : Number(newProduct.stock);
    const basePrice = hasVariants && variants.length > 0 ? Math.min(...variants.map(v => v.price)) : Number(newProduct.price);
    const baseCost = hasVariants && variants.length > 0 ? variants[0].costPrice : Number(newProduct.costPrice);

    if (productToEdit) {
      updateProduct({
        id: productToEdit.id,
        name: newProduct.name,
        price: basePrice,
        costPrice: baseCost,
        stock: totalStock,
        image: newProduct.image,
        category: newProduct.category,
        type: 'PRODUCT',
        hasVariants,
        variants: hasVariants ? variants : undefined
      });
    } else {
      addProduct({
        name: newProduct.name,
        price: basePrice,
        costPrice: baseCost,
        stock: totalStock,
        image: newProduct.image,
        category: newProduct.category,
        hasVariants,
        variants: hasVariants ? variants : undefined
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
        <h3 className="text-xl font-bold text-white mb-4">{productToEdit ? t('settings.products.modal.editTitle') : t('settings.products.modal.newTitle')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('settings.products.modal.nameLabel')}</label>
              <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
           </div>
           
           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('settings.products.modal.categoryLabel')}</label>
              <select 
                value={newProduct.category} 
                onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"
              >
                 <option value="">{t('settings.products.modal.categoryPlaceholder')}</option>
                 {productCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                 ))}
              </select>
              {productCategories.length === 0 && (
                 <p className="text-[10px] text-red-500 mt-1">{t('settings.products.modal.noCategoriesFound')}</p>
              )}
           </div>

           {/* Variações Toggle */}
           <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
              <div className="flex items-center gap-2">
                 <Layers className="w-4 h-4 text-purple-500" />
                 <span className="text-sm text-white font-medium">{t('settings.products.modal.variantsToggleLabel')}</span>
                 <span className="text-[10px] text-zinc-500">{t('settings.products.modal.variantsToggleHint')}</span>
              </div>
              <button
                 type="button"
                 onClick={() => setHasVariants(!hasVariants)}
                 className={`w-10 h-5 rounded-full transition-all ${hasVariants ? 'bg-purple-500' : 'bg-zinc-700'}`}
              >
                 <div className={`w-4 h-4 bg-white rounded-full transition-all ${hasVariants ? 'ml-5' : 'ml-0.5'}`} />
              </button>
           </div>

           {/* Variações Section */}
           {hasVariants && (
              <div className="space-y-3 p-3 bg-zinc-950 border border-purple-500/30 rounded-lg">
                 <p className="text-xs text-purple-400 font-bold">{t('settings.products.modal.variantsSectionTitle')}</p>
                 
                 {/* Lista de variações */}
                 {variants.length > 0 && (
                    <div className="space-y-2">
                       {variants.map((v, i) => (
                          <div key={v.id} className="flex items-center gap-2 p-2 bg-zinc-900 rounded-lg">
                             <span className="flex-1 text-sm text-white font-medium">{v.name}</span>
                             <span className="text-xs text-zinc-400">{formatCurrency(v.price)}</span>
                             <span className="text-xs text-zinc-500">{t('settings.products.modal.variantStockLabel')}: {v.stock}</span>
                             <button
                                type="button"
                                onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                                className="p-1 text-zinc-500 hover:text-red-500"
                             >
                                <Trash2 className="w-3 h-3" />
                             </button>
                          </div>
                       ))}
                    </div>
                 )}

                 {/* Adicionar variação */}
                 <div className="flex gap-2">
                    <input
                       type="text"
                       placeholder={t('settings.products.modal.variantNamePlaceholder')}
                       value={newVariant.name}
                       onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                       className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-purple-500"
                    />
                    <input
                       type="number"
                       placeholder={t('settings.products.modal.variantPricePlaceholder')}
                       value={newVariant.price}
                       onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                       className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-purple-500"
                    />
                    <input
                       type="number"
                       placeholder={t('settings.products.modal.variantCostPlaceholder')}
                       value={newVariant.costPrice}
                       onChange={(e) => setNewVariant({ ...newVariant, costPrice: e.target.value })}
                       className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-purple-500"
                    />
                    <input
                       type="number"
                       placeholder={t('settings.products.modal.variantStockPlaceholder')}
                       value={newVariant.stock}
                       onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                       className="w-16 bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-purple-500"
                    />
                    <button
                       type="button"
                       onClick={() => {
                          if (newVariant.name && newVariant.price) {
                             setVariants([...variants, {
                                id: crypto.randomUUID(),
                                name: newVariant.name,
                                price: Number(newVariant.price),
                                costPrice: Number(newVariant.costPrice) || 0,
                                stock: Number(newVariant.stock) || 0
                             }]);
                             setNewVariant({ name: '', price: '', costPrice: '', stock: '' });
                          }
                       }}
                       className="p-1.5 bg-purple-500 hover:bg-purple-400 text-white rounded"
                    >
                       <Plus className="w-4 h-4" />
                    </button>
                 </div>
                 <p className="text-[10px] text-zinc-500">
                   {t('settings.products.modal.totalStockLabel')}: {variants.reduce((sum, v) => sum + v.stock, 0)} | {t('settings.products.modal.basePriceLabel')}: {formatCurrency(variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0)}
                 </p>
              </div>
           )}

           {!hasVariants && (
           <>
           <div className="flex gap-3">
              <div className="flex-1">
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('settings.products.modal.priceLabel')} ({currency.symbol})</label>
                 <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
              </div>
              <div className="flex-1">
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('settings.products.modal.costLabel')} ({currency.symbol})</label>
                 <input required type="number" value={newProduct.costPrice} onChange={e => setNewProduct({...newProduct, costPrice: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
              </div>
           </div>
           
           {/* Margin Calc Visual */}
           <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                 <TrendingUp className="w-4 h-4 text-emerald-500" />
                 <span className="text-xs font-bold text-zinc-400">{t('settings.products.modal.profitSimulatorTitle')}</span>
              </div>
              <div className="flex justify-between items-center text-xs mb-1">
                 <span className="text-zinc-500">{t('settings.products.modal.estimatedCommissionLabel')}</span>
                 <span className="text-red-400">-{formatCurrency((Number(newProduct.price) || 0) * 0.20)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-2 mt-1">
                 <span className="text-zinc-300">{t('settings.products.modal.netProfitLabel')}</span>
                 <span className={`font-bold ${profit > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(profit)}</span>
              </div>
              <div className="text-[10px] text-right text-zinc-500 mt-1">{t('settings.products.modal.marginLabel')}: {margin.toFixed(1)}%</div>
           </div>

           <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t('settings.products.modal.stockLabel')}</label>
              <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
           </div>
           </>
           )}
           
           <ImageUpload 
              label={t('settings.products.modal.productImageLabel')} 
              value={newProduct.image} 
              onChange={(val) => setNewProduct({...newProduct, image: val})} 
           />

           <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2 text-zinc-500 hover:text-white">{t('common.cancel')}</button>
              <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2 rounded-lg">
                {productToEdit ? t('settings.products.modal.saveChangesButton') : t('settings.products.modal.createButton')}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};
