const WEIGHTS = {
  'DeFi Agent': { onchain: 1.2, code: 1.3, social: 0.8, aiInference: 1.2, governance: 0.9 },
  'Social Agent': { onchain: 0.9, code: 1.0, social: 1.3, aiInference: 1.1, governance: 1.0 },
  'Trading Bot': { onchain: 1.3, code: 1.2, social: 0.7, aiInference: 1.3, governance: 0.8 },
  'Data Agent': { onchain: 1.0, code: 1.1, social: 0.9, aiInference: 1.2, governance: 1.0 },
  'default': { onchain: 1.0, code: 1.0, social: 1.0, aiInference: 1.0, governance: 1.0 },
};

export function calculateScore(agent) {
  const weights = WEIGHTS[agent.category] || WEIGHTS['default'];
  const checks = agent.checks;

  const checkValue = (val) => {
    if (val === true) return 1.0;
    if (val === 'partial') return 0.5;
    return 0.0;
  };

  const raw =
    checkValue(checks.onchain) * weights.onchain * 20 +
    checkValue(checks.codeAudit) * weights.code * 20 +
    checkValue(checks.socialProof) * weights.social * 20 +
    checkValue(checks.aiInference) * weights.aiInference * 20 +
    checkValue(checks.governance) * weights.governance * 20;

  const maxPossible =
    weights.onchain * 20 +
    weights.code * 20 +
    weights.social * 20 +
    weights.aiInference * 20 +
    weights.governance * 20;

  return Math.round((raw / maxPossible) * 100);
}

export function getTier(score) {
  if (score >= 85) return { label: 'SEALED', color: '#4ADE80', bg: 'rgba(74,222,128,0.08)' };
  if (score >= 60) return { label: 'WANING', color: '#D4A843', bg: 'rgba(212,168,67,0.08)' };
  if (score >= 30) return { label: 'OBSCURED', color: '#555555', bg: 'rgba(85,85,85,0.08)' };
  return { label: 'VOID', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' };
}

export function statusColor(verified) {
  if (verified === true) return '#4ADE80';
  if (verified === 'pending') return '#D4A843';
  return '#DC2626';
}

export function statusLabel(verified) {
  if (verified === true) return 'SEALED';
  if (verified === 'pending') return 'WANING';
  return 'VOID';
}

export function scoreColor(score) {
  if (score >= 80) return '#4ADE80';
  if (score >= 50) return '#D4A843';
  return '#DC2626';
}
