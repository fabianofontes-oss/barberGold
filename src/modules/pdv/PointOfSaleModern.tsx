'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  DollarSign, 
  User, 
  CreditCard, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';
import { 
  listSalesAction, 
  processSaleAction,
  type Sale,
  type CreateSaleInput 
} from '@/modules/sales';

/**
 * PDV Moderno - Conectado ao Supabase
 * Usa Server Actions para processar vendas
 */
export const PointOfSaleModern = () => {
  // State
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // Carrinho
  const [cart, setCart] = useState<Array<{
    item_type: 'service' | 'product';
    item_id: string;
    name: string;
    price: number;
    quantity: number;
  }>>([]);
  
  // Form da venda
  const [clientId, setClientId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX'>('CASH');
  const [tip, setTip] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  // Calcular totais
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount + tip);

  // Carregar vendas recentes
  useEffect(() => {
    loadRecentSales();
  }, []);

  const loadRecentSales = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await listSalesAction({
        limit: 10,
        sort_by: 'created_at',
        sort_order: 'desc',
      });

      if (result.success) {
        setSales(result.data.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao carregar vendas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar item ao carrinho
  const addToCart = (item: typeof cart[0]) => {
    const existing = cart.find(i => i.item_id === item.item_id && i.item_type === item.item_type);
    
    if (existing) {
      setCart(cart.map(i => 
        i.item_id === item.item_id && i.item_type === item.item_type
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Remover item do carrinho
  const removeFromCart = (itemId: string, itemType: 'service' | 'product') => {
    setCart(cart.filter(i => !(i.item_id === itemId && i.item_type === itemType)));
  };

  // Atualizar quantidade
  const updateQuantity = (itemId: string, itemType: 'service' | 'product', delta: number) => {
    setCart(cart.map(i => {
      if (i.item_id === itemId && i.item_type === itemType) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  // Processar venda
  const handleProcessSale = async () => {
    if (cart.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    if (!staffId) {
      alert('Selecione um profissional!');
      return;
    }

    startTransition(async () => {
      const saleInput: CreateSaleInput = {
        client_id: clientId || null,
        staff_id: staffId,
        items: cart.map(item => ({
          item_type: item.item_type,
          item_id: item.item_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod,
        tip: tip,
        discount: discount,
        notes: notes || null,
      };

      // Settings de comissão (simplificado - você pode buscar do Supabase)
      const staffSettings = {
        commissionType: 'PERCENTAGE' as const,
        commissionRate: 50,
      };

      const shopSettings = {
        discountRule: 'SHARED' as const,
      };

      const result = await processSaleAction(saleInput, staffSettings, shopSettings);
      
      if (result.success) {
        // Limpar carrinho
        setCart([]);
        setClientId('');
        setTip(0);
        setDiscount(0);
        setNotes('');
        
        // Recarregar vendas
        await loadRecentSales();
        
        alert('Venda processada com sucesso!');
      } else {
        alert(`Erro: ${result.error}`);
      }
    });
  };

  // Limpar carrinho
  const clearCart = () => {
    if (cart.length > 0 && confirm('Limpar carrinho?')) {
      setCart([]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ponto de Venda</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {sales.length} venda(s) hoje
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Carrinho */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seleção de Cliente e Staff */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Informações da Venda</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2">
                  Cliente (Opcional)
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="UUID do cliente"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2">
                  Profissional *
                </label>
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder="UUID do profissional"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Itens do Carrinho */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-amber-500" />
                <h2 className="text-lg font-bold text-white">
                  Carrinho ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
                </h2>
              </div>
              
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400">Carrinho vazio</p>
                <p className="text-zinc-500 text-sm mt-2">
                  Adicione serviços ou produtos para começar
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {cart.map((item) => (
                  <div key={`${item.item_type}-${item.item_id}`} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-zinc-400 text-sm">
                        R$ {item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.item_id, item.item_type, -1)}
                          className="p-1 hover:bg-zinc-700 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-white font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.item_id, item.item_type, 1)}
                          className="p-1 hover:bg-zinc-700 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.item_id, item.item_type)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Add (Simplificado) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">Quick Add (Demo)</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => addToCart({
                  item_type: 'service',
                  item_id: 'service-1',
                  name: 'Corte Simples',
                  price: 35,
                  quantity: 1,
                })}
                className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-left"
              >
                <p className="font-medium">Corte Simples</p>
                <p className="text-sm text-zinc-400">R$ 35,00</p>
              </button>

              <button
                onClick={() => addToCart({
                  item_type: 'service',
                  item_id: 'service-2',
                  name: 'Barba',
                  price: 25,
                  quantity: 1,
                })}
                className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-left"
              >
                <p className="font-medium">Barba</p>
                <p className="text-sm text-zinc-400">R$ 25,00</p>
              </button>
            </div>
          </div>
        </div>

        {/* Resumo e Pagamento */}
        <div className="space-y-6">
          {/* Totais */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-500" />
              Totais
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Desconto</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500 outline-none"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Gorjeta</label>
                <input
                  type="number"
                  value={tip}
                  onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500 outline-none"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-2xl font-bold text-amber-500">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              Pagamento
            </h3>

            <div className="space-y-2">
              {(['CASH', 'PIX', 'DEBIT_CARD', 'CREDIT_CARD'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                    paymentMethod === method
                      ? 'bg-amber-500 text-zinc-900'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {method === 'CASH' && 'Dinheiro'}
                  {method === 'PIX' && 'PIX'}
                  {method === 'DEBIT_CARD' && 'Cartão de Débito'}
                  {method === 'CREDIT_CARD' && 'Cartão de Crédito'}
                </button>
              ))}
            </div>
          </div>

          {/* Botão Finalizar */}
          <button
            onClick={handleProcessSale}
            disabled={isPending || cart.length === 0 || !staffId}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Finalizar Venda
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vendas Recentes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Vendas Recentes</h2>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-zinc-400">Nenhuma venda registrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-zinc-400 uppercase">Data</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-zinc-400 uppercase">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-zinc-400 uppercase">Pagamento</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-zinc-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-white">
                      {new Date(sale.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-white">
                      R$ {sale.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {sale.payment_method}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-bold bg-green-500/20 text-green-400 rounded-full">
                        Concluída
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

