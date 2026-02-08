import { describe, expect, test, mock } from 'bun:test';
import {
  prettyPrint,
  printError,
  printSuccess,
  printWarning,
  printInfo,
} from '../../utils/formatter';

describe('formatter utilities', () => {
  describe('prettyPrint', () => {
    test('prints JSON with colors by default', () => {
      const consoleLogMock = mock(() => {});
      const originalLog = console.log;
      console.log = consoleLogMock;

      const data = { name: 'test', value: 123 };
      prettyPrint(data);

      expect(consoleLogMock).toHaveBeenCalled();
      console.log = originalLog;
    });

    test('prints JSON without colors when disabled', () => {
      const consoleLogMock = mock(() => {});
      const originalLog = console.log;
      console.log = consoleLogMock;

      const data = { name: 'test' };
      prettyPrint(data, { colors: false });

      expect(consoleLogMock).toHaveBeenCalled();
      console.log = originalLog;
    });

    test('handles BigInt values', () => {
      const consoleLogMock = mock(() => {});
      const originalLog = console.log;
      console.log = consoleLogMock;

      const data = { value: BigInt(123456789) };
      prettyPrint(data);

      expect(consoleLogMock).toHaveBeenCalled();
      console.log = originalLog;
    });

    test('uses custom indent', () => {
      const consoleLogMock = mock(() => {});
      const originalLog = console.log;
      console.log = consoleLogMock;

      const data = { test: 'value' };
      prettyPrint(data, { indent: 4 });

      expect(consoleLogMock).toHaveBeenCalled();
      console.log = originalLog;
    });
  });

  describe('printError', () => {
    test('prints error message to stderr', () => {
      const consoleErrorMock = mock(() => {});
      const originalError = console.error;
      console.error = consoleErrorMock;

      printError('Test error');

      expect(consoleErrorMock).toHaveBeenCalled();
      console.error = originalError;
    });
  });

  describe('printSuccess', () => {
    test('prints success message', () => {
      const consoleLogMock = mock(() => {});
      const originalLog = console.log;
      console.log = consoleLogMock;

      printSuccess('Test success');

      expect(consoleLogMock).toHaveBeenCalled();
      console.log = originalLog;
    });
  });

  describe('printWarning', () => {
    test('prints warning message', () => {
      const consoleWarnMock = mock(() => {});
      const originalWarn = console.warn;
      console.warn = consoleWarnMock;

      printWarning('Test warning');

      expect(consoleWarnMock).toHaveBeenCalled();
      console.warn = originalWarn;
    });
  });

  describe('printInfo', () => {
    test('prints info message', () => {
      const consoleLogMock = mock(() => {});
      const originalLog = console.log;
      console.log = consoleLogMock;

      printInfo('Test info');

      expect(consoleLogMock).toHaveBeenCalled();
      console.log = originalLog;
    });
  });
});
