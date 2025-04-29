import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from 'express'

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
  // Manejo de errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  next();  // Ahora next está disponible y tipado correctamente
};