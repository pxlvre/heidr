import { Command } from 'commander';
import { RpcProvider } from '@/providers/rpc.provider';
import { getChain } from '@/config/chains';
import { RpcService } from '@/services/rpc/rpc.service';
import {
  printBytecodeTable,
  printBytecodeJson,
  printNonceTable,
  printNonceJson,
  printStorageTable,
  printStorageJson,
  printCallTable,
  printCallJson,
  printEstimateTable,
  printEstimateJson,
  printLogsTable,
  printLogsJson,
  printChainIdTable,
  printChainIdJson,
  printReceiptTable,
  printReceiptJson,
  printProofTable,
  printProofJson,
} from '@/cli/printers/rpc.printer';
import { printError } from '@/utils/formatter';

function initService(chainName: string) {
  const chain = getChain(chainName);
  const rpcUrl = chain.rpcUrls.default.http[0];
  if (!rpcUrl) throw new Error(`No RPC URL available for chain: ${chain.name}`);
  const provider = new RpcProvider(rpcUrl, chain);
  return { chain, service: new RpcService(provider) };
}

const codeCmd = new Command('code')
  .description('Get bytecode at an address')
  .argument('<addr>', 'Contract address')
  .option('-c, --chain <chain>', 'Chain name', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (addr: string, options) => {
    try {
      const { chain, service } = initService(options.chain);
      const bytecode = await service.getBytecode(addr as `0x${string}`);
      if (options.json) {
        printBytecodeJson(addr, bytecode, chain);
      } else {
        printBytecodeTable(addr, bytecode, chain);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

const nonceCmd = new Command('nonce')
  .description('Get transaction count (nonce) for an address')
  .argument('<addr>', 'Address')
  .option('-c, --chain <chain>', 'Chain name', 'mainnet')
  .option('--pending', 'Use pending block tag')
  .option('-j, --json', 'Output as JSON')
  .action(async (addr: string, options) => {
    try {
      const { chain, service } = initService(options.chain);
      const blockTag = options.pending ? 'pending' : 'latest';
      const nonce = await service.getNonce(addr as `0x${string}`, blockTag);
      if (options.json) {
        printNonceJson(addr, nonce, chain);
      } else {
        printNonceTable(addr, nonce, chain);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

const storageCmd = new Command('storage')
  .description('Get storage value at a slot')
  .argument('<addr>', 'Contract address')
  .argument('<slot>', 'Storage slot (hex)')
  .option('-c, --chain <chain>', 'Chain name', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (addr: string, slot: string, options) => {
    try {
      const { chain, service } = initService(options.chain);
      const value = await service.getStorageAt(addr as `0x${string}`, slot as `0x${string}`);
      if (options.json) {
        printStorageJson(addr, slot, value, chain);
      } else {
        printStorageTable(addr, slot, value, chain);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

const callCmd = new Command('call')
  .description('Execute a call against a contract')
  .argument('<addr>', 'Target address')
  .argument('<data>', 'Call data (hex)')
  .option('-c, --chain <chain>', 'Chain name', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (addr: string, data: string, options) => {
    try {
      const { chain, service } = initService(options.chain);
      const result = await service.call(addr as `0x${string}`, data as `0x${string}`);
      if (options.json) {
        printCallJson(addr, data, result, chain);
      } else {
        printCallTable(addr, data, result, chain);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

const estimateCmd = new Command('estimate')
  .description('Estimate gas for a transaction')
  .option('--to <addr>', 'Target address')
  .option('--data <hex>', 'Call data')
  .option('--value <wei>', 'Value in wei')
  .option('-c, --chain <chain>', 'Chain name', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const { chain, service } = initService(options.chain);
      const params: { to?: `0x${string}`; data?: `0x${string}`; value?: bigint } = {};
      if (options.to) params.to = options.to as `0x${string}`;
      if (options.data) params.data = options.data as `0x${string}`;
      if (options.value) params.value = BigInt(options.value);
      const gas = await service.estimateGas(params);
      if (options.json) {
        printEstimateJson(gas, chain);
      } else {
        printEstimateTable(gas, chain);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

const logsCmd = new Command('logs')
  .description('Get logs matching a filter')
  .option('--address <addr>', 'Contract address to filter')
  .option('--from <block>', 'From block number')
  .option('--to <block>', 'To block number')
  .option('-c, --chain <chain>', 'Chain name', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const { chain, service } = initService(options.chain);
      const params: { address?: `0x${string}`; fromBlock?: bigint; toBlock?: bigint } = {};
      if (options.address) params.address = options.address as `0x${string}`;
      if (options.from) params.fromBlock = BigInt(options.from);
      if (options.to) params.toBlock = BigInt(options.to);
      const logs = await service.getLogs(params);
      if (options.json) {
        printLogsJson(logs, chain);
      } else {
        printLogsTable(logs, chain);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

const chainidCmd = new Command('chainid')
  .description('Get the chain ID')
  .option('-c, --chain <chain>', 'Chain name', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const { chain, service } = initService(options.chain);
      const chainId = await service.getChainId();
      if (options.json) {
        printChainIdJson(chainId, chain.name);
      } else {
        printChainIdTable(chainId, chain.name);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

const receiptCmd = new Command('receipt')
  .description('Get a transaction receipt')
  .argument('<hash>', 'Transaction hash')
  .option('-c, --chain <chain>', 'Chain name', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (hash: string, options) => {
    try {
      const { chain, service } = initService(options.chain);
      const receipt = await service.getTransactionReceipt(hash as `0x${string}`);
      if (options.json) {
        printReceiptJson(receipt, chain);
      } else {
        printReceiptTable(receipt, chain);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

const proofCmd = new Command('proof')
  .description('Get Merkle proof for an account')
  .argument('<addr>', 'Account address')
  .option('--slots <hex,...>', 'Comma-separated storage slots')
  .option('-c, --chain <chain>', 'Chain name', 'mainnet')
  .option('-j, --json', 'Output as JSON')
  .action(async (addr: string, options) => {
    try {
      const { chain, service } = initService(options.chain);
      const slots: `0x${string}`[] = options.slots
        ? options.slots.split(',').map((s: string) => s.trim() as `0x${string}`)
        : [];
      const proof = await service.getProof(addr as `0x${string}`, slots);
      if (options.json) {
        printProofJson(proof, chain);
      } else {
        printProofTable(proof, chain);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

export const rpcCommand = new Command('rpc')
  .description('Low-level RPC commands')
  .addCommand(codeCmd)
  .addCommand(nonceCmd)
  .addCommand(storageCmd)
  .addCommand(callCmd)
  .addCommand(estimateCmd)
  .addCommand(logsCmd)
  .addCommand(chainidCmd)
  .addCommand(receiptCmd)
  .addCommand(proofCmd);
