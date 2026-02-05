import type { Request, Response } from "express";
import deleteInstitutionUseCase from "../domain/use-cases/delete-institution.js";
import { AppError } from "../errors/app-error.js";
import mongoose from "mongoose";

class DeleteInstitutionController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("ID da instituição inválido.", 400);
    }

    const result = await deleteInstitutionUseCase.execute(id);

    return res.status(result.status).json(result.body);
  }
}

export default new DeleteInstitutionController();
