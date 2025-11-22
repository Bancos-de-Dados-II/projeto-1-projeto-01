import respositoryInstitution from "../../databases/repositories/repository-institution.js";

class GetAllInstitutionsUseCase {
    async execute () {
        const institutions = await respositoryInstitution.getAll();
        return {status: 200, body: institutions};
    }
}

export default new GetAllInstitutionsUseCase();