import {
  IApiContext,
  IRepositories,
  IUseCases,
} from "../interfaces/dependency.interface";
import { getUserRepository } from "../repositories/factory";
import { CreateUserUseCase } from "../usecases/user/create-user.usecase";
import { GetUserUseCase } from "../usecases/user/get-user.usecase";
import { UpdateUserUseCase } from "../usecases/user/update-user.usecase";
import { DeleteUserUseCase } from "../usecases/user/delete-user.usecase";
import { ListUsersUseCase } from "../usecases/user/list-users.usecase";

export class ApiContext implements IApiContext {
  public readonly repositories: IRepositories;
  public readonly useCases: IUseCases;

  constructor() {
    this.repositories = {
      user: getUserRepository(),
    };

    this.useCases = {
      user: {
        createUser: new CreateUserUseCase(this.repositories.user),
        getUser: new GetUserUseCase(this.repositories.user),
        updateUser: new UpdateUserUseCase(this.repositories.user),
        deleteUser: new DeleteUserUseCase(this.repositories.user),
        listUsers: new ListUsersUseCase(this.repositories.user),
      },
    };
  }

  private static instance: ApiContext;

  public static getInstance(): ApiContext {
    if (!ApiContext.instance) {
      ApiContext.instance = new ApiContext();
    }
    return ApiContext.instance;
  }
}
