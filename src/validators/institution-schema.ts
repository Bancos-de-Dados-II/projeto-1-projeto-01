import { z } from "zod";

export const CreateInstitutionSchema = z.object({
  name: z
    .string("Nome é obrigatório")
    .trim()
    .min(2, "Nome deve ter no mínimo 2 caracteres"),

  cnpj: z
    .string("CNPJ é obrigatório")
    .min(14, "CNPJ inválido"),

  email: z
    .string("E-mail é obrigatório")
    .email("E-mail inválido"),

  phone: z
    .string("Telefone é obrigatório")
    .min(8, "Telefone inválido"),

  address: z
    .string("Endereço é obrigatório")
    .min(5, "Endereço inválido"),

  active: z
    .boolean()
    .optional()
    .default(true),

  latitude: z.coerce
    .number("Latitude é obrigatória"),

  longitude: z.coerce
    .number("Longitude é obrigatória"),
});

export type CreateInstitutionDTO =
  z.infer<typeof CreateInstitutionSchema>;

export const UpdateInstitutionSchema =
  CreateInstitutionSchema
    .pick({
      name: true,
      email: true,
      phone: true,
      address: true,
      active: true,
      latitude: true,
      longitude: true,
    })
    .partial();

export type UpdateInstitutionDTO =
  z.infer<typeof UpdateInstitutionSchema>;
