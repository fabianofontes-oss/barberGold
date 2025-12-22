'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Search, 
  Plus, 
  Loader2, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { 
  listAppointmentsAction, 
  createAppointmentAction, 
  updateAppointmentAction,
  deleteAppointmentAction,
  type Appointment,
  type CreateAppointmentInput 
} from '@/modules/appointments';

/**
 * Agenda Moderna - Conectada ao Supabase
 * Usa Server Actions para todas as operações
 */
export const AgendaModern = () => {
  // State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // Filtros
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form
  const [formData, setFormData] = useState<Partial<CreateAppointmentInput>>({
    client_id: '',
    staff_id: '',
    service_id: '',
    scheduled_at: new Date().toISOString(),
    price: 0,
    status: 'SCHEDULED',
    notes: '',
  });

  // Carregar appointments
  useEffect(() => {
    loadAppointments();
  }, [selectedDate, statusFilter]);

  const loadAppointments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dateFrom = startOfMonth(selectedDate).toISOString();
      const dateTo = endOfMonth(selectedDate).toISOString();
      
      const result = await listAppointmentsAction({
        date_from: dateFrom,
        date_to: dateTo,
        status: statusFilter !== 'all' ? statusFilter as any : undefined,
        sort_by: 'scheduled_at',
        sort_order: 'asc',
      });

      if (result.success) {
        setAppointments(result.data.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao carregar agendamentos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar appointment
  const handleCreate = async () => {
    if (!formData.client_id || !formData.staff_id || !formData.service_id) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    startTransition(async () => {
      const result = await createAppointmentAction(formData as CreateAppointmentInput);
      
      if (result.success) {
        await loadAppointments();
        setIsModalOpen(false);
        resetForm();
      } else {
        alert(result.error);
      }
    });
  };

  // Atualizar status
  const handleUpdateStatus = async (id: string, newStatus: any) => {
    startTransition(async () => {
      const result = await updateAppointmentAction(id, { status: newStatus });
      
      if (result.success) {
        await loadAppointments();
      } else {
        alert(result.error);
      }
    });
  };

  // Deletar
  const handleDelete = async (id: string) => {
    if (!confirm('Deletar agendamento?')) return;

    startTransition(async () => {
      const result = await deleteAppointmentAction(id);
      
      if (result.success) {
        await loadAppointments();
      } else {
        alert(result.error);
      }
    });
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      staff_id: '',
      service_id: '',
      scheduled_at: new Date().toISOString(),
      price: 0,
      status: 'SCHEDULED',
      notes: '',
    });
    setEditingId(null);
  };

  // Filtrar appointments por busca
  const filteredAppointments = appointments.filter(apt => {
    if (!searchQuery) return true;
    // Aqui você pode adicionar lógica de busca mais complexa
    return true;
  });

  // Status badge
  const getStatusBadge = (status: string) => {
    const config = {
      SCHEDULED: { color: 'bg-blue-500', icon: Clock, label: 'Agendado' },
      COMPLETED: { color: 'bg-green-500', icon: CheckCircle2, label: 'Concluído' },
      CANCELLED: { color: 'bg-red-500', icon: XCircle, label: 'Cancelado' },
      NO_SHOW: { color: 'bg-orange-500', icon: AlertCircle, label: 'Não compareceu' },
    };

    const conf = config[status as keyof typeof config] || config.SCHEDULED;
    const Icon = conf.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${conf.color} text-white`}>
        <Icon className="w-3 h-3" />
        {conf.label}
      </span>
    );
  };

  if (error && !appointments.length) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          <p className="font-bold mb-2">Erro ao carregar agendamentos</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={loadAppointments}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agenda</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {appointments.length} agendamento(s) encontrado(s)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAppointments}
            disabled={isLoading}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
            title="Recarregar"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:border-amber-500 outline-none transition-colors"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none transition-colors"
        >
          <option value="all">Todos os status</option>
          <option value="SCHEDULED">Agendado</option>
          <option value="COMPLETED">Concluído</option>
          <option value="CANCELLED">Cancelado</option>
          <option value="NO_SHOW">Não compareceu</option>
        </select>
      </div>

      {/* Loading */}
      {isLoading && appointments.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      )}

      {/* Lista de Appointments */}
      {!isLoading && filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400">Nenhum agendamento encontrado</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold rounded-lg transition-colors"
          >
            Criar primeiro agendamento
          </button>
        </div>
      )}

      {filteredAppointments.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800/50 border-b border-zinc-800">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-bold text-zinc-400 uppercase">Data/Hora</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-zinc-400 uppercase">Cliente</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-zinc-400 uppercase">Serviço</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-zinc-400 uppercase">Profissional</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-zinc-400 uppercase">Preço</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-zinc-400 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-zinc-400 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-white">
                    {format(new Date(apt.scheduled_at), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {apt.client_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {apt.service_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {apt.staff_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-bold">
                    R$ {apt.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(apt.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {apt.status === 'SCHEDULED' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                          disabled={isPending}
                          className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          Concluir
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(apt.id)}
                        disabled={isPending}
                        className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Criação (Simplificado) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-4">Novo Agendamento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2">Cliente ID</label>
                <input
                  type="text"
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500 outline-none"
                  placeholder="UUID do cliente"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2">Staff ID</label>
                <input
                  type="text"
                  value={formData.staff_id}
                  onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500 outline-none"
                  placeholder="UUID do profissional"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2">Serviço ID</label>
                <input
                  type="text"
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500 outline-none"
                  placeholder="UUID do serviço"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2">Preço</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500 outline-none"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

