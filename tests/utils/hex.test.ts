import { describe, expect, test } from 'bun:test';
import { ensureHex, stripHex } from '../../utils/hex';

describe('hex utilities', () => {
  describe('ensureHex', () => {
    test('adds 0x prefix when missing', () => {
      expect(ensureHex('1234')).toBe('0x1234');
    });

    test('keeps 0x prefix when present', () => {
      expect(ensureHex('0x1234')).toBe('0x1234');
    });

    test('handles empty string', () => {
      expect(ensureHex('')).toBe('0x');
    });

    test('handles uppercase hex', () => {
      expect(ensureHex('ABCD')).toBe('0xABCD');
    });
  });

  describe('stripHex', () => {
    test('removes 0x prefix when present', () => {
      expect(stripHex('0x1234')).toBe('1234');
    });

    test('returns value unchanged when no prefix', () => {
      expect(stripHex('1234')).toBe('1234');
    });

    test('handles empty string', () => {
      expect(stripHex('')).toBe('');
    });

    test('handles 0x only', () => {
      expect(stripHex('0x')).toBe('');
    });
  });
});
