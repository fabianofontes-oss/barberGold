'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createAgendaBlockedTimeAction,
  createAgendaClientAction,
  createAgendaServiceAppointmentAction,
  getAgendaBootstrapAction,
  updateAgendaAppointmentStatusAction,
} from '../actions';
import type { Appointment, AppointmentStatus, Client, Service, StaffMember, CompensationModel } from '@/types';

// Tipo do staff retornado pela action (compatível com dados do Supabase)
type AgendaStaff = {
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
  workSchedule: StaffMember['workSchedule'];
};

type AgendaLoadState = {
  tenant: { id: string; name: string; slug: string } | null;
  me: { profileId: string; role: string; displayName: string } | null;
  clients: Client[];
  services: Service[];
  staff: AgendaStaff[];
  appointments: Appointment[];
};

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
        tenant: data.tenant,
        me: data.me,
        clients: data.clients,
        services: data.services,
        staff: data.staff,
        appointments: data.appointments,
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

  const createClient = useCallback(async (input: { name: string; phone: string; email: string; birthDate: string }) => {
    const res = await createAgendaClientAction(input);
    await reload();
    return res.id as string;
  }, [reload]);

  const createServiceAppointment = useCallback(async (input: {
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

  const createBlockedTime = useCallback(async (input: { staffId: string; scheduledAt: Date; durationMinutes: number; reason: string }) => {
    await createAgendaBlockedTimeAction({
      staffId: input.staffId,
      scheduledAt: input.scheduledAt.toISOString(),
      durationMinutes: input.durationMinutes,
      reason: input.reason,
    });

    await reload();
  }, [reload]);

  const updateAppointmentStatus = useCallback(async (appointmentId: string, status: AppointmentStatus) => {
    await updateAgendaAppointmentStatusAction({ appointmentId, status });
    await reload();
  }, [reload]);

  return {
    loading,
    error,
    reload,
    tenant: state.tenant,
    me: state.me,
    clients: state.clients,
    services: state.services,
    staff: state.staff,
    appointments: state.appointments,
    createClient,
    createServiceAppointment,
    createBlockedTime,
    updateAppointmentStatus,
  };
}
