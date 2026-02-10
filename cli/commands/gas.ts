import { Command } from 'commander';
import { RpcProvider } from '@/providers/rpc.provider';
import { getChain } from '@/config/chains';
import { GasService } from '@/services/rpc/gas.service';
import { validateGasPriority } from '@/cli/guards/gas.guard';
import {
  printGasPricesTable,
  printSingleGasPrice,
  printGasPricesJson,
  printSingleGasPriceJson,
} from '@/cli/printers/gas.printer';
import chalk from 'chalk';

export const gasCommand = new Command('gas')
  .description('Get current gas prices for a chain')
  .argument('[priority]', 'Priority level: low, average, or high (shows all if not specified)')
  .option('-c, --chain <name>', 'Chain name or ID', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (priority: string | undefined, options) => {
    try {
      // Validate inputs
      validateGasPriority(priority);

      // Get chain configuration
      const chain = getChain(options.chain);
      const rpcUrl = chain.rpcUrls.default.http[0];

      if (!rpcUrl) {
        throw new Error(`No RPC URL available for chain: ${options.chain}`);
      }

      // Initialize provider and service
      const provider = new RpcProvider(rpcUrl, chain);
      const gasService = new GasService(provider);

      // Get gas prices
      if (priority) {
        // Single priority
        const priorityLower = priority.toLowerCase() as 'low' | 'average' | 'high';
        const { gasPrice, baseFee } = await gasService.getGasPriceForPriority(priorityLower);

        // Print output
        if (options.json) {
          printSingleGasPriceJson(gasPrice, baseFee, priorityLower, chain.name, chain.id);
        } else {
          printSingleGasPrice(gasPrice, priorityLower, chain.name);
        }
      } else {
        // All priorities
        const gasPrices = await gasService.getGasPrices();

        // Print output
        if (options.json) {
          printGasPricesJson(gasPrices, chain.name, chain.id);
        } else {
          printGasPricesTable(gasPrices, chain.name);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      }
      process.exit(1);
    }
  });
