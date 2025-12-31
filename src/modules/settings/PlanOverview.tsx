'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { useSaasV2 } from '@/context/SaasV2Context';
import { SaasV2PlanId, SaasV2SizeTier, SaasV2BillingInterval } from '@/types';
import { getPlanPriceBR } from '@/utils/pricing';
import { Check, Users, Calendar } from 'lucide-react';
import { PlanComparisonTable } from './components/PlanComparisonTable';

type PlanModuleInfo = {
  key: string;
  title: string;
  included: boolean;
  items: string[];
};

type PlanInfo = {
  id: SaasV2PlanId;
  name: string;
  subtitle: string;
  highlight?: string;
  level: 'basic' | 'pro' | 'elite';
  idealFor?: string;
  modules: PlanModuleInfo[];
};

// --- GENERIC / TEAM PLANS (FALLBACK for 6+) ---
const TEAM_PLANS_INFO: PlanInfo[] = [
  {
    id: 'SOLO',
    name: 'Start',
    subtitle: 'Organização c/ Agendamento',
    level: 'basic',
    idealFor: 'Para quem quer parar de sofrer no WhatsApp.',
    highlight: 'Essencial',
    modules: [
      { key: 'CORE', title: 'Gestão Básica', included: true, items: ['Agenda & Clientes', 'PDV & Serviços'] },
      { key: 'ONLINE', title: 'Agendamento', included: true, items: ['Link Exclusivo', 'Gestão de Horários'] }
    ]
  },
  {
    id: 'SOLO_PRO',
    name: 'Pro',
    subtitle: 'Gestão Completa',
    level: 'pro',
    idealFor: 'Foco em lucro e retenção.',
    highlight: 'Recomendado',
    modules: [
      { key: 'FINANCE', title: 'Financeiro', included: true, items: ['Contas a Pagar', 'Comissões', 'DRE'] },
      { key: 'LOYALTY', title: 'Fidelidade', included: true, items: ['Programa de Pontos', 'Win-back'] }
    ]
  },
  {
    id: 'STUDIO',
    name: 'Elite',
    subtitle: 'Marca Forte',
    level: 'elite',
    highlight: 'Máxima Performance',
    modules: [
      { key: 'BRAND', title: 'Branding', included: true, items: ['Site Personalizado', 'Domínio Próprio'] },
      { key: 'SUPPORT', title: 'Suporte', included: true, items: ['Atendimento Prioritário'] }
    ]
  }
];

