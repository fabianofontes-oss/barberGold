'use client';

import React, { useState, useEffect } from 'react';
import { useBarber } from '@/context/BarberContext';
import { 
  Search, 
  Trash2, 
  CreditCard, 
  Banknote, 
  Smartphone,
  ShoppingBag,
  User,
  Scissors,
  Package,
  Gift,
  Star,
  Zap,
  HandCoins,
  Wallet,
  Calculator,
  UserPlus,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Grid3X3,
  DollarSign
} from 'lucide-react';
import { CartItem, PaymentMethod } from '@/types';
import { differenceInDays } from 'date-fns';
import { ClubCreditBadge } from '@/modules/barber-club/components/ClubCreditBadge';
import { CashRegister } from './components/CashRegister';

// Icon Map for dynamic payments
const PAYMENT_ICONS: Record<string, any> = {
   [PaymentMethod.CASH]: Banknote,
   [PaymentMethod.CREDIT_CARD]: CreditCard,
   [PaymentMethod.DEBIT_CARD]: CreditCard,
   [PaymentMethod.PIX]: Smartphone,
   [PaymentMethod.GOOGLE_PAY]: Wallet,
   [PaymentMethod.APPLE_PAY]: Wallet,
   [PaymentMethod.MERCADO_PAGO]: ShoppingBag,
   [PaymentMethod.PAGSEGURO]: Calculator,
   [PaymentMethod.INFINITE_PAY]: Zap,
   [PaymentMethod.STONE]: Calculator,
   [PaymentMethod.OTHER]: Banknote
};

const PAYMENT_LABELS: Record<string, string> = {
   [PaymentMethod.CASH]: 'Dinheiro',
   [PaymentMethod.CREDIT_CARD]: 'Crédito',
   [PaymentMethod.DEBIT_CARD]: 'Débito',
   [PaymentMethod.PIX]: 'Pix',
   [PaymentMethod.GOOGLE_PAY]: 'Google Pay',
   [PaymentMethod.APPLE_PAY]: 'Apple Pay',
   [PaymentMethod.MERCADO_PAGO]: 'Mercado Pago',
   [PaymentMethod.PAGSEGURO]: 'PagSeguro',
   [PaymentMethod.INFINITE_PAY]: 'InfinitePay',
   [PaymentMethod.STONE]: 'Stone',
   [PaymentMethod.OTHER]: 'Outro'
};

