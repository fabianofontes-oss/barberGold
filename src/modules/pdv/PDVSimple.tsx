'use client';

import { useState } from 'react';
import { useClients } from '@/modules/clients/hooks/useClients';
import { useSales } from '@/modules/sales/hooks/useSales';
import { listServicesAction } from '@/modules/services/actions';
import { listProductsAction } from '@/modules/products/actions';
import { listStaffAction } from '@/modules/staff/actions';
import { useEffect } from 'react';
import { ShoppingBag, Trash2, CreditCard, Banknote, Smartphone, Loader2, UserPlus, X } from 'lucide-react';

type CartItem = {
  type: 'SERVICE' | 'PRODUCT';
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export const PDVSimple = () => {
  const { clients, addClient } = useClients();
  const { createSale } = useSales();
  
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'PAYMENT' | 'SUCCESS'>('CART');
  const [tipAmount, setTipAmount] = useState<number>(0);
  
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  useEffect(() => {
    async function loadData() {
      const [servicesData, productsData, staffData] = await Promise.all([
        listServicesAction({ isActive: true }),
        listProductsAction({ isActive: true }),
        listStaffAction({ isActive: true }),
      ]);
      setServices(servicesData);
      setProducts(productsData);
      setStaff(staffData);
      setLoading(false);
    }
    loadData();
  }, []);

  const addToCart = (item: any) => {
    setCart([...cart, {
      type: item.type || (item.durationMinutes ? 'SERVICE' : 'PRODUCT'),
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    }]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + tipAmount;

  const handleCheckout = async (method: string) => {
    if (!selectedClientId || !selectedStaffId) return;
    
    await createSale({
      clientId: selectedClientId,
      staffId: selectedStaffId,
      items: cart,
      paymentMethod: method as any,
      subtotal,
      discount: 0,
      tip: tipAmount,
      total,
    });

    setCheckoutStep('SUCCESS');
    setTimeout(() => {
      setCart([]);
      setSelectedClientId('');
      setSelectedStaffId('');
      setTipAmount(0);
      setCheckoutStep('CART');
    }, 2000);
  };

  const handleQuickAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newClientName && newClientPhone) {
      const newId = await addClient({
        name: newClientName,
        phone: newClientPhone,
        email: '',
        birthDate: '',
      });
      setSelectedClientId(newId);
      setNewClientName('');
      setNewClientPhone('');
      setIsClientModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (checkoutStep === 'SUCCESS') {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
          <ShoppingBag className="w-10 h-10 text-zinc-950" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Venda Concluída!</h2>
        <p className="text-zinc-400">Transação registrada com sucesso.</p>
      </div>
    );
  }

  const allItems = [...services.map(s => ({ ...s, type: 'SERVICE' })), ...products.map(p => ({ ...p, type: 'PRODUCT' }))];

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col">
        <h2 className="text-3xl font-bold text-white mb-4">Ponto de Venda</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 overflow-y-auto pb-4">
          {allItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-amber-500 transition-all"
            >
              <h4 className="font-medium text-white text-sm mb-2">{item.name}</h4>
              <p className="text-amber-500 font-bold">R$ {item.price.toFixed(2)}</p>
              <p className="text-xs text-zinc-500 mt-1">{item.type}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col p-6">
        <h3 className="text-xl font-bold text-white mb-4">Carrinho</h3>
        
        <div className="space-y-3 mb-4">
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white"
          >
            <option value="">Selecionar Cliente</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white"
          >
            <option value="">Selecionar Profissional</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-zinc-950 p-3 rounded-lg">
              <div>
                <p className="text-white font-medium text-sm">{item.name}</p>
                <p className="text-xs text-zinc-500">{item.type}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-amber-500 font-bold">R$ {item.price.toFixed(2)}</span>
                <button onClick={() => removeFromCart(idx)} className="text-zinc-600 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-4 pt-4 border-t border-zinc-800">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          {checkoutStep === 'PAYMENT' && (
            <div className="flex justify-between text-amber-500">
              <span>Gorjeta</span>
              <input
                type="number"
                min="0"
                step="1"
                value={tipAmount}
                onChange={(e) => setTipAmount(Number(e.target.value))}
                className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-right"
              />
            </div>
          )}
          <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-zinc-800">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        {checkoutStep === 'CART' ? (
          <button
            disabled={cart.length === 0 || !selectedClientId || !selectedStaffId}
            onClick={() => setCheckoutStep('PAYMENT')}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-900 font-bold py-4 rounded-xl transition-all"
          >
            Prosseguir para Pagamento
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleCheckout('CASH')}
              className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl flex flex-col items-center gap-2"
            >
              <Banknote className="w-6 h-6 text-zinc-400" />
              <span className="text-xs text-white">Dinheiro</span>
            </button>
            <button
              onClick={() => handleCheckout('CREDIT_CARD')}
              className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl flex flex-col items-center gap-2"
            >
              <CreditCard className="w-6 h-6 text-zinc-400" />
              <span className="text-xs text-white">Cartão</span>
            </button>
            <button
              onClick={() => handleCheckout('PIX')}
              className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl flex flex-col items-center gap-2"
            >
              <Smartphone className="w-6 h-6 text-zinc-400" />
              <span className="text-xs text-white">Pix</span>
            </button>
          </div>
        )}
      </div>

      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Novo Cliente</h3>
              <button onClick={() => setIsClientModalOpen(false)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleQuickAddClient} className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                required
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                required
              />
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-3 rounded-xl"
              >
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
