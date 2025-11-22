import type {Request, Response} from 'express'; 
import getAllInstitutionsUseCase from '../domain/use-cases/getAll-institutions.js';

class GetAllInstitutionsController {
    async handle (request: Request, response: Response): Promise<Response> {
        try {
            const result = await getAllInstitutionsUseCase.execute();
            return response.status(result.status).json(result.body);
        } catch (error) {
            console.error("Erro no controller de obtenção de instituições:", error);
            return response.status(500).json({ 
                error: "Erro interno do servidor ao obter instituições" 
            });
        }    
    }
}

export default new GetAllInstitutionsController();