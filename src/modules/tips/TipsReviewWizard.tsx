'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { PaymentMethod } from '@/types';
import { 
  Star, MessageSquare, ThumbsUp, DollarSign, CheckCircle2, 
  ChevronRight, CreditCard, Smartphone, ShoppingBag, Wallet, Calculator, Zap, Banknote 
} from 'lucide-react';

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

export const TipsReviewWizard = () => {
  const { activeReviewAppointmentId, appointments, staff, shopSettings, submitReview, addLateTip, setView } = useBarber();
  
  // Find the appointment to review
  const appointment = appointments.find(a => a.id === activeReviewAppointmentId);
  const staffMember = appointment ? staff.find(s => s.id === appointment.staffId) : null;

  // STEPS: 0=Rating, 1=TipPrompt, 2=Payment, 3=Success
  const [step, setStep] = useState(0);
  
  // Review State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // Tip State
  const [tipAmount, setTipAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  // FEATURE DISABLED CHECK
  if (!shopSettings.enableTipsReview) {
     return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
           <div>
              <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white">Pesquisa Encerrada</h2>
              <p className="text-zinc-400 mt-2">Esta funcionalidade está temporariamente desativada.</p>
              <button onClick={() => setView('DASHBOARD')} className="mt-6 text-zinc-500 hover:text-white underline">Voltar para Home</button>
           </div>
        </div>
     );
  }

  if (!appointment || !staffMember) {
     return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
           <div>
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white">Link Inválido</h2>
              <p className="text-zinc-400 mt-2">Não encontramos o agendamento para avaliação.</p>
              <button onClick={() => setView('DASHBOARD')} className="mt-6 text-amber-500 underline">Voltar</button>
           </div>
        </div>
     );
  }

  // --- ACTIONS ---

  const handleSubmitReview = () => {
     if (rating > 0) {
        submitReview({
           appointmentId: appointment.id,
           rating,
           comment
        });
        
        // Logic: Only ask for tip if rating is good (>= 4 stars)
        if (rating >= 4) {
           setStep(1); // Go to Tip Prompt
        } else {
           setStep(3); // Skip to Success
        }
     }
  };

  const handleTipSelection = (amount: number) => {
     setTipAmount(amount);
     if (amount === 0) {
        setStep(3); // No tip, finish
     } else {
        setStep(2); // Go to Payment
     }
  };

  const handlePayment = () => {
     if (tipAmount > 0 && paymentMethod) {
        addLateTip(appointment.id, tipAmount, paymentMethod);
        // We could also update the review with the tip amount if needed, but Context handles it separately for now.
        setStep(3);
     }
  };

  // --- RENDER ---

  const OnlineMethods = shopSettings.paymentSettings?.online || [];

  // STEP 0: RATING
  if (step === 0) {
     return (
        <div className="min-h-screen bg-zinc-950 flex flex-col p-6 animate-fade-in">
           <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-800 mb-6 shadow-xl">
                 {staffMember.avatar ? (
                    <img src={staffMember.avatar} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-zinc-500">
                       {staffMember.name.charAt(0)}
                    </div>
                 )}
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Como foi seu corte com {staffMember.name.split(' ')[0]}?</h2>
              <p className="text-zinc-400 text-sm mb-8">Sua opinião nos ajuda a melhorar sempre.</p>

              <div className="flex gap-2 mb-8">
                 {[1, 2, 3, 4, 5].map((star) => (
                    <button
                       key={star}
                       onClick={() => setRating(star)}
                       className={`transition-all duration-300 ${rating >= star ? 'scale-110' : 'scale-100'}`}
                    >
                       <Star 
                          className={`w-10 h-10 ${rating >= star ? 'fill-amber-500 text-amber-500' : 'text-zinc-700'}`} 
                       />
                    </button>
                 ))}
              </div>

              {rating > 0 && (
                 <div className="w-full max-w-sm animate-fade-in-up">
                    <textarea 
                       placeholder="Algum comentário? (Opcional)"
                       value={comment}
                       onChange={(e) => setComment(e.target.value)}
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none resize-none h-24 mb-4"
                    />
                    <button 
                       onClick={handleSubmitReview}
                       className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-4 rounded-xl shadow-lg transition-all"
                    >
                       Enviar Avaliação
                    </button>
                 </div>
              )}
           </div>
        </div>
     );
  }

  // STEP 1: TIP PROMPT
  if (step === 1) {
     return (
        <div className="min-h-screen bg-zinc-950 flex flex-col p-6 animate-fade-in">
           <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 text-emerald-500 animate-pulse">
                 <ThumbsUp className="w-10 h-10" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Que ótimo que gostou!</h2>
              <p className="text-zinc-400 text-sm mb-8 max-w-xs mx-auto">
                 O {staffMember.name.split(' ')[0]} ficaria muito feliz com um reconhecimento extra. Gostaria de deixar uma gorjeta?
              </p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-4">
                 {[2, 5, 10, 15].map(amount => (
                    <button 
                       key={amount}
                       onClick={() => handleTipSelection(amount)}
                       className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center gap-1 transition-all group"
                    >
                       <span className="text-2xl font-bold text-white group-hover:text-emerald-500">${amount}</span>
                       <span className="text-xs text-zinc-500 font-bold uppercase">Café/Cerveja</span>
                    </button>
                 ))}
              </div>

              <div className="w-full max-w-sm space-y-3">
                 <div className="relative">
                    <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                    <input 
                       type="number" 
                       placeholder="Outro valor..." 
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-500 outline-none"
                       onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (val > 0) setTipAmount(val);
                       }}
                    />
                    {tipAmount > 0 && (
                       <button onClick={() => setStep(2)} className="absolute right-2 top-2 bg-emerald-500 text-zinc-900 p-1.5 rounded-lg font-bold text-xs">OK</button>
                    )}
                 </div>
                 
                 <button onClick={() => setStep(3)} className="text-zinc-500 text-sm font-medium hover:text-white py-2">
                    Não, obrigado. Apenas finalizar.
                 </button>
              </div>
           </div>
        </div>
     );
  }

  // STEP 2: PAYMENT METHOD
  if (step === 2) {
     return (
        <div className="min-h-screen bg-zinc-950 flex flex-col p-6 animate-fade-in">
           <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Enviar Tip</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 text-center">
                 <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Valor selecionado</p>
                 <span className="text-4xl font-bold text-emerald-500">${tipAmount.toFixed(2)}</span>
              </div>

              <p className="text-zinc-400 text-sm mb-4 font-medium">Escolha como pagar:</p>
              
              <div className="space-y-3">
                 {OnlineMethods.map(method => {
                    const Icon = PAYMENT_ICONS[method] || CreditCard;
                    return (
                       <button
                          key={method}
                          onClick={() => { setPaymentMethod(method); handlePayment(); }} // In a real app, setMethod then Show Payment Form. Here we simulate success.
                          className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500 rounded-xl p-4 flex items-center justify-between group transition-all"
                       >
                          <div className="flex items-center gap-4">
                             <div className="bg-zinc-950 p-2 rounded-lg text-zinc-400 group-hover:text-emerald-500">
                                <Icon className="w-6 h-6" />
                             </div>
                             <span className="font-bold text-white">{method}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white" />
                       </button>
                    );
                 })}
                 
                 {OnlineMethods.length === 0 && (
                    <p className="text-red-500 text-center text-sm">Nenhum método de pagamento online configurado na loja.</p>
                 )}
              </div>

              <button onClick={() => setStep(1)} className="mt-8 text-zinc-500 text-center text-sm">Voltar</button>
           </div>
        </div>
     );
  }

  // STEP 3: SUCCESS
  if (step === 3) {
     return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
           <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/30">
              <CheckCircle2 className="w-12 h-12 text-zinc-900" />
           </div>
           
           <h2 className="text-3xl font-bold text-white mb-2">Obrigado!</h2>
           <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
              {tipAmount > 0 ? `Sua avaliação e gorjeta de $${tipAmount} foram enviadas.` : 'Sua avaliação foi enviada com sucesso.'}
              <br/>Esperamos vê-lo novamente em breve!
           </p>
           
           <button onClick={() => setView('DASHBOARD')} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-8 rounded-xl transition-all">
              Fechar
           </button>
        </div>
     );
  }

  return null;
};

import { AlertCircle } from 'lucide-react';