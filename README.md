# @pipeworx/blockscout

Blockscout MCP — open-source multi-chain block explorer. ~30 networks supported via per-chain instances. No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `get_address(chain, address)` — address summary (balance, txn counts, token holdings)
- `get_address_txns(chain, address, limit?, filter?)` — transactions for an address
- `get_address_token_transfers(chain, address, limit?, token?)` — ERC-20/721/1155 transfers
- `get_transaction(chain, tx_hash)` — full tx detail
- `get_token(chain, contract)` — token contract metadata
- `get_block(chain, block_number_or_hash)` — block detail
- `search(chain, query)` — universal search (address, tx, block, token)
- `list_chains()` — built-in chain ID list

## Supported chains

`eth`, `eth-sepolia`, `eth-holesky`, `optimism`, `optimism-sepolia`, `polygon`, `polygon-zkevm`, `arbitrum`, `arbitrum-sepolia`, `base`, `base-sepolia`, `bnb`, `bnb-testnet`, `gnosis`, `celo`, `celo-alfajores`, `fantom`, `metis`, `mantle`, `linea`, `scroll`, `zksync-era`, `blast`, `polygon-zkevm-testnet`, `boba`, `redstone`, `taiko`. Pass `chain` as one of these slugs.

## Data source

Per-chain Blockscout v2 REST: `https://<chain-host>/api/v2/`. Hosts maintained at https://www.blockscout.com/chains-and-projects.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
