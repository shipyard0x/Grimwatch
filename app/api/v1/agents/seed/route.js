/**
 * GET /api/v1/agents/seed
 *
 * Discovers Solana AI agent tokens from DexScreener, saves placeholder
 * entries immediately, then runs full Helius scans in the background.
 * Returns the list of newly discovered addresses.
 *
 * Safe to call repeatedly — already-known addresses are skipped.
 */

import { NextResponse } from 'next/server';
import { discoverAiAgentTokens } from '../../../../../lib/solana/discover';
import { getAllSubmitted, upsertAgent } from '../../../../../lib/store';
import { MOCK_AGENTS } from '../../../../../lib/data';
import { runScanBatch } from '../../../../../lib/scan';
import { API_KEY } from '../../../../../lib/solana/helius';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Build set of already-indexed addresses
    const submitted = getAllSubmitted();
    const knownAddresses = new Set([
      ...MOCK_AGENTS.map((a) => a.fullAddress),
      ...submitted.map((a) => a.fullAddress),
    ]);

    // Discover candidates from DexScreener
    const candidates = await discoverAiAgentTokens(50);
    const newOnes = candidates.filter((c) => !knownAddresses.has(c.address));

    if (newOnes.length === 0) {
      return NextResponse.json({
        message: 'No new agents found — all discovered tokens already indexed',
        discovered: 0,
        total: knownAddresses.size,
      });
    }

    // Save placeholder entries immediately so they appear in the Explorer
    const placeholders = newOnes.map((c, i) => ({
      id: `live-${c.address.slice(0, 8)}-${Date.now() + i}`,
      name: c.name,
      ticker: `$${c.ticker}`,
      address: `${c.address.slice(0, 4)}...${c.address.slice(-4)}`,
      fullAddress: c.address,
      verified: 'pending',
      score: 0,
      category: 'AI Agent',
      description: 'Live scan in progress — fetching on-chain data...',
      chain_activity: { txCount: 0, lastTx: '—', contractCalls: 0, uniqueInteractions: 0 },
      code_verified: false,
      social: { twitter: null, followers: '—', github: null, stars: 0 },
      checks: { onchain: false, codeAudit: false, socialProof: false, aiInference: false, governance: false },
      launchDate: '—',
      mcap: '—',
      volume24h: '—',
      logo: (c.name[0] || '?').toUpperCase(),
      _status: 'scanning',
      _discoveredAt: new Date().toISOString(),
    }));

    placeholders.forEach((p) => upsertAgent(p));

    // Fire full scans in the background (non-blocking)
    if (API_KEY) {
      const items = newOnes.map((c, i) => ({ address: c.address, base: placeholders[i] }));
      runScanBatch(items, 4).catch(console.error);
    }

    return NextResponse.json({
      message: `Seeding ${newOnes.length} new agent${newOnes.length > 1 ? 's' : ''}`,
      discovered: newOnes.length,
      scanning: API_KEY ? true : false,
      agents: newOnes.map((c) => ({
        address: c.address,
        name: c.name,
        ticker: c.ticker,
        volume24h: c.volume24h,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
