import { IUserRepository } from "../interfaces/repository.interface";
import { userRepository } from "./user.repository"; // In-memory implementation
import { KnexUserRepository } from "./knex/user.repository";
import { db as knexDb } from "../config/knex";
import { config } from "../config/env";
import { logger } from "../utils/logger";

export class RepositoryFactory {
    private static userRepositoryInstance: IUserRepository | null = null;

    static getUserRepository(): IUserRepository {
        if (this.userRepositoryInstance) {
            return this.userRepositoryInstance;
        }

        // Check if we have a database connection
        if (config.DATABASE_URL) {
            try {
                logger.info("Using Knex repository");
                this.userRepositoryInstance = new KnexUserRepository(
                    knexDb,
                ) as IUserRepository;
            } catch (error) {
                logger.warn(
                    "Failed to initialize Knex repository, falling back to in-memory",
                    {
                        error:
                            error instanceof Error
                                ? error.message
                                : "Unknown error",
                    },
                );
                this.userRepositoryInstance = userRepository as IUserRepository;
            }
        } else {
            logger.info("No DATABASE_URL found, using in-memory repository");
            this.userRepositoryInstance = userRepository as IUserRepository;
        }

        return this.userRepositoryInstance;
    }
}

export const getUserRepository = (): IUserRepository => {
    return RepositoryFactory.getUserRepository();
};
