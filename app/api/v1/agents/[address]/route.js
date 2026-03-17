/**
 * GET /api/v1/agents/[address]
 *
 * Returns a full verification report for a Solana address.
 * - If the address matches a mock agent, returns its data immediately.
 * - If HELIUS_API_KEY is set and it's a real Solana address, runs live analysis.
 * - Otherwise returns a "no data" response.
 */

import { NextResponse } from "next/server";
import { MOCK_AGENTS } from "../../../../../lib/data.js";
import { findSubmitted } from "../../../../../lib/store.js";
import { analyzeOnChain, onchainCheckPassed } from "../../../../../lib/verification/onchain.js";
import { analyzeSocial, socialCheckPassed } from "../../../../../lib/verification/social.js";
import { getTier, statusColor, statusLabel } from "../../../../../lib/scoring.js";
import { getTokenMetadata, getLargestTokenAccounts, getTokenSupply, API_KEY } from "../../../../../lib/solana/helius.js";
import { getDexScreenerData } from "../../../../../lib/solana/dexscreener.js";

const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function GET(request, { params }) {
  const { address } = params;

  // ── Validate ────────────────────────────────────────────────────────────
  if (!SOLANA_ADDRESS_RE.test(address)) {
    return NextResponse.json(
      { error: "Invalid Solana address format" },
      { status: 400 }
    );
  }

  // ── Check mock data first ────────────────────────────────────────────────
  const mock = MOCK_AGENTS.find(
    (a) =>
      a.fullAddress === address ||
      a.address === address ||
      a.fullAddress?.toLowerCase() === address.toLowerCase()
  );
  if (mock) {
    return NextResponse.json({ source: "mock", agent: mock });
  }

  // ── Check submitted/scanned agents store ─────────────────────────────────
  const stored = findSubmitted(address);
  if (stored) {
    return NextResponse.json({ source: "store", agent: stored });
  }

  // ── Live Helius analysis ─────────────────────────────────────────────────
  if (!API_KEY) {
    return NextResponse.json(
      {
        error: "HELIUS_API_KEY not configured",
        hint: "Add HELIUS_API_KEY to your .env.local file to enable live analysis.",
        address,
      },
      { status: 503 }
    );
  }

  try {
    // Run all data fetches in parallel — each has its own fallback so one failure can't break the whole scan
    const fallbackOnchain = { score: 0, txCount: 0, accountAgeDays: 0, uniquePrograms: 0, details: [] };
    const fallbackSocial  = { score: 0, githubFound: false, repoName: null, stars: 0, twitterHandle: null, details: [] };

    const [onchainEvidence, tokenMeta, tokenSupply, dex] = await Promise.all([
      analyzeOnChain(address).catch(() => fallbackOnchain),
      getTokenMetadata(address).catch(() => null),
      getTokenSupply(address).catch(() => null),
      getDexScreenerData(address).catch(() => null),
    ]);

    // Social analysis — use token metadata name as hint if available
    const tokenName = tokenMeta?.content?.metadata?.name || tokenMeta?.name || null;
    const tokenSymbol = tokenMeta?.content?.metadata?.symbol || tokenMeta?.symbol || null;

    // Try to find GitHub from token metadata description or links
    const externalLinks = tokenMeta?.content?.links || {};
    const githubHint = externalLinks.github || null;
    const twitterHint = externalLinks.twitter || externalLinks.x || null;

    const socialEvidence = await analyzeSocial(
      { github: githubHint, twitter: twitterHint },
      tokenName || address.slice(0, 8)
    ).catch(() => fallbackSocial);

    // ── Build check results ─────────────────────────────────────────────
    const checks = {
      onchain: onchainCheckPassed(onchainEvidence),
      codeAudit: false,        // requires Anchor IDL lookup (Phase 2)
      socialProof: socialCheckPassed(socialEvidence),
      aiInference: false,      // requires compute unit analysis (Phase 2)
      governance: false,       // requires Realms/Squads lookup (Phase 2)
    };

    // ── Compute trust score ─────────────────────────────────────────────
    // Weight sub-scores: onchain=20, social=20, rest=0 for now
    // Normalise: score is out of the checks we CAN run (2 × 20 = 40 max -> scale to 100)
    const rawScore = (onchainEvidence.score || 0) + (socialEvidence.score || 0); // 0-40
    const score = isNaN(rawScore) ? 0 : Math.min(Math.round((rawScore / 40) * 60), 60);

    const tier = getTier(score);

    // ── Top holder concentration ─────────────────────────────────────────
    let topHolderPct = null;
    if (tokenSupply?.uiAmount) {
      const largestAccounts = await getLargestTokenAccounts(address, 10);
      if (largestAccounts.length > 0) {
        const top10Total = largestAccounts.reduce(
          (s, a) => s + (parseFloat(a.uiAmount) || 0),
          0
        );
        topHolderPct = Math.round((top10Total / tokenSupply.uiAmount) * 100);
      }
    }

    // ── Build response ──────────────────────────────────────────────────
    const agent = {
      id: null,
      name: tokenName || `Unknown (${address.slice(0, 6)}...)`,
      ticker: tokenSymbol ? `$${tokenSymbol}` : "—",
      address: `${address.slice(0, 4)}...${address.slice(-4)}`,
      fullAddress: address,
      verified: score >= 85 ? true : score >= 60 ? "pending" : false,
      score,
      category: "Unknown",
      description: tokenMeta?.content?.metadata?.description || "No description available.",
      chain_activity: {
        txCount: onchainEvidence.txCount,
        lastTx: onchainEvidence.accountAgeDays
          ? `${onchainEvidence.accountAgeDays} days active`
          : "unknown",
        contractCalls: 0,
        uniqueInteractions: onchainEvidence.uniquePrograms || 0,
      },
      code_verified: false,
      social: {
        twitter: socialEvidence.twitterHandle || null,
        followers: "—",
        github: socialEvidence.repoName || null,
        stars: socialEvidence.stars || 0,
      },
      checks,
      launchDate: dex?.launchDate
        || tokenMeta?.content?.metadata?.attributes?.find(
             (a) => a.trait_type === "launch_date"
           )?.value
        || null,
      mcap:      dex?.mcap      || "—",
      volume24h: dex?.volume24h || "—",
      price:     dex?.price     || null,
      dex:       dex?.dex       || null,
      liquidity: dex?.liquidity || null,
      priceChange24h: dex?.priceChange24h ?? null,
      logo: tokenName ? tokenName[0].toUpperCase() : "?",

      // Extra live data
      _live: true,
      _onchainEvidence: onchainEvidence,
      _socialEvidence: socialEvidence,
      _topHolderPct: topHolderPct,
      _tier: tier,
    };

    return NextResponse.json({ source: "live", agent });
  } catch (err) {
    console.error("[verify]", err);
    return NextResponse.json(
      { error: "Verification failed", details: err.message },
      { status: 500 }
    );
  }
}
