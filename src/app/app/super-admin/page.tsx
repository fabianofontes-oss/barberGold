'use client';

import { useState } from 'react';
import { 
  Shield, 
  Activity, 
  Users, 
  Layers, 
  Server, 
  LifeBuoy, 
  Receipt, 
  Megaphone, 
  Puzzle,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'billing' | 'system'>('overview');

  // Mock data - substituir com dados reais do Supabase
  const stats = {
    totalTenants: 42,
    activeUsers: 156,
    mrr: 12450,
    serverStatus: 'healthy',
    ticketsOpen: 3,
    deploymentStatus: 'stable'
  };

  const recentActivity = [
    { id: 1, type: 'new_tenant', message: 'Nova barbearia cadastrada: Elite Cuts', time: '5 min atrÃ¡s', icon: CheckCircle, color: 'text-green-500' },
    { id: 2, type: 'payment', message: 'Pagamento recebido: Premium Barber (R$ 149)', time: '23 min atrÃ¡s', icon: DollarSign, color: 'text-blue-500' },
    { id: 3, type: 'support', message: 'Novo ticket de suporte aberto', time: '1h atrÃ¡s', icon: AlertCircle, color: 'text-yellow-500' },
    { id: 4, type: 'upgrade', message: 'Upgrade de plano: Style House (Solo â†’ Equipe)', time: '2h atrÃ¡s', icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-zinc-400">Controle total do sistema BarberGOLD</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-zinc-800">
        {[
          { id: 'overview', label: 'VisÃ£o Geral', icon: Activity },
          { id: 'tenants', label: 'Barbearias', icon: Users },
          { id: 'billing', label: 'Faturamento', icon: Receipt },
          { id: 'system', label: 'Sistema', icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-indigo-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-indigo-500" />
                <span className="text-xs text-green-500 font-semibold">+12%</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.totalTenants}</p>
              <p className="text-sm text-zinc-400">Barbearias Ativas</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-green-500" />
                <span className="text-xs text-green-500 font-semibold">+8%</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.activeUsers}</p>
              <p className="text-sm text-zinc-400">UsuÃ¡rios Ativos</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-amber-500" />
                <span className="text-xs text-green-500 font-semibold">+23%</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">R$ {stats.mrr.toLocaleString()}</p>
              <p className="text-sm text-zinc-400">MRR</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Server className="w-8 h-8 text-purple-500" />
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-500 font-semibold">Healthy</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">99.9%</p>
              <p className="text-sm text-zinc-400">Uptime</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Atividade Recente</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg">
                    <Icon className={`w-5 h-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-white">{activity.message}</p>
                      <p className="text-xs text-zinc-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {activeTab === 'tenants' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Gerenciar Barbearias</h2>
          <p className="text-zinc-400">Lista completa de barbearias cadastradas no sistema.</p>
          {/* Adicionar tabela de tenants aqui */}
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Faturamento Global</h2>
          <p className="text-zinc-400">Controle de pagamentos e assinaturas.</p>
          {/* Adicionar grÃ¡ficos e tabelas de faturamento aqui */}
        </div>
      )}

      {activeTab === 'system' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Status do Sistema</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white">Banco de Dados</span>
              </div>
              <span className="text-green-500 text-sm font-semibold">Operacional</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white">API</span>
              </div>
              <span className="text-green-500 text-sm font-semibold">Operacional</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white">CDN</span>
              </div>
              <span className="text-green-500 text-sm font-semibold">Operacional</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
