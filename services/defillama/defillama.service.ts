import { DefiLlamaProvider } from '@/providers/defillama.provider';

// Re-export SDK types so callers only import from the service layer
export type {
  // TVL
  Protocol,
  ProtocolDetails,
  Chain,
  HistoricalChainTvl,
  HistoricalChainsTvl,
  TokenProtocolHolding,
  ProtocolInflowsResponse,
  ChainAssetsResponse,
  // Prices
  CoinPricesResponse,
  CoinPrice,
  BatchHistoricalResponse,
  ChartResponse,
  PercentageResponse,
  FirstPriceResponse,
  BlockInfo,
  ChartOptions,
  PercentageOptions,
  // Stablecoins
  StablecoinsResponse,
  StablecoinDetails,
  StablecoinChartDataPoint,
  StablecoinChainDataPoint,
  StablecoinChainMcap,
  StablecoinPricePoint,
  StablecoinDominanceDataPoint,
  // Yields
  YieldPoolsResponse,
  YieldPool,
  YieldChartResponse,
  BorrowPoolsResponse,
  LendBorrowChartResponse,
  PerpsResponse,
  LsdRate,
  // Volumes
  DexOverviewResponse,
  DexSummaryResponse,
  OptionsOverviewResponse,
  OptionsSummaryResponse,
  DerivativesOverviewResponse,
  DerivativesSummaryResponse,
  DexMetricsResponse,
  DexOverviewOptions,
  DexSummaryOptions,
  // Fees
  FeesOverviewResponse,
  FeesSummaryResponse,
  FeesOverviewOptions,
  FeesSummaryOptions,
  FeesChartOptions,
  FeesMetricsResponse,
  FeesMetricsByProtocolResponse,
  ChartDataPoint,
  ChartBreakdownDataPoint,
  // Emissions
  EmissionToken,
  EmissionDetailResponse,
  // Bridges
  BridgesResponse,
  BridgeDetail,
  BridgeVolumeDataPoint,
  BridgeDayStatsResponse,
  BridgeTransaction,
  BridgesOptions,
  BridgeTransactionsOptions,
  // Ecosystem
  CategoriesResponse,
  ForksResponse,
  OraclesResponse,
  Entity,
  Treasury,
  Hack,
  RaisesResponse,
  // ETFs
  EtfOverviewItem,
  EtfHistoryItem,
  FdvPerformanceItem,
  FdvPeriod,
  // DAT
  DatInstitutionsResponse,
  DatInstitutionResponse,
} from '@defillama/api';

/**
 * DefiLlama service — thin facade over @defillama/api SDK modules.
 * Uses DefiLlamaProvider for client construction (handles optional API key).
 *
 * Free-tier endpoints work without a key.
 * Pro-tier endpoints (🔒) require DEFILLAMA_API_KEY env var or config key "defillama.apiKey".
 */
export class DefiLlamaService {
  private readonly provider: DefiLlamaProvider;

  constructor() {
    this.provider = new DefiLlamaProvider();
  }

  // Convenience accessors to the SDK modules
  get tvl() {
    return this.provider.client.tvl;
  }
  get prices() {
    return this.provider.client.prices;
  }
  get stablecoins() {
    return this.provider.client.stablecoins;
  }
  get yields() {
    return this.provider.client.yields;
  }
  get volumes() {
    return this.provider.client.volumes;
  }
  get fees() {
    return this.provider.client.fees;
  }
  get emissions() {
    return this.provider.client.emissions;
  }
  get bridges() {
    return this.provider.client.bridges;
  }
  get ecosystem() {
    return this.provider.client.ecosystem;
  }
  get etfs() {
    return this.provider.client.etfs;
  }
  get dat() {
    return this.provider.client.dat;
  }
  get account() {
    return this.provider.client.account;
  }
}
