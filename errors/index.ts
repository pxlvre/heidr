/**
 * Base error class for all custom errors
 */
export class HeidrError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HeidrError';
  }
}

/**
 * Error thrown when configuration is invalid or missing
 */
export class ConfigurationError extends HeidrError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends HeidrError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends HeidrError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Error thrown when an RPC call fails
 */
export class RpcError extends HeidrError {
  constructor(
    message: string,
    public code?: number
  ) {
    super(message);
    this.name = 'RpcError';
  }
}

/**
 * Error thrown when an API call fails
 */
export class ApiError extends HeidrError {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
