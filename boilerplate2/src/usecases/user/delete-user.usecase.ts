import { IUserRepository } from "../../interfaces/repository.interface";
import { BaseUseCase } from "../base.usecase";
import { logger } from "../../utils/logger";

export class DeleteUserUseCase extends BaseUseCase<{ id: number }, void> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  protected async performExecute(request: { id: number }): Promise<void> {
    logger.info("Deleting user", { userId: request.id });

    const existingUser = await this.userRepository.findById(request.id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    await this.userRepository.delete(request.id);

    logger.info("User deleted successfully", { userId: request.id });
  }
}
