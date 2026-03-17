/**
 * Shared agent scan logic.
 * Used by both the manual submit endpoint and the auto-seed endpoint.
 */

import { upsertAgent } from './store.js';
import { analyzeOnChain, onchainCheckPassed } from './verification/onchain.js';
import { analyzeSocial, socialCheckPassed } from './verification/social.js';
import { getTier } from './scoring.js';
import {
  getTokenMetadata,
  getTokenSupply,
  getLargestTokenAccounts,
} from './solana/helius.js';
import { getDexScreenerData } from './solana/dexscreener.js';

/**
 * Run a full on-chain + social scan for a single address.
 * Saves the result (or error) to the store when done.
 *
 * @param {string} address  - Solana token mint address
 * @param {object} base     - Placeholder agent object already in the store
 */
export async function runScan(address, base) {
  try {
    const [onchainEvidence, tokenMeta, tokenSupply, dex] = await Promise.all([
      analyzeOnChain(address),
      getTokenMetadata(address).catch(() => null),
      getTokenSupply(address).catch(() => null),
      getDexScreenerData(address).catch(() => null),
    ]);

    const tokenName =
      tokenMeta?.content?.metadata?.name || tokenMeta?.name || base.name;
    const tokenSymbol =
      tokenMeta?.content?.metadata?.symbol || tokenMeta?.symbol || null;

    const externalLinks = tokenMeta?.content?.links || {};
    const githubHint = externalLinks.github || base.social?.github || null;
    const twitterHint =
      externalLinks.twitter || externalLinks.x || base.social?.twitter || null;

    const socialEvidence = await analyzeSocial(
      { github: githubHint, twitter: twitterHint },
      tokenName
    );

    const checks = {
      onchain: onchainCheckPassed(onchainEvidence),
      codeAudit: false,
      socialProof: socialCheckPassed(socialEvidence),
      aiInference: false,
      governance: false,
    };

    // raw score is 0-40 (onchain 0-20, social 0-20); scale to 0-60
    const rawScore = onchainEvidence.score + socialEvidence.score;
    const score = Math.min(Math.round((rawScore / 40) * 60), 60);
    const tier = getTier(score);

    let topHolderPct = null;
    if (tokenSupply?.uiAmount) {
      const largest = await getLargestTokenAccounts(address, 10).catch(() => []);
      if (largest.length > 0) {
        const top10 = largest.reduce(
          (s, a) => s + (parseFloat(a.uiAmount) || 0),
          0
        );
        topHolderPct = Math.round((top10 / tokenSupply.uiAmount) * 100);
      }
    }

    const updated = {
      ...base,
      name: tokenName,
      ticker: tokenSymbol ? `$${tokenSymbol}` : base.ticker,
      logo: tokenName ? tokenName[0].toUpperCase() : base.logo,
      verified: score >= 85 ? true : score >= 60 ? 'pending' : false,
      score,
      description:
        tokenMeta?.content?.metadata?.description ||
        base.description ||
        `Solana AI agent token — ${tokenName}.`,
      chain_activity: {
        txCount: onchainEvidence.txCount,
        lastTx: onchainEvidence.accountAgeDays
          ? `${onchainEvidence.accountAgeDays}d active`
          : '—',
        contractCalls: 0,
        uniqueInteractions: onchainEvidence.uniquePrograms || 0,
      },
      social: {
        twitter: twitterHint,
        followers: '—',
        github: socialEvidence.repoName || githubHint,
        stars: socialEvidence.stars || 0,
      },
      checks,
      mcap: dex?.mcap || base.mcap,
      volume24h: dex?.volume24h || base.volume24h,
      launchDate: dex?.launchDate || base.launchDate,
      _status: 'complete',
      _tier: tier,
      _topHolderPct: topHolderPct,
      _onchainEvidence: onchainEvidence,
      _socialEvidence: socialEvidence,
    };

    upsertAgent(updated);
  } catch (err) {
    upsertAgent({ ...base, _status: 'error', _error: err.message });
  }
}

/**
 * Scan a batch of agents concurrently (max `concurrency` at a time).
 *
 * @param {Array<{address: string, base: object}>} items
 * @param {number} concurrency
 */
export async function runScanBatch(items, concurrency = 4) {
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    await Promise.all(batch.map(({ address, base }) => runScan(address, base)));
  }
}
