import type { Request, Response } from "express";
import getInstitutionByIdUseCase from "../domain/use-cases/get-by-id-institution.js";
import { AppError } from "../errors/app-error.js";
import mongoose from "mongoose";

class GetInstitutionByIdController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("ID da instituição inválido.", 400);
    }

    const result = await getInstitutionByIdUseCase.execute(id);

    return res.status(result.status).json(result.body);
  }
}

export default new GetInstitutionByIdController();
