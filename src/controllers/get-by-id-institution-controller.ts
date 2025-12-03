import type { Request, Response } from "express";
import GetInstitutionByIdUseCase from "../domain/use-cases/get-by-id-institution.js";

class GetInstitutionByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            if (typeof id === 'undefined') {
            return response.status(400).json({ error: "ID da instituição é obrigatório." });
            }

            const result = await GetInstitutionByIdUseCase.execute(id);

            return response.status(result.status).json(result.body);
        } catch (error) {
            console.error("Erro no controller de busca por ID:", error);
            return response.status(500).json({
                error: "Erro interno do servidor ao buscar instituição por ID",
            });
        }
    }
}

export default new GetInstitutionByIdController();