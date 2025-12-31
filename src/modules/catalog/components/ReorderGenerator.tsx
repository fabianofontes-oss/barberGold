'use client';

import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Package,
  Archive,
  Truck,
  Copy,
  Check,
  MessageCircle,
  Mail,
  X,
  Plus,
  Minus,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Product, InventoryItem, Supplier } from '@/types';

interface ReorderItem {
  id: string;
  name: string;
  type: 'PRODUCT' | 'INVENTORY';
  currentStock: number;
  minStock: number;
  suggestedQty: number;
  orderQty: number;
  unitCost: number;
  supplierId?: string;
}

interface ReorderGeneratorProps {
  products: Product[];
  inventory: InventoryItem[];
  suppliers: Supplier[];
  productThreshold?: number;
  shopName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReorderGenerator: React.FC<ReorderGeneratorProps> = ({
  products,
  inventory,
  suppliers,
  productThreshold = 3,
  shopName,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRODUCTS' | 'INVENTORY'>('ALL');

  // Gerar lista de itens para reposiÃ§Ã£o
  const reorderItems = useMemo(() => {
    const items: ReorderItem[] = [];

    // Produtos com estoque baixo
    products
      .filter((p) => p.stock <= productThreshold)
      .forEach((p) => {
        const suggestedQty = Math.max(10, productThreshold * 3 - p.stock);
        items.push({
          id: p.id,
          name: p.name,
          type: 'PRODUCT',
          currentStock: p.stock,
          minStock: productThreshold,
          suggestedQty,
          orderQty: suggestedQty,
          unitCost: p.costPrice || 0,
        });
      });

    // Insumos com estoque baixo
    inventory
      .filter((i) => i.quantity <= i.minStock)
      .forEach((i) => {
        const suggestedQty = Math.max(i.minStock * 2, i.minStock * 3 - i.quantity);
        items.push({
          id: i.id,
          name: i.name,
          type: 'INVENTORY',
          currentStock: i.quantity,
          minStock: i.minStock,
          suggestedQty,
          orderQty: suggestedQty,
          unitCost: i.costPerUnit || 0,
          supplierId: i.supplierId,
        });
      });

    return items;
  }, [products, inventory, productThreshold]);

  const [orderItems, setOrderItems] = useState<ReorderItem[]>(reorderItems);

  // Atualizar quando reorderItems mudar
  React.useEffect(() => {
    setOrderItems(reorderItems);
  }, [reorderItems]);

  const updateOrderQty = (id: string, delta: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, orderQty: Math.max(0, item.orderQty + delta) } : item
      )
    );
  };

  const filteredItems =
    activeTab === 'ALL'
      ? orderItems
      : orderItems.filter((i) => (activeTab === 'PRODUCTS' ? i.type === 'PRODUCT' : i.type === 'INVENTORY'));

  const totalItems = filteredItems.reduce((sum, i) => sum + i.orderQty, 0);
  const totalCost = filteredItems.reduce((sum, i) => sum + i.orderQty * i.unitCost, 0);

  // Gerar texto do pedido
  const generateOrderText = () => {
    const date = format(new Date(), "dd/MM/yyyy 'Ã s' HH:mm", { locale: ptBR });
    const lines: string[] = [];

    lines.push(`ðŸ“¦ PEDIDO DE REPOSIÃ‡ÃƒO - ${shopName.toUpperCase()}`);
    lines.push(`ðŸ“… Data: ${date}`);
    lines.push('');
    lines.push('â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”');
    lines.push('');

    // Agrupar por fornecedor (para insumos)
    const bySupplier: Record<string, ReorderItem[]> = {};
    const noSupplier: ReorderItem[] = [];

    filteredItems.forEach((item) => {
      if (item.orderQty > 0) {
        if (item.supplierId) {
          if (!bySupplier[item.supplierId]) bySupplier[item.supplierId] = [];
          bySupplier[item.supplierId].push(item);
        } else {
          noSupplier.push(item);
        }
      }
    });

    // Itens sem fornecedor definido
    if (noSupplier.length > 0) {
      lines.push('ðŸ“‹ ITENS PARA PEDIDO:');
      lines.push('');
      noSupplier.forEach((item) => {
        const icon = item.type === 'PRODUCT' ? 'ðŸ·ï¸' : 'ðŸ“¦';
        lines.push(`${icon} ${item.name}`);
        lines.push(`   Qtd: ${item.orderQty} unidades`);
        lines.push(`   Estoque atual: ${item.currentStock}`);
        lines.push('');
      });
    }

    // Itens por fornecedor
    Object.entries(bySupplier).forEach(([supplierId, items]) => {
      const supplier = suppliers.find((s) => s.id === supplierId);
      lines.push(`ðŸšš FORNECEDOR: ${supplier?.name || 'Desconhecido'}`);
      if (supplier?.phone) lines.push(`   ðŸ“ž ${supplier.phone}`);
      lines.push('');
      items.forEach((item) => {
        lines.push(`   ðŸ“¦ ${item.name} - ${item.orderQty} unidades`);
      });
      lines.push('');
    });

    lines.push('â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”');
    lines.push('');
    lines.push(`ðŸ“Š RESUMO:`);
    lines.push(`   Total de itens: ${totalItems}`);
    lines.push(`   Custo estimado: R$ ${totalCost.toFixed(2)}`);
    lines.push('');
    lines.push('Gerado por BarberFlow ðŸ’ˆ');

    return lines.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOrderText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(generateOrderText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-2xl shadow-2xl animate-fade-in overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Gerar Pedido de ReposiÃ§Ã£o</h2>
              <p className="text-xs text-zinc-500">{reorderItems.length} itens com estoque baixo</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-zinc-800">
          {(['ALL', 'PRODUCTS', 'INVENTORY'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab ? 'bg-amber-500 text-zinc-900' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {tab === 'ALL' && <FileText className="w-3 h-3" />}
              {tab === 'PRODUCTS' && <Package className="w-3 h-3" />}
              {tab === 'INVENTORY' && <Archive className="w-3 h-3" />}
              {tab === 'ALL' ? 'Todos' : tab === 'PRODUCTS' ? 'Produtos' : 'Insumos'}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Check className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
              <p className="text-sm">Nenhum item com estoque baixo!</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.type === 'PRODUCT' ? 'bg-indigo-500/10' : 'bg-teal-500/10'
                    }`}
                  >
                    {item.type === 'PRODUCT' ? (
                      <Package className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Archive className="w-5 h-5 text-teal-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-zinc-500">
                      Estoque: <span className="text-red-400">{item.currentStock}</span> / MÃ­n: {item.minStock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">
                    R$ {(item.orderQty * item.unitCost).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <button
                      onClick={() => updateOrderQty(item.id, -1)}
                      className="p-2 text-zinc-500 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-white">{item.orderQty}</span>
                    <button
                      onClick={() => updateOrderQty(item.id, 1)}
                      className="p-2 text-zinc-500 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-zinc-500">Total de itens</p>
              <p className="text-lg font-bold text-white">{totalItems} unidades</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500">Custo estimado</p>
              <p className="text-lg font-bold text-amber-500">R$ {totalCost.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Pedido'}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Enviar WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
