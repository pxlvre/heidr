import { Command } from 'commander';
import { RpcProvider } from '@/providers/rpc.provider';
import { getChain } from '@/config/chains';
import { GasService } from '@/services/rpc/gas.service';
import { OpcodeService } from '@/services/opcode.service';
import { validateGasPriority } from '@/cli/guards/gas.guard';
import {
  printGasPricesTable,
  printSingleGasPrice,
  printGasPricesJson,
  printSingleGasPriceJson,
  printOpcodeGasTable,
  printOpcodeGasJson,
} from '@/cli/printers/gas.printer';
import { NotImplementedError } from '@/errors';
import chalk from 'chalk';

// Price subcommand - get current gas prices
const priceCommand = new Command('price')
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

// Cost subcommand - estimate transaction cost (not implemented)
const costCommand = new Command('cost')
  .description('Estimate transaction cost (not yet implemented)')
  .action(() => {
    throw new NotImplementedError('The "gas cost" command is not yet implemented');
  });

// Code subcommand - get gas costs for opcodes
const codeCommand = new Command('code')
  .description('Get gas costs for EVM opcodes')
  .argument('<identifier>', 'Opcode hex (e.g., 00, 0x01) or name (e.g., STOP, ADD)')
  .option('-j, --json', 'Output as JSON')
  .action(async (identifier: string, options) => {
    try {
      // Get opcode service
      const opcodeService = new OpcodeService();

      // Look up opcode
      const opcode = opcodeService.getOpcode(identifier);

      // Print output
      if (options.json) {
        printOpcodeGasJson(opcode);
      } else {
        printOpcodeGasTable(opcode);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      }
      process.exit(1);
    }
  });

// Fee subcommand - get detailed fee breakdown (not implemented)
const feeCommand = new Command('fee')
  .description('Get detailed fee breakdown (not yet implemented)')
  .action(() => {
    throw new NotImplementedError('The "gas fee" command is not yet implemented');
  });

// Main gas command
export const gasCommand = new Command('gas')
  .description('Gas-related utilities (prices, costs, fees)')
  .addCommand(priceCommand)
  .addCommand(costCommand)
  .addCommand(codeCommand)
  .addCommand(feeCommand);
