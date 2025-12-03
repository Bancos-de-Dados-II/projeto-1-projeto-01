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
        const institution = await RepositoryInstitution.findById(id);

        if (!institution) {
            return { status: 404, body: { error: 'Instituição não encontrada.' } };
        }

        // if (!institution.active) {
        //     return { status: 400, body: { error: 'Instituição já está inativa.' } };
        // }

        const deletedInstitution = await RepositoryInstitution.delete(id);

        return { status: 200, body: deletedInstitution };
    }
}

export default new DeleteInstitutionUseCase();