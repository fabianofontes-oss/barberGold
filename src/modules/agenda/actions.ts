'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getTenantId';
import { createAgendaRepository } from './repository';
import { AppointmentStatus, CompensationModel } from '@/types';
import {
  createAgendaBlockedTimeInputSchema,
  createAgendaClientInputSchema,
  createAgendaServiceAppointmentInputSchema,
  getAgendaBootstrapInputSchema,
  updateAgendaAppointmentStatusInputSchema,
} from './types';
import { addDays, addWeeks, addMonths } from 'date-fns';

function toDbStatus(input: {
  status:
    | 'SCHEDULED'
    | 'CHECKED_IN'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'BLOCKED'
    | 'NO_SHOW_PENDING'
    | 'NO_SHOW';
}): { dbStatus: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'BLOCKED'; internalNotes?: string | null } {
  if (input.status === 'CHECKED_IN') return { dbStatus: 'CONFIRMED', internalNotes: null };
  if (input.status === 'NO_SHOW_PENDING') return { dbStatus: 'NO_SHOW', internalNotes: 'NO_SHOW_PENDING' };
  if (input.status === 'NO_SHOW') return { dbStatus: 'NO_SHOW', internalNotes: 'NO_SHOW_APPROVED' };
  return { dbStatus: input.status, internalNotes: null };
}

function toUiStatus(input: {
  dbStatus: string;
  internalNotes: string | null;
}): AppointmentStatus {
  if (input.dbStatus === 'CONFIRMED') return AppointmentStatus.CHECKED_IN;
  if (input.dbStatus === 'NO_SHOW' && input.internalNotes === 'NO_SHOW_PENDING') return AppointmentStatus.NO_SHOW_PENDING;
  if (input.dbStatus === 'NO_SHOW') return AppointmentStatus.NO_SHOW;
  if (input.dbStatus === 'IN_PROGRESS') return AppointmentStatus.IN_PROGRESS;
  if (input.dbStatus === 'COMPLETED') return AppointmentStatus.COMPLETED;
  if (input.dbStatus === 'CANCELLED') return AppointmentStatus.CANCELLED;
  if (input.dbStatus === 'BLOCKED') return AppointmentStatus.BLOCKED;
  return AppointmentStatus.SCHEDULED;
}

export async function getAgendaBootstrapAction(input: unknown) {
  const parsed = getAgendaBootstrapInputSchema.parse(input);

  const auth = await getAuthContext();
  const tenantId = auth.tenantId;

  const supabase = await createClient();
  const repo = createAgendaRepository(supabase);

  const [tenant, clients, services, staff, appointments] = await Promise.all([
    repo.getTenantById({ tenantId }),
    repo.listClients({ tenantId }),
    repo.listServices({ tenantId }),
    repo.listStaff({ tenantId }),
    repo.listAppointments({ tenantId, start: parsed.start, end: parsed.end }),
  ]);

  if (!tenant) throw new Error('Tenant não encontrado.');

  const clientNameById = new Map(clients.map((c) => [c.id, c.name] as const));
  const serviceById = new Map(services.map((s) => [s.id, s] as const));

  const mappedAppointments = appointments.map((row) => {
    const isBlocked = row.status === 'BLOCKED';
    const clientName = isBlocked
      ? (row.notes ?? 'Bloqueio')
      : (row.client_id ? (clientNameById.get(row.client_id) ?? '') : '');
    const serviceName = isBlocked
      ? 'Blocked Time'
      : (serviceById.get(row.service_id)?.name ?? '');

    return {
      id: row.id,
      clientId: isBlocked ? 'BLOCK' : (row.client_id ?? ''),
      clientName,
      staffId: row.staff_id,
      serviceId: isBlocked ? 'BLOCK' : row.service_id,
      serviceName,
      date: new Date(row.scheduled_at),
      price: Number(row.price ?? 0),
      status: toUiStatus({ dbStatus: row.status, internalNotes: row.internal_notes ?? null }),
      notes: row.notes ?? undefined,
    };
  });

  return {
    tenant,
    me: {
      profileId: auth.profileId,
      role: auth.role,
      displayName: auth.displayName,
    },
    clients: clients.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email ?? '',
      birthDate: c.birthDate ?? '',
      totalSpent: Number(c.totalSpent ?? 0),
      lastVisit: c.lastVisit ? new Date(c.lastVisit) : undefined,
      loyaltyPoints: typeof c.loyaltyPoints === 'number' ? c.loyaltyPoints : undefined,
      notes: c.notes ?? undefined,
    })),
    services: services.map((s) => ({
      id: s.id,
      name: s.name,
      price: Number(s.price ?? 0),
      durationMinutes: Number(s.durationMinutes ?? 30),
      type: 'SERVICE' as const,
      category: s.category ?? undefined,
    })),
    staff: staff.map((p) => ({
      id: p.id,
      name: p.name,
      role: p.role,
      email: p.email,
      phone: p.phone ?? undefined,
      avatar: p.avatarUrl ?? undefined,
      commissionModel: p.role === 'OWNER' ? CompensationModel.OWNER : CompensationModel.PERCENTAGE,
      serviceCommissionRate: Number(p.commissionRate ?? 0),
      productCommissionRate: Number(p.commissionRate ?? 0),
      rentalFee: 0,
      paymentFrequency: 'WEEKLY' as const,
      workSchedule: [],
    })),
    appointments: mappedAppointments,
  };
}

