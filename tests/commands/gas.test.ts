import { describe, it, expect } from 'bun:test';
import { execSync } from 'child_process';

describe('Gas Command', () => {
  it('should get gas price for arbitrum', () => {
    const output = execSync('bun run cli/index.ts gas --chain arbitrum', {
      encoding: 'utf-8',
    });
    expect(output).toContain('Gas Price on Arbitrum One');
    expect(output).toContain('gwei');
    expect(output).toContain('wei');
  });

  it('should get gas price with --json flag', () => {
    const output = execSync('bun run cli/index.ts gas --chain arbitrum --json', {
      encoding: 'utf-8',
    });
    const result = JSON.parse(output);
    expect(result).toHaveProperty('chain');
    expect(result).toHaveProperty('chainId');
    expect(result).toHaveProperty('gasPrice');
    expect(result.gasPrice).toHaveProperty('wei');
    expect(result.gasPrice).toHaveProperty('gwei');
    expect(result.chain).toBe('Arbitrum One');
    expect(result.chainId).toBe(42161);
  });

  it('should get gas price for polygon', () => {
    const output = execSync('bun run cli/index.ts gas --chain polygon', {
      encoding: 'utf-8',
    });
    expect(output).toContain('Gas Price on Polygon');
    expect(output).toContain('gwei');
  });

  it('should get gas price for optimism', () => {
    const output = execSync('bun run cli/index.ts gas --chain optimism', {
      encoding: 'utf-8',
    });
    expect(output).toContain('Gas Price on OP Mainnet');
    expect(output).toContain('gwei');
  });

  it('should fail for invalid chain', () => {
    try {
      execSync('bun run cli/index.ts gas --chain invalid', {
        encoding: 'utf-8',
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error: unknown) {
      const err = error as { status: number };
      expect(err.status).toBe(1);
    }
  });
});
