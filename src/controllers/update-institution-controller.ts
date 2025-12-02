import type { Request, Response } from "express";
import updateInstitutionUseCase from "../domain/use-cases/update-institution.js";

class UpdateInstitutionController {
    async handle(request: Request, response: Response) {
        try {
            const id = request.params.id;
            const data = request.body;

            if (!id) {
                return response.status(400).json({ error: "ID da instituição é obrigatório." });
            }

            const result = await updateInstitutionUseCase.execute(id, data);

            return response.status(result.status).json(result.body);

        } catch {
            return response.status(500).json({
                error: "Erro interno do servidor ao atualizar instituição.",
            });
        }
    }
}

export default new UpdateInstitutionController();