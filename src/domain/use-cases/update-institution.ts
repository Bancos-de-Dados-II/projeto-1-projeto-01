import type { Institution } from "../entities/Institution.js";
import RepositoryInstitution from "../../databases/repositories/repository-institution.js";
interface SuccessResponse {
    status: number;
    body: Institution;
}

interface ErrorResponse {
    status: number;
    body: { error: string };
}

class UpdateInstitutionUseCase {
    async execute(id: string, data: Partial<Institution>): 
        Promise<SuccessResponse | ErrorResponse> 
    {
        //Verificando se a instituição existe
        const institution = await RepositoryInstitution.findById(id);

        if (!institution) {
            return { status: 404, body: { error: "Instituição não encontrada." } };
        }

        // Verificando se está inativa
        if (!institution.active) {
            return { status: 400, body: { error: "Instituição está inativa e não pode ser atualizada." } };
        }

        //Verificando duplicidade de CNPJ
        if (data.cnpj && data.cnpj !== institution.cnpj) {
            const exists = await RepositoryInstitution.findByCnpj(data.cnpj);
            if (exists) {
                return { status: 400, body: { error: "Já existe outra instituição com esse CNPJ." } };
            }
        }

        // Atualizando
        const updated = await RepositoryInstitution.update(id, data);

        return { status: 200, body: updated };
    }
}

export default new UpdateInstitutionUseCase();