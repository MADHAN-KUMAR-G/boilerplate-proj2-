/* eslint-disable no-unused-vars */
import { UseCaseResult } from "../interfaces/usecase.interface";
import { logger } from "../utils/logger";
import { ValidationError } from "../types/errors";

export abstract class BaseUseCase<TRequest, TResult> {
  protected abstract performExecute(request: TRequest): Promise<TResult>;

  async execute(request: TRequest): Promise<UseCaseResult<TResult>> {
    try {
      // Pre-execute validation and setup
      const preExecuteResult = await this.preExecute(request);
      if (
        preExecuteResult &&
        !preExecuteResult.success &&
        preExecuteResult.error
      ) {
        // Convert the error result to the correct type
        return {
          success: false,
          error: preExecuteResult.error,
        };
      }

      // Perform the main execution
      const result = await this.performExecute(request);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      logger.error(`${this.constructor.name}: Execution failed`, {
        error,
        request,
      });

      return {
        success: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          code: "INTERNAL_ERROR",
        },
      };
    }
  }

  /**
   * Override this method to add custom validation logic
   * Return null if validation passes, or a UseCaseResult with error if it fails
   */
  protected async preExecute(
    _request: TRequest
  ): Promise<UseCaseResult<TRequest> | null> {
    // Default implementation - no validation
    return null;
  }

  /**
   * Helper method to create validation errors
   */
  protected createValidationError(
    message: string,
    code: string = "VALIDATION_ERROR"
  ): UseCaseResult<TRequest> {
    return {
      success: false,
      error: { message, code },
    };
  }

  /**
   * Helper method to validate required fields
   */
  protected validateRequiredFields(
    request: TRequest,
    fields: (keyof TRequest)[]
  ): void {
    const missingFields = fields.filter((field) => !request[field]);
    if (missingFields.length > 0) {
      throw new ValidationError(
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }
  }

  /**
   * Helper method to validate field types
   */
  protected validateFieldType(
    value: unknown,
    expectedType: string,
    fieldName: string
  ): void {
    if (typeof value !== expectedType) {
      throw new ValidationError(
        `Field '${fieldName}' must be of type ${expectedType}`
      );
    }
  }

  /**
   * Helper method to validate email format
   */
  protected validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError("Invalid email format");
    }
  }

  /**
   * Helper method to validate string length
   */
  protected validateStringLength(
    value: string,
    minLength: number,
    maxLength: number,
    fieldName: string
  ): void {
    if (value.length < minLength || value.length > maxLength) {
      throw new ValidationError(
        `Field '${fieldName}' must be between ${minLength} and ${maxLength} characters`
      );
    }
  }
}
