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

        const currentInstitution = await RepositoryInstitution.findById(id);

        if (!currentInstitution) {
            return { status: 404, body: { error: "Instituição não encontrada." } };
        }

        if (data.cnpj && data.cnpj !== currentInstitution.cnpj) {
            const exists = await RepositoryInstitution.findByCnpj(data.cnpj);
            if (exists && exists.id !== id) {
                return { status: 400, body: { error: "CNPJ já em uso." } };
            }
        }

        const institutionToUpdate: Institution = {
            ...currentInstitution, 
            ...data,               
            id: id,                
            
            latitude: data.latitude !== undefined ? Number(data.latitude) : currentInstitution.latitude,
            longitude: data.longitude !== undefined ? Number(data.longitude) : currentInstitution.longitude,
        };
        try {
            const updated = await RepositoryInstitution.update(institutionToUpdate);
            console.log("Sucesso no Update:", updated);
            return { status: 200, body: updated };
        } catch (error) {
            console.error("ERRO NO UPDATE:", error);
            return { status: 500, body: { error: "Erro interno ao atualizar." } };
        }
    }
}
export default new UpdateInstitutionUseCase();