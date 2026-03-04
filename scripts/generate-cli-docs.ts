#!/usr/bin/env bun
/**
 * Generate CLI command documentation
 */

const commands = `
# heidr CLI Commands

Auto-generated documentation for all heidr commands.

## Commands

### \`heidr chains\`

List all supported chains or get info about a specific chain.

**Options:**
- \`-l, --list\` - List all supported chains
- \`-i, --info <chain>\` - Get information about a specific chain
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr chains --list
heidr chains --info mainnet
heidr chains --info arbitrum --json
\`\`\`

---

### \`heidr block\`

Get block information from any supported chain.

**Usage:** \`heidr block [block] [options]\`

**Arguments:**
- \`[block]\` - Block number or "latest" (default: latest)

**Options:**
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr block latest
heidr block latest --chain arbitrum
heidr block 12345 --chain polygon
heidr block 70000000 --json
\`\`\`

---

### \`heidr tx\`

Get transaction information by hash.

**Usage:** \`heidr tx <hash> [options]\`

**Arguments:**
- \`<hash>\` - Transaction hash

**Options:**
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr tx 0x086164dca926230a5b67e572888a26dee10708a328477b49fdb94ac7bc446260
heidr tx 0x4fedc... --chain arbitrum
heidr tx 0x123... --json
\`\`\`

---

### \`heidr balance\`

Get balance of an address on any supported chain.

**Usage:** \`heidr balance <address> [options]\`

**Arguments:**
- \`<address>\` - Ethereum address or ENS name to check

**Options:**
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-t, --token <addr>\` - ERC-20 token address to query token balance instead of native balance
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr balance 0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97
heidr balance 0x123... --chain arbitrum
heidr balance vitalik.eth --json
heidr balance 0x123... --token 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
\`\`\`

---

### \`heidr gas\`

Get current gas prices for any supported chain.

**Usage:** \`heidr gas [options]\`

**Options:**
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr gas
heidr gas --chain arbitrum
heidr gas --chain optimism --json
\`\`\`

---

### \`heidr rpc\`

Direct EVM JSON-RPC operations via viem. No API key required. Multi-chain via --chain flag.

**Subcommands:**

#### \`heidr rpc chainid\`

Get the chain ID.

**Usage:** \`heidr rpc chainid [options]\`

**Options:**
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr rpc chainid
heidr rpc chainid --chain arbitrum
heidr rpc chainid --json
\`\`\`

#### \`heidr rpc code\`

Get contract bytecode.

**Usage:** \`heidr rpc code <addr> [options]\`

**Arguments:**
- \`<addr>\` - Contract address

**Options:**
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr rpc code 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
heidr rpc code 0x123... --chain arbitrum
heidr rpc code 0x456... --json
\`\`\`

#### \`heidr rpc estimate\`

Estimate gas for a transaction.

**Usage:** \`heidr rpc estimate [options]\`

**Options:**
- \`--to <addr>\` - Recipient address
- \`--data <hex>\` - Transaction data (hex string)
- \`--value <wei>\` - Value to send in wei
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr rpc estimate --to 0x123... --data 0x
heidr rpc estimate --to 0x456... --value 1000000000000000000
heidr rpc estimate --chain arbitrum --to 0x789... --json
\`\`\`

#### \`heidr rpc logs\`

Get event logs.

**Usage:** \`heidr rpc logs [options]\`

**Options:**
- \`--address <addr>\` - Contract address
- \`--from <block>\` - From block number
- \`--to <block>\` - To block number
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr rpc logs --address 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
heidr rpc logs --from 17000000 --to 17001000
heidr rpc logs --address 0x123... --chain arbitrum --json
\`\`\`

#### \`heidr rpc nonce\`

Get nonce (transaction count) for an address.

**Usage:** \`heidr rpc nonce <addr> [options]\`

**Arguments:**
- \`<addr>\` - Account address

**Options:**
- \`--pending\` - Get pending nonce instead of confirmed
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr rpc nonce 0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97
heidr rpc nonce 0x123... --pending
heidr rpc nonce 0x456... --chain arbitrum --json
\`\`\`

#### \`heidr rpc proof\`

Get account proof (EIP-1186).

**Usage:** \`heidr rpc proof <addr> [options]\`

**Arguments:**
- \`<addr>\` - Account address

**Options:**
- \`--slots <hex,...>\` - Storage slots to include in proof (comma-separated hex values)
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr rpc proof 0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97
heidr rpc proof 0x123... --slots 0x0,0x1
heidr rpc proof 0x456... --chain arbitrum --json
\`\`\`

#### \`heidr rpc receipt\`

Get transaction receipt.

**Usage:** \`heidr rpc receipt <hash> [options]\`

**Arguments:**
- \`<hash>\` - Transaction hash

**Options:**
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr rpc receipt 0x086164dca926230a5b67e572888a26dee10708a328477b49fdb94ac7bc446260
heidr rpc receipt 0x4fedc... --chain arbitrum
heidr rpc receipt 0x123... --json
\`\`\`

#### \`heidr rpc storage\`

Read a storage slot.

**Usage:** \`heidr rpc storage <addr> <slot> [options]\`

**Arguments:**
- \`<addr>\` - Contract address
- \`<slot>\` - Storage slot (hex value)

**Options:**
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr rpc storage 0x123... 0x0
heidr rpc storage 0x456... 0x1 --chain arbitrum
heidr rpc storage 0x789... 0x2 --json
\`\`\`

#### \`heidr rpc call\`

Raw eth_call for contract interactions.

**Usage:** \`heidr rpc call <addr> <data> [options]\`

**Arguments:**
- \`<addr>\` - Contract address
- \`<data>\` - Transaction data (hex string)

**Options:**
- \`-c, --chain <chain>\` - Chain to query (default: mainnet)
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr rpc call 0x123... 0x06fdde03
heidr rpc call 0x456... 0x70a08231... --chain arbitrum
heidr rpc call 0x789... 0x18160ddd --json
\`\`\`

---

### \`heidr l2beat\`

L2Beat analytics — scaling projects, TVS, and transaction activity.

**Subcommands:**

#### \`heidr l2beat activity\`

Get aggregate transaction activity across all L2s (last 30 days).

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr l2beat activity
heidr l2beat activity --json
\`\`\`

#### \`heidr l2beat project <slug>\`

Get details for a specific L2Beat project.

**Usage:** \`heidr l2beat project <slug> [options]\`

**Arguments:**
- \`<slug>\` - Project slug (e.g. arbitrum, optimism, base)

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr l2beat project arbitrum
heidr l2beat project optimism --json
heidr l2beat project base
\`\`\`

#### \`heidr l2beat scaling\`

List all L2Beat scaling projects.

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr l2beat scaling
heidr l2beat scaling --json
\`\`\`

#### \`heidr l2beat tvs\`

Get aggregate Total Value Secured (TVS) across all L2s.

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr l2beat tvs
heidr l2beat tvs --json
\`\`\`

---

### \`heidr defillama\`

DefiLLama DeFi analytics — TVL, prices, yields, DEX volumes, fees, bridges, hacks.

**Subcommands:**

#### \`heidr defillama bridges\`

List cross-chain bridges by 24h volume.

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr defillama bridges
heidr defillama bridges --json
\`\`\`

#### \`heidr defillama chain <name>\`

Get historical TVL for a specific chain.

**Usage:** \`heidr defillama chain <name> [options]\`

**Arguments:**
- \`<name>\` - Chain name (e.g. Ethereum, Arbitrum, Base)

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr defillama chain Ethereum
heidr defillama chain Arbitrum --json
heidr defillama chain Base
\`\`\`

#### \`heidr defillama chains\`

List all chains with current TVL.

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr defillama chains
heidr defillama chains --json
\`\`\`

#### \`heidr defillama dexs\`

Get aggregate DEX volume overview.

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr defillama dexs
heidr defillama dexs --json
\`\`\`

#### \`heidr defillama fees\`

Get aggregate protocol fees & revenue overview.

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr defillama fees
heidr defillama fees --json
\`\`\`

#### \`heidr defillama hacks\`

List historical DeFi hacks and exploits.

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr defillama hacks
heidr defillama hacks --json
\`\`\`

#### \`heidr defillama pools\`

List top yield farming pools by TVL.

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr defillama pools
heidr defillama pools --json
\`\`\`

#### \`heidr defillama price <coins...>\`

Get current or historical token prices.

**Usage:** \`heidr defillama price <coins...> [options]\`

**Arguments:**
- \`<coins...>\` - One or more coin IDs (e.g. \`coingecko:ethereum\`, \`ethereum:0xA0b8...\`)

**Options:**
- \`-j, --json\` - Output as JSON
- \`--at <timestamp>\` - Unix timestamp for historical price lookup

**Examples:**
\`\`\`bash
heidr defillama price coingecko:ethereum
heidr defillama price coingecko:bitcoin coingecko:ethereum
heidr defillama price coingecko:ethereum --at 1700000000
heidr defillama price coingecko:ethereum --json
\`\`\`

#### \`heidr defillama protocol <slug>\`

Get TVL history and chain breakdown for a protocol.

**Usage:** \`heidr defillama protocol <slug> [options]\`

**Arguments:**
- \`<slug>\` - Protocol slug (e.g. uniswap, aave, compound)

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr defillama protocol uniswap
heidr defillama protocol aave --json
heidr defillama protocol compound
\`\`\`

#### \`heidr defillama protocols\`

List all DeFi protocols with TVL (top 50 by default).

**Options:**
- \`-j, --json\` - Output as JSON (all protocols)

**Examples:**
\`\`\`bash
heidr defillama protocols
heidr defillama protocols --json
\`\`\`

#### \`heidr defillama stablecoins\`

List stablecoins by circulating supply.

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr defillama stablecoins
heidr defillama stablecoins --json
\`\`\`

#### \`heidr defillama tvl <slug>\`

Get current TVL for a protocol.

**Usage:** \`heidr defillama tvl <slug> [options]\`

**Arguments:**
- \`<slug>\` - Protocol slug (e.g. uniswap, aave)

**Options:**
- \`-j, --json\` - Output as JSON

**Examples:**
\`\`\`bash
heidr defillama tvl uniswap
heidr defillama tvl aave --json
\`\`\`

---

## Global Options

- \`-v, --version\` - Output the current version
- \`-h, --help\` - Display help for command

## Output Formats

All commands support two output formats:

1. **Table** (default) - Human-readable ASCII tables
2. **JSON** (with \`--json\` flag) - Machine-readable JSON output

## Supported Chains

Run \`heidr chains --list\` to see all supported chains.

Popular chains include:
- Ethereum (mainnet)
- Arbitrum (arbitrum)
- Optimism (optimism)
- Polygon (polygon)
- Base (base)
- And many more...
`;

import { writeFileSync } from 'fs';

writeFileSync('docs-cli/COMMANDS.md', commands);
console.log('✅ CLI documentation generated at docs-cli/COMMANDS.md');
