import { CreateInstitutionSchema, UpdateInstitutionSchema } from "../validators/institution-schema.js";

export function validateZodCreateInstitution(data: unknown) {
  const result = CreateInstitutionSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      fieldErrors: result.error.flatten().fieldErrors ?? {}
    };
  }

  return {
    success: true as const,
    data: result.data
  };
}


export function validateZodUpdateInstitution(data: unknown) {
  const result = UpdateInstitutionSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors
    };
  }

  return {
    success: true,
    data: result.data
  };
}
