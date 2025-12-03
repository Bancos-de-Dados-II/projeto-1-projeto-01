import repositoryInstitution from "../../databases/repositories/repository-institution.js";

class GetInstitutionByIdUseCase {
    async execute(id: string) {
        const institution = await repositoryInstitution.findById(id);

        if (!institution) {
            return { status: 404, body: { message: "Instituição não encontrada" } };
        }

        return { status: 200, body: institution };
    }
}

export default new GetInstitutionByIdUseCase();
