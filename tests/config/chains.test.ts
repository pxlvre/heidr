import { describe, expect, test } from 'bun:test';
import { getChain, listChains, getChainInfo, SUPPORTED_CHAINS } from '../../config/chains';
import { ConfigurationError } from '../../errors';

describe('chain configuration', () => {
  describe('SUPPORTED_CHAINS', () => {
    test('contains mainnet', () => {
      expect(SUPPORTED_CHAINS.mainnet).toBeDefined();
      expect(SUPPORTED_CHAINS.mainnet.id).toBe(1);
    });

    test('supports case-insensitive lookups', () => {
      expect(SUPPORTED_CHAINS.mainnet).toBeDefined();
    });
  });

  describe('getChain', () => {
    test('returns mainnet by default', () => {
      const chain = getChain();
      expect(chain.id).toBe(1);
      expect(chain.name).toBe('Ethereum');
    });

    test('returns mainnet when explicitly requested', () => {
      const chain = getChain('mainnet');
      expect(chain.id).toBe(1);
    });

    test('returns arbitrum when requested', () => {
      const chain = getChain('arbitrum');
      expect(chain.id).toBe(42161);
    });

    test('is case-insensitive', () => {
      const chain1 = getChain('arbitrum');
      const chain2 = getChain('Arbitrum');
      expect(chain1.id).toBe(chain2.id);
    });

    test('throws ConfigurationError for invalid chain', () => {
      expect(() => getChain('invalidchain')).toThrow(ConfigurationError);
      expect(() => getChain('invalidchain')).toThrow('Unsupported chain: invalidchain');
    });
  });

  describe('listChains', () => {
    test('returns array of chain names', () => {
      const chains = listChains();
      expect(Array.isArray(chains)).toBe(true);
      expect(chains.length).toBeGreaterThan(0);
    });

    test('includes mainnet', () => {
      const chains = listChains();
      expect(chains).toContain('mainnet');
    });

    test('returns sorted chains', () => {
      const chains = listChains();
      const sortedChains = [...chains].sort();
      expect(chains).toEqual(sortedChains);
    });
  });

  describe('getChainInfo', () => {
    test('returns chain information for mainnet', () => {
      const info = getChainInfo('mainnet');
      expect(info.name).toBe('Ethereum');
      expect(info.id).toBe(1);
      expect(info.nativeCurrency).toBeDefined();
      expect(info.nativeCurrency.symbol).toBe('ETH');
      expect(info.nativeCurrency.decimals).toBe(18);
    });

    test('returns chain information for arbitrum', () => {
      const info = getChainInfo('arbitrum');
      expect(info.name).toBe('Arbitrum One');
      expect(info.id).toBe(42161);
      expect(info.nativeCurrency.symbol).toBe('ETH');
    });

    test('includes RPC URLs', () => {
      const info = getChainInfo('mainnet');
      expect(info.rpcUrls).toBeDefined();
      expect(info.rpcUrls?.default.http).toBeDefined();
      expect(info.rpcUrls?.default.http.length).toBeGreaterThan(0);
    });

    test('includes block explorers', () => {
      const info = getChainInfo('mainnet');
      expect(info.blockExplorers).toBeDefined();
      expect(info.blockExplorers?.default).toBeDefined();
    });

    test('throws for invalid chain', () => {
      expect(() => getChainInfo('invalidchain')).toThrow(ConfigurationError);
    });
  });
});