// --- SOLO (1 BARBER) PLANS ---
const SOLO_PLANS_INFO: PlanInfo[] = [
  {
    id: 'FREE',
    name: 'Free Solo',
    subtitle: 'Caderno digital para começar.',
    level: 'basic',
    modules: [
      {
        key: 'AGENDA',
        title: 'Agenda & Fila',
        included: true,
        items: ['Agenda diária para registrar horários', 'Bloqueios simples de horário', 'Visualização rápida do dia']
      },
      {
        key: 'CRM',
        title: 'Clientes (CRM Básico)',
        included: true,
        items: ['Cadastro básico (nome, telefone)', 'Histórico simples de visitas', 'Busca por nome/telefone']
      },
      {
        key: 'PDV',
        title: 'PDV & Produtos',
        included: true,
        items: ['Registro simples de vendas no PDV', 'Cadastro de serviços básicos']
      },
      {
        key: 'GENERAL',
        title: 'Geral',
        included: true,
        items: ['1 barbeiro por conta', 'Sem fidelidade, cancele quando quiser']
      }
    ],
  },
  {
    id: 'SOLO',
    name: 'Start',
    subtitle: 'Organização com agendamento online.',
    level: 'basic',
    highlight: 'Tudo do Free Solo, mais:',
    modules: [
      {
        key: 'ONLINE_BOOKING',
        title: 'Agendamento Online',
        included: true,
        items: [
          'Link único para agendamento (seu-nome.barber.gold)',
          'Wizard: Serviço → Dia → Horário → Confirmação',
          'Gestão de horários e pausas',
          'Templates prontos para WhatsApp com link'
        ]
      },
      {
        key: 'CATALOG',
        title: 'Catálogo Organizado',
        included: true,
        items: [
          'Organização de serviços por categoria',
          'Controle de preço e duração'
        ]
      },
      {
        key: 'REPORTS',
        title: 'Relatórios Simples',
        included: true,
        items: [
          'Visão de faturamento do mês',
          'Top serviços mais vendidos'
        ]
      }
    ],
  },
  {
    id: 'SOLO_PRO',
    name: 'Pro',
    subtitle: 'Gestão completa de lucro, retorno e fidelização.',
    level: 'pro',
    highlight: 'Tudo do Start, mais:',
    modules: [
      {
        key: 'FINANCE_ADVANCED',
        title: 'Financeiro Avançado',
        included: true,
        items: [
          'Cadastro de despesas fixas e variáveis',
          'DRE simplificado (lucro/prejuízo)',
          'Ponto de equilíbrio (Break-even)',
          'Relatórios por período'
        ]
      },
      {
        key: 'CASH_CONTROL',
        title: 'Fechamento de Caixa',
        included: true,
        items: [
          'Fechamento cego (segurança)',
          'Registro de sobras e quebras'
        ]
      },
      {
        key: 'LOYALTY',
        title: 'Clientes & Fidelidade',
        included: true,
        items: [
          'Cartão fidelidade (selos por visita)',
          'Win-back automático (reconquista)',
          'Tags de clientes (VIP, risco, perdido)'
        ]
      },
      {
        key: 'QUEUE',
        title: 'Fila Inteligente',
        included: true,
        items: [
          'Fila de espera com sugestão de horário',
          'Regras Fair / Speed (rodízio ou velocidade)'
        ]
      }
    ],
  },
  {
    id: 'STUDIO', // Mapped to "Elite" visually for Solo
    name: 'Elite',
    subtitle: 'Barbearias que querem marca própria forte.',
    level: 'elite',
    highlight: 'Tudo do Pro, mais:',
    modules: [
      {
        key: 'WEBSITE',
        title: 'Website & Marca',
        included: true,
        items: [
          'Website Premium (tema BarberFlow)',
          'Domínio próprio (.com.br) – via parceiro',
          'Personalização de cores e logo',
          'Remoção da marca d’água “BarberFlow”'
        ]
      },
      {
        key: 'EXPANSION',
        title: 'Expansão (Futuro)',
        included: true,
        items: [
          'Preparado para multi-unidades',
          'Ferramentas de branding e campanhas'
        ]
      },
      {
        key: 'SUPPORT',
        title: 'Suporte & Prioridade',
        included: true,
        items: [
          'Canal de suporte prioritário',
          'Acesso antecipado a novas funções'
        ]
      }
    ],
  },
];

// --- UP TO 3 BARBERS PLANS ---
const UP_TO_3_PLANS_INFO: PlanInfo[] = [
  {
    id: 'FREE',
    name: 'Free Solo',
    subtitle: 'Organização básica para equipes pequenas.',
    level: 'basic',
    modules: [
      {
        key: 'AGENDA',
        title: 'Agenda & Fila',
        included: true,
        items: ['Agenda diária compartilhada', 'Bloqueios simples por barbeiro', 'Visualização dos horários de cada cadeira']
      },
      {
        key: 'CRM',
        title: 'Clientes (CRM Básico)',
        included: true,
        items: ['Cadastro de clientes com telefone', 'Histórico simples de visitas por barbeiro', 'Busca rápida pelo nome ou telefone']
      },
      {
        key: 'PDV',
        title: 'PDV & Serviços',
        included: true,
        items: ['Registro simples de vendas no PDV', 'Cadastro de serviços básicos da barbearia']
      },
      {
        key: 'GENERAL',
        title: 'Geral',
        included: true,
        items: ['Até 3 barbeiros por conta', 'Sem fidelidade, cancele quando quiser']
      }
    ],
  },
  {
    id: 'SOLO', // Mapped to Start
    name: 'Start',
    subtitle: 'Organização com agendamento online para equipe.',
    level: 'basic',
    highlight: 'Tudo do Free Solo, mais:',
    modules: [
      {
        key: 'ONLINE_BOOKING',
        title: 'Agendamento Online',
        included: true,
        items: [
          'Link único de agendamento da barbearia',
          'Escolha do barbeiro pelo cliente (opcional)',
          'Wizard: Serviço → Profissional → Dia → Horário',
          'Controle de pausas e horários por barbeiro'
        ]
      },
      {
        key: 'CATALOG',
        title: 'Catálogo Organizado',
        included: true,
        items: [
          'Serviços organizados por categoria',
          'Tempo e preço por profissional'
        ]
      },
      {
        key: 'REPORTS',
        title: 'Relatórios Simples',
        included: true,
        items: [
          'Visão de faturamento do mês',
          'Top serviços e barbeiros mais requisitados'
        ]
      }
    ],
  },
  {
    id: 'SOLO_PRO', // Mapped to Pro
    name: 'Pro',
    subtitle: 'Gestão completa de lucro, comissões e retenção do time.',
    level: 'pro',
    highlight: 'Tudo do Start, mais:',
    modules: [
      {
        key: 'FINANCE_ADVANCED',
        title: 'Financeiro Avançado',
        included: true,
        items: [
          'Cadastro de despesas fixas e variáveis',
          'DRE simplificado por período',
          'Ponto de equilíbrio da barbearia (Break-even)'
        ]
      },
      {
        key: 'COMMISSIONS',
        title: 'Comissões & Pagamentos',
        included: true,
        items: [
          'Cálculo automático de comissão por barbeiro',
          'Controle de payouts e saldos pendentes'
        ]
      },
      {
        key: 'CASH_CONTROL',
        title: 'Fechamento de Caixa',
        included: true,
        items: [
          'Fechamento cego (segurança)',
          'Registro de sobras e quebras'
        ]
      },
      {
        key: 'LOYALTY',
        title: 'Clientes & Fidelidade',
        included: true,
        items: [
          'Cartão fidelidade',
          'Win-back automático (clientes sumidos)',
          'Tags de clientes (VIP, risco, perdido)'
        ]
      }
    ],
  },
  {
    id: 'STUDIO', // Mapped to Elite
    name: 'Elite',
    subtitle: 'Equipes pequenas com cara de marca grande.',
    level: 'elite',
    highlight: 'Tudo do Pro, mais:',
    modules: [
      {
        key: 'WEBSITE',
        title: 'Website & Marca',
        included: true,
        items: [
          'Website Premium da barbearia',
          'Domínio próprio (.com.br) – via parceiro',
          'Personalização de cores, fonte e logo',
          'Remoção da marca d’água BarberFlow'
        ]
      },
      {
        key: 'CX',
        title: 'Experiência do Cliente',
        included: true,
        items: [
          'Página de equipe com perfil de cada barbeiro',
          'Link de agendamento por barbeiro'
        ]
      },
      {
        key: 'SUPPORT',
        title: 'Suporte & Crescimento',
        included: true,
        items: [
          'Suporte prioritário',
          'Acesso antecipado a novos recursos'
        ]
      }
    ],
  },
];

