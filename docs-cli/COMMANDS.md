# heidr CLI Commands

Auto-generated documentation for all heidr commands.

## Commands

### `heidr chains`

List all supported chains or get info about a specific chain.

**Options:**

- `-l, --list` - List all supported chains
- `-i, --info <chain>` - Get information about a specific chain
- `-j, --json` - Output as JSON

**Examples:**

```bash
heidr chains --list
heidr chains --info mainnet
heidr chains --info arbitrum --json
```

---

### `heidr block`

Get block information from any supported chain.

**Usage:** `heidr block [block] [options]`

**Arguments:**

- `[block]` - Block number or "latest" (default: latest)

**Options:**

- `-c, --chain <chain>` - Chain to query (default: mainnet)
- `-j, --json` - Output as JSON

**Examples:**

```bash
heidr block latest
heidr block latest --chain arbitrum
heidr block 12345 --chain polygon
heidr block 70000000 --json
```

---

### `heidr tx`

Get transaction information by hash.

**Usage:** `heidr tx <hash> [options]`

**Arguments:**

- `<hash>` - Transaction hash

**Options:**

- `-c, --chain <chain>` - Chain to query (default: mainnet)
- `-j, --json` - Output as JSON

**Examples:**

```bash
heidr tx 0x086164dca926230a5b67e572888a26dee10708a328477b49fdb94ac7bc446260
heidr tx 0x4fedc... --chain arbitrum
heidr tx 0x123... --json
```

---

### `heidr balance`

Get balance of an address on any supported chain.

**Usage:** `heidr balance <address> [options]`

**Arguments:**

- `<address>` - Ethereum address or ENS name to check

**Options:**

- `-c, --chain <chain>` - Chain to query (default: mainnet)
- `-j, --json` - Output as JSON

**Examples:**

```bash
heidr balance 0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97
heidr balance 0x123... --chain arbitrum
heidr balance vitalik.eth --json
```

---

### `heidr gas`

Gas-related utilities including prices, costs, and fee analysis.

**Subcommands:**

#### `heidr gas price`

Get current gas prices for any supported chain with priority levels (low/average/high).

**Usage:** `heidr gas price [priority] [options]`

**Arguments:**

- `[priority]` - Gas priority level: "low", "average", or "high" (optional - shows all if omitted)

**Options:**

- `-c, --chain <chain>` - Chain to query (default: mainnet)
- `-j, --json` - Output as JSON

**Examples:**

```bash
# Show all priority levels
heidr gas price
heidr gas price --chain arbitrum

# Show specific priority level
heidr gas price low
heidr gas price average --chain optimism
heidr gas price high --chain polygon --json
```

**Priority Levels:**

- **Low** (25th percentile) - For non-urgent transactions
- **Average** (50th percentile) - For normal transactions
- **High** (75th percentile) - For urgent transactions

#### `heidr gas cost`

Estimate transaction cost (not yet implemented).

#### `heidr gas code`

Get gas costs for EVM opcodes.

**Usage:** `heidr gas code <identifier> [options]`

**Arguments:**

- `<identifier>` - Opcode hex (e.g., 00, 0x01, FF) or name (e.g., STOP, ADD, PUSH1) - case insensitive

**Options:**

- `-j, --json` - Output as JSON

**Examples:**

```bash
# Get gas cost by opcode name
heidr gas code ADD
heidr gas code PUSH1
heidr gas code keccak256

# Get gas cost by hex
heidr gas code 00
heidr gas code 0x01
heidr gas code ff

# JSON output
heidr gas code ADD --json
```

**Information Displayed:**

- Opcode hex value
- Mnemonic name
- Minimum gas cost
- Stack input requirements
- Stack output

#### `heidr gas fee`

Get detailed fee breakdown (not yet implemented).

---

### `heidr code`

Get EVM opcode information from the complete EVM instruction set.

**Usage:** `heidr code [identifier] [options]`

**Arguments:**

- `[identifier]` - Opcode hex (e.g., 00, 0x01, FF) or name (e.g., STOP, ADD, PUSH1) - case insensitive (optional - shows all if omitted)

**Options:**

- `-j, --json` - Output as JSON

**Examples:**

```bash
# List all opcodes
heidr code
heidr code --json

# Get opcode by hex
heidr code 00
heidr code 0x01
heidr code ff

# Get opcode by name (case-insensitive)
heidr code STOP
heidr code ADD
heidr code push1
heidr code KECCAK256
heidr code add --json
```

**Opcode Information Includes:**

- Hex value
- Mnemonic name
- Minimum gas cost
- Stack input requirements
- Stack output
- Description

---

## Global Options

- `-v, --version` - Output the current version
- `-h, --help` - Display help for command

## Output Formats

All commands support two output formats:

1. **Table** (default) - Human-readable ASCII tables
2. **JSON** (with `--json` flag) - Machine-readable JSON output

## Supported Chains

Run `heidr chains --list` to see all supported chains.

Popular chains include:

- Ethereum (mainnet)
- Arbitrum (arbitrum)
- Optimism (optimism)
- Polygon (polygon)
- Base (base)
- And many more...
