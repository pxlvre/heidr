import { describe, it, expect, spyOn, beforeEach, afterEach } from 'bun:test';
import { DefiLlamaService } from '@/services/defillama/defillama.service';
import {
  fmtUsd,
  printProtocolsJson,
  printProtocolJson,
  printTvlJson,
  printChainsJson,
  printChainTvlJson,
  printPricesJson,
  printStablecoinsJson,
  printPoolsJson,
  printDexsJson,
  printFeesJson,
  printBridgesJson,
  printHacksJson,
} from '@/cli/printers/defillama.printer';
import type {
  Protocol,
  ProtocolDetails,
  Chain,
  HistoricalChainTvl,
  CoinPrice,
  StablecoinsResponse,
  YieldPool,
  DexOverviewResponse,
  FeesOverviewResponse,
  BridgesResponse,
  Hack,
} from '@/services/defillama/defillama.service';

// ── Mock data ──────────────────────────────────────────────────────────────

const mockProtocol: Protocol = {
  id: '1',
  name: 'Uniswap',
  address: null,
  symbol: 'UNI',
  url: 'https://uniswap.org',
  chain: 'Ethereum',
  category: 'Dexes',
  chains: ['Ethereum', 'Arbitrum', 'Base'],
  slug: 'uniswap',
  tvl: 5e9,
  chainTvls: { Ethereum: 4e9, Arbitrum: 1e9 },
  change_1h: 0.1,
  change_1d: -1.2,
  change_7d: 3.5,
  mcap: 8e9,
};

const mockProtocolDetail: ProtocolDetails = {
  id: '1',
  name: 'Uniswap',
  symbol: 'UNI',
  url: 'https://uniswap.org',
  description: 'Leading DEX protocol',
  chains: ['Ethereum', 'Arbitrum'],
  currentChainTvls: { Ethereum: 4e9, Arbitrum: 1e9 },
  chainTvls: {},
  tvl: [
    { date: 1770000000, totalLiquidityUSD: 4.5e9 },
    { date: 1770086400, totalLiquidityUSD: 5e9 },
  ],
};

const mockChain: Chain = {
  name: 'Ethereum',
  tvl: 60e9,
  tokenSymbol: 'ETH',
  gecko_id: 'ethereum',
  cmcId: '1027',
  chainId: 1,
};

const mockChainTvl: HistoricalChainTvl[] = [
  { date: 1770000000, tvl: 55e9 },
  { date: 1770086400, tvl: 58e9 },
  { date: 1770172800, tvl: 60e9 },
];

const mockPrices: Record<string, CoinPrice> = {
  'coingecko:ethereum': { price: 2000, symbol: 'ETH', timestamp: 1770172800, confidence: 0.99 },
  'coingecko:bitcoin': { price: 65000, symbol: 'BTC', timestamp: 1770172800, confidence: 0.99 },
};

const mockStablecoins: StablecoinsResponse = {
  peggedAssets: [
    {
      id: '1',
      name: 'Tether',
      symbol: 'USDT',
      gecko_id: 'tether',
      pegType: 'peggedUSD',
      priceSource: 'coingecko',
      pegMechanism: 'fiat-backed',
      circulating: { peggedUSD: 100e9 },
      circulatingPrevDay: { peggedUSD: 99e9 },
      circulatingPrevWeek: { peggedUSD: 98e9 },
      circulatingPrevMonth: { peggedUSD: 95e9 },
      chainCirculating: {},
    },
  ],
};

const mockPool: YieldPool = {
  chain: 'Ethereum',
  project: 'aave-v3',
  symbol: 'USDC',
  tvlUsd: 2e9,
  apy: 4.5,
  apyBase: 3.0,
  apyReward: 1.5,
  rewardTokens: [],
  pool: 'pool-uuid-123',
  apyPct1D: null,
  apyPct7D: null,
  apyPct30D: null,
};

