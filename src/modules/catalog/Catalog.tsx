'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { ProductModal } from '@/modules/settings/modals/ProductModal';
import { ServiceModal } from '@/modules/settings/modals/ServiceModal';
import { InventoryModal } from '@/modules/settings/modals/InventoryModal';
import { SupplierModal } from '@/modules/settings/modals/SupplierModal';
import { SupplierDetailsModal } from '@/modules/settings/modals/SupplierDetailsModal';
import { 
  Scissors, Package, Plus, Edit2, Trash2,
  Archive, Truck, AlertTriangle, ArrowDownCircle,
  Eye, Tag, History, DollarSign, BarChart3, Calculator, ShoppingCart, ArrowRightCircle, TrendingUp
} from 'lucide-react';
import { Service, Product, InventoryItem, Supplier, CategoryType } from '@/types';
import { format } from 'date-fns';
import { AutoReorderFeature } from './components/AutoReorderFeature';
import { QuickAddFromCatalog } from './components/QuickAddFromCatalog';
import { useFeatureGate } from '@/hooks/useFeatureGate';

export const Catalog = () => {
  const { 
    services, products, deleteService, deleteProduct,
    inventory, suppliers, deleteInventoryItem, adjustInventoryStock, deleteSupplier,
    categories, addCategory, deleteCategory, supplyTransactions, restockProduct,
    addProduct, addInventoryItem
  } = useBarber();

  const { canUseFeature } = useFeatureGate();
  const hasPremiumCatalog = canUseFeature('ADVANCED_REPORTS'); // Premium feature
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'PRODUCTS' | 'INVENTORY' | 'CATEGORIES'>('SERVICES');
  
  // Inventory Sub-Tabs
  const [inventorySubTab, setInventorySubTab] = useState<'ITEMS' | 'SUPPLIERS' | 'HISTORY'>('ITEMS');
  const [productSubTab, setProductSubTab] = useState<'LIST' | 'HISTORY'>('LIST');

  // Category Sub-Tab
  const [categoryType, setCategoryType] = useState<CategoryType>('SERVICE');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Modals
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isSupplierDetailsOpen, setIsSupplierDetailsOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  // Edit State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Product Restock State
  const [restockProductId, setRestockProductId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState(1);
  const [restockCost, setRestockCost] = useState(0);

  // --- ACTIONS ---
  const openEditService = (service: Service) => {
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const openNewService = () => {
    setEditingService(null);
    setIsServiceModalOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditInventoryItem = (item: InventoryItem) => {
     setEditingInventoryItem(item);
     setIsInventoryModalOpen(true);
  };

  const openNewInventoryItem = () => {
     setEditingInventoryItem(null);
     setIsInventoryModalOpen(true);
  };

  const openSupplierDetails = (supplier: Supplier) => {
     setSelectedSupplier(supplier);
     setIsSupplierDetailsOpen(true);
  }

  const handleDeleteService = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleDeleteInventoryItem = (id: string) => {
     if (window.confirm('Delete this supply item?')) deleteInventoryItem(id);
  };

  const handleAddCategory = (e: React.FormEvent) => {
     e.preventDefault();
     if (newCategoryName.trim()) {
        addCategory(newCategoryName.trim(), categoryType);
        setNewCategoryName('');
     }
  };

  // Product Restock
  const startProductRestock = (product: Product) => {
     setRestockProductId(product.id);
     setRestockQty(1);
     setRestockCost(product.costPrice || 0);
  };

  const confirmProductRestock = () => {
     if (restockProductId && restockQty > 0) {
        restockProduct(restockProductId, restockQty, restockCost);
        setRestockProductId(null);
     }
  };

  // --- KPI CALCULATIONS ---
  // Inventory (Backbar)
  const totalStockValue = inventory.reduce((acc, item) => acc + (item.quantity * item.costPerUnit), 0);
  const lowStockCount = inventory.filter(i => i.quantity <= i.minStock).length;
  const totalItemsCount = inventory.reduce((acc, i) => acc + i.quantity, 0);

  // Retail Products
  const totalRetailCostValue = products.reduce((acc, p) => acc + (p.stock * (p.costPrice || 0)), 0);
  const totalRetailRevenuePotential = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const totalRetailUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockRetailCount = products.filter(p => p.stock <= 3).length; // Warning threshold: 3 units

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Catalog & Inventory</h2>
        <p className="text-zinc-400">
           Manage what you sell, what you offer, and what you use.
        </p>
      </div>

      {/* Auto Reorder Alert (Premium) */}
      <div className="mb-6">
        <AutoReorderFeature />
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
             <button
              onClick={() => setActiveTab('SERVICES')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'SERVICES' 
                  ? 'border-amber-500 text-white' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Scissors className="w-4 h-4" /> Services
            </button>
            <button
              onClick={() => setActiveTab('PRODUCTS')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'PRODUCTS' 
                  ? 'border-amber-500 text-white' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Package className="w-4 h-4" /> Retail Products
            </button>
            <button
              onClick={() => setActiveTab('INVENTORY')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'INVENTORY' 
                  ? 'border-amber-500 text-white' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Archive className="w-4 h-4" /> Backbar & Suppliers
            </button>
            <button
              onClick={() => setActiveTab('CATEGORIES')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'CATEGORIES' 
                  ? 'border-amber-500 text-white' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Tag className="w-4 h-4" /> Categories
            </button>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {/* Premium: Quick Add from Catalog */}
          {hasPremiumCatalog && (activeTab === 'PRODUCTS' || activeTab === 'INVENTORY') && (
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-bold rounded-lg transition-all"
            >
              <ShoppingCart className="w-4 h-4" /> Catálogo Rápido
            </button>
          )}
          <button 
            onClick={() => {
              if (activeTab === 'SERVICES') openNewService();
              else if (activeTab === 'PRODUCTS') openNewProduct();
              else if (activeTab === 'INVENTORY') {
                  if (inventorySubTab === 'ITEMS') openNewInventoryItem();
                  else setIsSupplierModalOpen(true);
              }
            }}
            disabled={activeTab === 'CATEGORIES' || (activeTab === 'INVENTORY' && inventorySubTab === 'HISTORY') || (activeTab === 'PRODUCTS' && productSubTab === 'HISTORY')}
            className={`flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-bold rounded-lg transition-all ${activeTab === 'CATEGORIES' || (activeTab === 'INVENTORY' && inventorySubTab === 'HISTORY') || (activeTab === 'PRODUCTS' && productSubTab === 'HISTORY') ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <Plus className="w-4 h-4" /> New Item
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        
        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6 animate-fade-in">
             
             {/* Product Dashboard (KPIs) */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-lg">
                       <DollarSign className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                       <p className="text-xs text-zinc-500 font-bold uppercase">Inventory Cost Value</p>
                       <p className="text-xl font-bold text-white">${totalRetailCostValue.toFixed(2)}</p>
                       <p className="text-[10px] text-zinc-500">Asset value sitting on shelf</p>
                    </div>
                 </div>
                 
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                       <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                       <p className="text-xs text-zinc-500 font-bold uppercase">Revenue Potential</p>
                       <p className="text-xl font-bold text-white">${totalRetailRevenuePotential.toFixed(2)}</p>
                       <p className="text-[10px] text-zinc-500">If all {totalRetailUnits} units are sold</p>
                    </div>
                 </div>

                 <div className={`bg-zinc-900 border rounded-xl p-4 flex items-center gap-4 ${lowStockRetailCount > 0 ? 'border-amber-500/50' : 'border-zinc-800'}`}>
                    <div className={`p-3 rounded-lg ${lowStockRetailCount > 0 ? 'bg-amber-500/10' : 'bg-zinc-800'}`}>
                       <AlertTriangle className={`w-6 h-6 ${lowStockRetailCount > 0 ? 'text-amber-500' : 'text-zinc-500'}`} />
                    </div>
                    <div>
                       <p className="text-xs text-zinc-500 font-bold uppercase">Reorder Alerts</p>
                       <p className={`text-xl font-bold ${lowStockRetailCount > 0 ? 'text-amber-500' : 'text-zinc-500'}`}>
                          {lowStockRetailCount > 0 ? `${lowStockRetailCount} Products` : 'Stock Healthy'}
                       </p>
                       <p className="text-[10px] text-zinc-500">Items with 3 or fewer units</p>
                    </div>
                 </div>
              </div>

             {/* Sub Tabs */}
             <div className="flex space-x-2 bg-zinc-900 border border-zinc-800 p-1 rounded-lg w-full md:w-max">
                 <button 
                    onClick={() => setProductSubTab('LIST')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${productSubTab === 'LIST' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-white'}`}
                 >
                    Products List
                 </button>
                 <button 
                    onClick={() => setProductSubTab('HISTORY')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${productSubTab === 'HISTORY' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-white'}`}
                 >
                    <History className="w-3 h-3" /> Purchase History
                 </button>
             </div>

             {productSubTab === 'LIST' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4 hover:border-zinc-700 transition-all group">
                       <div className="w-24 h-24 bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                         {product.image ? (
                           <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-zinc-600">
                             <Package className="w-8 h-8" />
                           </div>
                         )}
                         {product.category && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] text-center py-1 font-bold uppercase truncate px-1">
                               {product.category}
                            </div>
                         )}
                       </div>
                       <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="text-white font-bold text-lg leading-tight">{product.name}</h4>
                           <div className="flex gap-1">
                              <button 
                                 onClick={() => openEditProduct(product)}
                                 className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                              >
                                 <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                 onClick={() => handleDeleteProduct(product.id)}
                                 className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-all"
                              >
                                 <Trash2 className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        </div>
                        
                        <div className="flex justify-between items-end mb-2">
                           <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.stock <= 3 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                              {product.stock} in stock
                           </span>
                           
                           {/* Restock Mini Form */}
                           {restockProductId === product.id ? (
                              <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-700 rounded-lg p-1 animate-fade-in absolute right-4 md:static z-20 shadow-xl">
                                 <input 
                                    type="number" 
                                    min="1" 
                                    className="w-10 bg-zinc-800 border border-zinc-600 rounded px-1 text-white text-[10px] text-center outline-none" 
                                    value={restockQty}
                                    onChange={e => setRestockQty(Number(e.target.value))}
                                 />
                                 <span className="text-[10px] text-zinc-500">@</span>
                                 <input 
                                    type="number" 
                                    min="0" 
                                    step="0.01"
                                    className="w-12 bg-zinc-800 border border-zinc-600 rounded px-1 text-white text-[10px] text-center outline-none" 
                                    value={restockCost}
                                    onChange={e => setRestockCost(Number(e.target.value))}
                                 />
                                 <button onClick={confirmProductRestock} className="bg-emerald-500 text-zinc-900 p-1 rounded hover:bg-emerald-400">
                                    <ArrowRightCircle className="w-3 h-3" />
                                 </button>
                                 <button onClick={() => setRestockProductId(null)} className="text-zinc-500 hover:text-white px-1">
                                    x
                                 </button>
                              </div>
                           ) : (
                              <button 
                                 onClick={() => startProductRestock(product)}
                                 className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors"
                              >
                                 <Plus className="w-3 h-3" /> Restock
                              </button>
                           )}
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-2 text-sm">
                           <div>
                             <span className="text-zinc-500 block text-xs">Sale Price</span>
                             <span className="text-amber-500 font-bold">${product.price}</span>
                           </div>
                           <div>
                             <span className="text-zinc-500 block text-xs">Last Cost</span>
                             <span className="text-zinc-300 font-medium">${product.costPrice || '-'}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             )}

             {productSubTab === 'HISTORY' && (
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm text-zinc-400">
                          <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold text-xs">
                             <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4 text-center">Qty Added</th>
                                <th className="px-6 py-4 text-right">Unit Cost</th>
                                <th className="px-6 py-4 text-right">Total Spent</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800">
                             {supplyTransactions.filter(t => t.itemType === 'PRODUCT').length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center italic text-zinc-600">No product purchases recorded.</td></tr>
                             ) : (
                                supplyTransactions
                                   .filter(t => t.itemType === 'PRODUCT')
                                   .sort((a,b) => b.date.getTime() - a.date.getTime())
                                   .map((t) => (
                                      <tr key={t.id} className="hover:bg-zinc-800/50 transition-colors">
                                         <td className="px-6 py-4 font-mono text-xs">{format(t.date, 'dd/MM/yyyy HH:mm')}</td>
                                         <td className="px-6 py-4 font-medium text-white">{t.itemName}</td>
                                         <td className="px-6 py-4 text-center">
                                            <span className="text-emerald-500 font-bold">+{t.quantity}</span>
                                         </td>
                                         <td className="px-6 py-4 text-right text-zinc-500">${t.unitCost.toFixed(2)}</td>
                                         <td className="px-6 py-4 text-right font-bold text-white">${t.totalCost.toFixed(2)}</td>
                                      </tr>
                                   ))
                             )}
                          </tbody>
                       </table>
                    </div>
                 </div>
             )}
          </div>
        )}

        {/* --- INVENTORY TAB --- */}
        {activeTab === 'INVENTORY' && (
           <div className="space-y-6 animate-fade-in">
              {/* Inventory Dashboard (KPIs) - The "Algo a mais" */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                       <DollarSign className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                       <p className="text-xs text-zinc-500 font-bold uppercase">Total Value On Hand</p>
                       <p className="text-xl font-bold text-white">${totalStockValue.toFixed(2)}</p>
                    </div>
                 </div>
                 
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-lg">
                       <Package className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                       <p className="text-xs text-zinc-500 font-bold uppercase">Total Units Stocked</p>
                       <p className="text-xl font-bold text-white">{totalItemsCount}</p>
                    </div>
                 </div>

                 <div className={`bg-zinc-900 border rounded-xl p-4 flex items-center gap-4 ${lowStockCount > 0 ? 'border-red-500/50' : 'border-zinc-800'}`}>
                    <div className={`p-3 rounded-lg ${lowStockCount > 0 ? 'bg-red-500/10' : 'bg-zinc-800'}`}>
                       <AlertTriangle className={`w-6 h-6 ${lowStockCount > 0 ? 'text-red-500' : 'text-zinc-500'}`} />
                    </div>
                    <div>
                       <p className="text-xs text-zinc-500 font-bold uppercase">Low Stock Alerts</p>
                       <p className={`text-xl font-bold ${lowStockCount > 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                          {lowStockCount > 0 ? `${lowStockCount} Items` : 'All Good'}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Inventory Sub-Tabs */}
              <div className="flex space-x-2 bg-zinc-900 border border-zinc-800 p-1 rounded-lg w-full md:w-max overflow-x-auto">
                 <button 
                    onClick={() => setInventorySubTab('ITEMS')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${inventorySubTab === 'ITEMS' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-white'}`}
                 >
                    Stock Items
                 </button>
                 <button 
                    onClick={() => setInventorySubTab('HISTORY')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${inventorySubTab === 'HISTORY' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-white'}`}
                 >
                    <History className="w-3 h-3" /> Inflow History
                 </button>
                 <button 
                    onClick={() => setInventorySubTab('SUPPLIERS')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${inventorySubTab === 'SUPPLIERS' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-white'}`}
                 >
                    <Truck className="w-3 h-3" /> Suppliers
                 </button>
              </div>

              {inventorySubTab === 'ITEMS' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inventory.map(item => {
                       const isLow = item.quantity <= item.minStock;
                       return (
                          <div key={item.id} className={`bg-zinc-900 border rounded-xl p-4 transition-all ${isLow ? 'border-red-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}>
                             <div className="flex justify-between items-start mb-3">
                                <div>
                                   <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-white text-lg">{item.name}</h4>
                                      {isLow && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                   </div>
                                   <p className="text-xs text-zinc-500">{item.category} • Cost: ${item.costPerUnit}/{item.unit.toLowerCase()}</p>
                                </div>
                                <button onClick={() => openEditInventoryItem(item)} className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all">
                                   <Edit2 className="w-4 h-4" />
                                </button>
                             </div>

                             <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-lg border border-zinc-800 mb-3">
                                <span className="text-xs font-bold text-zinc-500">Current Stock</span>
                                <span className={`text-xl font-bold ${isLow ? 'text-red-500' : 'text-white'}`}>
                                   {item.quantity} <span className="text-sm font-normal text-zinc-600">{item.unit}</span>
                                </span>
                             </div>

                             <div className="grid grid-cols-2 gap-2">
                                <button 
                                   onClick={() => adjustInventoryStock(item.id, 1, 'ADD')}
                                   className="flex items-center justify-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 py-2 rounded-lg text-xs font-bold transition-all"
                                >
                                   <Plus className="w-3 h-3" /> Quick Add
                                </button>
                                <button 
                                   onClick={() => adjustInventoryStock(item.id, 1, 'CONSUME')}
                                   className="flex items-center justify-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 py-2 rounded-lg text-xs font-bold transition-all"
                                >
                                   <ArrowDownCircle className="w-3 h-3" /> Consume
                                </button>
                             </div>
                          </div>
                       )
                    })}
                 </div>
              )}

              {/* FLUXO DE ENTRADA (Flow Table) */}
              {inventorySubTab === 'HISTORY' && (
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm text-zinc-400">
                          <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold text-xs">
                             <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Item Name</th>
                                <th className="px-6 py-4">Supplier</th>
                                <th className="px-6 py-4 text-center">Qty Added</th>
                                <th className="px-6 py-4 text-right">Unit Cost</th>
                                <th className="px-6 py-4 text-right">Total Spent</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800">
                             {supplyTransactions.filter(t => t.itemType === 'INVENTORY').length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center italic text-zinc-600">No purchase history found.</td></tr>
                             ) : (
                                supplyTransactions
                                   .filter(t => t.itemType === 'INVENTORY')
                                   .sort((a,b) => b.date.getTime() - a.date.getTime())
                                   .map((t) => {
                                      const supplierName = suppliers.find(s => s.id === t.supplierId)?.name || 'Unknown Supplier';
                                      return (
                                         <tr key={t.id} className="hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">{format(t.date, 'dd/MM/yyyy HH:mm')}</td>
                                            <td className="px-6 py-4 font-medium text-white">{t.itemName}</td>
                                            <td className="px-6 py-4">
                                               <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">{supplierName}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                               <span className="text-emerald-500 font-bold">+{t.quantity}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-zinc-500">${t.unitCost.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right font-bold text-white">${t.totalCost.toFixed(2)}</td>
                                         </tr>
                                      );
                                   })
                             )}
                          </tbody>
                       </table>
                    </div>
                 </div>
              )}

              {inventorySubTab === 'SUPPLIERS' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers.map(sup => (
                       <div 
                          key={sup.id} 
                          onClick={() => openSupplierDetails(sup)}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative group hover:border-amber-500/50 cursor-pointer transition-all"
                       >
                          <div className="flex items-start gap-4 mb-4">
                             <div className="bg-zinc-800 p-3 rounded-full">
                                <Truck className="w-6 h-6 text-zinc-400 group-hover:text-amber-500" />
                             </div>
                             <div>
                                <h4 className="font-bold text-white text-lg group-hover:text-amber-500 transition-colors">{sup.name}</h4>
                                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase font-bold">{sup.category}</span>
                             </div>
                          </div>
                          <div className="space-y-2 text-sm text-zinc-400">
                             <p><span className="text-zinc-600">Contact:</span> {sup.contactName || '-'}</p>
                             <p><span className="text-zinc-600">Phone:</span> {sup.phone}</p>
                          </div>
                          <div className="absolute top-4 right-4 flex gap-2">
                             <button 
                                onClick={(e) => {
                                   e.stopPropagation();
                                   deleteSupplier(sup.id);
                                }}
                                className="text-zinc-600 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-500 group-hover:text-white">
                             <Eye className="w-3 h-3" /> View Products & History
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        )}

        {/* --- CATEGORIES TAB --- */}
        {activeTab === 'CATEGORIES' && (
           <div className="max-w-4xl space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                 <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-amber-500" /> Category Management
                 </h3>
                 <p className="text-zinc-400 text-sm mb-6">
                    Define standardized categories for your Services, Retail Products, Inventory Supplies, and Suppliers.
                    <br />This prevents typos like &quot;Shampoo&quot; vs &quot;shampoo&quot; and keeps reports clean.
                 </p>

                 {/* Type Switcher */}
                 <div className="flex space-x-2 mb-6 bg-zinc-950 p-1 rounded-lg border border-zinc-800 w-full md:w-max overflow-x-auto">
                    {(['SERVICE', 'PRODUCT', 'SUPPLY', 'SUPPLIER'] as CategoryType[]).map(type => (
                       <button
                          key={type}
                          onClick={() => setCategoryType(type)}
                          className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                             categoryType === type ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-white'
                          }`}
                       >
                          {type === 'PRODUCT' ? 'Retail Products' : type.charAt(0) + type.slice(1).toLowerCase() + 's'}
                       </button>
                    ))}
                 </div>

                 {/* Add New Input */}
                 <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                    <input 
                       type="text" 
                       placeholder={`New ${categoryType.toLowerCase()} category...`}
                       value={newCategoryName}
                       onChange={e => setNewCategoryName(e.target.value)}
                       className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-amber-500 outline-none"
                    />
                    <button 
                       type="submit"
                       disabled={!newCategoryName.trim()}
                       className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-bold px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                       <Plus className="w-4 h-4" /> Add
                    </button>
                 </form>

                 {/* Category List */}
                 <div className="flex flex-wrap gap-2">
                    {categories.filter(c => c.type === categoryType).length === 0 ? (
                       <p className="text-zinc-500 text-sm italic py-4">No categories defined for this section.</p>
                    ) : (
                       categories.filter(c => c.type === categoryType).map(cat => (
                          <div key={cat.id} className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 group hover:border-amber-500/50 transition-colors">
                             <span className="text-sm font-medium text-white">{cat.name}</span>
                             <button 
                                onClick={() => deleteCategory(cat.id)}
                                className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                <Trash2 className="w-3.5 h-3.5" />
                             </button>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* --- SERVICES TAB --- */}
        {activeTab === 'SERVICES' && (
          <div className="space-y-4 animate-fade-in">
            {services.map((service) => (
              <div key={service.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-zinc-700 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                     <h4 className="text-white font-bold text-lg">{service.name}</h4>
                     {service.category && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold border border-zinc-700">
                           {service.category}
                        </span>
                     )}
                  </div>
                  <p className="text-zinc-500 text-sm mt-1">ID: {service.id}</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-center">
                    <span className="block text-xs text-zinc-500 mb-1">Duration</span>
                    <span className="text-white font-medium">{service.durationMinutes}m</span>
                   </div>
                   <div className="text-center">
                    <span className="block text-xs text-zinc-500 mb-1">Price</span>
                    <span className="text-amber-500 font-bold">${service.price}</span>
                   </div>
                   
                   {/* ACTIONS */}
                   <div className="flex gap-2 pl-4 border-l border-zinc-800">
                      <button 
                        onClick={() => openEditService(service)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                        title="Edit"
                      >
                         <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 text-zinc-600 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-all"
                        title="Delete"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>

      {/* MODALS */}
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} productToEdit={editingProduct} />
      <ServiceModal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} serviceToEdit={editingService} />
      <InventoryModal isOpen={isInventoryModalOpen} onClose={() => setIsInventoryModalOpen(false)} itemToEdit={editingInventoryItem} />
      <SupplierModal isOpen={isSupplierModalOpen} onClose={() => setIsSupplierModalOpen(false)} />
      <SupplierDetailsModal isOpen={isSupplierDetailsOpen} onClose={() => setIsSupplierDetailsOpen(false)} supplier={selectedSupplier} />
      
      {/* Premium: Quick Add from Catalog Modal */}
      <QuickAddFromCatalog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddProduct={(data) => {
          addProduct({
            name: data.name,
            price: data.price,
            costPrice: data.costPrice,
            stock: 0,
            category: data.category
          });
        }}
        onAddSupply={(data) => {
          const unitMap: Record<string, 'UNIT' | 'LITRE' | 'BOX' | 'PACK'> = {
            'unidade': 'UNIT', 'frasco': 'UNIT', 'pote': 'UNIT', 'lata': 'UNIT', 'bisnaga': 'UNIT',
            'litro': 'LITRE', 'galão': 'LITRE',
            'caixa': 'BOX',
            'pacote': 'PACK', 'cartela': 'PACK', 'rolo': 'PACK'
          };
          addInventoryItem({
            name: data.name,
            quantity: 0,
            costPerUnit: data.costPerUnit,
            minStock: data.minStock,
            unit: unitMap[data.unit.toLowerCase()] || 'UNIT',
            category: 'Geral'
          });
        }}
      />

    </div>
  );
};