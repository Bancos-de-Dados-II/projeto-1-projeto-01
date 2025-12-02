import type {Request, Response} from 'express'; 
import deleteInstitutionUseCase from '../domain/use-cases/delete-institution.js';

class DeleteInstitutionController {
    async handle (request: Request, response: Response): Promise<Response> {
        try {
            // O ID virá como parâmetro na URL 
            const id = request.params.id;

            if (!id) {
                return response.status(400).json({ error: "ID da instituição é obrigatório." });
            }

            const result = await deleteInstitutionUseCase.execute(id);
            
            // Retorna o status e o corpo padronizados pelo Use Case
            return response.status(result.status).json(result.body);

        } catch (error) {
            console.error("Erro no controller de exclusão de instituição:", error);
            return response.status(500).json({ 
                error: "Erro interno do servidor ao tentar deletar instituição." 
            });
        }    
    }
}

export default new DeleteInstitutionController();