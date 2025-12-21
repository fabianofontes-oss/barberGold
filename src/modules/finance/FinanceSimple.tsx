'use client';

import { useState, useEffect } from 'react';
import { listExpensesAction, createExpenseAction, deleteExpenseAction } from '@/modules/expenses/actions';
import { listSalesAction } from '@/modules/sales/actions';
import { listStaffAction } from '@/modules/staff/actions';
import { TrendingDown, DollarSign, Users, Loader2, Plus, Trash2, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export const FinanceSimple = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXPENSES'>('OVERVIEW');
  
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: 0,
    category: 'UTILITIES',
    expenseDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    async function loadData() {
      const today = new Date();
      const start = startOfMonth(today).toISOString();
      const end = endOfMonth(today).toISOString();

      const [expensesData, salesData, staffData] = await Promise.all([
        listExpensesAction({ startDate: start, endDate: end }),
        listSalesAction({ startDate: start, endDate: end }),
        listStaffAction({ isActive: true }),
      ]);

      setExpenses(expensesData);
      setSales(salesData);
      setStaff(staffData);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    await createExpenseAction({
      title: newExpense.title,
      amount: newExpense.amount,
      category: newExpense.category,
      expenseDate: newExpense.expenseDate,
    });
    
    const today = new Date();
    const start = startOfMonth(today).toISOString();
    const end = endOfMonth(today).toISOString();
    const updated = await listExpensesAction({ startDate: start, endDate: end });
    setExpenses(updated);
    
    setNewExpense({ title: '', amount: 0, category: 'UTILITIES', expenseDate: format(new Date(), 'yyyy-MM-dd') });
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpenseAction(id);
    setExpenses(expenses.filter(e => e.id !== id));
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Financeiro</h2>
          <p className="text-zinc-400">Controle de receitas e despesas</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'OVERVIEW' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('EXPENSES')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'EXPENSES' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500'
          }`}
        >
          Despesas
        </button>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-zinc-400">Receita do Mês</span>
              </div>
              <p className="text-2xl font-bold text-white">R$ {totalRevenue.toFixed(2)}</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <span className="text-sm text-zinc-400">Despesas do Mês</span>
              </div>
              <p className="text-2xl font-bold text-white">R$ {totalExpenses.toFixed(2)}</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-zinc-400">Lucro Líquido</span>
              </div>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                R$ {netProfit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EXPENSES' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Lista de Despesas</h3>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nova Despesa
            </button>
          </div>

          <div className="space-y-3">
            {expenses.map((exp) => (
              <div key={exp.id} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <div>
                  <p className="text-white font-bold">{exp.title}</p>
                  <p className="text-xs text-zinc-500">{exp.category} • {format(new Date(exp.expenseDate), 'dd/MM/yyyy')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-red-400 font-bold">-R$ {exp.amount.toFixed(2)}</span>
                  <button onClick={() => handleDeleteExpense(exp.id)} className="text-zinc-600 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <p className="text-center text-zinc-500 py-8">Nenhuma despesa registrada</p>
            )}
          </div>
        </div>
      )}

      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Nova Despesa</h3>
              <button onClick={() => setIsExpenseModalOpen(false)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                required
              />
              <input
                type="number"
                placeholder="Valor"
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                required
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              >
                <option value="RENT">Aluguel</option>
                <option value="UTILITIES">Utilidades</option>
                <option value="SUPPLIES">Suprimentos</option>
                <option value="EQUIPMENT">Equipamentos</option>
                <option value="MARKETING">Marketing</option>
                <option value="SALARIES">Salários</option>
                <option value="OTHER">Outros</option>
              </select>
              <input
                type="date"
                value={newExpense.expenseDate}
                onChange={(e) => setNewExpense({ ...newExpense, expenseDate: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
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
