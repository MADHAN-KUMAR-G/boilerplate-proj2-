/* eslint-disable no-unused-vars */
import { User, UserFilters } from "../../entities/user.entity";
import { IUserRepository } from "../../interfaces/repository.interface";
import { IPaginatedResult } from "../../interfaces/repository.interface";
import { BaseUseCase } from "../base.usecase";
import { logger } from "../../utils/logger";

export interface ListUsersParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  filters?: UserFilters;
}

export class ListUsersUseCase extends BaseUseCase<
  ListUsersParams,
  IPaginatedResult<User>
> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  protected async performExecute(
    request: ListUsersParams
  ): Promise<IPaginatedResult<User>> {
    logger.info("Listing users", request);

    let result: IPaginatedResult<User>;

    if (request.filters && Object.keys(request.filters).length > 0) {
      const users = await this.userRepository.findByFilters(request.filters);
      result = {
        data: users,
        meta: {
          page: 1,
          limit: users.length,
          total: users.length,
          totalPages: 1,
        },
      };
    } else {
      result = await this.userRepository.findWithPagination({
        page: request.page,
        limit: request.limit,
        sortBy: request.sortBy,
        sortOrder: request.sortOrder,
      });
    }

    logger.info("Users listed successfully", {
      count: result.data.length,
      total: result.meta.total,
    });

    return result;
  }
}
