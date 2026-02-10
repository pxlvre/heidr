/**
 * Base error class for all custom errors
 */
export class HeidrError extends Error {
  /**
   * Creates a new HeidrError
   * @param message - Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'HeidrError';
  }
}

/**
 * Error thrown when configuration is invalid or missing
 */
export class ConfigurationError extends HeidrError {
  /**
   * Creates a new ConfigurationError
   * @param message - Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends HeidrError {
  /**
   * Creates a new ValidationError
   * @param message - Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends HeidrError {
  /**
   * Creates a new NotFoundError
   * @param message - Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Error thrown when an RPC call fails
 */
export class RpcError extends HeidrError {
  /**
   * Creates a new RpcError
   * @param message - Error message
   * @param code - Optional RPC error code
   */
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
  /**
   * Creates a new ApiError
   * @param message - Error message
   * @param statusCode - Optional HTTP status code
   */
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Error thrown when a feature is not yet implemented
 */
export class NotImplementedError extends HeidrError {
  /**
   * Creates a new NotImplementedError
   * @param message - Error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}