const mockDexs: DexOverviewResponse = {
  total24h: 3e9,
  total48hto24h: 2.8e9,
  change_1d: 7.1,
  change_7d: -2.3,
  totalDataChart: [[1770000000, 3e9]],
  totalDataChartBreakdown: [],
  allChains: ['Ethereum', 'Arbitrum', 'Base'],
  breakdown24h: null,
  breakdown30d: null,
  protocols: [],
};

const mockFees: FeesOverviewResponse = {
  total24h: 10e6,
  total48hto24h: 9e6,
  change_1d: 11.1,
  change_7d: 5.0,
  totalDataChart: [[1770000000, 10e6]],
  totalDataChartBreakdown: [],
  allChains: ['Ethereum', 'Arbitrum'],
  breakdown24h: null,
  breakdown30d: null,
  protocols: [],
};

const mockBridges: BridgesResponse = {
  bridges: [
    {
      id: 1,
      name: 'polygon',
      displayName: 'Polygon PoS Bridge',
      icon: 'icons:polygon',
      volumePrevDay: 28e6,
      volumePrev2Day: 17e6,
      lastHourlyVolume: 118e3,
      last24hVolume: 34e6,
      lastDailyVolume: 28e6,
      dayBeforeLastVolume: 17e6,
      weeklyVolume: 71e6,
      monthlyVolume: 490e6,
      chains: ['Ethereum', 'Polygon'],
      destinationChain: 'Polygon',
      url: 'https://wallet.polygon.technology',
      slug: 'polygon-bridge',
    },
  ],
};

const mockHack: Hack = {
  date: 1711065600,
  name: 'Test Protocol',
  classification: 'Protocol Logic',
  technique: 'Infinite Mint',
  amount: 4_800_000,
  chain: ['Ethereum'],
  bridgeHack: false,
  targetType: 'DeFi',
  source: 'https://rekt.news',
  returnedFunds: null,
  defillamaId: null,
  language: 'Solidity',
};

// ── Helpers ────────────────────────────────────────────────────────────────

describe('fmtUsd', () => {
  it('formats billions', () => expect(fmtUsd(5e9)).toBe('$5.00B'));
  it('formats millions', () => expect(fmtUsd(5e6)).toBe('$5.00M'));
  it('formats thousands', () => expect(fmtUsd(5e3)).toBe('$5.00K'));
  it('formats small numbers', () => expect(fmtUsd(42.5)).toBe('$42.50'));
});

// ── Printer unit tests (no API calls) ─────────────────────────────────────

