import { NextResponse } from 'next/server';
import { MOCK_AGENTS } from '../../../../lib/data';
import { getAllSubmitted } from '../../../../lib/store';

export async function GET() {
  const submitted = getAllSubmitted();
  const submittedAddresses = new Set(submitted.map((a) => a.fullAddress));
  const all = [
    ...MOCK_AGENTS.filter((a) => !submittedAddresses.has(a.fullAddress)),
    ...submitted,
  ];

  const certified    = all.filter((a) => a.verified === true).length;
  const pending      = all.filter((a) => a.verified === 'pending').length;
  const larps        = all.filter((a) => a.verified === false && a.score < 30).length;
  const avgScore     = all.length
    ? Math.round(all.reduce((s, a) => s + (a.score || 0), 0) / all.length)
    : 0;

  return NextResponse.json({
    totalScanned:   all.length,
    certified,
    pending,
    larpsDetected:  larps,
    avgTrustScore:  avgScore,
    lastUpdated:    new Date().toISOString(),
  });
}
