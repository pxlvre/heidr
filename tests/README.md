# Tests

This directory contains unit tests for the heidr CLI tool.

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage
```

## Test Structure

- `config/` - Tests for chain configuration
- `errors/` - Tests for custom error classes
- `providers/` - Tests for RPC provider
- `utils/` - Tests for utility functions
- `commands/` - Tests for CLI commands (future)

## Coverage

We aim for high test coverage across all modules:

- ✅ Utility functions (hex, formatter)
- ✅ Error classes
- ✅ Chain configuration
- ✅ RPC provider
- 🚧 CLI commands (integration tests)

## Writing Tests

Tests use Bun's built-in test runner. Example:

```typescript
import { describe, expect, test } from 'bun:test';

describe('my feature', () => {
  test('does something', () => {
    expect(true).toBe(true);
  });
});
```
