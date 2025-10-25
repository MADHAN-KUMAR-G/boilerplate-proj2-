import { UseCaseResult } from "../../interfaces/usecase.interface";
import { User, CreateUserParams } from "../../entities/user.entity";
import { IUserRepository } from "../../interfaces/repository.interface";
import { BaseUseCase } from "../base.usecase";
import { logger } from "../../utils/logger";

export class CreateUserUseCase extends BaseUseCase<CreateUserParams, User> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  protected async performExecute(request: CreateUserParams): Promise<User> {
    logger.info("Creating user", { email: request.email });

    const user = await this.userRepository.create(request);

    logger.info("User created successfully", { userId: user.id });

    return user;
  }

  protected override async preExecute(
    request: CreateUserParams
  ): Promise<UseCaseResult<CreateUserParams> | null> {
    this.validateRequiredFields(request, ["email", "name"]);

    this.validateEmail(request.email);

    this.validateStringLength(request.name, 2, 100, "name");

    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      return this.createValidationError(
        "Email already exists",
        "EMAIL_CONFLICT"
      );
    }

    return null;
  }
}
