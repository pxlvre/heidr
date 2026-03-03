import { describe, it, expect, spyOn, beforeEach, afterEach } from 'bun:test';
import { L2BeatService } from '@/services/l2beat/l2beat.service';
import {
  printScalingJson,
  printTvsJson,
  printProjectJson,
  printActivityJson,
} from '@/cli/printers/l2beat.printer';
import type {
  L2BeatProject,
  L2BeatScalingSummary,
  L2BeatTvsData,
  L2BeatActivityData,
} from '@/services/l2beat/l2beat.service';

// ── Mock data ──────────────────────────────────────────────────────────────

const mockProject: L2BeatProject = {
  id: 'arbitrum',
  name: 'Arbitrum One',
  slug: 'arbitrum',
  type: 'layer2',
  hostChain: 'ethereum',
  category: 'Optimistic Rollup',
  providers: ['Arbitrum'],
  purposes: ['Universal'],
  isArchived: false,
  isUpcoming: false,
  isUnderReview: false,
  badges: [],
  stage: 'Stage 1',
  risks: [
    {
      name: 'Exit Window',
      value: '< 7 days',
      sentiment: 'warning',
      description: 'Short exit window',
    },
  ],
  tvs: {
    breakdown: {
      total: 12e9,
      native: 5e9,
      canonical: 4e9,
      external: 3e9,
      ether: 1e9,
      stablecoin: 2e9,
      btc: 0,
      other: 0,
    },
    change7d: 0.05,
  },
};

const mockSummary: L2BeatScalingSummary = {
  chart: { types: [], data: [] },
  projects: { arbitrum: mockProject },
};

const mockTvs: L2BeatTvsData = {
  usdValue: 50e9,
  ethValue: 25e6,
  chart: { types: [], data: Array.from({ length: 10 }, () => [1, 2]) },
};

const mockActivity: L2BeatActivityData = {
  chart: {
    types: ['timestamp', 'count', 'uopsCount'],
    data: [
      [1770508800, 168944991, 171555909],
      [1770595200, 218328454, 220983341],
      [1770681600, 204949632, 207873369],
    ],
  },
};

// ── Printer unit tests (no API calls) ─────────────────────────────────────

describe('L2Beat Printers', () => {
  let logs: string[] = [];
  let spy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    logs = [];
    spy = spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(' '));
    });
  });

  afterEach(() => {
    spy.mockRestore();
  });

  describe('printScalingJson', () => {
    it('should output a JSON array with the active project', () => {
      printScalingJson(mockSummary);
      const output = logs.join('\n');
      const data = JSON.parse(output);
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].slug).toBe('arbitrum');
      expect(data[0].name).toBe('Arbitrum One');
      expect(data[0]).toHaveProperty('category');
      expect(data[0]).toHaveProperty('stage');
      expect(data[0]).toHaveProperty('tvs');
    });

    it('should exclude archived projects', () => {
      const archived: L2BeatScalingSummary = {
        chart: mockSummary.chart,
        projects: { archived: { ...mockProject, slug: 'archived', isArchived: true } },
      };
      printScalingJson(archived);
      const data = JSON.parse(logs.join('\n'));
      expect(data).toHaveLength(0);
    });
  });

  describe('printTvsJson', () => {
    it('should output usdValue, ethValue and usdFormatted', () => {
      printTvsJson(mockTvs);
      const data = JSON.parse(logs.join('\n'));
      expect(data.usdValue).toBe(50e9);
      expect(data.ethValue).toBe(25e6);
      expect(data.usdFormatted).toBe('$50.00B');
    });
  });

  describe('printProjectJson', () => {
    it('should output full project as JSON', () => {
      printProjectJson(mockProject);
      const data = JSON.parse(logs.join('\n'));
      expect(data.slug).toBe('arbitrum');
      expect(data.name).toBe('Arbitrum One');
      expect(data.risks).toHaveLength(1);
      expect(data.tvs.breakdown.total).toBe(12e9);
    });
  });
  describe('printActivityJson', () => {
    it('should output array with date, transactions, userOps fields', () => {
      printActivityJson(mockActivity);
      const data = JSON.parse(logs.join('\n'));
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(3);
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('transactions');
      expect(data[0]).toHaveProperty('userOps');
      expect(data[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(data[0].transactions).toBe(168944991);
    });
  });
});

describe('L2BeatService', () => {
  it('should instantiate without errors', () => {
    const service = new L2BeatService();
    expect(service).toBeDefined();
    expect(typeof service.getScalingSummary).toBe('function');
    expect(typeof service.getScalingTvs).toBe('function');
    expect(typeof service.getScalingActivity).toBe('function');
  });
});
