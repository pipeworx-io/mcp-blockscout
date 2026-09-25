# @pipeworx/blockscout

Blockscout MCP — open-source multi-chain block explorer. ~30 networks supported via per-chain instances. No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1683+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/blockscout/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1683+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/blockscout_get_address \
  -H 'Content-Type: application/json' \
  -d '{"chain":"ethereum","address":"0x1234567890123456789012345678901234567890"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/blockscout_get_address`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "blockscout": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-blockscout"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-blockscout
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Blockscout data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
