'use client';

import React, { useMemo } from 'react';
import { useBarber } from '@/context/BarberContext';
import { Trophy, TrendingUp, Medal } from 'lucide-react';
import { startOfDay, endOfDay } from 'date-fns';

export const BarberRanking: React.FC = () => {
  const { staff, sales, currentUser } = useBarber();
  
  const isOwner = currentUser.role === 'OWNER';

  // Optimization: Memoize the calculation to prevent expensive re-computations on every render.
  // Complexity reduced from O(Staff * Sales) to O(Sales + Staff).
  const barberStats = useMemo(() => {
    // 1. Define time range for "today" once
    const now = new Date();
    const start = startOfDay(now);
    const end = endOfDay(now);

    // 2. Filter sales for today ONCE (O(Sales))
    // Using timestamp comparison is faster than string formatting
    const todaySales = sales.filter(s => {
       const date = new Date(s.date);
       return date >= start && date <= end;
    });

    // 3. Aggregate by staff (O(TodaySales))
    const salesByStaff = new Map<string, typeof sales>();
    todaySales.forEach(s => {
      if (!salesByStaff.has(s.staffId)) {
        salesByStaff.set(s.staffId, []);
      }
      salesByStaff.get(s.staffId)!.push(s);
    });

    // 4. Map staff to results (O(Staff))
    return staff.map(barber => {
      const barberSales = salesByStaff.get(barber.id) || [];
      const totalRevenue = barberSales.reduce((sum, s) => sum + s.total, 0);
      const salesCount = barberSales.length;

      return {
        id: barber.id,
        name: barber.name,
        avatar: barber.avatar,
        revenue: totalRevenue,
        salesCount
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [sales, staff]);

  const getMedalColor = (index: number) => {
    if (index === 0) return 'text-amber-400';
    if (index === 1) return 'text-zinc-300';
    if (index === 2) return 'text-orange-400';
    return 'text-zinc-600';
  };

  const getMedalBg = (index: number) => {
    if (index === 0) return 'bg-amber-500/20 border-amber-500/30';
    if (index === 1) return 'bg-zinc-500/20 border-zinc-500/30';
    if (index === 2) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-zinc-800 border-zinc-700';
  };

  if (barberStats.length <= 1) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-white">Ranking do Dia</h3>
      </div>

      <div className="space-y-3">
        {barberStats.slice(0, 5).map((barber, idx) => {
          const isMe = barber.id === currentUser.id;
          
          return (
            <div 
              key={barber.id} 
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${getMedalBg(idx)} ${isMe ? 'ring-2 ring-amber-500/50' : ''}`}
            >
              {/* Position */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getMedalColor(idx)}`}>
                {idx < 3 ? <Medal className="w-5 h-5" /> : `#${idx + 1}`}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                {barber.avatar ? (
                  <img src={barber.avatar} alt={barber.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-400 font-bold">{barber.name.charAt(0)}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className={`font-bold ${isMe ? 'text-amber-400' : 'text-white'}`}>
                  {barber.name} {isMe && <span className="text-xs">(você)</span>}
                </p>
                <p className="text-xs text-zinc-500">{barber.salesCount} vendas</p>
              </div>

              {/* Revenue */}
              <div className="text-right">
                <p className={`font-bold ${idx === 0 ? 'text-amber-400' : 'text-white'}`}>
                  ${barber.revenue.toFixed(2)}
                </p>
                {idx === 0 && barber.revenue > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <TrendingUp className="w-3 h-3" /> Líder
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isOwner && (
        <p className="text-[10px] text-zinc-500 text-center mt-3">
          🏆 Seja o primeiro hoje!
        </p>
      )}
    </div>
  );
};
