import { NextResponse } from 'next/server';
import { getAllSubmitted, upsertAgent } from '../../../../lib/store';
import { API_KEY } from '../../../../lib/solana/helius';
import { runScan } from '../../../../lib/scan';

const SOLANA_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

// Re-seed every 30 minutes to stay fresh with live Solana data
let lastSeedTime = 0;
const SEED_INTERVAL_MS = 30 * 60 * 1000;

// ── GET /api/v1/agents ────────────────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  const search = (searchParams.get('search') || '').toLowerCase();

  // Trigger auto-discovery on first load or every 30 minutes
  const now = Date.now();
  if (now - lastSeedTime > SEED_INTERVAL_MS) {
    lastSeedTime = now;
    fetch(new URL('/api/v1/agents/seed', request.url).toString()).catch(() => {});
  }

  // Only serve live data from the store — no static mock agents
  const submitted = getAllSubmitted();
  const base = submitted;

  let agents = base;

  if (search) {
    agents = agents.filter(
      (a) =>
        a.name?.toLowerCase().includes(search) ||
        a.ticker?.toLowerCase().includes(search) ||
        a.address?.toLowerCase().includes(search) ||
        a.fullAddress?.toLowerCase().includes(search) ||
        a.category?.toLowerCase().includes(search)
    );
  }

  if (filter === 'verified')   agents = agents.filter((a) => a.verified === true);
  if (filter === 'unverified') agents = agents.filter((a) => a.verified === false);
  if (filter === 'pending')    agents = agents.filter((a) => a.verified === 'pending');

  return NextResponse.json({ agents, total: agents.length });
}

// ── POST /api/v1/agents ───────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const address = body.address?.trim();

    if (!address) {
      return NextResponse.json({ error: 'Contract address is required' }, { status: 400 });
    }
    if (!SOLANA_RE.test(address)) {
      return NextResponse.json({ error: 'Invalid Solana address format' }, { status: 400 });
    }

    // Save a "scanning" placeholder immediately so it shows up in the Explorer
    const placeholder = {
      id: `live-${address.slice(0, 8)}`,
      name: body.name || `${address.slice(0, 6)}...${address.slice(-4)}`,
      ticker: body.ticker ? `$${body.ticker}` : '—',
      address: `${address.slice(0, 4)}...${address.slice(-4)}`,
      fullAddress: address,
      verified: 'pending',
      score: 0,
      category: body.category || 'Unknown',
      description: body.description || 'Verification in progress...',
      chain_activity: { txCount: 0, lastTx: '—', contractCalls: 0, uniqueInteractions: 0 },
      code_verified: false,
      social: { twitter: body.twitter || null, followers: '—', github: body.github || null, stars: 0 },
      checks: { onchain: false, codeAudit: false, socialProof: false, aiInference: false, governance: false },
      launchDate: '—',
      mcap: '—',
      volume24h: '—',
      logo: (body.name || address)[0].toUpperCase(),
      _status: 'scanning',
    };
    upsertAgent(placeholder);

    // Run full live scan if Helius key is available
    if (API_KEY) {
      runScan(address, placeholder).catch(console.error);
    }

    return NextResponse.json({
      message: 'Agent submitted — scan started',
      address,
      estimatedTime: API_KEY ? '~10 seconds' : 'No Helius key configured',
      status: 'scanning',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
