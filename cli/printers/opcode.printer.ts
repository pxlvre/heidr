import Table from 'cli-table3';
import chalk from 'chalk';
import type { OpcodeWithHex } from '@/services/opcode.service';

/**
 * Print single opcode in table format
 * @param opcode - Opcode data
 */
export const printOpcodeTable = (opcode: OpcodeWithHex): void => {
  const table = new Table({
    style: { head: ['cyan'] },
    wordWrap: true,
  });

  table.push(
    [chalk.bold('Opcode'), `0x${opcode.hex.toUpperCase()}`],
    [chalk.bold('Name'), chalk.green(opcode.name)],
    [chalk.bold('Minimum Gas'), opcode.minGas.toString()],
    [chalk.bold('Stack Input'), opcode.input || chalk.gray('none')],
    [chalk.bold('Stack Output'), opcode.output || chalk.gray('none')],
    [chalk.bold('Description'), opcode.description || chalk.gray('No description')]
  );

  console.log(table.toString());
};

/**
 * Print single opcode in JSON format
 * @param opcode - Opcode data
 */
export const printOpcodeJson = (opcode: OpcodeWithHex): void => {
  console.log(
    JSON.stringify(
      {
        hex: `0x${opcode.hex}`,
        name: opcode.name,
        minGas: opcode.minGas,
        stackInput: opcode.input,
        stackOutput: opcode.output,
        description: opcode.description,
      },
      null,
      2
    )
  );
};

/**
 * Print all opcodes in table format
 * @param opcodes - Array of opcodes
 */
export const printOpcodesTable = (opcodes: OpcodeWithHex[]): void => {
  const table = new Table({
    head: [
      chalk.cyan('Opcode'),
      chalk.cyan('Name'),
      chalk.cyan('Gas'),
      chalk.cyan('Input'),
      chalk.cyan('Output'),
      chalk.cyan('Description'),
    ],
    style: { head: ['cyan'] },
    wordWrap: true,
    colWidths: [10, 18, 8, 15, 15, 40],
  });

  opcodes.forEach((opcode) => {
    table.push([
      `0x${opcode.hex.toUpperCase()}`,
      chalk.green(opcode.name),
      opcode.minGas.toString(),
      opcode.input || chalk.gray('-'),
      opcode.output || chalk.gray('-'),
      opcode.description.substring(0, 37) + (opcode.description.length > 37 ? '...' : ''),
    ]);
  });

  console.log(table.toString());
  console.log(chalk.gray(`\nTotal: ${opcodes.length} opcodes`));
};

/**
 * Print all opcodes in JSON format
 * @param opcodes - Array of opcodes
 */
export const printOpcodesJson = (opcodes: OpcodeWithHex[]): void => {
  const output = opcodes.map((opcode) => ({
    hex: `0x${opcode.hex}`,
    name: opcode.name,
    minGas: opcode.minGas,
    stackInput: opcode.input,
    stackOutput: opcode.output,
    description: opcode.description,
  }));

  console.log(JSON.stringify(output, null, 2));
};
