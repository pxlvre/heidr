import Table from 'cli-table3';
import chalk from 'chalk';
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

// ── Helpers ────────────────────────────────────────────────────────────────

export const fmtUsd = (n: number): string => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
};

const pct = (n: number | null | undefined): string => {
  if (n == null) return chalk.gray('N/A');
  return n >= 0 ? chalk.green(`+${n.toFixed(2)}%`) : chalk.red(`${n.toFixed(2)}%`);
};

// ── Protocols list ─────────────────────────────────────────────────────────

export const printProtocolsTable = (protocols: Protocol[]): void => {
  const table = new Table({
    head: ['Name', 'Category', 'Chains', 'TVL', '1d %', '7d %'].map((h) => chalk.cyan(h)),
    style: { head: [] },
  });
  const sorted = [...protocols].sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0)).slice(0, 50);
  for (const p of sorted) {
    table.push([
      p.name,
      p.category ?? 'N/A',
      p.chains.length.toString(),
      fmtUsd(p.tvl ?? 0),
      pct(p.change_1d),
      pct(p.change_7d),
    ]);
  }
  console.log(chalk.bold('\nDefiLLama — Protocols (top 50 by TVL)\n'));
  console.log(table.toString());
};

export const printProtocolsJson = (protocols: Protocol[]): void => {
  const data = [...protocols]
    .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
    .map(({ name, slug, category, chains, tvl, change_1d, change_7d }) => ({
      name,
      slug,
      category,
      chains,
      tvl,
      change_1d,
      change_7d,
    }));
  console.log(JSON.stringify(data, null, 2));
};

// ── Protocol detail ────────────────────────────────────────────────────────

export const printProtocolTable = (detail: ProtocolDetails): void => {
  const table = new Table({ style: { head: ['cyan'] }, wordWrap: true });
  const currentTvl = detail.tvl.at(-1)?.totalLiquidityUSD ?? 0;
  table.push(
    [chalk.bold('Name'), detail.name],
    [chalk.bold('Symbol'), detail.symbol ?? 'N/A'],
    [chalk.bold('Category'), detail.category ?? 'N/A'],
    [chalk.bold('Chains'), detail.chains.join(', ')],
    [chalk.bold('Current TVL'), chalk.green(fmtUsd(currentTvl))],
    [chalk.bold('URL'), detail.url ?? 'N/A'],
    [chalk.bold('Description'), detail.description ?? 'N/A']
  );
  const top = Object.entries(detail.currentChainTvls)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
  for (const [chain, tvl] of top) {
    table.push([chalk.bold(`  ${chain}`), fmtUsd(tvl)]);
  }
  console.log(table.toString());
};

export const printProtocolJson = (detail: ProtocolDetails): void => {
  console.log(JSON.stringify(detail, null, 2));
};

// ── TVL single number ──────────────────────────────────────────────────────

export const printTvlTable = (slug: string, tvl: number): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push([chalk.bold('Protocol'), slug], [chalk.bold('Current TVL'), chalk.green(fmtUsd(tvl))]);
  console.log(chalk.bold('\nDefiLLama — Protocol TVL\n'));
  console.log(table.toString());
};

export const printTvlJson = (slug: string, tvl: number): void => {
  console.log(JSON.stringify({ protocol: slug, tvl, tvlFormatted: fmtUsd(tvl) }, null, 2));
};

// ── Chains ─────────────────────────────────────────────────────────────────

export const printChainsTable = (chains: Chain[]): void => {
  const table = new Table({
    head: ['Chain', 'TVL', 'Token'].map((h) => chalk.cyan(h)),
    style: { head: [] },
  });
  const sorted = [...chains].sort((a, b) => b.tvl - a.tvl).slice(0, 30);
  for (const c of sorted) {
    table.push([c.name, fmtUsd(c.tvl), c.tokenSymbol ?? 'N/A']);
  }
  console.log(chalk.bold('\nDefiLLama — Chains by TVL (top 30)\n'));
  console.log(table.toString());
};

export const printChainsJson = (chains: Chain[]): void => {
  console.log(
    JSON.stringify(
      [...chains].sort((a, b) => b.tvl - a.tvl),
      null,
      2
    )
  );
};

// ── Chain TVL history ──────────────────────────────────────────────────────

