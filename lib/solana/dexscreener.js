/**
 * DexScreener API helper — free, no API key needed.
 * Covers all Solana DEXes including pump.fun, Raydium, Orca, Meteora.
 */

export async function getDexScreenerData(tokenAddress) {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
      { next: { revalidate: 60 } } // cache 60s in Next.js
    );
    if (!res.ok) return null;
    const data = await res.json();

    // May return multiple pairs — pick the one with highest liquidity
    const pairs = data?.pairs;
    if (!Array.isArray(pairs) || pairs.length === 0) return null;

    const pair = pairs.sort(
      (a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
    )[0];

    const mcapRaw = pair.marketCap || pair.fdv || null;
    const vol24h  = pair.volume?.h24 || null;
    const createdAt = pair.pairCreatedAt || null; // ms timestamp

    return {
      mcap:       mcapRaw != null ? formatUsd(mcapRaw) : null,
      volume24h:  vol24h  != null ? formatUsd(vol24h)  : null,
      launchDate: createdAt ? new Date(createdAt).toISOString().slice(0, 10) : null,
      price:      pair.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(8)}` : null,
      dex:        pair.dexId || null,
      pairAddress: pair.pairAddress || null,
      liquidity:  pair.liquidity?.usd ? formatUsd(pair.liquidity.usd) : null,
      priceChange24h: pair.priceChange?.h24 ?? null,
    };
  } catch {
    return null;
  }
}

function formatUsd(n) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}
