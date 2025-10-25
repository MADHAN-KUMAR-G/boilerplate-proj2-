import { User, UpdateUserParams } from "../../entities/user.entity";
import { IUserRepository } from "../../interfaces/repository.interface";
import { BaseUseCase } from "../base.usecase";
import { logger } from "../../utils/logger";
import { NotFoundError } from "../../types";

export class UpdateUserUseCase extends BaseUseCase<
  { id: number; data: UpdateUserParams },
  User
> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  protected async performExecute(request: {
    id: number;
    data: UpdateUserParams;
  }): Promise<User> {
    logger.info("Updating user", {
      userId: request.id,
      updateData: request.data,
    });

    const existingUser = await this.userRepository.findById(request.id);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await this.userRepository.update(
      request.id,
      request.data
    );

    if (!updatedUser) {
      throw new NotFoundError("Failed to update user");
    }

    logger.info("User updated successfully", { userId: updatedUser.id });

    return updatedUser;
  }
}
