import { Command } from 'commander';
import { DefiLlamaService } from '@/services/defillama/defillama.service';
import {
  printBridgesTable,
  printBridgesJson,
  printChainsTable,
  printChainsJson,
  printChainTvlTable,
  printChainTvlJson,
  printDexsTable,
  printDexsJson,
  printFeesTable,
  printFeesJson,
  printHacksTable,
  printHacksJson,
  printPoolsTable,
  printPoolsJson,
  printPricesTable,
  printPricesJson,
  printProtocolTable,
  printProtocolJson,
  printProtocolsTable,
  printProtocolsJson,
  printStablecoinsTable,
  printStablecoinsJson,
  printTvlTable,
  printTvlJson,
} from '@/cli/printers/defillama.printer';
import { printError } from '@/utils/formatter';

const svc = () => new DefiLlamaService();

// bridges — list all bridges by volume
const bridgesCommand = new Command('bridges')
  .description('List cross-chain bridges by 24h volume')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const data = await svc().bridges.getAll({ includeChains: true });
      if (options.json) {
        printBridgesJson(data);
      } else {
        printBridgesTable(data);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// chain — historical TVL for a specific chain
const chainCommand = new Command('chain')
  .description('Get historical TVL for a specific chain')
  .argument('<name>', 'Chain name (e.g. Ethereum, Arbitrum, Base)')
  .option('-j, --json', 'Output as JSON')
  .action(async (name: string, options) => {
    try {
      const data = await svc().tvl.getHistoricalChainTvl(name);
      if (options.json) {
        printChainTvlJson(name, data);
      } else {
        printChainTvlTable(name, data);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// chains — list all chains with current TVL
const chainsCommand = new Command('chains')
  .description('List all chains with current TVL')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const data = await svc().tvl.getChains();
      if (options.json) {
        printChainsJson(data);
      } else {
        printChainsTable(data);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// dexs — aggregate DEX volume overview
const dexsCommand = new Command('dexs')
  .description('Get aggregate DEX volume overview')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const data = await svc().volumes.getDexOverview();
      if (options.json) {
        printDexsJson(data);
      } else {
        printDexsTable(data);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// fees — aggregate fees & revenue overview
const feesCommand = new Command('fees')
  .description('Get aggregate protocol fees & revenue overview')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const data = await svc().fees.getOverview();
      if (options.json) {
        printFeesJson(data);
      } else {
        printFeesTable(data);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// hacks — historical DeFi exploits
const hacksCommand = new Command('hacks')
  .description('List historical DeFi hacks and exploits')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const data = await svc().ecosystem.getHacks();
      if (options.json) {
        printHacksJson(data);
      } else {
        printHacksTable(data);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// pools — top yield farming pools
const poolsCommand = new Command('pools')
  .description('List top yield farming pools by TVL')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const { data } = await svc().yields.getPools();
      if (options.json) {
        printPoolsJson(data);
      } else {
        printPoolsTable(data);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// price — current (or historical) token prices
const priceCommand = new Command('price')
  .description('Get current token prices')
  .argument('<coins...>', 'Coin IDs (e.g. coingecko:ethereum ethereum:0xA0b8...)')
  .option('-j, --json', 'Output as JSON')
  .option('--at <timestamp>', 'Unix timestamp for historical price lookup')
  .action(async (coins: string[], options) => {
    try {
      const response = options.at
        ? await svc().prices.getHistoricalPrices(Number(options.at), coins)
        : await svc().prices.getCurrentPrices(coins);
      if (options.json) {
        printPricesJson(response.coins);
      } else {
        printPricesTable(response.coins);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// protocol — TVL history and chain breakdown for a single protocol
const protocolCommand = new Command('protocol')
  .description('Get TVL history and chain breakdown for a protocol')
  .argument('<slug>', 'Protocol slug (e.g. uniswap, aave, compound)')
  .option('-j, --json', 'Output as JSON')
  .action(async (slug: string, options) => {
    try {
      const data = await svc().tvl.getProtocol(slug);
      if (options.json) {
        printProtocolJson(data);
      } else {
        printProtocolTable(data);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// protocols — list all protocols
const protocolsCommand = new Command('protocols')
  .description('List all DeFi protocols with TVL (top 50 by default)')
  .option('-j, --json', 'Output as JSON (all protocols)')
  .action(async (options) => {
    try {
      const data = await svc().tvl.getProtocols();
      if (options.json) {
        printProtocolsJson(data);
      } else {
        printProtocolsTable(data);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// stablecoins — list stablecoins by circulating supply
const stablecoinsCommand = new Command('stablecoins')
  .description('List stablecoins by circulating supply')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const data = await svc().stablecoins.getStablecoins();
      if (options.json) {
        printStablecoinsJson(data);
      } else {
        printStablecoinsTable(data);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// tvl — current TVL (single number) for a protocol
const tvlCommand = new Command('tvl')
  .description('Get current TVL for a protocol')
  .argument('<slug>', 'Protocol slug (e.g. uniswap, aave)')
  .option('-j, --json', 'Output as JSON')
  .action(async (slug: string, options) => {
    try {
      const tvl = await svc().tvl.getTvl(slug);
      if (options.json) {
        printTvlJson(slug, tvl);
      } else {
        printTvlTable(slug, tvl);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

export const defiLlamaCommand = new Command('defillama')
  .description('DefiLLama DeFi analytics — TVL, prices, yields, DEX volumes, fees, bridges, hacks')
  .addCommand(bridgesCommand)
  .addCommand(chainCommand)
  .addCommand(chainsCommand)
  .addCommand(dexsCommand)
  .addCommand(feesCommand)
  .addCommand(hacksCommand)
  .addCommand(poolsCommand)
  .addCommand(priceCommand)
  .addCommand(protocolCommand)
  .addCommand(protocolsCommand)
  .addCommand(stablecoinsCommand)
  .addCommand(tvlCommand);
