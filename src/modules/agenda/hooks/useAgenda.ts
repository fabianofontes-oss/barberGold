'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createAgendaBlockedTimeAction,
  createAgendaClientAction,
  createAgendaServiceAppointmentAction,
  getAgendaBootstrapAction,
  updateAgendaAppointmentStatusAction,
} from '../actions';
import type { AppointmentStatus as AppointmentStatusEnum, CompensationModel } from '@/types';

// =============================================
// TIPOS LOCAIS DO HOOK (compatíveis com Supabase)
// =============================================

export type AgendaStaff = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar?: string;
  commissionModel: CompensationModel;
  serviceCommissionRate: number;
  productCommissionRate: number;
  rentalFee: number;
  paymentFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  workSchedule: Array<{ dayIndex: number; isActive: boolean; start?: string; end?: string }>;
  allowedServices?: string[];
};

export type AgendaClient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate?: string;
  totalSpent?: number;
  lastVisit?: Date;
  loyaltyPoints?: number;
  notes?: string;
  tags?: string[];
  photo?: string;
  preferredStaffId?: string;
  preferences?: {
    preferredService?: string;
    preferredDay?: string;
    preferredTime?: string;
    allergies?: string;
    observations?: string;
  };
};

export type AgendaService = {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  type: 'SERVICE';
  category?: string;
};

export type AgendaAppointment = {
  id: string;
  clientId: string;
  clientName: string;
  staffId: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  price: number;
  status: AppointmentStatusEnum;
  notes?: string;
};

export type AgendaTenant = {
  id: string;
  name: string;
  slug: string;
  plan_id?: string;
  status?: string;
  settings?: unknown;
};

export type AgendaMe = {
  profileId: string;
  role: string;
  displayName: string;
};

type AgendaLoadState = {
  tenant: AgendaTenant | null;
  me: AgendaMe | null;
  clients: AgendaClient[];
  services: AgendaService[];
  staff: AgendaStaff[];
  appointments: AgendaAppointment[];
};

// =============================================
// HOOK PRINCIPAL
// =============================================

export function useAgenda(params: { start: Date; end: Date }) {
  const [state, setState] = useState<AgendaLoadState>({
    tenant: null,
    me: null,
    clients: [],
    services: [],
    staff: [],
    appointments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startIso = useMemo(() => params.start.toISOString(), [params.start]);
  const endIso = useMemo(() => params.end.toISOString(), [params.end]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAgendaBootstrapAction({ start: startIso, end: endIso });
      setState({
        tenant: data.tenant as AgendaTenant,
        me: data.me as AgendaMe,
        clients: data.clients as AgendaClient[],
        services: data.services as AgendaService[],
        staff: data.staff as AgendaStaff[],
        appointments: data.appointments as AgendaAppointment[],
      });
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  }, [startIso, endIso]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // =============================================
  // MUTATIONS
  // =============================================

  const addClient = useCallback(async (input: { name: string; phone: string; email: string; birthDate: string }) => {
    const res = await createAgendaClientAction(input);
    await reload();
    return res.id as string;
  }, [reload]);

  const addAppointment = useCallback(async (input: {
    clientId: string;
    staffId: string;
    serviceId: string;
    scheduledAt: Date;
    notes?: string;
    recurrence?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    recurrenceEndDate?: Date;
  }) => {
    await createAgendaServiceAppointmentAction({
      clientId: input.clientId,
      staffId: input.staffId,
      serviceId: input.serviceId,
      scheduledAt: input.scheduledAt.toISOString(),
      notes: input.notes,
      recurrence: input.recurrence,
      recurrenceEndDate: input.recurrenceEndDate?.toISOString(),
    });

    await reload();
  }, [reload]);

  const addBlockedTime = useCallback(async (input: { staffId: string; scheduledAt: Date; durationMinutes: number; reason: string }) => {
    await createAgendaBlockedTimeAction({
      staffId: input.staffId,
      scheduledAt: input.scheduledAt.toISOString(),
      durationMinutes: input.durationMinutes,
      reason: input.reason,
    });

    await reload();
  }, [reload]);

  const updateAppointmentStatus = useCallback(async (appointmentId: string, status: AppointmentStatusEnum) => {
    await updateAgendaAppointmentStatusAction({ appointmentId, status });
    await reload();
  }, [reload]);

  // =============================================
  // RETURN
  // =============================================

  return {
    // Estado
    loading,
    error,
    tenant: state.tenant,
    me: state.me,
    clients: state.clients,
    services: state.services,
    staff: state.staff,
    appointments: state.appointments,

    // Ações
    reload,
    addClient,
    addAppointment,
    addBlockedTime,
    updateAppointmentStatus,
  };
}

// Re-export do tipo para uso externo
export type UseAgendaReturn = ReturnType<typeof useAgenda>;