export async function createAgendaClientAction(input: unknown) {
  const parsed = createAgendaClientInputSchema.parse(input);

  const auth = await getAuthContext();
  const tenantId = auth.tenantId;

  const supabase = await createClient();
  const repo = createAgendaRepository(supabase);

  const created = await repo.createClient({
    input: {
      tenant_id: tenantId,
      name: parsed.name,
      phone: parsed.phone,
      email: parsed.email || null,
      birth_date: parsed.birthDate || null,
    },
  });

  return { id: created.id };
}

export async function createAgendaServiceAppointmentAction(input: unknown) {
  const parsed = createAgendaServiceAppointmentInputSchema.parse(input);

  const auth = await getAuthContext();
  const tenantId = auth.tenantId;

  const supabase = await createClient();
  const repo = createAgendaRepository(supabase);

  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('id,price,duration_minutes')
    .eq('tenant_id', tenantId)
    .eq('id', parsed.serviceId)
    .maybeSingle();

  if (serviceError) throw serviceError;
  if (!service) throw new Error('Serviço não encontrado.');

  const scheduledAt = new Date(parsed.scheduledAt);
  const baseRow = {
    tenant_id: tenantId,
    client_id: parsed.clientId,
    staff_id: parsed.staffId,
    service_id: parsed.serviceId,
    scheduled_at: scheduledAt.toISOString(),
    duration_minutes: Number((service as any).duration_minutes ?? 30),
    price: Number((service as any).price ?? 0),
    status: 'SCHEDULED' as const,
    source: 'MANUAL' as const,
    notes: parsed.notes ?? null,
    internal_notes: null,
    is_recurring: Boolean(parsed.recurrence && parsed.recurrence !== 'NONE' && parsed.recurrenceEndDate),
    recurrence_rule: null,
    parent_appointment_id: null,
  };

  const rows: any[] = [baseRow];

  if (parsed.recurrence && parsed.recurrence !== 'NONE' && parsed.recurrenceEndDate) {
    const endDate = new Date(parsed.recurrenceEndDate);
    let next = new Date(scheduledAt);
    let count = 0;
    const maxRecurrences = 52;

    while (count < maxRecurrences) {
      if (parsed.recurrence === 'DAILY') next = addDays(next, 1);
      if (parsed.recurrence === 'WEEKLY') next = addWeeks(next, 1);
      if (parsed.recurrence === 'MONTHLY') next = addMonths(next, 1);

      if (next > endDate) break;

      rows.push({
        ...baseRow,
        scheduled_at: next.toISOString(),
        parent_appointment_id: null,
      });
      count++;
    }
  }

  const ids = await repo.createAppointments({ rows });
  return { ids };
}

export async function createAgendaBlockedTimeAction(input: unknown) {
  const parsed = createAgendaBlockedTimeInputSchema.parse(input);

  const auth = await getAuthContext();
  const tenantId = auth.tenantId;

  const supabase = await createClient();
  const repo = createAgendaRepository(supabase);

  const blockedService = await repo.findOrCreateBlockedService({ tenantId });

  const ids = await repo.createAppointments({
    rows: [
      {
        tenant_id: tenantId,
        client_id: null,
        staff_id: parsed.staffId,
        service_id: blockedService.id,
        scheduled_at: new Date(parsed.scheduledAt).toISOString(),
        duration_minutes: parsed.durationMinutes,
        price: 0,
        status: 'BLOCKED',
        source: 'MANUAL',
        notes: parsed.reason,
        internal_notes: null,
        is_recurring: false,
        recurrence_rule: null,
        parent_appointment_id: null,
      },
    ],
  });

  return { ids };
}

export async function updateAgendaAppointmentStatusAction(input: unknown) {
  const parsed = updateAgendaAppointmentStatusInputSchema.parse(input);

  const auth = await getAuthContext();
  const tenantId = auth.tenantId;

  const supabase = await createClient();
  const repo = createAgendaRepository(supabase);

  const mapped = toDbStatus({ status: parsed.status });

  await repo.updateAppointment({
    tenantId,
    appointmentId: parsed.appointmentId,
    patch: {
      status: mapped.dbStatus,
      internal_notes: typeof mapped.internalNotes === 'undefined' ? null : mapped.internalNotes,
      updated_at: new Date().toISOString(),
    } as any,
  });

  return { success: true };
}
