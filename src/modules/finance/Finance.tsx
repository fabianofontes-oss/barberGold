'use client';


import React, { useState, useEffect } from 'react';
import { useBarber } from '@/context/BarberContext';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { ExpenseQuickAdd } from './components/ExpenseQuickAdd';
import { RegisterClosureModal } from './components/RegisterClosureModal';
import { PremiumFeatures } from './components/PremiumFeatures';
import { 
  TrendingDown,
  Trash2,
  Lock,
  Activity,
  AlertTriangle,
  Laptop2,
  CheckCircle2,
  Crown,
  Briefcase,
  Home,
  Wallet,
  LayoutDashboard,
  Receipt,
  Users,
  CreditCard,
  Banknote,
  Smartphone,
  PieChart,
  HandCoins,
  ArrowRightCircle,
  CalendarClock,
  Landmark,
  Calculator,
  CalendarDays
} from 'lucide-react';
import { format, isSameDay, isSameWeek, isSameMonth, startOfDay } from 'date-fns';
import { CompensationModel, Expense, PaymentMethod, StaffMember, Sale } from '@/types';

export const Finance = () => {
  const { sales, staff, expenses, staffPayments, addExpense, removeExpense, addStaffPayment, currentUser, shopSettings, currentTenantPlanId } = useBarber();
  const { canUseFeature } = useFeatureGate();
  
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXPENSES' | 'PAYOUTS'>('OVERVIEW');
  const [activeContext, setActiveContext] = useState<'BUSINESS' | 'PERSONAL'>('BUSINESS');
  const [dateFilter, setDateFilter] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'ALL'>('MONTH'); // NEW: Date Filter
  
  if (!currentUser) return null;
  
  const isOwner = currentUser.role === 'OWNER';
  const hasAdvancedReports = canUseFeature('ADVANCED_REPORTS');
  const isFreePlan = currentTenantPlanId === 'FREE';

  // Force Tab to Payouts if not Owner
  useEffect(() => {
     if (!isOwner) {
        setActiveTab('PAYOUTS');
     }
  }, [isOwner]);
  
  // Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false);
  const [selectedStaffForPayout, setSelectedStaffForPayout] = useState<StaffMember | null>(null);
  
  // Forms
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    title: '',
    amount: 0,
    category: 'UTILITIES',
    context: 'BUSINESS',
    date: new Date()
  });

  const [payoutForm, setPayoutForm] = useState({
     amount: 0,
     type: 'PAYOUT' as 'PAYOUT' | 'ADVANCE',
     notes: ''
  });

  // --- FILTERING HELPERS ---
  const filterByDate = (date: Date) => {
     const today = new Date();
     if (dateFilter === 'ALL') return true;
     if (dateFilter === 'TODAY') return isSameDay(date, today);
     if (dateFilter === 'WEEK') return isSameWeek(date, today);
     if (dateFilter === 'MONTH') return isSameMonth(date, today);
     return true;
  };

  const filteredSales = sales.filter(s => filterByDate(s.date));
  const filteredExpenses = expenses.filter(e => filterByDate(e.date));
  // Note: Payouts/Staff Payments usually filter by date for history, but balances are lifetime.
  const filteredPayoutsHistory = staffPayments.filter(p => filterByDate(p.date));

  // --- FINANCIAL CALCULATIONS (FILTERED) ---
  
  // 1. Sales Breakdown by Method
  const salesByMethod = filteredSales.reduce((acc, sale) => {
    acc[sale.method] = (acc[sale.method] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.total, 0);
  const totalTips = filteredSales.reduce((acc, sale) => acc + (sale.tip || 0), 0); // NEW: Tips

  // 2. Staff Payouts Calculation & Logic
  // Filter: If Owner, show all. If Staff, show ONLY self.
  const relevantStaff = isOwner ? staff : staff.filter(s => s.id === currentUser.id);

  const staffBreakdown = relevantStaff.map(member => {
    // For LIFETIME Balance, we need ALL sales/payments. For PERIOD stats, we use filtered.
    // Let's calculate LIFETIME for NetPayable, but also calculate PERIOD Earnings for display.
    
    const allMemberSales = sales.filter(s => s.staffId === member.id);
    const allMemberPayments = staffPayments.filter(p => p.staffId === member.id);
    
    const calculateEarnings = (salesList: Sale[]) => {
       let serviceComm = 0;
       let productComm = 0;
       let tips = 0;
       const houseRev = 0;

       salesList.forEach(sale => {
          tips += (sale.tip || 0);
          
          const serviceItems = sale.items.filter(i => i.type === 'SERVICE');
          const productItems = sale.items.filter(i => i.type === 'PRODUCT');
          
          const listPriceService = serviceItems.reduce((sum, i) => sum + i.price, 0);
          const listPriceProduct = productItems.reduce((sum, i) => sum + i.price, 0);
          const listPriceTotal = listPriceService + listPriceProduct;
          const netPaid = sale.total; // Excludes tip

          let baseService = listPriceService;
          let baseProduct = listPriceProduct;

          if (shopSettings.discountAllocation === 'SHARED') {
             if (listPriceTotal > 0) {
                const ratio = netPaid / listPriceTotal;
                baseService = listPriceService * ratio;
                baseProduct = listPriceProduct * ratio;
             } else {
                baseService = 0;
                baseProduct = 0;
             }
          }

          serviceComm += baseService * (member.serviceCommissionRate / 100);
          productComm += baseProduct * (member.productCommissionRate / 100);
       });

       // Logic based on Model
       let gross = 0;
       let house = 0;

       if (member.commissionModel === CompensationModel.PERCENTAGE || member.commissionModel === CompensationModel.OWNER) {
          gross = serviceComm + productComm + tips; // Tips go 100% to staff
          const revenueNoTips = salesList.reduce((acc, s) => acc + s.total, 0);
          house = revenueNoTips - (serviceComm + productComm); // House doesn't keep tips
       } else if (member.commissionModel === CompensationModel.CHAIR_RENTAL) {
          // Chair Rental Logic
          // Earnings = (Service Revenue - Rent) + Product Comm + Tips
          // Simplified for aggregate: Just sum commissions (assuming Rent is deducted monthly elsewhere or handled manually in Payouts? 
          // Usually Rent is a deduction. Let's subtract rent only if filtering by Month? Too complex.
          // Let's stick to standard accumulation:
          const serviceRev = salesList.reduce((acc, s) => acc + s.items.filter(i => i.type === 'SERVICE').reduce((sum, i) => sum + i.price, 0), 0); // Approx
          gross = serviceComm + productComm + tips; // Note: In rental, serviceComm is usually 100%. 
       }

       return { gross, house, tips };
    };

    const lifetimeStats = calculateEarnings(allMemberSales);
    const periodStats = calculateEarnings(allMemberSales.filter(s => filterByDate(s.date))); // Sales in selected period

    // Deduct Rent? 
    // If calculating Net Payable, we should technically deduct Rent. 
    // For MVP, we'll assume Rent is handled via manual "Expenses" or manual "Payout" adjustments (negative payout?) 
    // Or simpler: Staff owes rent. 
    // Let's keep it simple: NetPayable = Earnings - Payments.

    const totalPaidOut = allMemberPayments.reduce((acc, p) => acc + p.amount, 0);
    const netPayable = lifetimeStats.gross - totalPaidOut;

    return {
      ...member,
      lifetimeEarnings: lifetimeStats.gross,
      periodEarnings: periodStats.gross,
      periodTips: periodStats.tips,
      totalPaidOut,
      netPayable,
      houseSharePeriod: periodStats.house,
      role: member.role
    };
  });

  // 3. Expenses Classification (Filtered)
  const businessExpensesList = filteredExpenses.filter(e => e.context !== 'PERSONAL');
  const personalExpensesList = filteredExpenses.filter(e => e.context === 'PERSONAL');

  const isFixedCost = (category: string) => ['RENT', 'UTILITIES', 'SYSTEM'].includes(category);
  
  const fixedBizExpenses = businessExpensesList.filter(e => isFixedCost(e.category)).reduce((sum, e) => sum + e.amount, 0);
  const variableBizExpenses = businessExpensesList.filter(e => !isFixedCost(e.category)).reduce((sum, e) => sum + e.amount, 0);
  const systemExpenses = businessExpensesList.filter(e => e.category === 'SYSTEM').reduce((sum, e) => sum + e.amount, 0);
  
  const totalBizExpenses = fixedBizExpenses + variableBizExpenses;
  
  // 4. CASH FLOW ANALYSIS (Filtered)
  const totalPayoutsMadePeriod = filteredPayoutsHistory.reduce((acc, p) => acc + p.amount, 0);
  
  // Net Cash Flow for Period = Revenue (Period) - Expenses (Period) - Payouts (Period)
  // Revenue includes Tips in the till? Yes, technically it's cash in drawer until paid out.
  // totalRevenue variable above excludes tips. Let's add tips to Cash In.
  const totalCashIn = totalRevenue + totalTips;
  
  const netCashFlow = totalCashIn - totalBizExpenses - totalPayoutsMadePeriod;

  // 4. Personal Context (CPF)
  const totalPersonalExpenses = personalExpensesList.reduce((sum, e) => sum + e.amount, 0);
  const personalBalance = netCashFlow - totalPersonalExpenses;

  // Break-even (Period)
  const totalHouseSharePeriod = staffBreakdown.reduce((acc, s) => acc + s.houseSharePeriod, 0);
  const remainingToBreakEven = Math.max(0, totalBizExpenses - totalHouseSharePeriod);
  const breakEvenPercent = totalBizExpenses > 0 ? (totalHouseSharePeriod / totalBizExpenses) * 100 : 100;
  const systemCostRatio = totalHouseSharePeriod > 0 ? (systemExpenses / totalHouseSharePeriod) * 100 : 0;

  // --- ACTIONS ---

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.title && newExpense.amount) {
      addExpense({
        title: newExpense.title,
        amount: Number(newExpense.amount),
        category: newExpense.category as any,
        context: newExpense.context as any,
        date: new Date(newExpense.date || new Date())
      });
      setIsExpenseModalOpen(false);
      setNewExpense({ title: '', amount: 0, category: 'UTILITIES', context: activeContext, date: new Date() });
    }
  };

  const handleCreatePayout = (e: React.FormEvent) => {
     e.preventDefault();
     if (selectedStaffForPayout && payoutForm.amount > 0) {
        addStaffPayment({
           staffId: selectedStaffForPayout.id,
           amount: Number(payoutForm.amount),
           type: payoutForm.type,
           date: new Date(),
           notes: payoutForm.notes
        });
        setIsPayoutModalOpen(false);
        setPayoutForm({ amount: 0, type: 'PAYOUT', notes: '' });
        setSelectedStaffForPayout(null);
     }
  }

  const openPayoutModal = (staffMember: any) => {
     if (!isOwner) return; 
     setSelectedStaffForPayout(staffMember);
     setPayoutForm({ amount: 0, type: 'PAYOUT', notes: '' });
     setIsPayoutModalOpen(true);
  }

  const openTemplateExpense = (template: Partial<Expense>) => {
    setNewExpense({
      ...newExpense,
      title: template.title,
      category: template.category,
      amount: template.amount,
      context: template.context || activeContext,
      date: new Date()
    });
    if (template.context && template.context !== activeContext) {
      setActiveContext(template.context as any);
    }
    setIsExpenseModalOpen(true);
  };

  const openNewExpenseModal = () => {
     setNewExpense({ 
        title: '', 
        amount: 0, 
        category: activeContext === 'BUSINESS' ? 'UTILITIES' : 'PERSONAL', 
        context: activeContext, 
        date: new Date() 
     });
     setIsExpenseModalOpen(true);
  }

  const isSystemExpense = newExpense.category === 'SYSTEM';

  return (
    <div className="h-full flex flex-col animate-fade-in">
      
      {/* HEADER & CONTEXT SWITCHER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{isOwner ? 'Finance' : 'My Earnings'}</h2>
          <p className="text-zinc-400">
             {isOwner 
               ? (activeContext === 'BUSINESS' ? 'Business Intelligence (CNPJ)' : 'Personal Wealth (CPF)')
               : 'Track your commissions and payouts.'
             }
          </p>
        </div>

        <div className="flex gap-4">
           {/* DATE FILTER */}
           <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
              <button onClick={() => setDateFilter('TODAY')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${dateFilter === 'TODAY' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Today</button>
              <button onClick={() => setDateFilter('WEEK')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${dateFilter === 'WEEK' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Week</button>
              <button onClick={() => setDateFilter('MONTH')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${dateFilter === 'MONTH' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Month</button>
              <button onClick={() => setDateFilter('ALL')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${dateFilter === 'ALL' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>All</button>
           </div>

           {isOwner && !isFreePlan && (
             <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
               <button 
                 onClick={() => setActiveContext('BUSINESS')}
                 className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${activeContext === 'BUSINESS' ? 'bg-amber-500 text-zinc-900 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
               >
                   <Briefcase className="w-4 h-4" /> Biz
               </button>
               <button 
                 onClick={() => setActiveContext('PERSONAL')}
                 className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${activeContext === 'PERSONAL' ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
               >
                   <Home className="w-4 h-4" /> Personal
               </button>
             </div>
           )}
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex justify-start items-center mb-6 border-b border-zinc-800 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
           {isOwner && (
             <>
               <button
                  onClick={() => setActiveTab('OVERVIEW')}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'OVERVIEW' 
                      ? 'border-amber-500 text-white' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Visão Geral
                </button>
                {!isFreePlan && (
                  <button
                    onClick={() => setActiveTab('EXPENSES')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'EXPENSES' 
                        ? 'border-amber-500 text-white' 
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Receipt className="w-4 h-4" /> Custos e Despesas
                  </button>
                )}
             </>
           )}
           
           {(isOwner || !isOwner) && activeContext === 'BUSINESS' && !isFreePlan && (
             <button
               onClick={() => setActiveTab('PAYOUTS')}
               className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                 activeTab === 'PAYOUTS' 
                   ? 'border-amber-500 text-white' 
                   : 'border-transparent text-zinc-500 hover:text-zinc-300'
               }`}
             >
               <Users className="w-4 h-4" /> {isOwner ? 'Pagamentos da Equipe' : 'Meus Pagamentos'}
             </button>
          )}
        </div>
      </div>

      {isFreePlan && (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-500" />
            <div className="text-sm">
              <p className="text-zinc-200 font-bold">Funcionalidade Avançada Bloqueada</p>
              <p className="text-zinc-400 text-xs">
                Controle de despesas, comissões detalhadas e DRE estão disponíveis apenas nos planos Start, Pro e Elite.
              </p>
            </div>
          </div>
          <button className="bg-amber-500 hover:bg-amber-400 text-zinc-900 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
            Ver Planos
          </button>
        </div>
      )}

      {/* --- TAB CONTENT: OVERVIEW (OWNER ONLY) --- */}
      {activeTab === 'OVERVIEW' && isOwner && (
        <div className="space-y-6 animate-fade-in pb-20">
            
            {/* FEATURE GATE: ADVANCED REPORTS */}
            {hasAdvancedReports ? (
              <>
                {/* Break-Even Monitor */}
                {activeContext === 'BUSINESS' && (
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-end mb-4 relative z-10">
                      <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {remainingToBreakEven > 0 ? <AlertTriangle className="text-amber-500" /> : <CheckCircle2 className="text-emerald-500" />}
                            Lucratividade da Loja ({dateFilter})
                          </h3>
                          <p className="text-zinc-400 text-sm mt-1">
                            {remainingToBreakEven > 0 
                              ? `A casa precisa de $${remainingToBreakEven.toFixed(2)} a mais para cobrir as despesas do período.` 
                              : "A loja está cobrindo todos os custos! O excedente cobre pagamentos e lucro."}
                          </p>
                      </div>
                      <div className="text-right">
                          <span className={`text-2xl font-bold ${remainingToBreakEven > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {breakEvenPercent.toFixed(0)}%
                          </span>
                          <span className="text-zinc-500 text-sm block">Cobertura de Custos</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-4 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 relative z-10">
                      <div 
                          className={`h-full transition-all duration-1000 ${remainingToBreakEven > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, breakEvenPercent)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* REAL CASH FLOW STATEMENT CARD */}
                <div className={`bg-gradient-to-br from-zinc-900 to-zinc-950 border ${activeContext === 'BUSINESS' ? 'border-zinc-800' : 'border-indigo-500/30'} p-6 rounded-2xl relative overflow-hidden`}>
                   {activeContext === 'BUSINESS' ? (
                      <>
                         <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                            <div className="flex items-center gap-2">
                               <Landmark className="w-6 h-6 text-amber-500" />
                               <h3 className="text-xl font-bold text-white">Fluxo de Caixa Líquido ({dateFilter})</h3>
                            </div>
                            <span className="text-xs text-zinc-500">O que realmente está no caixa</span>
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-zinc-400">Receita Total (Serviços + Produtos + Gorjetas)</span>
                               <span className="text-white font-bold">${totalCashIn.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-zinc-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Despesas da Loja</span>
                               <span className="text-red-400">-${totalBizExpenses.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-zinc-400 flex items-center gap-1"><Users className="w-3 h-3" /> Pagamentos da Equipe (Pagos)</span>
                               <span className="text-red-400">-${totalPayoutsMadePeriod.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-zinc-800 mt-2">
                               <span className="text-lg font-bold text-white">Saldo de Caixa Líquido</span>
                               <span className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                  ${netCashFlow.toFixed(2)}
                               </span>
                            </div>
                         </div>
                      </>
                   ) : (
                      <>
                         <div className="flex items-center gap-2 mb-6 border-b border-indigo-500/20 pb-4">
                            <Wallet className="w-6 h-6 text-indigo-500" />
                            <h3 className="text-xl font-bold text-white">Patrimônio Pessoal ({dateFilter})</h3>
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-zinc-400">Disponível da Loja (Caixa Líquido)</span>
                               <span className="text-emerald-400 font-bold">${netCashFlow.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-zinc-400">Despesas Pessoais</span>
                               <span className="text-red-400">-${totalPersonalExpenses.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-zinc-800 mt-2">
                               <span className="text-lg font-bold text-white">Seu Bolso</span>
                               <span className={`text-2xl font-bold ${personalBalance >= 0 ? 'text-indigo-400' : 'text-red-500'}`}>
                                  ${personalBalance.toFixed(2)}
                               </span>
                            </div>
                         </div>
                      </>
                   )}
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-[11px] text-zinc-300">
                <p className="font-semibold text-amber-400 mb-1">
                  Relatórios avançados indisponíveis no seu plano atual.
                </p>
                <p>
                  Para ver lucro real, ponto de equilíbrio e detalhes financeiros completos,
                  faça upgrade para <span className="font-semibold">Solo PRO</span> ou superior.
                </p>
              </div>
            )}

            {/* KPI Cards (Detailed) - Always visible as Basic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                 <div className="flex items-center gap-2 mb-2">
                    <HandCoins className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium text-zinc-400">Receita Total</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                     ${totalRevenue.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-zinc-500">Vendas Brutas</span>
              </div>

              {!isFreePlan && (
                <>
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-zinc-400">Custos Fixos</span>
                      </div>
                      <p className="text-2xl font-bold text-white">${activeContext === 'BUSINESS' ? fixedBizExpenses.toFixed(2) : totalPersonalExpenses.toFixed(2)}</p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-medium text-zinc-400">Custos Variáveis</span>
                      </div>
                      <p className="text-2xl font-bold text-white">${activeContext === 'BUSINESS' ? variableBizExpenses.toFixed(2) : '0.00'}</p>
                  </div>
                </>
              )}
            </div>

            {/* PAYMENT METHODS BREAKDOWN (Cash Drawer Control) */}
            {activeContext === 'BUSINESS' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                       <PieChart className="w-5 h-5 text-amber-500" /> Composição do Caixa
                    </h3>
                    
                    {/* CLOSE REGISTER BUTTON (Feature Toggle Check) */}
                    {shopSettings.enableCashControl && !isFreePlan && (
                       <button 
                          onClick={() => setIsClosureModalOpen(true)}
                          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-300 text-xs font-bold py-2 px-4 rounded-lg transition-colors border border-zinc-700"
                       >
                          <Calculator className="w-4 h-4" /> Fechar Caixa
                       </button>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Cash */}
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center gap-3">
                       <div className="p-2 bg-emerald-500/10 rounded-lg">
                          <Banknote className="w-5 h-5 text-emerald-500" />
                       </div>
                       <div>
                          <p className="text-xs text-zinc-500 uppercase font-bold">Dinheiro</p>
                          <p className="text-lg font-bold text-white">${(salesByMethod[PaymentMethod.CASH] || 0).toFixed(2)}</p>
                       </div>
                    </div>
                    {/* Card */}
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center gap-3">
                       <div className="p-2 bg-blue-500/10 rounded-lg">
                          <CreditCard className="w-5 h-5 text-blue-500" />
                       </div>
                       <div>
                          <p className="text-xs text-zinc-500 uppercase font-bold">Crédito/Débito</p>
                          <p className="text-lg font-bold text-white">${((salesByMethod[PaymentMethod.CREDIT_CARD] || 0) + (salesByMethod[PaymentMethod.DEBIT_CARD] || 0)).toFixed(2)}</p>
                       </div>
                    </div>
                    {/* Pix */}
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center gap-3">
                       <div className="p-2 bg-teal-500/10 rounded-lg">
                          <Smartphone className="w-5 h-5 text-teal-500" />
                       </div>
                       <div>
                          <p className="text-xs text-zinc-500 uppercase font-bold">Pix</p>
                          <p className="text-lg font-bold text-white">${(salesByMethod[PaymentMethod.PIX] || 0).toFixed(2)}</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Premium Features Section */}
            <PremiumFeatures
              sales={sales}
              expenses={expenses}
              staffPayments={staffPayments}
              filteredSales={filteredSales}
              filteredExpenses={filteredExpenses}
              filteredPayouts={filteredPayoutsHistory}
              totalRevenue={totalRevenue}
              totalTips={totalTips}
              staffPayoutsTotal={totalPayoutsMadePeriod}
              fixedExpenses={fixedBizExpenses}
              variableExpenses={variableBizExpenses}
              currentMonthRevenue={sales.filter(s => isSameMonth(new Date(s.date), new Date())).reduce((sum, s) => sum + s.total, 0)}
              currentWeekRevenue={sales.filter(s => isSameWeek(new Date(s.date), new Date())).reduce((sum, s) => sum + s.total, 0)}
              period={dateFilter}
            />
        </div>
      )}

      {/* --- TAB CONTENT: EXPENSES (OWNER ONLY) --- */}
      {activeTab === 'EXPENSES' && isOwner && !isFreePlan && (
         <div className="flex-1 overflow-y-auto pb-20 animate-fade-in">
            {/* Quick Add */}
            <ExpenseQuickAdd onSelectTemplate={openTemplateExpense} activeContext={activeContext} />
            
            {/* Expense List Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white">Histórico de Despesas ({dateFilter})</h3>
              <button onClick={openNewExpenseModal} className="text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
                 <TrendingDown className="w-4 h-4 text-red-500" /> Adicionar Personalizada
              </button>
            </div>

            <div className="space-y-3">
               {(activeContext === 'BUSINESS' ? businessExpensesList : personalExpensesList).length === 0 ? (
                  <div className="text-center text-zinc-500 py-10 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <TrendingDown className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhuma despesa registrada para este período.</p>
                  </div>
               ) : (
                  (activeContext === 'BUSINESS' ? businessExpensesList : personalExpensesList).map(exp => (
                    <div key={exp.id} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800 group hover:border-zinc-700 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${isFixedCost(exp.category) ? 'bg-blue-500/10' : 'bg-orange-500/10'}`}>
                             {exp.category === 'SYSTEM' ? <Crown className="w-5 h-5 text-amber-500" /> : 
                              isFixedCost(exp.category) ? <Lock className="w-5 h-5 text-blue-500" /> : <Activity className="w-5 h-5 text-orange-500" />}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{exp.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] bg-zinc-950 text-zinc-400 px-1.5 py-0.5 rounded uppercase">{exp.category}</span>
                               <span className="text-[10px] text-zinc-500">{format(exp.date, 'MMM do')}</span>
                            </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-red-400 font-bold text-lg">-${exp.amount.toFixed(2)}</span>
                          <button onClick={() => removeExpense(exp.id)} className="text-zinc-600 hover:text-red-500 p-2 rounded-lg hover:bg-zinc-950 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  ))
               )}
            </div>
         </div>
      )}

      {/* --- TAB CONTENT: PAYOUTS (Safety Valve Implementation) --- */}
      {activeTab === 'PAYOUTS' && activeContext === 'BUSINESS' && !isFreePlan && (
         <div className="flex-1 overflow-y-auto pb-20 animate-fade-in">
            <div className="mb-6 flex justify-between items-end">
               <div>
                  <h3 className="font-bold text-xl text-white">
                     {isOwner ? 'Team Payouts & Advances' : 'My Financial Record'}
                  </h3>
                  <p className="text-sm text-zinc-400">
                     Showing earnings for <span className="text-white font-bold">{dateFilter}</span> but Payable is <span className="text-white font-bold">Lifetime Balance</span>.
                  </p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
               {staffBreakdown.map((stat, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        
                        {/* Avatar & Role */}
                        <div className="flex items-center gap-4 min-w-[200px]">
                           <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-bold text-lg border-2 border-zinc-700">
                              {stat.name.charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold text-white text-lg">{stat.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="text-[10px] bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">{stat.role}</span>
                                 <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold flex items-center gap-1 ${
                                    stat.paymentFrequency === 'WEEKLY' ? 'bg-blue-500/10 text-blue-400' : 
                                    stat.paymentFrequency === 'BIWEEKLY' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'
                                 }`}>
                                    <CalendarClock className="w-3 h-3" /> {stat.paymentFrequency || 'MONTHLY'}
                                 </span>
                              </div>
                           </div>
                        </div>
                        
                        {/* Financial Stats Grid */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6">
                           <div>
                              <p className="text-xs text-zinc-500 mb-1">Ganhos do Período</p>
                              <p className="font-bold text-white">${stat.periodEarnings.toFixed(2)}</p>
                              {stat.periodTips > 0 && <span className="text-[10px] text-amber-500">+ ${stat.periodTips} gorjetas</span>}
                           </div>
                           <div>
                              <p className="text-xs text-zinc-500 mb-1">Pago (Total)</p>
                              <p className="font-bold text-red-400">-${stat.totalPaidOut.toFixed(2)}</p>
                           </div>
                           <div className="md:col-span-2">
                              <p className="text-xs text-zinc-400 mb-1 font-bold uppercase tracking-wider">Saldo a Pagar (Líquido)</p>
                              <p className={`font-bold text-2xl ${stat.netPayable <= 0 ? 'text-zinc-500' : 'text-emerald-400'}`}>
                                 ${stat.netPayable.toFixed(2)}
                              </p>
                              {stat.netPayable <= 0 && (
                                 <span className="text-[10px] text-zinc-600 block">Nada a pagar no momento</span>
                              )}
                           </div>
                        </div>

                        {/* Action Button (Owner Only) */}
                        {isOwner && (
                           <div className="mt-2 md:mt-0">
                              <button 
                                onClick={() => openPayoutModal(stat)}
                                disabled={stat.netPayable <= 0}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                              >
                                 <HandCoins className="w-5 h-5" /> Pagar / Adiantar
                              </button>
                           </div>
                        )}
                     </div>

                     {/* Progress Bar Visual for Payout Status */}
                     <div className="absolute bottom-0 left-0 h-1 bg-zinc-800 w-full">
                        <div 
                           className="h-full bg-emerald-500" 
                           style={{ width: `${Math.min(100, (stat.totalPaidOut / (stat.lifetimeEarnings || 1)) * 100)}%` }}
                        ></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Expense Modal (Shared) */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {isSystemExpense ? <Crown className="text-amber-500" /> : (newExpense.context === 'BUSINESS' ? <Briefcase className="w-5 h-5" /> : <Home className="w-5 h-5" />)}
              {isSystemExpense ? 'Confirmar Assinatura' : (newExpense.context === 'BUSINESS' ? 'Despesa da Loja' : 'Despesa Pessoal')}
            </h3>
            
            {!isSystemExpense && (
               <div className="bg-zinc-950 p-1 rounded-lg flex mb-4 border border-zinc-800">
                  <button 
                     type="button"
                     onClick={() => setNewExpense({...newExpense, context: 'BUSINESS'})}
                     className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${newExpense.context === 'BUSINESS' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500'}`}
                  >
                     CNPJ (Business)
                  </button>
                  <button 
                     type="button"
                     onClick={() => setNewExpense({...newExpense, context: 'PERSONAL'})}
                     className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${newExpense.context === 'PERSONAL' ? 'bg-indigo-500 text-white' : 'text-zinc-500'}`}
                  >
                     CPF (Personal)
                  </button>
               </div>
            )}

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Descrição</label>
                <input 
                  required 
                  type="text" 
                  disabled={isSystemExpense}
                  placeholder="ex: Conta de Luz" 
                  value={newExpense.title} 
                  onChange={e => setNewExpense({...newExpense, title: e.target.value})} 
                  className={`w-full border rounded-lg py-2 px-3 text-white focus:outline-none ${isSystemExpense ? 'bg-zinc-900 border-amber-500/50 text-amber-500 font-bold' : 'bg-zinc-950 border-zinc-800 focus:border-amber-500'}`}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
                <select 
                  value={newExpense.category} 
                  disabled={isSystemExpense}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value as any})}
                  className={`w-full border rounded-lg py-2 px-3 text-white focus:outline-none ${isSystemExpense ? 'bg-zinc-900 border-zinc-800 opacity-50' : 'bg-zinc-950 border-zinc-800 focus:border-amber-500'}`}
                >
                   {newExpense.context === 'BUSINESS' ? (
                      <>
                        <option value="RENT">Rent (Fixed)</option>
                        <option value="SYSTEM">System/Software (Fixed)</option>
                        <option value="UTILITIES">Utilities (Fixed)</option>
                        <option value="SUPPLIES">Supplies (Variable)</option>
                        <option value="MARKETING">Marketing (Variable)</option>
                        <option value="OTHER">Other</option>
                      </>
                   ) : (
                      <>
                        <option value="PERSONAL">General Personal</option>
                        <option value="RENT">Home Rent</option>
                        <option value="UTILITIES">Home Utilities</option>
                      </>
                   )}
                </select>
              </div>

              <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Amount ($)</label>
                 <input 
                   required 
                   type="number" 
                   disabled={isSystemExpense}
                   value={newExpense.amount} 
                   onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} 
                   className={`w-full border rounded-lg py-2 px-3 text-white focus:outline-none ${isSystemExpense ? 'bg-zinc-900 border-amber-500/50 text-amber-500 font-bold' : 'bg-zinc-950 border-zinc-800 focus:border-amber-500'}`}
                 />
              </div>

              <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5">Date</label>
                 <input required type="date" value={format(newExpense.date || new Date(), 'yyyy-MM-dd')} onChange={e => setNewExpense({...newExpense, date: new Date(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-amber-500 outline-none"/>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="flex-1 py-2 text-zinc-500 hover:text-white">Cancel</button>
                <button 
                  type="submit" 
                  className={`flex-1 font-bold py-2 rounded-lg text-zinc-950 ${isSystemExpense ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:to-yellow-500' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                >
                  {isSystemExpense ? 'Invest Now' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout Modal (The Safety Valve) - Only show if Owner */}
      {isPayoutModalOpen && selectedStaffForPayout && isOwner && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-sm p-6 shadow-2xl animate-fade-in">
               <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-white border border-zinc-700">
                     {selectedStaffForPayout.name.charAt(0)}
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-white leading-tight">Payout for {selectedStaffForPayout.name}</h3>
                     <p className="text-xs text-zinc-400">Available: <span className="text-emerald-500 font-bold">${(selectedStaffForPayout as any).netPayable.toFixed(2)}</span></p>
                  </div>
               </div>

               <form onSubmit={handleCreatePayout} className="space-y-4">
                  {/* Payout Type Selector */}
                  <div className="grid grid-cols-2 gap-2">
                     <button
                        type="button"
                        onClick={() => setPayoutForm({ ...payoutForm, type: 'PAYOUT' })}
                        className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                           payoutForm.type === 'PAYOUT' 
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                     >
                        <Banknote className="w-5 h-5" />
                        <span className="text-xs font-bold">Official Payout</span>
                     </button>
                     <button
                        type="button"
                        onClick={() => setPayoutForm({ ...payoutForm, type: 'ADVANCE' })}
                        className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                           payoutForm.type === 'ADVANCE' 
                              ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                     >
                        <ArrowRightCircle className="w-5 h-5" />
                        <span className="text-xs font-bold">Advance / Kept Cash</span>
                     </button>
                  </div>

                  {payoutForm.type === 'ADVANCE' && (
                     <div className="bg-amber-900/20 p-3 rounded-lg border border-amber-500/20 text-xs text-amber-200">
                        Use this if the barber asked for money early <b>OR</b> if they kept cash from a client sale.
                     </div>
                  )}

                  <div>
                     <label className="block text-xs font-medium text-zinc-400 mb-1.5">Amount ($)</label>
                     <input 
                        required 
                        type="number" 
                        min="0.01"
                        max={(selectedStaffForPayout as any).netPayable} // SAFETY VALVE: CANNOT EXCEED BALANCE
                        step="0.01"
                        value={payoutForm.amount} 
                        onChange={e => setPayoutForm({...payoutForm, amount: Number(e.target.value)})} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-4 text-white text-lg font-bold focus:border-emerald-500 outline-none"
                     />
                     <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-zinc-500">Max: ${(selectedStaffForPayout as any).netPayable.toFixed(2)}</span>
                        {payoutForm.amount > (selectedStaffForPayout as any).netPayable && (
                           <span className="text-[10px] text-red-500 font-bold">Insufficient Funds!</span>
                        )}
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-medium text-zinc-400 mb-1.5">Notes (Optional)</label>
                     <input 
                        type="text" 
                        placeholder="e.g. Weekly settlement" 
                        value={payoutForm.notes} 
                        onChange={e => setPayoutForm({...payoutForm, notes: e.target.value})} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white focus:border-emerald-500 outline-none"
                     />
                  </div>

                  <div className="flex gap-3 pt-2">
                     <button type="button" onClick={() => setIsPayoutModalOpen(false)} className="flex-1 py-3 text-zinc-500 hover:text-white font-medium">Cancel</button>
                     <button 
                        type="submit" 
                        disabled={payoutForm.amount <= 0 || payoutForm.amount > (selectedStaffForPayout as any).netPayable}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20"
                     >
                        Confirm Transaction
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Register Closure Modal (Reconciliation) */}
      <RegisterClosureModal isOpen={isClosureModalOpen} onClose={() => setIsClosureModalOpen(false)} />
    </div>
  );
};
