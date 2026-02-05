import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error("Erro capturado:", error);

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: error.message,
    });
  }

  if (error instanceof Error) {
    return response.status(500).json({
      error: "Erro interno do servidor",
    });
  }

  return response.status(500).json({
    error: "Erro inesperado",
  });
}
