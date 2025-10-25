import { Request, Response } from "express";
import { ResponseHandler } from "../utils/response-handler";
import { AppError, ValidationError } from "../types/errors";
import { logger } from "../utils/logger";

export abstract class BaseController {
  protected async handleRequest<T>(
    req: Request,
    res: Response,
    handler: () => Promise<T>
  ): Promise<void> {
    try {
      const result = await handler();
      if (result === undefined) {
        ResponseHandler.noContent(res);
      } else {
        ResponseHandler.success(res, result);
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  protected handleError(res: Response, error: unknown): void {
    logger.error("Controller error", { error });

    if (error instanceof AppError) {
      ResponseHandler.error(res, error);
    } else if (error instanceof Error) {
      const appError = new AppError(error.message);
      ResponseHandler.error(res, appError);
    } else {
      const appError = new AppError("An unexpected error occurred");
      ResponseHandler.error(res, appError);
    }
  }

  protected validateRequiredFields(
    body: Record<string, unknown>,
    fields: string[]
  ): void {
    const missingFields = fields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      throw new ValidationError(
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }
  }

  protected validateIdParam(id: string | undefined): number {
    if (!id) {
      throw new ValidationError("ID parameter is required");
    }
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      throw new ValidationError("Invalid ID parameter");
    }
    return numId;
  }
}
