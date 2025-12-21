'use client';

import { useEffect, useState } from 'react';
import { listClientsAction } from '@/modules/clients/actions';
import { listServicesAction } from '@/modules/services/actions';
import { getAgendaBootstrapAction } from '@/modules/agenda/actions';
import { Users, CalendarCheck, DollarSign, Scissors, Loader2 } from 'lucide-react';
import { format, isToday } from 'date-fns';

type DashboardStats = {
  clientsCount: number;
  servicesCount: number;
  appointmentsToday: number;
  revenue: number;
};

export const DashboardSimple = () => {
  const [stats, setStats] = useState<DashboardStats>({
    clientsCount: 0,
    servicesCount: 0,
    appointmentsToday: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const today = new Date();
        const start = new Date(today.setHours(0, 0, 0, 0));
        const end = new Date(today.setHours(23, 59, 59, 999));

        const [clientsResult, servicesResult, agendaResult] = await Promise.all([
          listClientsAction({ isActive: true }),
          listServicesAction({ isActive: true }),
          getAgendaBootstrapAction({ start, end }),
        ]);

        const appointmentsToday = agendaResult.appointments.filter(apt =>
          isToday(apt.date)
        );

        setStats({
          clientsCount: clientsResult.length,
          servicesCount: servicesResult.length,
          appointmentsToday: appointmentsToday.length,
          revenue: 0,
        });
      } catch (error) {
        console.error('Erro ao carregar stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-zinc-400">Visão geral do seu negócio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Clientes" 
          value={stats.clientsCount} 
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard 
          title="Serviços" 
          value={stats.servicesCount} 
          icon={Scissors}
          color="bg-purple-500"
        />
        <StatCard 
          title="Agendamentos Hoje" 
          value={stats.appointmentsToday} 
          icon={CalendarCheck}
          color="bg-emerald-500"
        />
        <StatCard 
          title="Receita do Mês" 
          value={`R$ ${stats.revenue.toFixed(2)}`} 
          icon={DollarSign}
          color="bg-amber-500"
        />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Bem-vindo ao BarberFlow!</h3>
        <p className="text-zinc-400 mb-4">
          Seu sistema está configurado e pronto para uso. Comece adicionando clientes e serviços.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/app/clients"
            className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-amber-500 transition-all text-center"
          >
            <Users className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-white font-bold">Gerenciar Clientes</p>
          </a>
          <a
            href="/app/agenda"
            className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-amber-500 transition-all text-center"
          >
            <CalendarCheck className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-white font-bold">Ver Agenda</p>
          </a>
          <a
            href="/app/settings"
            className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-amber-500 transition-all text-center"
          >
            <Scissors className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-white font-bold">Configurar Serviços</p>
          </a>
        </div>
      </div>
    </div>
  );
};
