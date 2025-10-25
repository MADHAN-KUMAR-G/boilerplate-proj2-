import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ValidationError, NotFoundError } from "../types/errors";
import { UserFilters } from "../entities/user.entity";
import { IApiContext } from "../interfaces/dependency.interface";

export class UserController extends BaseController {
  constructor(private readonly apiContext: IApiContext) {
    super();
  }

  async createUser(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      this.validateRequiredFields(req.body, ["email", "name"]);
      const { email, name } = req.body;

      const result = await this.apiContext.useCases.user.createUser.execute({
        email,
        name,
      });
      if (!result.success || !result.data) {
        throw new Error(result.error?.message || "Failed to create user");
      }

      return result.data;
    });
  }

  async getUser(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const userId = this.validateIdParam(req.params.id);

      const result = await this.apiContext.useCases.user.getUser.execute({
        id: userId,
      });
      if (!result.success || !result.data) {
        throw new NotFoundError(result.error?.message || "User not found");
      }

      return result.data;
    });
  }

  async listUsers(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const {
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
        isActive,
        email,
        name,
      } = req.query;

      const filters: UserFilters = {};
      if (isActive !== undefined) {
        filters.isActive = isActive === "true";
      }
      if (email && typeof email === "string") {
        filters.email = email;
      }
      if (name) {
        filters.name = name as string;
      }

      const result = await this.apiContext.useCases.user.listUsers.execute({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as "asc" | "desc",
        ...(Object.keys(filters).length > 0 && { filters }),
      });

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || "Failed to list users");
      }

      return result.data;
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const userId = this.validateIdParam(req.params.id);
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
        throw new ValidationError("Update data is required");
      }

      const result = await this.apiContext.useCases.user.updateUser.execute({
        id: userId,
        data: updateData,
      });

      if (!result.success || !result.data) {
        throw new NotFoundError(result.error?.message || "User not found");
      }

      return result.data;
    });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    await this.handleRequest(req, res, async () => {
      const userId = this.validateIdParam(req.params.id);

      const result = await this.apiContext.useCases.user.deleteUser.execute({
        id: userId,
      });
      if (!result.success) {
        throw new NotFoundError(result.error?.message || "User not found");
      }

      return undefined; // Will trigger noContent response
    });
  }
}
