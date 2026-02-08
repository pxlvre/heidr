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

Get current gas prices for any supported chain.

**Usage:** `heidr gas [options]`

**Options:**

- `-c, --chain <chain>` - Chain to query (default: mainnet)
- `-j, --json` - Output as JSON

**Examples:**

```bash
heidr gas
heidr gas --chain arbitrum
heidr gas --chain optimism --json
```

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
