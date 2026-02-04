import RepositoryInstitution from "../../databases/repositories/repository-institution.js";
import type { Institution } from "../entities/Institution.js";
import { AppError } from "../../errors/app-error.js";

type CreateInstitution = Omit<Institution, 'id'>;

class RegisterInstitutionUseCase {
  async execute(institution: CreateInstitution): Promise<Institution> {

    const institutionAlreadyExists =
      await RepositoryInstitution.findByCnpj(institution.cnpj);

    if (institutionAlreadyExists) {
      throw new AppError("Instituição já cadastrada", 409);
    }

    const createdInstitution =
      await RepositoryInstitution.register(institution);

    return createdInstitution;
  }
}

export default new RegisterInstitutionUseCase();
