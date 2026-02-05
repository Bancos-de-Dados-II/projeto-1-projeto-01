import type { Request, Response, NextFunction } from "express";
import { AppErrorsZod } from "../errors/errorsZod.js" 
import { AppError } from "../errors/app-error.js";
import {ZodError} from "zod";

export function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  
  if (err instanceof AppErrorsZod) {
    return res.status(err.statusCode).json({
      status: "error",
      message: "Erro de validação",
      errors: err.issues 
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Erro de validação",
      errors: err.issues 
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message
    });
  }

 console.error(err); 

  return res.status(500).json({ 
    status: "error", 
    message: "Internal Server Error" 
  });
}