// --- 3 TO 6 BARBERS PLANS (NEW) ---
const UP_TO_6_PLANS_INFO: PlanInfo[] = [
  {
    id: 'FREE',
    name: 'Free Solo',
    subtitle: 'Organização básica para testar o sistema com o time.',
    level: 'basic',
    modules: [
      {
        key: 'AGENDA',
        title: 'Agenda & Operação',
        included: true,
        items: ['Agenda compartilhada para até 6 barbeiros', 'Bloqueio de horários por profissional', 'Visão rápida de ocupação das cadeiras']
      },
      {
        key: 'CRM',
        title: 'Clientes & Cadastros',
        included: true,
        items: ['Cadastro básico de clientes', 'Histórico de visitas por profissional']
      },
      {
        key: 'PDV',
        title: 'PDV & Serviços',
        included: true,
        items: ['Registro simples de vendas', 'Cadastro de serviços principais']
      },
      {
        key: 'LIMITS',
        title: 'Limitações',
        included: true,
        items: ['Sem financeiro avançado', 'Sem fidelidade', 'Sem website próprio']
      }
    ],
  },
  {
    id: 'SOLO', // Mapped to Start
    name: 'Start',
    subtitle: 'Agenda online e organização para equipe de 3 a 6 barbeiros.',
    level: 'basic',
    highlight: 'Tudo do Free Solo, mais:',
    modules: [
      {
        key: 'ONLINE_BOOKING',
        title: 'Agendamento Online',
        included: true,
        items: [
          'Link de agendamento da barbearia',
          'Cliente escolhe barbeiro ou “primeiro disponível”',
          'Controle de pausas e horários por cadeira'
        ]
      },
      {
        key: 'TEAM_MGMT',
        title: 'Gestão de Equipe',
        included: true,
        items: [
          'Visual da agenda por barbeiro',
          'Indicador de ocupação (quem está mais cheio)'
        ]
      },
      {
        key: 'REPORTS',
        title: 'Relatórios Simples',
        included: true,
        items: [
          'Faturamento por dia e por barbeiro',
          'Serviços mais vendidos'
        ]
      }
    ],
  },
  {
    id: 'SOLO_PRO', // Mapped to Pro
    name: 'Pro',
    subtitle: 'Gestão completa de equipe, comissões e caixa.',
    level: 'pro',
    highlight: 'Tudo do Start, mais:',
    modules: [
      {
        key: 'FINANCE_ADVANCED',
        title: 'Financeiro Avançado',
        included: true,
        items: [
          'DRE simplificado (lucro/prejuízo)',
          'Ponto de equilíbrio da barbearia',
          'Controle de despesas fixas e variáveis'
        ]
      },
      {
        key: 'COMMISSIONS',
        title: 'Comissões & Payouts',
        included: true,
        items: [
          'Regras de comissão por barbeiro',
          'Cálculo automático de saldos',
          'Histórico de pagamentos (payouts)'
        ]
      },
      {
        key: 'CASH_CONTROL',
        title: 'Fechamento de Caixa',
        included: true,
        items: [
          'Fechamento cego (blindagem)',
          'Registro de sobras e quebras em dinheiro'
        ]
      },
      {
        key: 'RETENTION',
        title: 'Retenção de Clientes',
        included: true,
        items: [
          'Cartão fidelidade',
          'Win-back automático (clientes sumidos)',
          'Visão de retenção por barbeiro'
        ]
      }
    ],
  },
  {
    id: 'STUDIO', // Mapped to Elite
    name: 'Elite',
    subtitle: 'Barbearias em crescimento que querem marca forte e experiência premium.',
    level: 'elite',
    highlight: 'Tudo do Pro, mais:',
    modules: [
      {
        key: 'WEBSITE',
        title: 'Website & Marca',
        included: true,
        items: [
          'Site profissional da barbearia',
          'Páginas de perfil para cada barbeiro',
          'Link de agendamento próprio por barbeiro',
          'Domínio próprio (.com.br) – via parceiro',
          'Remoção da marca d’água BarberFlow'
        ]
      },
      {
        key: 'MARKETING',
        title: 'Marketing & Crescimento',
        included: true,
        items: [
          'Base preparada para múltiplas unidades',
          'Ferramentas de campanhas (WhatsApp, e-mail, SMS – quando liberado)'
        ]
      },
      {
        key: 'SUPPORT',
        title: 'Suporte & Prioridade',
        included: true,
        items: [
          'Suporte prioritário',
          'Acesso antecipado aos novos recursos do BarberFlow'
        ]
      }
    ],
  }
];

