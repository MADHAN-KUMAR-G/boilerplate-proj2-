import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { ValidationError } from "../types/errors";

export const validateRequest = (
  schema: Schema,
  location: "body" | "query" | "params" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req[location]);

    if (error) {
      const validationError = new ValidationError(
        error.details.map((detail) => detail.message).join(", ")
      );
      res.status(validationError.statusCode).json({
        success: false,
        error: validationError.message,
        code: validationError.code,
      });
      return;
    }

    next();
  };
};

export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      success: false,
      error: "ID parameter is required",
      code: "VALIDATION_ERROR",
    });
    return;
  }

  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    res.status(400).json({
      success: false,
      error: "Invalid ID parameter",
      code: "VALIDATION_ERROR",
    });
    return;
  }

  next();
};