export const printChainTvlTable = (chain: string, points: HistoricalChainTvl[]): void => {
  const table = new Table({
    head: ['Date', 'TVL'].map((h) => chalk.cyan(h)),
    style: { head: [] },
  });
  for (const { date, tvl } of points.slice(-30)) {
    table.push([new Date(date * 1000).toISOString().slice(0, 10), fmtUsd(tvl)]);
  }
  console.log(chalk.bold(`\nDefiLLama — ${chain} TVL History (last 30 days)\n`));
  console.log(table.toString());
};

export const printChainTvlJson = (chain: string, points: HistoricalChainTvl[]): void => {
  const data = points.slice(-30).map(({ date, tvl }) => ({
    date: new Date(date * 1000).toISOString().slice(0, 10),
    tvl,
  }));
  console.log(JSON.stringify({ chain, history: data }, null, 2));
};

// ── Prices ─────────────────────────────────────────────────────────────────

export const printPricesTable = (prices: Record<string, CoinPrice>): void => {
  const table = new Table({
    head: ['Coin', 'Symbol', 'Price (USD)', 'Confidence'].map((h) => chalk.cyan(h)),
    style: { head: [] },
  });
  for (const [id, coin] of Object.entries(prices)) {
    table.push([
      id,
      coin.symbol,
      chalk.green(`$${coin.price.toFixed(4)}`),
      coin.confidence != null ? `${(coin.confidence * 100).toFixed(0)}%` : 'N/A',
    ]);
  }
  console.log(chalk.bold('\nDefiLLama — Token Prices\n'));
  console.log(table.toString());
};

export const printPricesJson = (prices: Record<string, CoinPrice>): void => {
  console.log(JSON.stringify(prices, null, 2));
};

// ── Stablecoins ────────────────────────────────────────────────────────────

export const printStablecoinsTable = (response: StablecoinsResponse): void => {
  const table = new Table({
    head: ['Name', 'Symbol', 'Peg Type', 'Mechanism', 'Circulating'].map((h) => chalk.cyan(h)),
    style: { head: [] },
  });
  const sorted = [...response.peggedAssets]
    .sort((a, b) => (b.circulating?.peggedUSD ?? 0) - (a.circulating?.peggedUSD ?? 0))
    .slice(0, 30);
  for (const s of sorted) {
    table.push([
      s.name,
      s.symbol,
      s.pegType ?? 'N/A',
      s.pegMechanism ?? 'N/A',
      fmtUsd(s.circulating?.peggedUSD ?? 0),
    ]);
  }
  console.log(chalk.bold('\nDefiLLama — Stablecoins (top 30 by circulating supply)\n'));
  console.log(table.toString());
};

export const printStablecoinsJson = (response: StablecoinsResponse): void => {
  const data = [...response.peggedAssets]
    .sort((a, b) => (b.circulating?.peggedUSD ?? 0) - (a.circulating?.peggedUSD ?? 0))
    .map((s) => ({
      name: s.name,
      symbol: s.symbol,
      pegType: s.pegType,
      pegMechanism: s.pegMechanism,
      circulating: s.circulating?.peggedUSD ?? 0,
    }));
  console.log(JSON.stringify(data, null, 2));
};

// ── Yield Pools ────────────────────────────────────────────────────────────

export const printPoolsTable = (pools: YieldPool[]): void => {
  const table = new Table({
    head: ['Project', 'Chain', 'Symbol', 'TVL', 'APY'].map((h) => chalk.cyan(h)),
    style: { head: [] },
  });
  const sorted = [...pools].sort((a, b) => (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0)).slice(0, 30);
  for (const p of sorted) {
    const apy = p.apy != null ? chalk.green(`${p.apy.toFixed(2)}%`) : chalk.gray('N/A');
    table.push([p.project, p.chain, p.symbol, fmtUsd(p.tvlUsd ?? 0), apy]);
  }
  console.log(chalk.bold('\nDefiLLama — Yield Pools (top 30 by TVL)\n'));
  console.log(table.toString());
};

export const printPoolsJson = (pools: YieldPool[]): void => {
  const data = [...pools]
    .sort((a, b) => (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0))
    .map(({ pool, project, chain, symbol, tvlUsd, apy, apyBase, apyReward }) => ({
      pool,
      project,
      chain,
      symbol,
      tvlUsd,
      apy,
      apyBase,
      apyReward,
    }));
  console.log(JSON.stringify(data, null, 2));
};

