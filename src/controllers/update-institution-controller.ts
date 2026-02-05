import type { Request, Response } from "express";
import updateInstitutionUseCase from "../domain/use-cases/update-institution.js";
import { AppError } from "../errors/app-error.js";
import mongoose from "mongoose";

class UpdateInstitutionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;
    const data = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("ID da instituição inválido.", 400);
    }

    if (!data || Object.keys(data).length === 0) {
      throw new AppError("Dados para atualização são obrigatórios.", 400);
    }

    const result = await updateInstitutionUseCase.execute(id, data);

    return res.status(result.status).json(result.body);
  }
}

export default new UpdateInstitutionController();
