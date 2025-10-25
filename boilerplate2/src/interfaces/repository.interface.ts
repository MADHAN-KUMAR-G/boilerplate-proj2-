import { User } from "../entities/user.entity";

// Base repository interface
export interface IBaseRepository<T> {
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T | null>;
    delete(id: number): Promise<boolean>;
}

// Pagination interface
export interface IPaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface IPaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Extended repository with pagination
export interface IPaginatedRepository<T> extends IBaseRepository<T> {
    findWithPagination(
        options: IPaginationOptions,
    ): Promise<IPaginatedResult<T>>;
    findByFilters(filters: unknown): Promise<T[]>;
}

// User-specific repository interface
export interface IUserRepository extends IPaginatedRepository<User> {
    findByEmail(email: string): Promise<User | null>;
}
