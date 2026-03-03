#!/usr/bin/env bun
/**
 * Main CLI entry point for heidr - EVM blockchain CLI tool
 */
import { Command } from 'commander';
import { balanceCommand } from '@/cli/commands/balance';
import { blockCommand } from '@/cli/commands/block';
import { chainsCommand } from '@/cli/commands/chains';
import { codeCommand } from '@/cli/commands/code';
import { configCommand } from '@/cli/commands/config';
import { gasCommand } from '@/cli/commands/gas';
import { txCommand } from '@/cli/commands/tx';
import { defiLlamaCommand } from '@/cli/commands/defillama/index';
import { l2beatCommand } from '@/cli/commands/l2beat/index';

const program = new Command();

program
  .name('heidr')
  .description('EVM blockchain CLI tool')
  .version('0.0.7', '-v, --version', 'Output the current version')
  .addHelpText(
    'after',
    `
Examples:
  $ heidr chains --list              List all supported chains
  $ heidr chains --info mainnet      Get info about mainnet
  $ heidr block latest               Get latest block from Ethereum mainnet
  $ heidr block latest --chain arbitrum   Get latest block from Arbitrum
  $ heidr block 12345 --chain polygon     Get block 12345 from Polygon
  $ heidr tx 0x123...                Get transaction info from Ethereum mainnet
  $ heidr tx 0x123... --chain arbitrum    Get transaction info from Arbitrum
  $ heidr gas price                  Get current gas prices
  $ heidr gas price low --chain optimism  Get low priority gas price
  $ heidr gas code ADD               Get gas cost for ADD opcode
  $ heidr code                       List all EVM opcodes
  $ heidr code 00                    Get STOP opcode info
  $ heidr code ADD                   Get ADD opcode info
  $ heidr --version                  Show version
  $ heidr --help                     Show help
`
  );

// Register commands
program.addCommand(balanceCommand);
program.addCommand(blockCommand);
program.addCommand(chainsCommand);
program.addCommand(codeCommand);
program.addCommand(configCommand);
program.addCommand(gasCommand);
program.addCommand(defiLlamaCommand);
program.addCommand(l2beatCommand);
program.addCommand(txCommand);

program.parse();
