'use client';

import React from 'react';
import { Target, Rocket, TrendingUp, Flame, Trophy } from 'lucide-react';

interface DailyGoalWidgetProps {
  currentRevenue: number;
  goal: number;
}

export const DailyGoalWidget: React.FC<DailyGoalWidgetProps> = ({ currentRevenue, goal }) => {
  const goalPercentage = Math.min(100, Math.round((currentRevenue / goal) * 100));
  const remaining = Math.max(0, goal - currentRevenue);

  let motivationMessage = "Let's get the chairs spinning!";
  let MotivationIcon = Rocket;
  let progressColor = "bg-zinc-600";
  let progressGlow = "";

  if (goalPercentage > 0 && goalPercentage < 40) {
    motivationMessage = "Good start! Keep pushing!";
    MotivationIcon = TrendingUp;
    progressColor = "bg-blue-500";
    progressGlow = "shadow-[0_0_10px_rgba(59,130,246,0.5)]";
  } else if (goalPercentage >= 40 && goalPercentage < 80) {
    motivationMessage = "We are heating up! ðŸ”¥";
    MotivationIcon = Flame;
    progressColor = "bg-amber-500";
    progressGlow = "shadow-[0_0_15px_rgba(245,158,11,0.5)]";
  } else if (goalPercentage >= 80 && goalPercentage < 100) {
    motivationMessage = "So close to the target! ðŸ¤";
    MotivationIcon = Target;
    progressColor = "bg-orange-500";
    progressGlow = "shadow-[0_0_15px_rgba(249,115,22,0.5)]";
  } else if (goalPercentage >= 100) {
    motivationMessage = "TARGET SMASHED! EXCELLENT WORK TEAM! ðŸ†";
    MotivationIcon = Trophy;
    progressColor = "bg-emerald-500";
    progressGlow = "shadow-[0_0_20px_rgba(16,185,129,0.6)]";
  }

  return (
    <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 p-6 rounded-2xl shadow-xl relative overflow-hidden group transition-all hover:border-zinc-600">
      <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700">
         <MotivationIcon className="w-48 h-48 text-white" />
      </div>

      <div className="relative z-10">
         <div className="flex justify-between items-end mb-4">
            <div>
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-amber-500" />
                  Daily Team Mission
               </h3>
               <p className="text-zinc-400 text-sm mt-1">{motivationMessage}</p>
            </div>
            <div className="text-right">
               <span className="text-3xl font-bold text-white">${currentRevenue.toFixed(0)}</span>
               <span className="text-zinc-500 text-lg"> / ${goal}</span>
            </div>
         </div>

         <div className="h-6 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 relative">
            <div 
               className={`h-full ${progressColor} ${progressGlow} transition-all duration-1000 ease-out`} 
               style={{ width: `${goalPercentage}%` }}
            >
               <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 animate-pulse"></div>
            </div>
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-zinc-800 z-20"></div>
            <div className="absolute top-0 left-3/4 w-0.5 h-full bg-zinc-800 z-20"></div>
         </div>

         <div className="flex justify-between mt-2 text-xs font-medium text-zinc-500">
            <span>$0</span>
            <span className="text-zinc-400 hidden sm:inline">50% Halfway</span>
            <span className={remaining === 0 ? 'text-emerald-500 font-bold' : 'text-amber-500'}>
              {remaining > 0 ? `$${remaining} to go!` : 'Goal Reached!'}
            </span>
         </div>
      </div>
    </div>
  );
};