// ── DEXs ───────────────────────────────────────────────────────────────────

export const printDexsTable = (dexs: DexOverviewResponse): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push(
    [chalk.bold('24h Volume'), chalk.green(fmtUsd(dexs.total24h ?? 0))],
    [chalk.bold('Prev 24h Volume'), fmtUsd(dexs.total48hto24h ?? 0)],
    [chalk.bold('Change 1d'), pct(dexs.change_1d)],
    [chalk.bold('Chains Tracked'), (dexs.allChains?.length ?? 0).toString()]
  );
  console.log(chalk.bold('\nDefiLLama — DEX Volume Overview\n'));
  console.log(table.toString());
};

export const printDexsJson = (dexs: DexOverviewResponse): void => {
  console.log(
    JSON.stringify(
      {
        total24h: dexs.total24h,
        total48hto24h: dexs.total48hto24h,
        change_1d: dexs.change_1d,
        chains: dexs.allChains?.length,
      },
      null,
      2
    )
  );
};

// ── Fees ───────────────────────────────────────────────────────────────────

export const printFeesTable = (fees: FeesOverviewResponse): void => {
  const table = new Table({ style: { head: ['cyan'] } });
  table.push(
    [chalk.bold('24h Fees'), chalk.green(fmtUsd(fees.total24h ?? 0))],
    [chalk.bold('Prev 24h Fees'), fmtUsd(fees.total48hto24h ?? 0)],
    [chalk.bold('Change 1d'), pct(fees.change_1d)],
    [chalk.bold('Chains Tracked'), (fees.allChains?.length ?? 0).toString()]
  );
  console.log(chalk.bold('\nDefiLLama — Fees & Revenue Overview\n'));
  console.log(table.toString());
};

export const printFeesJson = (fees: FeesOverviewResponse): void => {
  console.log(
    JSON.stringify(
      {
        total24h: fees.total24h,
        total48hto24h: fees.total48hto24h,
        change_1d: fees.change_1d,
        chains: fees.allChains?.length,
      },
      null,
      2
    )
  );
};

// ── Bridges ────────────────────────────────────────────────────────────────

export const printBridgesTable = (response: BridgesResponse): void => {
  const table = new Table({
    head: ['Name', '24h Volume', '7d Volume', 'Chains'].map((h) => chalk.cyan(h)),
    style: { head: [] },
  });
  const sorted = [...response.bridges]
    .sort((a, b) => (b.last24hVolume ?? 0) - (a.last24hVolume ?? 0))
    .slice(0, 20);
  for (const b of sorted) {
    table.push([
      b.displayName,
      fmtUsd(b.last24hVolume ?? 0),
      fmtUsd(b.weeklyVolume ?? 0),
      b.chains?.join(', ') ?? 'N/A',
    ]);
  }
  console.log(chalk.bold('\nDefiLLama — Bridges (top 20 by 24h volume)\n'));
  console.log(table.toString());
};

export const printBridgesJson = (response: BridgesResponse): void => {
  console.log(JSON.stringify(response.bridges, null, 2));
};

// ── Hacks ──────────────────────────────────────────────────────────────────

export const printHacksTable = (hacks: Hack[]): void => {
  const table = new Table({
    head: ['Date', 'Protocol', 'Amount Lost', 'Category', 'Technique'].map((h) => chalk.cyan(h)),
    style: { head: [] },
  });
  const sorted = [...hacks].sort((a, b) => b.date - a.date).slice(0, 30);
  for (const h of sorted) {
    const date = new Date(h.date * 1000).toISOString().slice(0, 10);
    const amount = h.amount != null ? chalk.red(fmtUsd(h.amount)) : chalk.gray('N/A');
    table.push([date, h.name, amount, h.targetType ?? 'N/A', h.technique ?? 'N/A']);
  }
  console.log(chalk.bold('\nDefiLLama — DeFi Hacks (most recent 30)\n'));
  console.log(table.toString());
};

export const printHacksJson = (hacks: Hack[]): void => {
  console.log(
    JSON.stringify(
      [...hacks].sort((a, b) => b.date - a.date),
      null,
      2
    )
  );
};
