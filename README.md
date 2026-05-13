# mcp-blockscout

Blockscout MCP — multi-chain block-explorer aggregate

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_address` | Address summary — balance, tx counts, token-holding stats. |
| `get_address_txns` | Recent transactions for an address. |
| `get_address_token_transfers` | ERC-20/721/1155 transfers to/from an address. |
| `get_transaction` | Full transaction detail. |
| `get_token` | Token contract metadata. |
| `get_block` | Block detail by number or hash. |
| `search` | Universal search across addresses, txns, blocks, tokens. |
| `list_chains` | List supported chain slugs and hosts. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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
