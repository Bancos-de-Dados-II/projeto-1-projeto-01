import RepositoryInstitution from "../../databases/repositories/repository-institution.js";
import type { Institution } from "../entities/Institution.js";

type SuccessResponse = {
    status: number,
    body: Institution
}

type ErrorResponse = {
    status: number,
    body: {error: string}
}

class DeleteInstitutionUseCase {
    async execute (id: string): Promise<SuccessResponse | ErrorResponse> {
        // 1. Verificar se a instituição existe e está ativa
        const institution = await RepositoryInstitution.findById(id);

        if (!institution) {
            return { status: 404, body: { error: 'Instituição não encontrada.' } };
        }

        if (!institution.active) {
            return { status: 400, body: { error: 'Instituição já está inativa.' } };
        }

        // 2. Executar a exclusão lógica (marcar como inativa)
        const deletedInstitution = await RepositoryInstitution.delete(id);

        // 3. Retornar a resposta padronizada (200 OK ou 204 No Content também seria válido)
        return { status: 200, body: deletedInstitution };
    }
}

export default new DeleteInstitutionUseCase();