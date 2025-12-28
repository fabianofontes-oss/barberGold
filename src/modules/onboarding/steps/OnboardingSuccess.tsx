'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Calendar, Share2, Eye, ArrowRight } from 'lucide-react';
import { OnboardingStats } from '@/types/onboarding';
import confetti from 'canvas-confetti';

interface OnboardingSuccessProps {
  stats: OnboardingStats;
}

export const OnboardingSuccess: React.FC<OnboardingSuccessProps> = ({ stats }) => {
  const router = useRouter();

  useEffect(() => {
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const nextSteps = [
    {
      icon: Calendar,
      title: 'Fazer primeiro agendamento',
      description: 'Comece a usar o sistema',
      action: () => router.push('/app/agenda'),
      buttonText: 'Agendar agora'
    },
    {
      icon: Share2,
      title: 'Convidar clientes',
      description: 'Compartilhe seu link de agendamento',
      action: () => router.push('/app/settings'),
      buttonText: 'Compartilhar link'
    },
    {
      icon: Eye,
      title: 'Ver como cliente vê',
      description: 'Preview do cardápio',
      action: () => window.open('/book', '_blank'),
      buttonText: 'Preview do cardápio'
    }
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 text-center animate-fade-in">
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-full mb-6">
        <Check className="w-10 h-10 text-emerald-500" />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-2">
        🎉 Tudo pronto!
      </h1>
      <p className="text-zinc-400 text-lg mb-8">
        Seu negócio está no ar
      </p>

      {/* Stats Card */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-8 max-w-md mx-auto">
        <h3 className="text-white font-bold mb-4">📊 Resumo do seu catálogo</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">✓ Serviços ativos</span>
            <span className="text-white font-bold">{stats.totalServices}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">✓ Combos configurados</span>
            <span className="text-white font-bold">{stats.totalCombos}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">✓ Categorias disponíveis</span>
            <span className="text-white font-bold">{stats.totalCategories}</span>
          </div>
          <div className="h-px bg-zinc-700 my-3" />
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">💰 Ticket médio</span>
            <span className="text-amber-500 font-bold">R$ {stats.avgPrice}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">⏱️ Tempo médio</span>
            <span className="text-amber-500 font-bold">{stats.avgDuration}min</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8">
        <h3 className="text-white font-bold mb-4">Próximos passos</h3>
        <div className="space-y-3 max-w-md mx-auto">
          {nextSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={step.action}
              className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-amber-500/50 rounded-xl p-4 transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-amber-500/10 rounded-lg">
                  <step.icon className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm mb-1">
                    {idx + 1}️⃣ {step.title}
                  </h4>
                  <p className="text-zinc-500 text-xs">{step.description}</p>
                </div>
                <div className="text-zinc-600 group-hover:text-amber-500 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 max-w-md mx-auto">
        <p className="text-amber-500 text-sm">
          💡 Você pode editar serviços a qualquer momento em{' '}
          <span className="font-bold">Painel → Catálogo</span>
        </p>
      </div>

      {/* Go to Dashboard */}
      <button
        onClick={() => router.push('/app/dashboard')}
        className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2"
      >
        Ir para painel
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
