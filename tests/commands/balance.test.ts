import { describe, it, expect } from 'bun:test';
import { execSync } from 'child_process';

describe('Balance Command Tests', () => {
  describe('getBalance', () => {
    it('should get balance for a valid address on arbitrum', () => {
      const output = execSync(
        'bun run cli/index.ts balance 0x0000000000000000000000000000000000000001 --chain arbitrum',
        { encoding: 'utf-8' }
      );
      expect(output).toContain('Address');
      expect(output).toContain('Arbitrum One');
      expect(output).toContain('Balance');
    });

    it('should get balance for an address on polygon', () => {
      const result = execSync(
        'bun run cli/index.ts balance 0x0000000000000000000000000000000000000001 --chain polygon --json',
        { encoding: 'utf-8' }
      );
      const data = JSON.parse(result);
      expect(data).toHaveProperty('address');
      expect(data).toHaveProperty('balance');
      expect(data.chain).toBe('Polygon');
    });

    it('should handle address with uppercase letters', () => {
      const output = execSync(
        'bun run cli/index.ts balance 0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045 --chain arbitrum',
        { encoding: 'utf-8' }
      );
      expect(output).toContain('Address');
      expect(output).toContain('Balance');
    });
  });

  describe('Different chains', () => {
    it('should get balance on Arbitrum', () => {
      const output = execSync(
        'bun run cli/index.ts balance 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 --chain arbitrum --json',
        { encoding: 'utf-8' }
      );
      const data = JSON.parse(output);
      expect(data.chain).toBe('Arbitrum One');
      expect(data).toHaveProperty('balance');
    });

    it('should get balance on Optimism', () => {
      const output = execSync(
        'bun run cli/index.ts balance 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 --chain optimism --json',
        { encoding: 'utf-8' }
      );
      const data = JSON.parse(output);
      expect(data.chain).toBe('OP Mainnet');
      expect(data).toHaveProperty('balance');
    });
  });
});
