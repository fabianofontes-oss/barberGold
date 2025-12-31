'use client';

import React from 'react';
import { EXPENSE_TEMPLATES } from '@/constants';
import { 
  Building2, Zap, Wifi, Droplets, SprayCan, Coffee, Smartphone, 
  Plus, Laptop2, Wrench, Scissors, Sparkles, Crown, 
  Home, ShoppingCart, Dumbbell, Tv, Beer 
} from 'lucide-react';
import { Expense } from '@/types';

interface ExpenseQuickAddProps {
  onSelectTemplate: (template: Partial<Expense>) => void;
  activeContext: 'BUSINESS' | 'PERSONAL';
}

const iconMap: Record<string, any> = {
  Building2, Zap, Wifi, Droplets, SprayCan, Coffee, Smartphone, Laptop2, Wrench,
  Home, ShoppingCart, Dumbbell, Tv, Beer
};

export const ExpenseQuickAdd: React.FC<ExpenseQuickAddProps> = ({ onSelectTemplate, activeContext }) => {
  
  const filteredTemplates = EXPENSE_TEMPLATES.filter(t => t.context === activeContext);

  return (
    <div className="mb-8 animate-fade-in">
      <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${activeContext === 'BUSINESS' ? 'text-white' : 'text-indigo-200'}`}>
        <Plus className={`w-5 h-5 ${activeContext === 'BUSINESS' ? 'text-amber-500' : 'text-indigo-400'}`} /> 
        Quick Add {activeContext === 'BUSINESS' ? 'Business' : 'Personal'} Expenses
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {filteredTemplates.map((template, idx) => {
          
          // SPECIAL LOGIC FOR SYSTEM (BARBERFLOW) CARD
          if (template.category === 'SYSTEM') {
             return (
               <button
                  key={idx}
                  onClick={() => onSelectTemplate({
                    title: template.title,
                    category: template.category as any,
                    amount: template.defaultAmount,
                    context: template.context as any
                  })}
                  className="col-span-2 relative group overflow-hidden rounded-xl p-[1px] transition-all hover:scale-[1.02]"
               >
                  {/* Gold Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 animate-pulse opacity-80 group-hover:opacity-100"></div>
                  
                  {/* Card Content */}
                  <div className="relative h-full bg-zinc-900 rounded-[11px] p-3 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-amber-400 to-yellow-600 p-2.5 rounded-lg text-zinc-950 shadow-lg shadow-amber-500/20">
                           <Scissors className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                           <h4 className="font-bold text-white text-sm leading-tight flex items-center gap-1">
                              BarberFlow <Crown className="w-3 h-3 text-amber-400" />
                           </h4>
                           <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Premium Partner</p>
                        </div>
                     </div>
                     
                     <div className="text-right">
                        <span className="block font-bold text-amber-500 text-lg">${template.defaultAmount}</span>
                        <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                           <Sparkles className="w-2.5 h-2.5" /> Best ROI
                        </div>
                     </div>
                  </div>
               </button>
             );
          }

          // STANDARD CARDS
          const Icon = iconMap[template.icon] || Plus;
          const isBusiness = activeContext === 'BUSINESS';

          return (
            <button
              key={idx}
              onClick={() => onSelectTemplate({
                title: template.title,
                category: template.category as any,
                amount: template.defaultAmount,
                context: template.context as any
              })}
              className={`flex flex-col items-center justify-center gap-2 border p-4 rounded-xl transition-all group ${
                 isBusiness 
                 ? 'bg-zinc-900 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800' 
                 : 'bg-indigo-950/20 border-indigo-500/20 hover:border-indigo-400/50 hover:bg-indigo-900/30'
              }`}
            >
              <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${isBusiness ? 'bg-zinc-950' : 'bg-indigo-950/40'}`}>
                <Icon className={`w-5 h-5 ${
                   template.type === 'FIXED' 
                   ? (isBusiness ? 'text-blue-400' : 'text-indigo-400')
                   : (isBusiness ? 'text-orange-400' : 'text-pink-400')
                }`} />
              </div>
              <span className={`text-[10px] font-bold text-center leading-tight ${isBusiness ? 'text-zinc-400' : 'text-indigo-200'}`}>{template.title}</span>
            </button>
          );
        })}
      </div>
      
      <div className="flex gap-4 mt-3 text-xs">
         <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${activeContext === 'BUSINESS' ? 'bg-blue-400' : 'bg-indigo-400'}`}></div>
            <span className="text-zinc-500">Fixed Cost</span>
         </div>
         <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${activeContext === 'BUSINESS' ? 'bg-orange-400' : 'bg-pink-400'}`}></div>
            <span className="text-zinc-500">Variable Cost</span>
         </div>
      </div>
    </div>
  );
};