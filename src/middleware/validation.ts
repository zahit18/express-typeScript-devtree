import { validationResult } from "express-validator";

export const handleInputErrors = (req, res, next) => {
  // Manejo de errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();  // Ahora next está disponible y tipado correctamente
};