describe('DefiLLama Printers', () => {
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

  it('printProtocolsJson — sorted by TVL, correct shape', () => {
    printProtocolsJson([mockProtocol]);
    const data = JSON.parse(logs.join('\n'));
    expect(data[0].slug).toBe('uniswap');
    expect(data[0].tvl).toBe(5e9);
    expect(data[0]).toHaveProperty('change_1d');
  });

  it('printProtocolJson — full detail', () => {
    printProtocolJson(mockProtocolDetail);
    const data = JSON.parse(logs.join('\n'));
    expect(data.name).toBe('Uniswap');
    expect(data.currentChainTvls.Ethereum).toBe(4e9);
  });

  it('printTvlJson — protocol, tvl, tvlFormatted', () => {
    printTvlJson('uniswap', 5e9);
    const data = JSON.parse(logs.join('\n'));
    expect(data.protocol).toBe('uniswap');
    expect(data.tvl).toBe(5e9);
    expect(data.tvlFormatted).toBe('$5.00B');
  });

  it('printChainsJson — sorted by TVL', () => {
    printChainsJson([mockChain]);
    const data = JSON.parse(logs.join('\n'));
    expect(data[0].name).toBe('Ethereum');
    expect(data[0].tvl).toBe(60e9);
  });

  it('printChainTvlJson — formatted dates, chain field', () => {
    printChainTvlJson('ethereum', mockChainTvl);
    const data = JSON.parse(logs.join('\n'));
    expect(data.chain).toBe('ethereum');
    expect(data.history[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(data.history[0].tvl).toBe(55e9);
  });

  it('printPricesJson — keyed by coin id', () => {
    printPricesJson(mockPrices);
    const data = JSON.parse(logs.join('\n'));
    expect(data['coingecko:ethereum'].price).toBe(2000);
    expect(data['coingecko:bitcoin'].symbol).toBe('BTC');
  });

  it('printStablecoinsJson — sorted by circulating, correct fields', () => {
    printStablecoinsJson(mockStablecoins);
    const data = JSON.parse(logs.join('\n'));
    expect(data[0].symbol).toBe('USDT');
    expect(data[0].circulating).toBe(100e9);
    expect(data[0]).toHaveProperty('pegType');
  });

  it('printPoolsJson — sorted by tvlUsd, correct fields', () => {
    printPoolsJson([mockPool]);
    const data = JSON.parse(logs.join('\n'));
    expect(data[0].project).toBe('aave-v3');
    expect(data[0].tvlUsd).toBe(2e9);
    expect(data[0].apy).toBe(4.5);
  });

  it('printDexsJson — total24h, change_1d, chains count', () => {
    printDexsJson(mockDexs);
    const data = JSON.parse(logs.join('\n'));
    expect(data.total24h).toBe(3e9);
    expect(data.change_1d).toBe(7.1);
    expect(data.chains).toBe(3);
  });

  it('printFeesJson — total24h, change_1d, chains count', () => {
    printFeesJson(mockFees);
    const data = JSON.parse(logs.join('\n'));
    expect(data.total24h).toBe(10e6);
    expect(data.change_1d).toBe(11.1);
    expect(data.chains).toBe(2);
  });

  it('printBridgesJson — outputs array of bridges', () => {
    printBridgesJson(mockBridges);
    const data = JSON.parse(logs.join('\n'));
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].displayName).toBe('Polygon PoS Bridge');
  });

  it('printHacksJson — sorted by date desc', () => {
    printHacksJson([mockHack]);
    const data = JSON.parse(logs.join('\n'));
    expect(data[0].name).toBe('Test Protocol');
    expect(data[0].amount).toBe(4_800_000);
  });
});

// ── Service unit tests (no API calls) ─────────────────────────────────────

describe('DefiLlamaService', () => {
  it('should instantiate and expose all SDK modules', () => {
    const service = new DefiLlamaService();
    expect(service).toBeDefined();
    expect(typeof service.tvl.getProtocols).toBe('function');
    expect(typeof service.tvl.getProtocol).toBe('function');
    expect(typeof service.tvl.getTvl).toBe('function');
    expect(typeof service.tvl.getChains).toBe('function');
    expect(typeof service.tvl.getHistoricalChainTvl).toBe('function');
    expect(typeof service.prices.getCurrentPrices).toBe('function');
    expect(typeof service.prices.getHistoricalPrices).toBe('function');
    expect(typeof service.prices.getBatchHistoricalPrices).toBe('function');
    expect(typeof service.stablecoins.getStablecoins).toBe('function');
    expect(typeof service.yields.getPools).toBe('function');
    expect(typeof service.yields.getBorrowPools).toBe('function');
    expect(typeof service.yields.getLsdRates).toBe('function');
    expect(typeof service.volumes.getDexOverview).toBe('function');
    expect(typeof service.volumes.getOptionsOverview).toBe('function');
    expect(typeof service.volumes.getDerivativesOverview).toBe('function');
    expect(typeof service.fees.getOverview).toBe('function');
    expect(typeof service.fees.getSummary).toBe('function');
    expect(typeof service.emissions.getAll).toBe('function');
    expect(typeof service.bridges.getAll).toBe('function');
    expect(typeof service.bridges.getTransactions).toBe('function');
    expect(typeof service.ecosystem.getHacks).toBe('function');
    expect(typeof service.ecosystem.getRaises).toBe('function');
    expect(typeof service.ecosystem.getTreasuries).toBe('function');
    expect(typeof service.etfs.getOverview).toBe('function');
    expect(typeof service.dat.getInstitutions).toBe('function');
    expect(typeof service.account.getUsage).toBe('function');
  });
});
