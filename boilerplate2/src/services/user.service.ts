import {
  User,
  CreateUserParams,
  UpdateUserParams,
} from "../entities/user.entity";
import { logger } from "../utils/logger";
import { NotFoundError } from "../types/errors";
import { IApiContext } from "../interfaces/dependency.interface";

export class UserService {
  constructor(private readonly apiContext: IApiContext) {}

  async createUser(userData: CreateUserParams): Promise<User> {
    logger.info("UserService: Creating user", userData);

    const result =
      await this.apiContext.useCases.user.createUser.execute(userData);

    if (!result.success || !result.data) {
      throw new Error(result.error?.message || "Failed to create user");
    }

    return result.data;
  }

  async getUserById(id: number): Promise<User> {
    logger.info("UserService: Getting user by ID", { userId: id });

    const result = await this.apiContext.useCases.user.getUser.execute({ id });

    if (!result.success || !result.data) {
      if (result.error?.message === "User not found") {
        throw new NotFoundError("User not found");
      }
      throw new Error(result.error?.message || "Failed to get user");
    }

    return result.data;
  }

  async listUsers(options: any): Promise<any> {
    logger.info("UserService: Listing users", options);

    const result =
      await this.apiContext.useCases.user.listUsers.execute(options);

    if (!result.success || !result.data) {
      throw new Error(result.error?.message || "Failed to list users");
    }

    return result.data;
  }

  async updateUser(id: number, updateData: UpdateUserParams): Promise<User> {
    logger.info("UserService: Updating user", { userId: id, updateData });

    const result = await this.apiContext.useCases.user.updateUser.execute({
      id,
      data: updateData,
    });

    if (!result.success || !result.data) {
      if (result.error?.message === "User not found") {
        throw new NotFoundError("User not found");
      }
      throw new Error(result.error?.message || "Failed to update user");
    }

    return result.data;
  }

  async deleteUser(id: number): Promise<void> {
    logger.info("UserService: Deleting user", { userId: id });

    const result = await this.apiContext.useCases.user.deleteUser.execute({
      id,
    });

    if (!result.success) {
      if (result.error?.message === "User not found") {
        throw new NotFoundError("User not found");
      }
      throw new Error(result.error?.message || "Failed to delete user");
    }
  }
}
