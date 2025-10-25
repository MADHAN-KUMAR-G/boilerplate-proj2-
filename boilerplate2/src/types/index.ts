import { User } from "../entities/user.entity";

// Common API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Error types
export * from "./errors";

// Response handler
export { ResponseHandler } from "../utils/response-handler";

// Dependency injection
export * from "../interfaces/dependency.interface";
export { ApiContext } from "../context/api-context";
