import type { Request, Response } from 'express';
import type { CreateInstitutionDTO } from '../validators/institution-schema.js';
import registerInstitutionUseCase from '../domain/use-cases/register-institution.js';

class RegisterInstitutionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const data = request.body as CreateInstitutionDTO;

    const institution = await registerInstitutionUseCase.execute({
      name: data.name,
      cnpj: data.cnpj,
      email: data.email,
      phone: data.phone,
      address: data.address,
      active: data.active ?? true,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    return response.status(201).json(institution);
  }
}

export default new RegisterInstitutionController();
