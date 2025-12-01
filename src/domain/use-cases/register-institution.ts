import RepositoryInstitution from "../../databases/repositories/repository-institution.js";
import type { Institution } from "../entities/Institution.js";

type sucessResponse = {
    status: number,
    body: Institution
}

type errorResponse = {
    status: number,
    body: {error: string}
}

class RegisterInstitutionUseCase {
    async execute (institution: Institution): Promise<sucessResponse | errorResponse>  {
        let institutionAlreadyExists = await RepositoryInstitution.findByCnpj(institution.cnpj);
        
        if(institutionAlreadyExists){
            return {status: 400, body: {error: 'Instituição já cadastrada'}}
        }
        await RepositoryInstitution.register(institution);
        return {status: 201, body: institution}
    }
}

export default new RegisterInstitutionUseCase();   