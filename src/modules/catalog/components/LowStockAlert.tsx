'use client';

import React from 'react';
import { AlertTriangle, Package, Archive, ChevronRight } from 'lucide-react';
import type { Product, InventoryItem } from '@/types';

interface LowStockAlertProps {
  products: Product[];
  inventory: InventoryItem[];
  productThreshold?: number;
  onViewDetails?: () => void;
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({
  products,
  inventory,
  productThreshold = 3,
  onViewDetails,
}) => {
  const lowStockProducts = products.filter((p) => p.stock <= productThreshold);
  const lowStockInventory = inventory.filter((i) => i.quantity <= i.minStock);

  const totalAlerts = lowStockProducts.length + lowStockInventory.length;

  if (totalAlerts === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/30 to-zinc-900 border border-amber-500/30 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {totalAlerts} {totalAlerts === 1 ? 'Item' : 'Itens'} com Estoque Baixo
            </h3>
            <p className="text-sm text-zinc-400 mb-3">
              Recomendamos fazer pedido de reposição para evitar falta de produtos.
            </p>

            <div className="flex flex-wrap gap-2">
              {lowStockProducts.length > 0 && (
                <div className="flex items-center gap-2 bg-zinc-950/50 px-3 py-1.5 rounded-lg">
                  <Package className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-zinc-300">
                    <strong className="text-white">{lowStockProducts.length}</strong> produto{lowStockProducts.length > 1 ? 's' : ''} para venda
                  </span>
                </div>
              )}
              {lowStockInventory.length > 0 && (
                <div className="flex items-center gap-2 bg-zinc-950/50 px-3 py-1.5 rounded-lg">
                  <Archive className="w-4 h-4 text-teal-400" />
                  <span className="text-xs text-zinc-300">
                    <strong className="text-white">{lowStockInventory.length}</strong> insumo{lowStockInventory.length > 1 ? 's' : ''} backbar
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 text-sm font-bold rounded-lg transition-all"
          >
            Ver Detalhes <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
