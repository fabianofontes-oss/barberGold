'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { format } from 'date-fns';
import { 
  DollarSign, ArrowUpCircle, ArrowDownCircle, 
  Clock, CheckCircle, X, AlertCircle, Lock, Unlock
} from 'lucide-react';

interface CashMovement {
  id: string;
  type: 'OPEN' | 'CLOSE' | 'SANGRIA' | 'SUPRIMENTO';
  amount: number;
  notes: string;
  timestamp: Date;
  userId: string;
}

interface CashRegisterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CashRegister: React.FC<CashRegisterProps> = ({ isOpen, onClose }) => {
  const { currentUser, sales } = useBarber();
  
  // Cash register state (would be in context in production)
  const [registerStatus, setRegisterStatus] = useState<'CLOSED' | 'OPEN'>('CLOSED');
  const [openingAmount, setOpeningAmount] = useState<number>(0);
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [sangriaMotive, setSangriaMotive] = useState('');
  const [sangriaAmount, setSangriaAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'STATUS' | 'SANGRIA' | 'CLOSE'>('STATUS');

  if (!isOpen) return null;

  const todaySales = sales.filter(s => 
    format(s.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const todayCashSales = todaySales
    .filter(s => s.method === 'CASH')
    .reduce((sum, s) => sum + s.total, 0);

  const todayCardSales = todaySales
    .filter(s => s.method !== 'CASH')
    .reduce((sum, s) => sum + s.total, 0);

  const sangrias = movements
    .filter(m => m.type === 'SANGRIA')
    .reduce((sum, m) => sum + m.amount, 0);

  const suprimentos = movements
    .filter(m => m.type === 'SUPRIMENTO')
    .reduce((sum, m) => sum + m.amount, 0);

  const expectedCash = openingAmount + todayCashSales - sangrias + suprimentos;

  const handleOpenRegister = () => {
    const amount = parseFloat(prompt('Valor de abertura do caixa (troco):') || '0');
    if (amount >= 0) {
      setOpeningAmount(amount);
      setRegisterStatus('OPEN');
      setMovements([{
        id: Date.now().toString(),
        type: 'OPEN',
        amount,
        notes: 'Abertura de caixa',
        timestamp: new Date(),
        userId: currentUser.id
      }]);
    }
  };

  const handleSangria = () => {
    const amount = parseFloat(sangriaAmount);
    if (amount > 0 && amount <= expectedCash && sangriaMotive) {
      setMovements([...movements, {
        id: Date.now().toString(),
        type: 'SANGRIA',
        amount,
        notes: sangriaMotive,
        timestamp: new Date(),
        userId: currentUser.id
      }]);
      setSangriaAmount('');
      setSangriaMotive('');
      setActiveTab('STATUS');
    }
  };

  const handleCloseRegister = () => {
    const countedAmount = parseFloat(prompt('Valor contado no caixa:') || '0');
    const difference = countedAmount - expectedCash;
    
    setMovements([...movements, {
      id: Date.now().toString(),
      type: 'CLOSE',
      amount: countedAmount,
      notes: difference === 0 ? 'Fechamento OK' : `Diferença: $${difference.toFixed(2)}`,
      timestamp: new Date(),
      userId: currentUser.id
    }]);
    
    if (Math.abs(difference) < 1) {
      alert('✅ Caixa fechado com sucesso!');
    } else if (difference > 0) {
      alert(`⚠️ Caixa com sobra de $${difference.toFixed(2)}`);
    } else {
      alert(`⚠️ Caixa com falta de $${Math.abs(difference).toFixed(2)}`);
    }
    
    setRegisterStatus('CLOSED');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-zinc-900 w-full max-w-md md:rounded-2xl rounded-t-3xl border-t md:border border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${registerStatus === 'OPEN' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <span className="text-white font-bold">
              {registerStatus === 'OPEN' ? 'Caixa Aberto' : 'Caixa Fechado'}
            </span>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Closed State */}
          {registerStatus === 'CLOSED' && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-zinc-500" />
              </div>
              <h3 className="text-white font-bold text-xl">Caixa Fechado</h3>
              <p className="text-zinc-400 text-sm">Abra o caixa para começar a registrar vendas.</p>
              <button
                onClick={handleOpenRegister}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Unlock className="w-5 h-5" /> Abrir Caixa
              </button>
            </div>
          )}

          {/* Open State */}
          {registerStatus === 'OPEN' && (
            <>
              {/* Tabs */}
              <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                <button
                  onClick={() => setActiveTab('STATUS')}
                  className={`flex-1 py-2 text-xs font-bold rounded transition-all ${activeTab === 'STATUS' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-400'}`}
                >
                  Status
                </button>
                <button
                  onClick={() => setActiveTab('SANGRIA')}
                  className={`flex-1 py-2 text-xs font-bold rounded transition-all ${activeTab === 'SANGRIA' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-400'}`}
                >
                  Sangria
                </button>
                <button
                  onClick={() => setActiveTab('CLOSE')}
                  className={`flex-1 py-2 text-xs font-bold rounded transition-all ${activeTab === 'CLOSE' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-400'}`}
                >
                  Fechar
                </button>
              </div>

              {/* Status Tab */}
              {activeTab === 'STATUS' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                      <DollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs text-zinc-500">Abertura</p>
                      <p className="text-lg font-bold text-white">${openingAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                      <ArrowUpCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-xs text-zinc-500">Vendas (Dinheiro)</p>
                      <p className="text-lg font-bold text-white">${todayCashSales.toFixed(2)}</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                      <ArrowDownCircle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                      <p className="text-xs text-zinc-500">Sangrias</p>
                      <p className="text-lg font-bold text-white">-${sangrias.toFixed(2)}</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                      <CheckCircle className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <p className="text-xs text-zinc-500">Cartões</p>
                      <p className="text-lg font-bold text-white">${todayCardSales.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                    <p className="text-xs text-emerald-400 uppercase font-bold mb-1">Esperado no Caixa</p>
                    <p className="text-3xl font-bold text-emerald-400">${expectedCash.toFixed(2)}</p>
                  </div>

                  {/* Recent Movements */}
                  {movements.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase">Movimentações</h4>
                      {movements.slice(-5).reverse().map(m => (
                        <div key={m.id} className="flex items-center justify-between text-xs bg-zinc-950 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span className="text-zinc-400">{format(m.timestamp, 'HH:mm')}</span>
                            <span className="text-zinc-300">{m.notes}</span>
                          </div>
                          <span className={`font-bold ${m.type === 'SANGRIA' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {m.type === 'SANGRIA' ? '-' : '+'}${m.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sangria Tab */}
              {activeTab === 'SANGRIA' && (
                <div className="space-y-4">
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                      <div>
                        <p className="text-orange-300 text-sm font-bold">Retirada de Dinheiro</p>
                        <p className="text-orange-300/70 text-xs">Sangrias são registradas e visíveis no fechamento.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Valor</label>
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                      <DollarSign className="w-4 h-4 text-zinc-500" />
                      <input
                        type="number"
                        value={sangriaAmount}
                        onChange={e => setSangriaAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent text-white text-lg font-bold outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">Máximo: ${expectedCash.toFixed(2)}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase">Motivo</label>
                    <input
                      type="text"
                      value={sangriaMotive}
                      onChange={e => setSangriaMotive(e.target.value)}
                      placeholder="Ex: Pagamento fornecedor"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSangria}
                    disabled={!sangriaAmount || !sangriaMotive || parseFloat(sangriaAmount) > expectedCash}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-700 text-white font-bold rounded-xl"
                  >
                    Registrar Sangria
                  </button>
                </div>
              )}

              {/* Close Tab */}
              {activeTab === 'CLOSE' && (
                <div className="space-y-4 text-center">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-300 text-sm font-bold">Fechar Caixa</p>
                    <p className="text-red-300/70 text-xs">Conte o dinheiro e confirme o valor.</p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 uppercase mb-1">Valor Esperado</p>
                    <p className="text-3xl font-bold text-white">${expectedCash.toFixed(2)}</p>
                  </div>

                  <button
                    onClick={handleCloseRegister}
                    className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" /> Fechar Caixa
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
