// Base usecase interface
export interface IUseCase<TRequest, TResult> {
  execute(request: TRequest): Promise<UseCaseResult<TResult>>;
}

// Usecase with validation
export interface IUseCaseWithValidation<TRequest, TResult>
  extends IUseCase<TRequest, TResult> {
  validate(request: TRequest): Promise<boolean>;
}

// Usecase with pre-execute
export interface IUseCaseWithPreExecute<TRequest, TResult>
  extends IUseCase<TRequest, TResult> {
  preExecute(request: TRequest): Promise<UseCaseResult<TRequest> | null>;
}

// Usecase result wrapper
export interface UseCaseResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

// Base request/response types
export interface BaseRequest {
  userId?: string;
  [key: string]: unknown;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}
