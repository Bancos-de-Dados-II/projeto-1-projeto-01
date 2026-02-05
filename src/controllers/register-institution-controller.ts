import type { Request, Response } from "express";
import registerInstitutionUseCase from "../domain/use-cases/register-institution.js";
import { validateZodCreateInstitution } from "../service/zodvalidations.js";
import { AppErrorsZod } from "../errors/errorsZod.js";

class RegisterInstitutionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const validation = validateZodCreateInstitution(req.body);

    if (!validation.success) {
      throw new AppErrorsZod(validation.fieldErrors);
    }

    const institution =
      await registerInstitutionUseCase.execute(validation.data);

    return res.status(201).json(institution);
  }
}

export default new RegisterInstitutionController();
