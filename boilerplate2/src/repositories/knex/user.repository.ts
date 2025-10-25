import { Knex } from "knex";
import {
    IPaginatedRepository,
    IPaginationOptions,
    IPaginatedResult,
} from "../../interfaces/repository.interface";
import { User, UserFilters } from "../../entities/user.entity";
import { logger } from "../../utils/logger";

export class KnexUserRepository implements IPaginatedRepository<User> {
    constructor(private knex: Knex) {}

    async findById(id: number): Promise<User | null> {
        try {
            const user = await this.knex("User").where({ id }).first();

            return user || null;
        } catch (error) {
            logger.error("Error finding user by ID", {
                id,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.knex("User").where({ email }).first();

            return user || null;
        } catch (error) {
            logger.error("Error finding user by email", {
                email,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const users = await this.knex("User").orderBy("createdAt", "desc");

            return users;
        } catch (error) {
            logger.error("Error finding all users", {
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }

    async create(data: Partial<User>): Promise<User> {
        try {
            const userData = {
                email: data.email,
                name: data.name,
                isActive: data.isActive ?? true,
            };

            const [user] = await this.knex("User")
                .insert(userData)
                .returning("*");

            return user;
        } catch (error) {
            logger.error("Error creating user", {
                data,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }

    async update(id: number, data: Partial<User>): Promise<User | null> {
        try {
            const updateData: any = {};

            // Only update provided fields
            if (data.email !== undefined) updateData.email = data.email;
            if (data.name !== undefined) updateData.name = data.name;
            if (data.isActive !== undefined)
                updateData.isActive = data.isActive;

            const [updatedUser] = await this.knex("User")
                .where({ id })
                .update(updateData)
                .returning("*");

            return updatedUser || null;
        } catch (error) {
            logger.error("Error updating user", {
                id,
                data,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deletedCount = await this.knex("User").where({ id }).del();

            return deletedCount > 0;
        } catch (error) {
            logger.error("Error deleting user", {
                id,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }

    async findWithPagination(
        options: IPaginationOptions,
    ): Promise<IPaginatedResult<User>> {
        try {
            const {
                page,
                limit,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = options;

            // Validate sortBy to prevent injection
            const allowedSortFields = [
                "id",
                "email",
                "name",
                "isActive",
                "createdAt",
                "updatedAt",
            ];
            const safeSortBy = allowedSortFields.includes(sortBy)
                ? sortBy
                : "createdAt";
            const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";

            // Get total count
            const countResult = await this.knex("User").count("* as count");
            const total = parseInt((countResult[0]?.count as string) || "0");

            // Get paginated data
            const offset = (page - 1) * limit;
            const users = await this.knex("User")
                .orderBy(safeSortBy, safeSortOrder)
                .limit(limit)
                .offset(offset);

            return {
                data: users,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error("Error finding users with pagination", {
                options,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }

    async findByFilters(filters: UserFilters): Promise<User[]> {
        try {
            let query = this.knex("User");

            // Apply filters
            if (filters.isActive !== undefined) {
                query = query.where("isActive", filters.isActive);
            }

            if (filters.email) {
                query = query.whereILike("email", `%${filters.email}%`);
            }

            if (filters.name) {
                query = query.whereILike("name", `%${filters.name}%`);
            }

            const users = await query.orderBy("createdAt", "desc");
            return users;
        } catch (error) {
            logger.error("Error finding users by filters", {
                filters,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }
}