const SIZE_TIERS: { id: SaasV2SizeTier; label: string }[] = [
  { id: 'SOLO', label: 'Solo (1 Barbeiro)' },
  { id: 'UP_TO_3', label: 'Até 3 Barbeiros' },
  { id: 'UP_TO_6', label: '3 a 6 Barbeiros' },
  { id: 'PLUS_6', label: 'Mais de 6' },
];

export const PlanOverview: React.FC = () => {
  const { currentTenantPlanId } = useBarber();
  const { getCurrentTenant } = useSaasV2();

  const currentTenant = getCurrentTenant();

  // Default to tenant's size or SOLO
  const [selectedSizeTier, setSelectedSizeTier] = useState<SaasV2SizeTier>(
    currentTenant?.sizeTier || 'SOLO'
  );

  // Billing Interval State - DEFAULT ANNUAL AS REQUESTED
  const [billingInterval, setBillingInterval] = useState<SaasV2BillingInterval>('ANNUAL');

  // Fallback to FREE if no plan is set
  const currentPlanId = currentTenantPlanId || 'FREE';

  // Determine which plan set to use
  let activePlanList = TEAM_PLANS_INFO;
  if (selectedSizeTier === 'SOLO') {
    activePlanList = SOLO_PLANS_INFO;
  } else if (selectedSizeTier === 'UP_TO_3') {
    activePlanList = UP_TO_3_PLANS_INFO;
  } else if (selectedSizeTier === 'UP_TO_6') {
    activePlanList = UP_TO_6_PLANS_INFO;
  }

  // Header Logic
  const getHeaderText = () => {
    if (selectedSizeTier === 'SOLO') {
      return {
        title: 'Escolha o plano ideal para o seu momento',
        sub: 'Nossos planos foram pensados para barbeiros solo. Comece grátis e ative mais recursos conforme o seu fluxo de clientes cresce.'
      };
    } else if (selectedSizeTier === 'UP_TO_3') {
      return {
        title: 'Planos para equipes de até 3 barbeiros',
        sub: 'Perfeito para barbearias pequenas que já funcionam em dupla ou trio e querem organizar agenda, caixa e crescimento do time.'
      };
    } else if (selectedSizeTier === 'UP_TO_6') {
      return {
        title: 'Planos para barbearias em crescimento',
        sub: 'Para lojas com 3 a 6 barbeiros que precisam controlar agenda, comissões, caixa e experiência de marca.'
      };
    }
    // Default for other tiers
    return {
      title: 'Planos para Barbearias em Crescimento',
      sub: 'Soluções escaláveis para equipes maiores e múltiplas unidades.'
    };
  };

  const headerInfo = getHeaderText();

  return (
    <div className="space-y-8 animate-fade-in pb-10 h-full overflow-y-auto">
      {/* Header & Selectors */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-2">
              Assinatura & Planos
            </p>
            <h1 className="text-3xl font-bold text-white mb-2">
              {headerInfo.title}
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl">
              {headerInfo.sub}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Size Tier Selector */}
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Tamanho da Equipe
            </p>
            <div className="flex flex-wrap gap-2">
              {SIZE_TIERS.map(tier => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedSizeTier(tier.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all ${selectedSizeTier === tier.id
                      ? 'bg-zinc-100 text-zinc-900 border-zinc-100 shadow-lg'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                    }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Billing Interval Toggle */}
          <div className="flex items-center gap-4">
            <p className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Ciclo de Pagamento
            </p>
            <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-1 rounded-lg">
              <button
                onClick={() => setBillingInterval('MONTHLY')}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${billingInterval === 'MONTHLY'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingInterval('ANNUAL')}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${billingInterval === 'ANNUAL'
                    ? 'bg-amber-500 text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                Anual
                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase ${billingInterval === 'ANNUAL' ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-500'}`}>
                  2 meses grátis
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {activePlanList.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isPro = plan.level === 'pro';
          const isElite = plan.level === 'elite';

          // Calculate Price Logic
          const priceInfo = getPlanPriceBR(plan.id, selectedSizeTier, billingInterval);

          // Visual helpers
          const borderColor = isCurrent ? 'border-amber-500' : 'border-zinc-800';
          const titleColor = isElite ? 'text-purple-400' : (isPro ? 'text-amber-400' : 'text-white');

          return (
            <div
              key={plan.id}
              className={`flex flex-col h-full rounded-3xl border ${borderColor} bg-zinc-900 p-5 relative overflow-hidden transition-all hover:border-zinc-700`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-amber-500 text-zinc-900 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">
                  ATUAL
                </div>
              )}

              <div className="mb-6 border-b border-zinc-800/50 pb-4">
                <h2 className={`text-xl font-bold mb-1 ${titleColor}`}>
                  {plan.name}
                </h2>

                <div className="h-16 flex flex-col justify-center">
                  {!priceInfo || priceInfo.amount === 0 ? (
                    <span className="text-2xl font-bold text-white">Grátis</span>
                  ) : billingInterval === 'ANNUAL' ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white">12x </span>
                        <span className="text-3xl font-bold text-white">R$ {(priceInfo.amount / 12).toFixed(2).replace('.', ',')}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 leading-tight">
                        Total R$ {priceInfo.amount.toFixed(2).replace('.', ',')} (2 meses grátis)
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">R$ {priceInfo.amount.toFixed(0)}</span>
                        <span className="text-xs text-zinc-500 font-medium">/mês</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 leading-tight">
                        Cobrança mensal, sem desconto.
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-zinc-400 mt-2 min-h-[32px] font-medium">{plan.subtitle}</p>
              </div>

              {/* MODULES LIST */}
              <div className="flex-1 space-y-5">
                {plan.highlight && (
                  <p className="text-[11px] font-bold text-zinc-200 bg-zinc-950 p-2 rounded border border-zinc-800 text-center">
                    {plan.highlight}
                  </p>
                )}

                {plan.modules.map((module) => {
                  return (
                    <div key={module.key}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                          {module.title}
                        </span>
                        <div className="h-px bg-zinc-800 flex-1"></div>
                      </div>

                      <ul className="space-y-2 pl-1">
                        {module.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-400 leading-tight">
                            <Check className="w-3 h-3 text-zinc-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-zinc-800">
                {isCurrent ? (
                  <button disabled className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-bold text-center cursor-default">
                    Plano ativo
                  </button>
                ) : (
                  <button
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${plan.id === 'FREE'
                        ? 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                        : 'bg-amber-500 hover:bg-amber-400 text-zinc-900 shadow-lg shadow-amber-500/10'
                      }`}
                    onClick={() => alert(`Plano ${plan.name} selecionado. Fluxo de checkout em breve.`)}
                  >
                    {plan.id === 'FREE' ? 'Manter este plano' : 'Quero este plano'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table Section */}
      <div className="mt-16 pt-8 border-t border-zinc-800">
        <PlanComparisonTable />
      </div>
    </div>
  );
};
