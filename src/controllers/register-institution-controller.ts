import type {Request, Response} from 'express';
import type {Institution}from '../domain/entities/Institution.js';
import registerInstitutionUseCase from '../domain/use-cases/register-institution.js';

class RegisterInstitutionController {
  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const institutionData: Institution = request.body;

      // Validação de dados obrigatórios
      if (!institutionData.cnpj) {
        return response.status(400).json({ error: "CNPJ é obrigatório" });
      }

      const result = await registerInstitutionUseCase.execute(institutionData);

      return response.status(result.status).json(result.body);

    } catch (error) {
      console.error("Erro no controller de instituição:", error);
      return response.status(500).json({ 
        error: "Erro interno do servidor ao cadastrar instituição" 
      });
    }
  }
}

export default new RegisterInstitutionController();