import {
    IPaginatedRepository,
    IPaginationOptions,
    IPaginatedResult,
} from "../interfaces/repository.interface";
import { CreateUserParams, User, UserFilters } from "../entities/user.entity";
import { logger } from "../utils/logger";

class InMemoryUserRepository implements IPaginatedRepository<User> {
    private users: User[] = [];
    private nextId = 1;

    async findById(id: number): Promise<User | null> {
        const user = this.users.find((u) => u.id === id);
        return user || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find((u) => u.email === email);
        return user || null;
    }

    async findAll(): Promise<User[]> {
        return [...this.users].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
    }

    async create(data: CreateUserParams): Promise<User> {
        const user: User = {
            id: this.nextId++,
            email: data.email,
            name: data.name,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.users.push(user);
        logger.info("User created in memory", { userId: user.id });
        return user;
    }

    async update(id: number, data: Partial<User>): Promise<User | null> {
        const userIndex = this.users.findIndex((u) => u.id === id);
        if (userIndex === -1) {
            return null;
        }

        const originalUser = this.users[userIndex];
        if (!originalUser) {
            return null;
        }

        const updatedUser: User = {
            id: originalUser.id,
            email: data.email ?? originalUser.email,
            name: data.name ?? originalUser.name,
            isActive: data.isActive ?? originalUser.isActive,
            createdAt: originalUser.createdAt,
            updatedAt: new Date(),
        };

        this.users[userIndex] = updatedUser;
        logger.info("User updated in memory", { userId: id });
        return updatedUser;
    }

    async delete(id: number): Promise<boolean> {
        const userIndex = this.users.findIndex((u) => u.id === id);
        if (userIndex === -1) {
            return false;
        }

        this.users.splice(userIndex, 1);
        logger.info("User deleted from memory", { userId: id });
        return true;
    }

    async findWithPagination(
        options: IPaginationOptions,
    ): Promise<IPaginatedResult<User>> {
        const {
            page,
            limit,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        let sortedUsers = [...this.users];

        // Sort users
        sortedUsers.sort((a, b) => {
            const aValue = a[sortBy as keyof User];
            const bValue = b[sortBy as keyof User];

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        const total = sortedUsers.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

        return {
            data: paginatedUsers,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findByFilters(filters: UserFilters): Promise<User[]> {
        let filteredUsers = [...this.users];

        if (filters.isActive !== undefined) {
            filteredUsers = filteredUsers.filter(
                (user) => user.isActive === filters.isActive,
            );
        }

        if (filters.email) {
            const email = filters.email.toLowerCase();
            filteredUsers = filteredUsers.filter((user) =>
                user.email.toLowerCase().includes(email),
            );
        }

        if (filters.name) {
            const name = filters.name.toLowerCase();
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(name),
            );
        }

        return filteredUsers.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
    }
}

export const userRepository = new InMemoryUserRepository();
