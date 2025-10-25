import { IUserRepository } from "./repository.interface";
import { CreateUserUseCase } from "../usecases/user/create-user.usecase";
import { GetUserUseCase } from "../usecases/user/get-user.usecase";
import { UpdateUserUseCase } from "../usecases/user/update-user.usecase";
import { DeleteUserUseCase } from "../usecases/user/delete-user.usecase";
import { ListUsersUseCase } from "../usecases/user/list-users.usecase";

export interface IUserUseCases {
  createUser: CreateUserUseCase;
  getUser: GetUserUseCase;
  updateUser: UpdateUserUseCase;
  deleteUser: DeleteUserUseCase;
  listUsers: ListUsersUseCase;
}

export interface IRepositories {
  user: IUserRepository;
}

export interface IUseCases {
  user: IUserUseCases;
}

export interface IApiContext {
  repositories: IRepositories;
  useCases: IUseCases;
}
