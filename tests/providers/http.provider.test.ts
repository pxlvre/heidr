import { describe, it, expect } from 'bun:test';
import { HttpProvider } from '@/providers/http.provider';

describe('HttpProvider', () => {
  describe('constructor', () => {
    it('should create provider without base URL', () => {
      const provider = new HttpProvider();
      expect(provider).toBeDefined();
    });

    it('should create provider with base URL', () => {
      const provider = new HttpProvider('https://api.example.com');
      expect(provider).toBeDefined();
    });

    it('should create provider with custom headers', () => {
      const provider = new HttpProvider('https://api.example.com', {
        'X-Custom-Header': 'value',
      });
      expect(provider).toBeDefined();
    });

    it('should create provider with custom timeout', () => {
      const provider = new HttpProvider('https://api.example.com', {}, 60000);
      expect(provider).toBeDefined();
    });
  });

  describe('request methods', () => {
    it('should have get method', () => {
      const provider = new HttpProvider();
      expect(typeof provider.get).toBe('function');
    });

    it('should have post method', () => {
      const provider = new HttpProvider();
      expect(typeof provider.post).toBe('function');
    });

    it('should have put method', () => {
      const provider = new HttpProvider();
      expect(typeof provider.put).toBe('function');
    });

    it('should have delete method', () => {
      const provider = new HttpProvider();
      expect(typeof provider.delete).toBe('function');
    });

    it('should have patch method', () => {
      const provider = new HttpProvider();
      expect(typeof provider.patch).toBe('function');
    });

    it('should have request method', () => {
      const provider = new HttpProvider();
      expect(typeof provider.request).toBe('function');
    });
  });
});
