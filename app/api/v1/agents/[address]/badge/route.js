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
  const certified = agent.score >= 85;
  const mintedAt  = agent.submittedAt || '2025-06-01T00:00:00Z';
  const expiresAt = certified
    ? new Date(new Date(mintedAt).getTime() + 90 * 86400000).toISOString()
    : null;

  return NextResponse.json({
    address,
    badge: {
      status:     certified ? 'ACTIVE' : agent.score >= 60 ? 'PENDING' : 'NOT_ISSUED',
      tier:       tier.label,
      trustScore: agent.score,
      mintedAt:   certified ? mintedAt : null,
      expiresAt,
      // Bitmask: bit 0=onchain, 1=code, 2=social, 3=aiInference, 4=governance
      checksBitmask: buildBitmask(agent.checks),
      metadataUri:   certified ? `https://arweave.net/grimwatch-seal-${address.slice(0,8)}` : null,
    },
  });
}

function buildBitmask(checks = {}) {
  const fields = ['onchain','codeAudit','socialProof','aiInference','governance'];
  return fields.reduce((mask, key, i) => mask | (checks[key] === true ? 1 << i : 0), 0);
}
