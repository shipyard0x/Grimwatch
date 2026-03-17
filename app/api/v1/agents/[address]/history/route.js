import { NextResponse } from 'next/server';
import { MOCK_AGENTS } from '../../../../../../lib/data';
import { findSubmitted } from '../../../../../../lib/store';

const SOLANA_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

// In production this would be a DB query. For now we synthesise a plausible
// history from the agent's current score and launch date.
export async function GET(_, { params }) {
  const { address } = params;
  if (!SOLANA_RE.test(address))
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });

  const agent =
    MOCK_AGENTS.find((a) => a.fullAddress === address || a.address === address) ||
    findSubmitted(address);

  if (!agent)
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

  const current = agent.score;
  const now     = Date.now();

  // Generate synthetic 30-day history trending toward current score
  const history = Array.from({ length: 30 }, (_, i) => {
    const daysAgo = 29 - i;
    const base    = Math.max(0, current - Math.floor(Math.random() * 15));
    const noise   = Math.floor(Math.random() * 8) - 4;
    const score   = Math.min(100, Math.max(0, base + noise));
    return {
      date:  new Date(now - daysAgo * 86400000).toISOString().split('T')[0],
      score,
      tier:  score >= 85 ? 'CERTIFIED' : score >= 60 ? 'PENDING' : score >= 30 ? 'INCONCLUSIVE' : 'LARP',
    };
  });
  // Ensure last entry matches real score
  history[29].score = current;

  return NextResponse.json({ address, history });
}
