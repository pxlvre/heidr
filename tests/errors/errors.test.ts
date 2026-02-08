import { describe, expect, test } from 'bun:test';
import {
  HeidrError,
  ConfigurationError,
  ValidationError,
  NotFoundError,
  RpcError,
  ApiError,
} from '../../errors';

describe('error classes', () => {
  describe('HeidrError', () => {
    test('creates error with correct message', () => {
      const error = new HeidrError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('HeidrError');
    });

    test('extends Error', () => {
      const error = new HeidrError('Test');
      expect(error instanceof Error).toBe(true);
      expect(error instanceof HeidrError).toBe(true);
    });
  });

  describe('ConfigurationError', () => {
    test('creates error with correct name', () => {
      const error = new ConfigurationError('Invalid config');
      expect(error.message).toBe('Invalid config');
      expect(error.name).toBe('ConfigurationError');
    });

    test('extends HeidrError', () => {
      const error = new ConfigurationError('Test');
      expect(error instanceof HeidrError).toBe(true);
      expect(error instanceof ConfigurationError).toBe(true);
    });
  });

  describe('ValidationError', () => {
    test('creates error with correct name', () => {
      const error = new ValidationError('Validation failed');
      expect(error.message).toBe('Validation failed');
      expect(error.name).toBe('ValidationError');
    });

    test('extends HeidrError', () => {
      const error = new ValidationError('Test');
      expect(error instanceof HeidrError).toBe(true);
    });
  });

  describe('NotFoundError', () => {
    test('creates error with correct name', () => {
      const error = new NotFoundError('Resource not found');
      expect(error.message).toBe('Resource not found');
      expect(error.name).toBe('NotFoundError');
    });

    test('extends HeidrError', () => {
      const error = new NotFoundError('Test');
      expect(error instanceof HeidrError).toBe(true);
    });
  });

  describe('RpcError', () => {
    test('creates error with message and code', () => {
      const error = new RpcError('RPC failed', 500);
      expect(error.message).toBe('RPC failed');
      expect(error.name).toBe('RpcError');
      expect(error.code).toBe(500);
    });

    test('creates error without code', () => {
      const error = new RpcError('RPC failed');
      expect(error.message).toBe('RPC failed');
      expect(error.code).toBeUndefined();
    });

    test('extends HeidrError', () => {
      const error = new RpcError('Test');
      expect(error instanceof HeidrError).toBe(true);
    });
  });

  describe('ApiError', () => {
    test('creates error with message and status code', () => {
      const error = new ApiError('API failed', 404);
      expect(error.message).toBe('API failed');
      expect(error.name).toBe('ApiError');
      expect(error.statusCode).toBe(404);
    });

    test('creates error without status code', () => {
      const error = new ApiError('API failed');
      expect(error.message).toBe('API failed');
      expect(error.statusCode).toBeUndefined();
    });

    test('extends HeidrError', () => {
      const error = new ApiError('Test');
      expect(error instanceof HeidrError).toBe(true);
    });
  });
});
