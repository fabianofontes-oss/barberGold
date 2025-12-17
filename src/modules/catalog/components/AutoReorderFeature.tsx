'use client';

import React, { useState } from 'react';
import { Crown, Lock, ShoppingCart, Bell, Zap } from 'lucide-react';
import { useBarber } from '@/context/BarberContext';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { LowStockAlert } from './LowStockAlert';
import { ReorderGenerator } from './ReorderGenerator';

export const AutoReorderFeature: React.FC = () => {
  const { products, inventory, suppliers, shopProfile, currentTenantPlanId } = useBarber();
  const { canUseFeature } = useFeatureGate();
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  const isFreePlan = currentTenantPlanId === 'FREE';
  const hasAutoReorder = canUseFeature('ADVANCED_REPORTS'); // Usar feature gate existente ou criar nova

  const lowStockProducts = products.filter((p) => p.stock <= 3);
  const lowStockInventory = inventory.filter((i) => i.quantity <= i.minStock);
  const totalLowStock = lowStockProducts.length + lowStockInventory.length;

  // Se plano FREE, mostra upsell
  if (isFreePlan) {
    return (
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Crown className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              Pedido Automático
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold uppercase">
                Premium
              </span>
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Gere pedidos de reposição automaticamente quando o estoque estiver baixo. 
              Envie direto para o WhatsApp do fornecedor.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Bell className="w-3 h-3" /> Alertas de estoque
              </span>
              <span className="flex items-center gap-1">
                <ShoppingCart className="w-3 h-3" /> Pedido em 1 clique
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" /> WhatsApp automático
              </span>
            </div>
          </div>
          <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 text-xs font-bold rounded-lg whitespace-nowrap">
            Ver Planos
          </button>
        </div>
      </div>
    );
  }

  // Se não há itens com estoque baixo
  if (totalLowStock === 0) {
    return null;
  }

  return (
    <>
      <LowStockAlert
        products={products}
        inventory={inventory}
        productThreshold={3}
        onViewDetails={() => setIsReorderModalOpen(true)}
      />

      <ReorderGenerator
        products={products}
        inventory={inventory}
        suppliers={suppliers}
        productThreshold={3}
        shopName={shopProfile.name || 'Barbearia'}
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
      />
    </>
  );
};
