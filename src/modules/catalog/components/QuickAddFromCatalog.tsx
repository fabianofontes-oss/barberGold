'use client';

import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Plus, Package, Archive, Crown, Check } from 'lucide-react';
import { PRODUCT_CATALOG, ProductCategory } from '../data/ProductTemplates';
import { SUPPLY_CATALOG, SupplyCategory } from '../data/SupplyTemplates';

type CatalogType = 'PRODUCTS' | 'SUPPLIES';

interface QuickAddFromCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (data: { name: string; price: number; costPrice: number; category: string }) => void;
  onAddSupply: (data: { name: string; costPerUnit: number; minStock: number; unit: string }) => void;
}

export const QuickAddFromCatalog: React.FC<QuickAddFromCatalogProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onAddSupply,
}) => {
  const [catalogType, setCatalogType] = useState<CatalogType>('PRODUCTS');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    suggestedCost: number;
    suggestedPrice?: number;
    minStock?: number;
    unit?: string;
    category: string;
  } | null>(null);
  const [customCost, setCustomCost] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [addedItems, setAddedItems] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentCatalog = catalogType === 'PRODUCTS' ? PRODUCT_CATALOG : SUPPLY_CATALOG;
  const currentCategory = currentCatalog.find(c => c.id === selectedCategory);
  const currentSubcategory = currentCategory?.subcategories.find(s => s.id === selectedSubcategory);

  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
      setCustomCost('');
      setCustomPrice('');
    } else if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const handleSelectItem = (item: typeof selectedItem) => {
    setSelectedItem(item);
    setCustomCost(item?.suggestedCost.toFixed(2) || '');
    setCustomPrice(item?.suggestedPrice?.toFixed(2) || '');
  };

  const handleAddItem = () => {
    if (!selectedItem) return;

    if (catalogType === 'PRODUCTS') {
      onAddProduct({
        name: selectedItem.name,
        price: Number(customPrice) || selectedItem.suggestedPrice || 0,
        costPrice: Number(customCost) || selectedItem.suggestedCost,
        category: selectedItem.category,
      });
    } else {
      onAddSupply({
        name: selectedItem.name,
        costPerUnit: Number(customCost) || selectedItem.suggestedCost,
        minStock: selectedItem.minStock || 5,
        unit: selectedItem.unit || 'unidade',
      });
    }

    setAddedItems(prev => [...prev, selectedItem.id]);
    setSelectedItem(null);
    setCustomCost('');
    setCustomPrice('');
  };

  const getTitle = () => {
    if (selectedItem) return selectedItem.name;
    if (currentSubcategory) return currentSubcategory.name;
    if (currentCategory) return currentCategory.name;
    return catalogType === 'PRODUCTS' ? 'Produtos' : 'Insumos';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
            {(selectedCategory || selectedSubcategory || selectedItem) && (
              <button onClick={handleBack} className="text-zinc-400 hover:text-white p-1">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] text-amber-500 font-bold uppercase">Premium</span>
              </div>
              <h2 className="text-lg font-bold text-white">{getTitle()}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle */}
        {!selectedCategory && (
          <div className="flex gap-2 p-4 border-b border-zinc-800">
            <button
              onClick={() => setCatalogType('PRODUCTS')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                catalogType === 'PRODUCTS'
                  ? 'bg-amber-500 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" /> Produtos
            </button>
            <button
              onClick={() => setCatalogType('SUPPLIES')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                catalogType === 'SUPPLIES'
                  ? 'bg-amber-500 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Archive className="w-4 h-4" /> Insumos
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Categories */}
          {!selectedCategory && (
            <div className="grid grid-cols-2 gap-3">
              {currentCatalog.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-amber-500/50 transition-all group"
                >
                  <span className="text-3xl">{category.emoji}</span>
                  <span className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">
                    {category.name}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {category.subcategories.reduce((acc, sub) => acc + ('products' in sub ? sub.products.length : (sub as any).supplies?.length || 0), 0)} itens
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Subcategories */}
          {selectedCategory && !selectedSubcategory && currentCategory && (
            <div className="space-y-2">
              {currentCategory.subcategories.map(subcategory => (
                <button
                  key={subcategory.id}
                  onClick={() => setSelectedSubcategory(subcategory.id)}
                  className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-amber-500/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{subcategory.emoji}</span>
                    <div className="text-left">
                      <p className="font-bold text-white group-hover:text-amber-500">{subcategory.name}</p>
                      <p className="text-[10px] text-zinc-500">
                        {'products' in subcategory ? subcategory.products.length : (subcategory as any).supplies?.length || 0} itens
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-amber-500" />
                </button>
              ))}
            </div>
          )}

          {/* Items */}
          {selectedSubcategory && !selectedItem && currentSubcategory && (
            <div className="space-y-2">
              {('products' in currentSubcategory ? currentSubcategory.products : (currentSubcategory as any).supplies || []).map((item: any) => {
                const isAdded = addedItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => !isAdded && handleSelectItem({
                      ...item,
                      category: currentCategory?.name || '',
                    })}
                    disabled={isAdded}
                    className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all ${
                      isAdded
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-zinc-950 border-zinc-800 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.emoji}</span>
                      <div className="text-left">
                        <p className={`font-bold ${isAdded ? 'text-emerald-400' : 'text-white'}`}>{item.name}</p>
                        <p className="text-[10px] text-zinc-500">
                          Custo sugerido: R$ {item.suggestedCost.toFixed(2)}
                          {item.suggestedPrice && ` • Venda: R$ ${item.suggestedPrice.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                    {isAdded ? (
                      <Check className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Plus className="w-5 h-5 text-zinc-600" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Item Detail / Price Form */}
          {selectedItem && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <span className="text-5xl">{(selectedItem as any).emoji}</span>
                <h3 className="text-xl font-bold text-white mt-3">{selectedItem.name}</h3>
                <p className="text-xs text-zinc-500">{selectedItem.category}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1.5">
                    Custo (seu preço de compra)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={customCost}
                      onChange={(e) => setCustomCost(e.target.value)}
                      placeholder={selectedItem.suggestedCost.toFixed(2)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-lg font-bold focus:border-amber-500 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1">
                    Sugerido: R$ {selectedItem.suggestedCost.toFixed(2)}
                  </p>
                </div>

                {catalogType === 'PRODUCTS' && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1.5">
                      Preço de Venda
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        placeholder={selectedItem.suggestedPrice?.toFixed(2) || '0.00'}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-lg font-bold focus:border-amber-500 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-1">
                      Sugerido: R$ {selectedItem.suggestedPrice?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                )}

                {/* Margin Preview (Products only) */}
                {catalogType === 'PRODUCTS' && customCost && customPrice && (
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Lucro por unidade</span>
                      <span className="text-lg font-bold text-emerald-500">
                        R$ {(Number(customPrice) - Number(customCost)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-zinc-500">Margem</span>
                      <span className="text-sm font-bold text-zinc-400">
                        {((1 - Number(customCost) / Number(customPrice)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedItem && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950">
            <button
              onClick={handleAddItem}
              disabled={!customCost || (catalogType === 'PRODUCTS' && !customPrice)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-900 font-bold rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" /> Adicionar ao Catálogo
            </button>
          </div>
        )}

        {/* Added Counter */}
        {addedItems.length > 0 && !selectedItem && (
          <div className="p-4 border-t border-zinc-800 bg-emerald-500/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-400 font-bold">
                {addedItems.length} {addedItems.length === 1 ? 'item adicionado' : 'itens adicionados'}
              </span>
              <button
                onClick={onClose}
                className="text-sm text-white font-bold bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-lg"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
