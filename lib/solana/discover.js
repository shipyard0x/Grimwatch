/**
 * Discover Solana AI agent tokens via DexScreener search.
 * No API key required — uses the free public search endpoint.
 *
 * Returns up to `limit` token candidates sorted by 24h volume,
 * filtering out dust (< $5K liquidity) and non-Solana pairs.
 */

const SEARCH_QUERIES = [
  'ai agent',
  'ai16z',
  'eliza',
  'autonomous agent',
  'degenai',
  'griffain',
  'zerebro',
  'virtual protocol',
  'arc agent',
  'cookie dao',
  'neur',
  'swarm agent',
  'sentient',
  'chaos terminal',
  'hive mind',
  'agent protocol',
  'solana ai',
  'agent token',
  'vvaifu',
  'goat agent',
];

const MIN_LIQUIDITY_USD = 2_000;

// Keywords that must appear in the token name OR ticker for it to qualify
const AI_AGENT_KEYWORDS = [
  'ai', 'agent', 'eliza', 'gpt', 'llm', 'neural', 'bot', 'mind', 'brain',
  'autonomous', 'sentient', 'protocol', 'terminal', 'swarm', 'hive', 'neur',
  'zerebro', 'griffain', 'degenai', 'vvaifu', 'goat', 'arc', 'cookie',
  'virtual', 'framework', 'inference', 'oracle', 'network', 'dao',
];

// Obvious junk to reject regardless of other signals
const JUNK_PATTERNS = [
  /^just /i, /memecoin/i, /useless/i, /horse$/i, /inu$/i, /fish/i,
  /^sol\s/i, /^baby/i, /^moon/i, /^pepe/i, /^doge/i, /^shib/i,
];

function isAiAgentToken(name, ticker) {
  const combined = `${name} ${ticker}`.toLowerCase();
  // Reject obvious junk
  if (JUNK_PATTERNS.some((re) => re.test(combined))) return false;
  // Must match at least one AI keyword
  return AI_AGENT_KEYWORDS.some((kw) => combined.includes(kw));
}

export async function discoverAiAgentTokens(limit = 50) {
  const seen = new Set();
  const candidates = [];

  for (const q of SEARCH_QUERIES) {
    try {
      const res = await fetch(
        `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`,
        { next: { revalidate: 300 } } // cache 5 min in Next.js
      );
      if (!res.ok) continue;

      const data = await res.json();
      const pairs = data?.pairs || [];

      for (const pair of pairs) {
        if (pair.chainId !== 'solana') continue;

        const addr = pair.baseToken?.address;
        if (!addr || seen.has(addr)) continue;

        const liquidity = pair.liquidity?.usd || 0;
        if (liquidity < MIN_LIQUIDITY_USD) continue;

        const name = pair.baseToken?.name || addr.slice(0, 8);
        const ticker = pair.baseToken?.symbol || '?';

        // Only keep tokens that look like AI agents
        if (!isAiAgentToken(name, ticker)) continue;

        seen.add(addr);
        candidates.push({
          address: addr,
          name,
          ticker,
          volume24h: pair.volume?.h24 || 0,
          liquidity,
          mcap: pair.marketCap || pair.fdv || 0,
          dex: pair.dexId || null,
          pairAddress: pair.pairAddress || null,
        });
      }
    } catch {
      // ignore per-query failures
    }
  }

  return candidates
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, limit);
}
