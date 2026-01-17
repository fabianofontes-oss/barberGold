import { z } from 'zod';

// ===================================
// CLIENTS SCHEMAS
// ===================================

const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export const createClientSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    phone: z.string().regex(phoneRegex, 'Telefone deve estar no formato (XX) XXXXX-XXXX').or(z.literal('')),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida').optional(),
    cpf: z.string().regex(cpfRegex, 'CPF deve estar no formato XXX.XXX.XXX-XX').optional().or(z.literal('')),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
    zipCode: z.string().optional(),
    notes: z.string().optional(),
    referrerCode: z.string().optional()
});

export const updateClientSchema = createClientSchema.extend({
    id: z.string().uuid('ID do cliente inválido')
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
