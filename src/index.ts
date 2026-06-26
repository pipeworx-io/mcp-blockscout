interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Blockscout MCP — multi-chain block-explorer aggregate
 *
 * Each chain has its own Blockscout instance at a different host. We
 * keep a small hand-curated map of chain-slug → host. Falls through
 * gracefully if the chain isn't in the map.
 *
 * Auth: none. Most instances are rate-limited per IP.
 * Docs: https://docs.blockscout.com/devs/apis/rest
 */


const HOSTS: Record<string, string> = {
  eth: 'https://eth.blockscout.com',
  'eth-sepolia': 'https://eth-sepolia.blockscout.com',
  'eth-holesky': 'https://eth-holesky.blockscout.com',
  optimism: 'https://optimism.blockscout.com',
  'optimism-sepolia': 'https://optimism-sepolia.blockscout.com',
  polygon: 'https://polygon.blockscout.com',
  'polygon-zkevm': 'https://zkevm.blockscout.com',
  arbitrum: 'https://arbitrum.blockscout.com',
  'arbitrum-sepolia': 'https://arbitrum-sepolia.blockscout.com',
  base: 'https://base.blockscout.com',
  'base-sepolia': 'https://base-sepolia.blockscout.com',
  bnb: 'https://bnb.blockscout.com',
  gnosis: 'https://gnosis.blockscout.com',
  celo: 'https://celo.blockscout.com',
  fantom: 'https://ftm.blockscout.com',
  metis: 'https://andromeda-explorer.metis.io',
  mantle: 'https://mantle.blockscout.com',
  linea: 'https://explorer.linea.build',
  scroll: 'https://scroll.blockscout.com',
  'zksync-era': 'https://zksync.blockscout.com',
  blast: 'https://blast.blockscout.com',
  taiko: 'https://blockscoutapi.mainnet.taiko.xyz',
};

// LLMs (and the curated examples) naturally say "ethereum"/"matic"/"arb", not
// the short host-slug. Map common full/alt names onto the canonical slug so a
// natural chain name resolves instead of erroring "Unsupported chain".
const CHAIN_ALIASES: Record<string, string> = {
  ethereum: 'eth', mainnet: 'eth', 'ethereum-mainnet': 'eth',
  matic: 'polygon', 'polygon-pos': 'polygon',
  arb: 'arbitrum', 'arbitrum-one': 'arbitrum',
  op: 'optimism', 'op-mainnet': 'optimism',
  bsc: 'bnb', binance: 'bnb', 'bnb-chain': 'bnb',
  xdai: 'gnosis', ftm: 'fantom', zksync: 'zksync-era',
};

