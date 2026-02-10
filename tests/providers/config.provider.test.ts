import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { ConfigProvider } from '@/providers/config.provider';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

describe('ConfigProvider', () => {
  let provider: ConfigProvider;
  let tempDir: string;
  let originalXdgConfigHome: string | undefined;

  beforeEach(() => {
    // Create a temporary directory for tests
    tempDir = mkdtempSync(join(tmpdir(), 'heidr-test-'));

    // Set XDG_CONFIG_HOME to temp directory
    originalXdgConfigHome = process.env.XDG_CONFIG_HOME;
    process.env.XDG_CONFIG_HOME = tempDir;

    provider = new ConfigProvider();
  });

  afterEach(() => {
    // Restore original XDG_CONFIG_HOME
    if (originalXdgConfigHome) {
      process.env.XDG_CONFIG_HOME = originalXdgConfigHome;
    } else {
      delete process.env.XDG_CONFIG_HOME;
    }

    // Clean up temp directory
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('basic operations', () => {
    it('should set and get values', () => {
      provider.set('test.key', 'test-value');
      expect(provider.get('test.key')).toBe('test-value');
    });

    it('should return undefined for missing keys', () => {
      expect(provider.get('non.existent.key')).toBeUndefined();
    });

    it('should check if key exists', () => {
      provider.set('test.key', 'value');
      expect(provider.has('test.key')).toBe(true);
      expect(provider.has('missing.key')).toBe(false);
    });

    it('should persist configuration across instances', () => {
      provider.set('persist.test', 'persisted-value');

      // Create new instance
      const newProvider = new ConfigProvider();
      expect(newProvider.get('persist.test')).toBe('persisted-value');
    });

    it('should remove configuration keys', () => {
      provider.set('remove.test', 'value');
      expect(provider.get('remove.test')).toBe('value');

      provider.remove('remove.test');
      expect(provider.get('remove.test')).toBeUndefined();
    });
  });

  describe('getRequired', () => {
    it('should return value for existing key', () => {
      provider.set('test.key', 'test-value');
      expect(provider.getRequired('test.key')).toBe('test-value');
    });

    it('should throw error for missing required key', () => {
      expect(() => provider.getRequired('missing.key')).toThrow(
        'Required configuration key not found: missing.key'
      );
    });
  });

  describe('API key getters', () => {
    it('should get Dune API key', () => {
      provider.set('dune.apiKey', 'dune-key');
      expect(provider.getDuneApiKey()).toBe('dune-key');
    });

    it('should get Etherscan API key', () => {
      provider.set('etherscan.apiKey', 'etherscan-key');
      expect(provider.getEtherscanApiKey()).toBe('etherscan-key');
    });

    it('should get Tenderly API key', () => {
      provider.set('tenderly.apiKey', 'tenderly-key');
      expect(provider.getTenderlyApiKey()).toBe('tenderly-key');
    });

    it('should get Tenderly account', () => {
      provider.set('tenderly.account', 'my-account');
      expect(provider.getTenderlyAccount()).toBe('my-account');
    });

    it('should get Tenderly project', () => {
      provider.set('tenderly.project', 'my-project');
      expect(provider.getTenderlyProject()).toBe('my-project');
    });

    it('should return undefined for unset keys', () => {
      expect(provider.getDuneApiKey()).toBeUndefined();
      expect(provider.getEtherscanApiKey()).toBeUndefined();
      expect(provider.getTenderlyApiKey()).toBeUndefined();
      expect(provider.getTenderlyAccount()).toBeUndefined();
      expect(provider.getTenderlyProject()).toBeUndefined();
    });
  });

  describe('config file management', () => {
    it('should return config path', () => {
      const path = provider.getConfigPath();
      expect(path).toContain('heidr');
      expect(path).toContain('config.json');
    });

    it('should get all configuration', () => {
      provider.set('key1', 'value1');
      provider.set('nested.key2', 'value2');

      const all = provider.getAll();
      expect(all).toHaveProperty('key1');
      expect(all).toHaveProperty('nested');
    });
  });
});
