'use client';


import React from 'react';
import { useRouter } from 'next/navigation';
import { useBarber } from '@/context/BarberContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { DailyGoalWidget } from '@/components/widgets/DailyGoalWidget';
import { PlanSummaryCard } from './PlanSummaryCard';
import { MyReferralsPanel } from '@/modules/clients/MyReferralsPanel';
import { NoShowApprovalPanel } from './components/NoShowApprovalPanel';
import { BarberRanking } from './components/BarberRanking';
import { BirthdayClients } from './components/BirthdayClients';
import { InactiveClients } from './components/InactiveClients';
import { DaySummary } from './components/DaySummary';
import { 
  Users, 
  CalendarCheck, 
  DollarSign,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Wallet,
  ShieldCheck,
  MessageSquare,
  Send
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import { AppointmentStatus, CompensationModel } from '@/types';

export const Dashboard = () => {
  const router = useRouter();
  const { currentUser, sales, appointments, clients, shopSettings, currentTenantPlanId } = useBarber();

  if (!currentUser) return null;

  const { 
    todayRevenue, 
    dailyGoal, 
    todaysAppointments, 
    completedCount, 
    activeClientsCount, 
    nextAppointment, 
    lowStockProducts, 
    chartData 
  } = useDashboardStats();

  const isOwner = currentUser.role === 'OWNER';

  // --- STAFF SPECIFIC STATS CALCULATION ---
  // If not owner, filter data to show only personal stats
  const myAppointmentsToday = todaysAppointments.filter(a => a.staffId === currentUser.id);
  const myCompletedCount = myAppointmentsToday.filter(a => a.status === AppointmentStatus.COMPLETED).length;
  const myNextAppointment = myAppointmentsToday
    .filter(a => a.status === AppointmentStatus.SCHEDULED && a.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  
  // Calculate Estimated Earnings for Today (Simple Approx)
  const mySalesToday = sales.filter(s => s.staffId === currentUser.id && s.date.toDateString() === new Date().toDateString());
  const myServiceRevenue = myAppointmentsToday.filter(a => a.status === AppointmentStatus.COMPLETED).reduce((acc, a) => acc + a.price, 0);
  // Note: This is a rough estimate for the dashboard card
  const estimatedCommission = (myServiceRevenue * (currentUser.serviceCommissionRate / 100));

  // Loyal Count for Badge
  const myLoyalCount = clients.filter(c => c.preferredStaffId === currentUser.id).length;

  // --- ACTIONS ---
  const sendSurvey = (apptId: string) => {
     // Simulate sending link (In real app: API call)
     // For Demo: Navigate to tips review page
     if (confirm('Simular envio de link e abrir Pesquisa como cliente?')) {
        router.push(`/app/tips-review?appointmentId=${apptId}`);
     }
  };

  // --- STAT CARD COMPONENT ---
  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
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
      <p className="text-xs text-zinc-500">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-3">
             <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
             {!isOwner && <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded font-bold uppercase">Staff View</span>}
           </div>
           <p className="text-zinc-400">Bem-vindo de volta, <b>{currentUser.name}</b>. Veja o que está acontecendo hoje.</p>
        </div>
      </div>

      {/* NO-SHOW APPROVAL PANEL (Owner Only) */}
      <NoShowApprovalPanel />

      {/* BIRTHDAY CLIENTS */}
      <BirthdayClients />

      {/* MY REFERRALS PANEL - Horizontal at top */}
      {shopSettings.referralConfig?.enabled && (
        <MyReferralsPanel />
      )}

      {/* DAY SUMMARY (Integrado com stats do dono) */}
      <DaySummary todayRevenue={todayRevenue} activeClientsCount={activeClientsCount} />

      {/* GAMIFICATION WIDGET (Shows Shop Goal for Everyone to motivate team) */}
      <DailyGoalWidget currentRevenue={todayRevenue} goal={dailyGoal} />

      {/* Stats Grid - ONLY FOR STAFF (Owner stats are in DaySummary now) */}
      {!isOwner && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Meus Ganhos Est." 
            value={`$${estimatedCommission.toFixed(2)}`} 
            sub="Comissão de Hoje"
            icon={Wallet}
            color="bg-emerald-500"
          />
          <StatCard 
            title="Meus Agendamentos" 
            value={myAppointmentsToday.length} 
            sub={`${myCompletedCount} concluídos`}
            icon={CalendarCheck}
            color="bg-blue-500"
          />
          <StatCard 
            title="Portfólio Fiel" 
            value={myLoyalCount} 
            sub={myLoyalCount > 5 ? "Você é um Pro!" : "Continue construindo!"}
            icon={ShieldCheck}
            color="bg-purple-500"
          />
          <StatCard 
            title="Próximo Cliente" 
            value={myNextAppointment ? format(myNextAppointment.date, 'HH:mm') : '-'} 
            sub={myNextAppointment?.clientName || 'Livre'}
            icon={Users}
            color="bg-amber-500"
          />
        </div>
      )}

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section - Only meaningful for Owner or maybe personal history for barber later */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">{isOwner ? 'Visão Geral da Receita' : 'Desempenho da Loja'}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Alert Block (Visible to everyone as staff needs to know too) */}
          {lowStockProducts.length > 0 && (
            <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-6">
               <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-bold text-white">Alerta de Estoque Baixo</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lowStockProducts.map(p => (
                     <div key={p.id} className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                        <div className="flex items-center gap-3">
                           {p.image && <img src={p.image} className="w-8 h-8 rounded-lg object-cover" />}
                           <div>
                              <p className="text-sm font-bold text-zinc-200">{p.name}</p>
                              <p className="text-xs text-zinc-500">Apenas {p.stock} restante</p>
                           </div>
                        </div>
                        {isOwner && (
                           <button 
                              onClick={() => router.push('/app/settings')} 
                              className="text-xs font-bold text-amber-500 hover:underline"
                           >
                              Reabastecer
                           </button>
                        )}
                     </div>
                  ))}
               </div>
            </div>
          )}

          {/* PLAN SUMMARY CARD (NEW - OWNER ONLY) */}
          {isOwner && currentTenantPlanId && (
             <PlanSummaryCard currentPlanId={currentTenantPlanId} />
          )}
        </div>

        {/* Up Next & Quick Actions & REFERRALS */}
        <div className="space-y-6">

          {/* BARBER RANKING */}
          <BarberRanking />

          {/* INACTIVE CLIENTS (Win-back) */}
          {isOwner && <InactiveClients />}

          {/* COMPLETED APPOINTMENTS (Feedback Trigger) - CONDITIONAL RENDERING */}
          {shopSettings.enableTipsReview && (
             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                   <MessageSquare className="w-5 h-5 text-emerald-500" /> Fila de Feedback
                </h3>
                <div className="space-y-3">
                   {todaysAppointments.filter(a => a.status === AppointmentStatus.COMPLETED).length === 0 ? (
                      <p className="text-zinc-500 text-sm">Nenhum agendamento concluído ainda.</p>
                   ) : (
                      todaysAppointments
                         .filter(a => a.status === AppointmentStatus.COMPLETED)
                         .slice(0, 3) // Show last 3
                         .map(appt => (
                            <div key={appt.id} className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                               <div>
                                  <p className="text-sm font-bold text-white">{appt.clientName}</p>
                                  <p className="text-xs text-zinc-500">Finalizado às {format(appt.date, 'HH:mm')}</p>
                               </div>
                               <button 
                                  onClick={() => sendSurvey(appt.id)}
                                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-amber-500 font-bold px-2 py-1.5 rounded flex items-center gap-1 transition-colors"
                                  title="Enviar Link de Pesquisa"
                               >
                                  <Send className="w-3 h-3" /> Link
                               </button>
                            </div>
                         ))
                   )}
                </div>
             </div>
          )}

          {/* Up Next Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Próximo</h3>
            
            {(isOwner ? nextAppointment : myNextAppointment) ? (
              <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-amber-500 font-bold text-lg">
                    {format((isOwner ? nextAppointment : myNextAppointment)!.date, 'HH:mm')}
                  </span>
                  <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-full">
                    {(isOwner ? nextAppointment : myNextAppointment)!.serviceName}
                  </span>
                </div>
                <h4 className="font-medium text-white text-lg">{(isOwner ? nextAppointment : myNextAppointment)!.clientName}</h4>
                <p className="text-zinc-500 text-sm mt-1 mb-3">Does not want much off the top.</p>
                <button 
                  onClick={() => router.push('/app/pdv')}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg transition-colors"
                >
                  Check-in / Finalizar
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                <p>Sem mais agendamentos hoje.</p>
              </div>
            )}
            
            <button 
              onClick={() => router.push('/app/agenda')}
              className="w-full mt-4 flex items-center justify-center gap-2 text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors"
            >
              Ver Agenda Completa <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-zinc-950">
            <h3 className="font-bold text-xl mb-2">Venda Rápida</h3>
            <p className="text-zinc-900/80 text-sm mb-4">Cliente sem agendamento comprando produto?</p>
            <button 
              onClick={() => router.push('/app/pdv')}
              className="w-full bg-white/90 hover:bg-white text-zinc-900 font-bold py-3 rounded-xl transition-all shadow-lg"
            >
              Abrir Caixa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
