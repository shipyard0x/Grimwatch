import { NextResponse } from 'next/server';
import { MOCK_AGENTS } from '../../../../../../lib/data';
import { findSubmitted } from '../../../../../../lib/store';
import { getTier } from '../../../../../../lib/scoring';

const SOLANA_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function GET(_, { params }) {
  const { address } = params;
  if (!SOLANA_RE.test(address))
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });

  const agent =
    MOCK_AGENTS.find((a) => a.fullAddress === address || a.address === address) ||
    findSubmitted(address);

  if (!agent)
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

  const tier = getTier(agent.score);
  return NextResponse.json({
    address,
    score: agent.score,
    tier:  tier.label,
    color: tier.color,
    verified: agent.verified,
    lastUpdated: agent.updatedAt || agent.submittedAt || null,
  });
}
