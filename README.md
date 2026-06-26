# mcp-blockscout

Blockscout MCP — multi-chain block-explorer aggregate

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 965+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_address` | "What\'s the balance of [wallet]" / "Ethereum / Polygon / Arbitrum / Base wallet info" / "address summary for [0x...]" / "what tokens does [wallet] hold" — on-chain address summary across 20+ EVM chains (Ethereum, Optimism, Polygon, Arbitrum, Base, BNB, Gnosis, Celo, zkSync, Scroll, Linea, Blast, …). Returns balance, transaction count, token-holding stats. Pass chain slug + 0x address. |
| `get_address_txns` | "Recent transactions of [wallet]" / "tx history for [0x...]" / "what has [address] done lately" — recent transactions for an EVM address. Pass chain + 0x address; optionally filter by direction (to/from). Use for wallet-activity audit, fund-flow tracing. |
| `get_address_token_transfers` | "Token transfers / NFT activity for [wallet]" / "ERC-20 / ERC-721 / ERC-1155 transfers in/out of [0x...]" / "what tokens did [address] send or receive" — token transfer log for an EVM address. Use for tracing NFT activity, stablecoin flows, airdrops, or specific-token movement (filter via `token` arg). |
| `get_transaction` | "Look up transaction [0xhash]" / "what happened in tx [hash]" / "decode tx [X]" — full transaction detail (from, to, value, method, status, gas, decoded calldata). Pass chain + tx_hash. Use for forensic tx analysis, MEV inspection, contract-call breakdown. |
| `get_token` | "Token info for [contract]" / "what is contract [0x...]" / "ERC-20 / NFT metadata for [token]" — token contract metadata: name, symbol, decimals, total supply, holder count, contract type. Use for on-chain token characterization. |
| `get_block` | "Block [N] details" / "what was in block [hash]" / "miner / proposer of block [X]" — block detail by number or hash. Returns timestamp, gas used, transaction count, miner / validator, parent / next blocks. Use for chain forensics, block-time analysis. |
| `search` | "Search [chain] for [query]" / "is [string] a token / contract / address on [chain]" — universal block-explorer search across addresses, transactions, blocks, tokens, and ENS-style names on a specific EVM chain. Use when you don\'t know yet whether the input is an address / hash / token symbol. |
| `list_chains` | List all EVM chain slugs and Blockscout host URLs supported by this pack (20+ chains: eth, polygon, arbitrum, base, optimism, bnb, gnosis, zksync-era, etc.). Use to discover valid chain values for other tools. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "blockscout": {
      "url": "https://gateway.pipeworx.io/blockscout/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 965+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Blockscout data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