const tools: McpToolExport['tools'] = [
  {
    name: 'get_address',
    description: '"What\'s the balance of [wallet]" / "Ethereum / Polygon / Arbitrum / Base wallet info" / "address summary for [0x...]" / "what tokens does [wallet] hold" — on-chain address summary across 20+ EVM chains (Ethereum, Optimism, Polygon, Arbitrum, Base, BNB, Gnosis, Celo, zkSync, Scroll, Linea, Blast, …). Returns balance, transaction count, token-holding stats. Pass chain slug + 0x address.',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string', description: 'Chain slug (see list_chains)' },
        address: { type: 'string', description: '0x address' },
      },
      required: ['chain', 'address'],
    },
  },
  {
    name: 'get_address_txns',
    description: '"Recent transactions of [wallet]" / "tx history for [0x...]" / "what has [address] done lately" — recent transactions for an EVM address. Pass chain + 0x address; optionally filter by direction (to/from). Use for wallet-activity audit, fund-flow tracing.',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string' },
        address: { type: 'string' },
        limit: { type: 'number', description: 'Max returned (default 25, max ~50)' },
        filter: { type: 'string', description: 'to | from (default both)' },
      },
      required: ['chain', 'address'],
    },
  },
  {
    name: 'get_address_token_transfers',
    description: '"Token transfers / NFT activity for [wallet]" / "ERC-20 / ERC-721 / ERC-1155 transfers in/out of [0x...]" / "what tokens did [address] send or receive" — token transfer log for an EVM address. Use for tracing NFT activity, stablecoin flows, airdrops, or specific-token movement (filter via `token` arg).',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string' },
        address: { type: 'string' },
        token: { type: 'string', description: 'Restrict to a specific token contract' },
        limit: { type: 'number', description: 'Default 25' },
      },
      required: ['chain', 'address'],
    },
  },
  {
    name: 'get_transaction',
    description: '"Look up transaction [0xhash]" / "what happened in tx [hash]" / "decode tx [X]" — full transaction detail (from, to, value, method, status, gas, decoded calldata). Pass chain + tx_hash. Use for forensic tx analysis, MEV inspection, contract-call breakdown.',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string' },
        tx_hash: { type: 'string' },
      },
      required: ['chain', 'tx_hash'],
    },
  },
  {
    name: 'get_token',
    description: '"Token info for [contract]" / "what is contract [0x...]" / "ERC-20 / NFT metadata for [token]" — token contract metadata: name, symbol, decimals, total supply, holder count, contract type. Use for on-chain token characterization.',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string' },
        contract: { type: 'string', description: 'Token contract address' },
      },
      required: ['chain', 'contract'],
    },
  },
  {
    name: 'get_block',
    description: '"Block [N] details" / "what was in block [hash]" / "miner / proposer of block [X]" — block detail by number or hash. Returns timestamp, gas used, transaction count, miner / validator, parent / next blocks. Use for chain forensics, block-time analysis.',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string' },
        block_number_or_hash: { type: 'string' },
      },
      required: ['chain', 'block_number_or_hash'],
    },
  },
  {
    name: 'search',
    description: '"Search [chain] for [query]" / "is [string] a token / contract / address on [chain]" — universal block-explorer search across addresses, transactions, blocks, tokens, and ENS-style names on a specific EVM chain. Use when you don\'t know yet whether the input is an address / hash / token symbol.',
    inputSchema: {
      type: 'object',
      properties: {
        chain: { type: 'string' },
        query: { type: 'string' },
      },
      required: ['chain', 'query'],
    },
  },
  {
    name: 'list_chains',
    description: 'List all EVM chain slugs and Blockscout host URLs supported by this pack (20+ chains: eth, polygon, arbitrum, base, optimism, bnb, gnosis, zksync-era, etc.). Use to discover valid chain values for other tools.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  if (name === 'list_chains') {
    return { chains: Object.entries(HOSTS).map(([slug, host]) => ({ slug, host })) };
  }
  const raw = reqStr(args, 'chain', '"eth"').toLowerCase();
  const chain = CHAIN_ALIASES[raw] ?? raw;
  const host = HOSTS[chain];
  if (!host) {
    throw new Error(`Unsupported chain "${raw}". Run list_chains for supported options.`);
  }
  const base = `${host}/api/v2`;
  switch (name) {
    case 'get_address':
      return bsGet(`${base}/addresses/${encodeURIComponent(reqStr(args, 'address', '"0x..."'))}`);
    case 'get_address_txns': {
      const params = new URLSearchParams();
      if (args.filter) params.set('filter', String(args.filter));
      const q = params.toString() ? `?${params}` : '';
      const data = await bsGet(`${base}/addresses/${encodeURIComponent(reqStr(args, 'address', '"0x..."'))}/transactions${q}`);
      return capItems(data, (args.limit as number) ?? 25);
    }
    case 'get_address_token_transfers': {
      const params = new URLSearchParams();
      if (args.token) params.set('token', String(args.token));
      const q = params.toString() ? `?${params}` : '';
      const data = await bsGet(`${base}/addresses/${encodeURIComponent(reqStr(args, 'address', '"0x..."'))}/token-transfers${q}`);
      return capItems(data, (args.limit as number) ?? 25);
    }
    case 'get_transaction':
      return bsGet(`${base}/transactions/${encodeURIComponent(reqStr(args, 'tx_hash', '"0xabc..."'))}`);
    case 'get_token':
      return bsGet(`${base}/tokens/${encodeURIComponent(reqStr(args, 'contract', '"0x..."'))}`);
    case 'get_block':
      return bsGet(`${base}/blocks/${encodeURIComponent(reqStr(args, 'block_number_or_hash', '"18000000"'))}`);
    case 'search':
      return bsGet(`${base}/search?q=${encodeURIComponent(reqStr(args, 'query', '"vitalik.eth"'))}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function capItems(data: unknown, limit: number) {
  if (data && typeof data === 'object' && 'items' in (data as Record<string, unknown>)) {
    const items = (data as { items: unknown[] }).items ?? [];
    return { ...(data as object), items: items.slice(0, limit) };
  }
  return data;
}

async function bsGet(url: string) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'pipeworx-mcp-blockscout/1.0 (+https://pipeworx.io)',
    },
  });
  if (res.status === 404) throw new Error('Blockscout: not found');
  if (res.status === 429) throw new Error('Blockscout: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Blockscout error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
