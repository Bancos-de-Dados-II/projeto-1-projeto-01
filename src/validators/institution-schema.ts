import { z } from 'zod';

export const createInstitutionSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),

  cnpj: z
    .string()
    .length(14, 'CNPJ deve conter 14 números')
    .regex(/^\d+$/, 'CNPJ deve conter apenas números'),

  email: z.string().email('Email inválido'),

  phone: z.string().min(10, 'Telefone inválido'),

  address: z.string().min(5, 'Endereço muito curto'),

  active: z.boolean().optional(),

  latitude: z
    .number()
    .min(-90, 'Latitude inválida')
    .max(90, 'Latitude inválida'),

  longitude: z
    .number()
    .min(-180, 'Longitude inválida')
    .max(180, 'Longitude inválida'),
});

export type CreateInstitutionDTO = z.infer<typeof createInstitutionSchema>;

export const updateInstitutionSchema =
  createInstitutionSchema.partial();
    
export type UpdateInstitutionDTO =
  z.infer<typeof updateInstitutionSchema>;