export const PointOfSale = () => {
  const { services, products, processSale, clients, staff, shopSettings, addClient } = useBarber();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [checkoutStep, setCheckoutStep] = useState<'CART' | 'PAYMENT' | 'SUCCESS'>('CART');
  const [tipAmount, setTipAmount] = useState<number>(0);
  
  // Mobile View State
  const [mobileView, setMobileView] = useState<'CATALOG' | 'CART'>('CATALOG');
  
  // Display Mode: GRID (cards com imagem), LIST (linhas), COMPACT (grid pequeno)
  const [displayMode, setDisplayMode] = useState<'GRID' | 'LIST' | 'COMPACT'>('GRID');
  
  // Quick Add Client State
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  // Discount State
  const [activeDiscount, setActiveDiscount] = useState<{type: string, amount: number} | null>(null);

  // Club Credit State
  const [clubCreditApplied, setClubCreditApplied] = useState(false);

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState<{code: string, discount: number} | null>(null);

  // Split Payment State
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [splitPayments, setSplitPayments] = useState<{method: PaymentMethod, amount: number}[]>([]);

  // Cash Register State
  const [isCashRegisterOpen, setIsCashRegisterOpen] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Mock promo codes (could come from backend later)
  const PROMO_CODES: Record<string, number> = {
    'BEMVINDO10': 0.10,
    'VOLTA15': 0.15,
    'AMIGO20': 0.20,
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (PROMO_CODES[code]) {
      setPromoApplied({ code, discount: PROMO_CODES[code] });
      setPromoError('');
    } else {
      setPromoError('Cupom inválido');
      setPromoApplied(null);
    }
  };

  const handleAddSplitPayment = (method: PaymentMethod, amount: number) => {
    setSplitPayments(prev => [...prev, { method, amount }]);
  };

  const handleRemoveSplitPayment = (index: number) => {
    setSplitPayments(prev => prev.filter((_, i) => i !== index));
  };

  const splitTotal = splitPayments.reduce((sum, p) => sum + p.amount, 0);

  // Auto-detect Discounts when client changes
  useEffect(() => {
    if (!selectedClient) {
      setActiveDiscount(null);
      return;
    }

    // 1. Birthday Check
    if (shopSettings.enableBirthdayDiscount && selectedClient.birthDate) {
      const today = new Date();
      const birth = new Date(selectedClient.birthDate);
      if (birth.getDate() === today.getDate() && birth.getMonth() === today.getMonth()) {
        setActiveDiscount({ type: 'BIRTHDAY', amount: 0.05 }); // 5%
        return;
      }
    }

    // 2. Win-Back Check (> 60 days)
    if (shopSettings.enableWinBackDiscount && selectedClient.lastVisit) {
      const daysSince = differenceInDays(new Date(), selectedClient.lastVisit);
      if (daysSince > 60) {
        setActiveDiscount({ type: 'WINBACK', amount: 0.05 }); // 5%
        return;
      }
    }
    
    setActiveDiscount(null);
  }, [selectedClientId, shopSettings, clients]);

  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
    if (cart.length <= 1) setMobileView('CATALOG'); // Auto close if empty
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  let discountAmount = 0;
  
  if (activeDiscount) {
    if (activeDiscount.type === 'REWARD_REDEMPTION') {
       // Free Lowest Service logic
       const servicesInCart = cart.filter(c => c.type === 'SERVICE').sort((a,b) => a.price - b.price);
       if (servicesInCart.length > 0) {
         discountAmount = servicesInCart[0].price;
       }
    } else {
       // Percentage based
       discountAmount = subtotal * activeDiscount.amount;
    }
  }

  // Promo code discount
  const promoDiscount = promoApplied ? subtotal * promoApplied.discount : 0;

  const total = subtotal - discountAmount - promoDiscount;
  const grandTotal = total + (tipAmount || 0);
  const splitRemaining = grandTotal - splitTotal;

  // Use the item's category if available, otherwise fallback to generic Type
  const filteredItems = [
    ...services, 
    ...products
  ].filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCheckout = (method: PaymentMethod) => {
    if (!selectedClientId) return; // Enforce Client
    
    const staffId = selectedStaffId || staff[0]?.id;
    processSale(cart, selectedClientId, staffId, method, activeDiscount?.type, tipAmount);
    setCheckoutStep('SUCCESS');
    setTimeout(() => {
      setCart([]);
      setSelectedClientId('');
      setSelectedStaffId('');
      setTipAmount(0);
      setCheckoutStep('CART');
      setMobileView('CATALOG');
      setActiveDiscount(null);
    }, 2000);
  };

  const handleQuickAddClient = (e: React.FormEvent) => {
     e.preventDefault();
     if (newClientName && newClientPhone) {
        const newId = addClient({
           name: newClientName,
           phone: newClientPhone,
           email: '',
           birthDate: ''
        });
        
        // Auto Select the new client
        setSelectedClientId(newId);

        // Reset and close
        setNewClientName('');
        setNewClientPhone('');
        setIsClientModalOpen(false);
     }
  };

  const redeemLoyalty = () => {
    if (selectedClient && (selectedClient.loyaltyPoints || 0) >= 10) {
      setActiveDiscount({ type: 'REWARD_REDEMPTION', amount: 0 }); // Amount calculated dynamically
    }
  };

  if (checkoutStep === 'SUCCESS') {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
          <ShoppingBag className="w-10 h-10 text-zinc-950" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Sale Completed!</h2>
        <p className="text-zinc-400">Transaction recorded successfully.</p>
        {tipAmount > 0 && <p className="text-amber-500 font-bold mt-2">+ ${tipAmount.toFixed(2)} Tip for Barber</p>}
      </div>
    );
  }

  // Determine enabled methods (Use In-Store Config)
  const enabledMethods = shopSettings.paymentSettings?.inStore || [PaymentMethod.CASH, PaymentMethod.CREDIT_CARD, PaymentMethod.PIX];

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] relative">
      <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Item Selection (Hidden on Mobile if Cart Open) */}
        <div className={`flex-col h-full ${mobileView === 'CART' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-bold text-white">Point of Sale</h2>
              <button
                onClick={() => setIsCashRegisterOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-zinc-300 text-sm font-bold transition-all"
              >
                <DollarSign className="w-4 h-4" /> Caixa
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search services or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>

            {/* Quick Access & View Toggle */}
            <div className="flex justify-between items-center mt-3">
              {/* Quick Access - Top Services */}
              {!searchQuery && services.length > 0 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 flex-1">
                  {services.slice(0, 4).map(service => (
                    <button
                      key={service.id}
                      onClick={() => addToCart(service)}
                      className="flex-shrink-0 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" /> {service.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 ml-2 flex-shrink-0">
                <button
                  onClick={() => setDisplayMode('GRID')}
                  className={`p-1.5 rounded transition-all ${displayMode === 'GRID' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-white'}`}
                  title="Grade Grande"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDisplayMode('COMPACT')}
                  className={`p-1.5 rounded transition-all ${displayMode === 'COMPACT' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-white'}`}
                  title="Grade Compacta"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDisplayMode('LIST')}
                  className={`p-1.5 rounded transition-all ${displayMode === 'LIST' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-white'}`}
                  title="Lista"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* GRID VIEW (Default) */}
          {displayMode === 'GRID' && (
          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 gap-3 pb-24 lg:pb-0 scrollbar-hide">
            {filteredItems.map((item, idx) => (
              <button 
                key={`${item.id}-${idx}`}
                onClick={() => addToCart(item)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-0 flex flex-col items-start hover:border-amber-500 transition-all text-left group overflow-hidden relative shadow-sm"
              >
                 {item.type === 'PRODUCT' && 'image' in item && item.image && (
                   <div className="w-full h-24 sm:h-32 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   </div>
                 )}
                 {(!('image' in item) || !item.image) && (
                    <div className="w-full h-24 sm:h-32 bg-zinc-950 flex items-center justify-center">
                      {item.type === 'SERVICE' ? <Scissors className="w-8 h-8 text-zinc-700" /> : <Package className="w-8 h-8 text-zinc-700" />}
                    </div>
                 )}

                <div className="p-3 w-full">
                  <div className="flex justify-between w-full mb-1">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      item.type === 'SERVICE' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      {item.category || item.type}
                    </span>
                    <span className="font-bold text-white text-sm">${item.price}</span>
                  </div>
                  <h4 className="font-medium text-zinc-300 text-sm group-hover:text-amber-500 transition-colors line-clamp-1">{item.name}</h4>
                </div>
              </button>
            ))}
          </div>
          )}

          {/* COMPACT VIEW */}
          {displayMode === 'COMPACT' && (
          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-3 md:grid-cols-4 gap-2 pb-24 lg:pb-0 scrollbar-hide">
            {filteredItems.map((item, idx) => (
              <button 
                key={`${item.id}-${idx}`}
                onClick={() => addToCart(item)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 flex flex-col items-center justify-center hover:border-amber-500 transition-all text-center group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${item.type === 'SERVICE' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                  {item.type === 'SERVICE' ? <Scissors className="w-4 h-4 text-blue-400" /> : <Package className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[10px] text-zinc-400 font-medium line-clamp-1 w-full">{item.name}</p>
                <p className="text-xs text-amber-500 font-bold">${item.price}</p>
              </button>
            ))}
          </div>
          )}

          {/* LIST VIEW */}
          {displayMode === 'LIST' && (
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 pb-24 lg:pb-0 scrollbar-hide">
            {filteredItems.map((item, idx) => (
              <button 
                key={`${item.id}-${idx}`}
                onClick={() => addToCart(item)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center justify-between hover:border-amber-500 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'SERVICE' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                    {item.type === 'SERVICE' ? <Scissors className="w-5 h-5 text-blue-400" /> : <Package className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-white font-medium group-hover:text-amber-500 transition-colors">{item.name}</p>
                    <p className="text-[10px] text-zinc-500">{item.category || item.type}</p>
                  </div>
                </div>
                <span className="text-amber-500 font-bold">${item.price}</span>
              </button>
            ))}
          </div>
          )}
        </div>

        {/* Right: Cart & Checkout (Full Screen on Mobile when active) */}
        <div className={`lg:col-span-1 bg-zinc-900 border border-zinc-800 lg:rounded-2xl flex flex-col h-full shadow-2xl absolute inset-0 z-30 lg:relative lg:z-0 lg:block ${mobileView === 'CART' ? 'block' : 'hidden'}`}>
          {/* Mobile Header for Cart */}
          <div className="lg:hidden p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
             <h3 className="font-bold text-white text-lg">Carrinho ({cart.length})</h3>
             <button onClick={() => setMobileView('CATALOG')} className="p-2 bg-zinc-800 rounded-full text-zinc-400">
                <ChevronDown className="w-5 h-5" />
             </button>
          </div>

          <div className="p-4 sm:p-6 border-b border-zinc-800 space-y-4 bg-zinc-900">
            {/* Desktop Header */}
            <h3 className="text-xl font-bold text-white hidden lg:block">Current Sale</h3>
            
            <div className="grid grid-cols-2 gap-3">
               <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <div className="flex gap-2">
                     <select 
                       value={selectedClientId}
                       onChange={(e) => setSelectedClientId(e.target.value)}
                       className={`flex-1 bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-amber-500 ${!selectedClientId ? 'text-zinc-500 border-red-500/30' : 'text-zinc-300'}`}
                     >
                       <option value="" disabled>Client (Required)</option>
                       {clients.map(c => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                       ))}
                     </select>
                     <button 
                        onClick={() => setIsClientModalOpen(true)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors border border-zinc-700"
                        title="Quick Add Client"
                     >
                        <UserPlus className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               <div className="relative">
                  <Scissors className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <select 
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm text-zinc-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="" disabled>Staff...</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
               </div>
            </div>

            {/* Loyalty & Discount Context */}
            {selectedClient && (
              <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-zinc-400">Loyalty Status</span>
                    <span className="text-xs font-bold text-amber-500">{selectedClient.loyaltyPoints || 0}/10 Stamps</span>
                 </div>
                 
                 {/* Redeem Button */}
                 {(selectedClient.loyaltyPoints || 0) >= 10 && shopSettings.enableLoyaltyCard && !activeDiscount && (
                   <button 
                     onClick={redeemLoyalty}
                     className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 text-xs font-bold py-1.5 rounded animate-pulse"
                   >
                      Redeem Free Cut Reward
                   </button>
                 )}

                 {/* Active Discount Display */}
                 {activeDiscount && (
                   <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-400">
                         {activeDiscount.type === 'BIRTHDAY' ? '🎂 Birthday Deal' : 
                          activeDiscount.type === 'WINBACK' ? '👋 Win-Back Promo' : 
                          activeDiscount.type === 'CLUB_CREDIT' ? '👑 Crédito do Clube' : '🏆 Reward Claimed'}
                      </span>
                      <button onClick={() => { setActiveDiscount(null); setClubCreditApplied(false); }} className="text-zinc-500 hover:text-white">
                         <Trash2 className="w-3 h-3" />
                      </button>
                   </div>
                 )}

                 {/* Barber Club Credit */}
                 {!clubCreditApplied && !activeDiscount && (
                   <div className="mt-2">
                     <ClubCreditBadge
                       clientId={selectedClientId}
                       serviceId={cart.find(c => c.type === 'SERVICE')?.id}
                       serviceName={cart.find(c => c.type === 'SERVICE')?.name}
                       servicePrice={cart.find(c => c.type === 'SERVICE')?.price}
                       staffId={selectedStaffId}
                       staffName={staff.find(s => s.id === selectedStaffId)?.name}
                       disabled={cart.filter(c => c.type === 'SERVICE').length === 0}
                       onRedeemCredit={() => {
                         const serviceInCart = cart.find(c => c.type === 'SERVICE');
                         if (serviceInCart) {
                           setActiveDiscount({ type: 'CLUB_CREDIT', amount: serviceInCart.price / subtotal });
                           setClubCreditApplied(true);
                         }
                       }}
                     />
                   </div>
                 )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center text-zinc-500 py-10">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                  <div className="flex items-center gap-3">
                     {item.type === 'PRODUCT' && 'image' in item && item.image && (
                        <img src={item.image} className="w-8 h-8 rounded object-cover" />
                     )}
                     <div>
                      <p className="text-zinc-200 font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.category || item.type}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-amber-500 font-medium">${item.price}</span>
                    <button onClick={() => removeFromCart(idx)} className="text-zinc-600 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-zinc-950 rounded-b-2xl border-t border-zinc-800 pb-safe">
            <div className="space-y-2 mb-6">
               <div className="flex justify-between items-center text-sm text-zinc-500">
                 <span>Subtotal</span>
                 <span>${subtotal.toFixed(2)}</span>
               </div>
               {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm text-emerald-500 font-bold">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
               )}

               {/* Promo Code Discount */}
               {promoDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm text-purple-400 font-bold">
                    <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> Cupom {promoApplied?.code}</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
               )}

               {/* Promo Code Input */}
               {checkoutStep === 'CART' && !promoApplied && cart.length > 0 && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cupom promocional"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white uppercase focus:border-purple-500 outline-none"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoCode}
                      className="bg-purple-500 hover:bg-purple-400 disabled:bg-zinc-700 text-white text-xs font-bold px-3 rounded-lg"
                    >
                      Aplicar
                    </button>
                  </div>
               )}
               {promoError && <p className="text-red-400 text-xs">{promoError}</p>}
               
               {checkoutStep === 'PAYMENT' && (
                  <div className="flex justify-between items-center text-sm text-amber-500 font-bold bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <span className="flex items-center gap-1"><HandCoins className="w-3 h-3" /> Tip (100% to Staff)</span>
                    <div className="flex items-center gap-1">
                       <span className="text-zinc-500 text-xs">$</span>
                       <input 
                          type="number" 
                          min="0" 
                          step="1"
                          className="w-16 bg-transparent text-right outline-none focus:border-b border-amber-500"
                          value={tipAmount}
                          onChange={e => setTipAmount(Number(e.target.value))}
                       />
                    </div>
                  </div>
               )}

               <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                 <span className="text-zinc-300 font-bold">Total Due</span>
                 <span className="text-3xl font-bold text-white">${grandTotal.toFixed(2)}</span>
               </div>
            </div>

            {checkoutStep === 'CART' ? (
              <button 
                disabled={cart.length === 0 || !selectedStaffId || !selectedClientId}
                onClick={() => setCheckoutStep('PAYMENT')}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                {!selectedClientId ? 'Select Client' : (selectedStaffId ? 'Proceed to Payment' : 'Select Staff')}
              </button>
            ) : (
              <div className="space-y-3">
                {/* Split Payment Toggle */}
                <div className="flex items-center justify-between bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-400 font-bold">Dividir pagamento?</span>
                  <button
                    onClick={() => {
                      setIsSplitPayment(!isSplitPayment);
                      setSplitPayments([]);
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${isSplitPayment ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    {isSplitPayment ? 'Sim' : 'Não'}
                  </button>
                </div>

                {/* Split Payment UI */}
                {isSplitPayment && (
                  <div className="bg-zinc-900 p-3 rounded-lg border border-purple-500/30 space-y-3">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Falta pagar:</span>
                      <span className={`font-bold ${splitRemaining > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        ${splitRemaining.toFixed(2)}
                      </span>
                    </div>

                    {/* Added Payments */}
                    {splitPayments.map((sp, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-zinc-950 p-2 rounded">
                        <span className="text-xs text-zinc-300">{PAYMENT_LABELS[sp.method]}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-bold">${sp.amount.toFixed(2)}</span>
                          <button onClick={() => handleRemoveSplitPayment(idx)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Payment */}
                    {splitRemaining > 0 && (
                      <div className="grid grid-cols-4 gap-1">
                        {enabledMethods.slice(0, 4).map(method => {
                          const Icon = PAYMENT_ICONS[method] || Banknote;
                          return (
                            <button
                              key={method}
                              onClick={() => {
                                const amount = parseFloat(prompt(`Valor em ${PAYMENT_LABELS[method]}:`) || '0');
                                if (amount > 0 && amount <= splitRemaining) {
                                  handleAddSplitPayment(method, amount);
                                }
                              }}
                              className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded flex flex-col items-center gap-1"
                            >
                              <Icon className="w-4 h-4 text-zinc-400" />
                              <span className="text-[8px] text-zinc-400">{PAYMENT_LABELS[method]?.slice(0, 6)}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Finalize Split Payment */}
                    {splitRemaining <= 0.01 && splitPayments.length > 0 && (
                      <button
                        onClick={() => handleCheckout(splitPayments[0].method)}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg"
                      >
                        ✓ Finalizar Pagamento
                      </button>
                    )}
                  </div>
                )}

                {/* Normal Payment Grid */}
                {!isSplitPayment && (
                  <div className="grid grid-cols-3 gap-2">
                    {enabledMethods.map(method => {
                       const Icon = PAYMENT_ICONS[method] || Banknote;
                       return (
                          <button 
                             key={method} 
                             onClick={() => handleCheckout(method)} 
                             className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors border border-transparent hover:border-zinc-600"
                          >
                             <Icon className="w-6 h-6 text-zinc-400" />
                             <span className="text-[10px] font-medium text-white text-center leading-tight">
                                {PAYMENT_LABELS[method] || method}
                             </span>
                          </button>
                       );
                    })}
                  </div>
                )}
                
                <button 
                  onClick={() => { setCheckoutStep('CART'); setIsSplitPayment(false); setSplitPayments([]); }}
                  className="w-full mt-2 text-zinc-500 hover:text-white text-sm py-2"
                >
                  Back to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING CART BAR */}
      {cart.length > 0 && mobileView === 'CATALOG' && (
         <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 bg-zinc-950 border-t border-zinc-800 z-20 safe-area-bottom">
            <button 
               onClick={() => setMobileView('CART')}
               className="w-full bg-amber-500 text-zinc-900 font-bold py-3 rounded-xl shadow-lg flex justify-between items-center px-6 animate-fade-in-up"
            >
               <span className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> {cart.length} itens</span>
               <div className="flex items-center gap-2">
                  <span>Ver Carrinho</span>
                  <span className="bg-black/20 px-2 py-0.5 rounded text-sm">${grandTotal.toFixed(2)}</span>
                  <ChevronUp className="w-4 h-4" />
               </div>
            </button>
         </div>
      )}

      {/* QUICK ADD CLIENT MODAL */}
      {isClientModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 w-full h-full md:h-auto md:max-w-sm p-6 shadow-2xl animate-fade-in md:rounded-2xl border-0 md:border md:border-zinc-800 flex flex-col justify-center">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Quick Add Client</h3>
                  <button onClick={() => setIsClientModalOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-800 p-2 rounded-full"><X className="w-5 h-5"/></button>
               </div>
               <form onSubmit={handleQuickAddClient} className="space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-zinc-400 mb-2">Full Name</label>
                     <input 
                        type="text" 
                        required 
                        value={newClientName}
                        onChange={e => setNewClientName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none text-lg"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-zinc-400 mb-2">Phone (Required)</label>
                     <input 
                        type="tel" 
                        required 
                        value={newClientPhone}
                        onChange={e => setNewClientPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none text-lg"
                     />
                  </div>
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 mt-4 text-lg shadow-lg">
                     <Save className="w-5 h-5" /> Save Client
                  </button>
               </form>
            </div>
         </div>
      )}

      {/* Cash Register Modal */}
      <CashRegister 
        isOpen={isCashRegisterOpen} 
        onClose={() => setIsCashRegisterOpen(false)} 
      />
    </div>
  );
};