#!/usr/bin/env bun
/**
 * Command to get EVM opcode information
 * @example
 * heidr code                 List all opcodes
 * heidr code 00              Get STOP opcode info
 * heidr code stop            Get STOP opcode info
 * heidr code ADD             Get ADD opcode info
 * heidr code --json          List all opcodes as JSON
 */
import { Command } from 'commander';
import { OpcodeService } from '@/services/opcode.service';
import {
  printOpcodeTable,
  printOpcodeJson,
  printOpcodesTable,
  printOpcodesJson,
} from '@/cli/printers/opcode.printer';
import { printError } from '@/utils/formatter';

export const codeCommand = new Command('code')
  .description('Get EVM opcode information')
  .argument('[opcode]', 'Opcode hex (e.g., 00, 0x01) or name (e.g., STOP, ADD)')
  .option('-j, --json', 'Output as JSON')
  .action(async (opcodeIdentifier: string | undefined, options: { json?: boolean }) => {
    try {
      const opcodeService = new OpcodeService();

      if (opcodeIdentifier) {
        // Get specific opcode
        const opcode = opcodeService.getOpcode(opcodeIdentifier);

        if (!opcode) {
          throw new Error(
            `Opcode not found: ${opcodeIdentifier}. Use hex (e.g., 00, 0x01) or name (e.g., STOP, ADD)`
          );
        }

        // Print output
        if (options.json) {
          printOpcodeJson(opcode);
        } else {
          printOpcodeTable(opcode);
        }
      } else {
        // Get all opcodes
        const opcodes = opcodeService.getAllOpcodes();

        // Print output
        if (options.json) {
          printOpcodesJson(opcodes);
        } else {
          printOpcodesTable(opcodes);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        printError(error.message);
      } else {
        printError('An unknown error occurred');
      }
      process.exit(1);
    }
  });
