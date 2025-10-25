import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../interfaces/repository.interface";
import { BaseUseCase } from "../base.usecase";
import { logger } from "../../utils/logger";

export class GetUserUseCase extends BaseUseCase<{ id: number }, User> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  protected async performExecute(request: { id: number }): Promise<User> {
    logger.info("Getting user by ID", { userId: request.id });

    const user = await this.userRepository.findById(request.id);

    if (!user) {
      throw new Error("User not found");
    }

    logger.info("User retrieved successfully", { userId: user.id });

    return user;
  }
}
