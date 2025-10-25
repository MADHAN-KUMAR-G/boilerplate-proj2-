import { Response } from "express";
import { AppError } from "../types/errors";

export class ResponseHandler {
  static success<T>(res: Response, data: T, status = 200): Response {
    return res.status(status).json({
      success: true,
      data,
    });
  }

  static error(res: Response, error: AppError): Response {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }

  static created<T>(res: Response, data: T): Response {
    return this.success(res, data, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number
  ): Response {
    return res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
}
