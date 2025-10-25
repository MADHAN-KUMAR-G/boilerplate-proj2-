export interface User {
    id: number;
    email: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserParams {
    email: string;
    name: string;
    password?: string;
}

export interface UpdateUserParams {
    email?: string;
    name?: string;
    isActive?: boolean;
}

export interface UserFilters {
    isActive?: boolean;
    email?: string;
    name?: string;
}
