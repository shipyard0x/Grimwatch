/**
 * On-Chain Activity Analysis Module — scores 0–20
 *
 * Analyzes:
 *  - Transaction count & frequency (24/7 vs human patterns)
 *  - CPI depth (inner instructions depth)
 *  - Program interaction diversity
 *  - Account age
 *  - Adaptive behavior (strategy variance over time)
 */

import {
  getSignatures,
  getEnhancedTransactions,
  isProgramAddress,
  getProgramUpgradeAuthority,
} from "../solana/helius.js";

/**
 * Main entry point — runs all on-chain checks and returns a score 0-20
 * plus detailed evidence.
 */
export async function analyzeOnChain(address) {
  const evidence = {
    txCount: 0,
    accountAgeDays: 0,
    avgTxPerDay: 0,
    cpiDepthAvg: 0,
    uniquePrograms: 0,
    hasNightGap: false,        // true = human-like sleep pattern
    isExecutable: false,
    upgradeAuthority: null,
    score: 0,
    details: [],
  };

  try {
    // 1. Fetch up to 1000 signatures (lightweight)
    const signatures = await getSignatures(address, 1000);
    evidence.txCount = signatures.length;

    if (signatures.length === 0) {
      evidence.details.push("No transactions found for this address.");
      return evidence;
    }

    // 2. Account age
    const oldest = signatures[signatures.length - 1];
    const newest = signatures[0];
    const oldestTs = oldest.blockTime || Date.now() / 1000;
    const newestTs = newest.blockTime || Date.now() / 1000;
    const ageSeconds = newestTs - oldestTs;
    evidence.accountAgeDays = Math.floor(ageSeconds / 86400);
    evidence.avgTxPerDay =
      evidence.accountAgeDays > 0
        ? Math.round(signatures.length / evidence.accountAgeDays)
        : signatures.length;

    // 3. Detect human sleep patterns (gap > 6 hours in timestamps)
    const timestamps = signatures
      .map((s) => s.blockTime)
      .filter(Boolean)
      .sort((a, b) => a - b);
    let maxGapHours = 0;
    for (let i = 1; i < timestamps.length; i++) {
      const gapHours = (timestamps[i] - timestamps[i - 1]) / 3600;
      if (gapHours > maxGapHours) maxGapHours = gapHours;
    }
    evidence.hasNightGap = maxGapHours > 6;

    // 4. Fetch 50 enhanced txs for deeper analysis (CPI depth, programs)
    const enhanced = await getEnhancedTransactions(address, 50);
    if (enhanced && enhanced.length > 0) {
      // CPI depth: count levels of inner instructions
      const cpiDepths = enhanced.map((tx) => {
        const inner = tx.instructions?.filter((i) => i.innerInstructions)?.length || 0;
        // Also check innerInstructions array depth
        const maxDepth = tx.instructions?.reduce((max, ix) => {
          const depth = ix.innerInstructions ? countDepth(ix.innerInstructions) : 0;
          return Math.max(max, depth);
        }, 0) || 0;
        return Math.max(inner, maxDepth, 1);
      });
      evidence.cpiDepthAvg =
        cpiDepths.reduce((a, b) => a + b, 0) / cpiDepths.length;

      // Unique programs interacted with
      const programs = new Set();
      enhanced.forEach((tx) => {
        tx.instructions?.forEach((ix) => {
          if (ix.programId) programs.add(ix.programId);
        });
        // Also check accountData for program interactions
        tx.accountData?.forEach((acc) => {
          if (acc.account) programs.add(acc.account);
        });
      });
      evidence.uniquePrograms = programs.size;

      // Strategy variance: check if transaction types change over time
      const txTypes = enhanced.map((tx) => tx.type || "UNKNOWN");
      const uniqueTypes = new Set(txTypes).size;
      evidence.strategyVariance = uniqueTypes;
    }

    // 5. Check if address is an executable program
    evidence.isExecutable = await isProgramAddress(address);
    if (evidence.isExecutable) {
      evidence.upgradeAuthority = await getProgramUpgradeAuthority(address);
    }

    // ── Scoring ──────────────────────────────────────────────────────────
    let score = 0;

    // Transaction count (0-5 pts)
    if (evidence.txCount >= 10000) score += 5;
    else if (evidence.txCount >= 1000) score += 4;
    else if (evidence.txCount >= 500) score += 3;
    else if (evidence.txCount >= 100) score += 2;
    else if (evidence.txCount >= 10) score += 1;

    // Account age (0-3 pts)
    if (evidence.accountAgeDays >= 90) score += 3;
    else if (evidence.accountAgeDays >= 30) score += 2;
    else if (evidence.accountAgeDays >= 7) score += 1;

    // No human sleep gap = autonomous (0-3 pts)
    if (!evidence.hasNightGap) score += 3;
    else if (maxGapHours < 8) score += 1;

    // CPI depth (0-3 pts) — real agents make complex multi-step calls
    if (evidence.cpiDepthAvg >= 3) score += 3;
    else if (evidence.cpiDepthAvg >= 2) score += 2;
    else if (evidence.cpiDepthAvg >= 1) score += 1;

    // Program diversity (0-3 pts)
    if (evidence.uniquePrograms >= 10) score += 3;
    else if (evidence.uniquePrograms >= 5) score += 2;
    else if (evidence.uniquePrograms >= 2) score += 1;

    // Is a deployed program (0-2 pts)
    if (evidence.isExecutable) score += 2;

    // Strategy variance (0-1 pt)
    if (evidence.strategyVariance >= 3) score += 1;

    evidence.score = Math.min(score, 20);

    // Human-readable details
    evidence.details.push(`${evidence.txCount.toLocaleString()} transactions found`);
    evidence.details.push(`Account active for ${evidence.accountAgeDays} days`);
    evidence.details.push(
      evidence.hasNightGap
        ? `Human-like pattern detected (max gap: ${maxGapHours.toFixed(1)}h)`
        : "Autonomous 24/7 activity pattern detected"
    );
    if (enhanced?.length) {
      evidence.details.push(`Avg CPI depth: ${evidence.cpiDepthAvg.toFixed(1)}`);
      evidence.details.push(`Unique programs interacted: ${evidence.uniquePrograms}`);
    }
    if (evidence.isExecutable) {
      evidence.details.push("Address is a deployed Solana program");
      if (evidence.upgradeAuthority) {
        evidence.details.push(`Upgrade authority: ${evidence.upgradeAuthority}`);
      } else {
        evidence.details.push("Program is immutable (no upgrade authority)");
      }
    }
  } catch (err) {
    evidence.details.push(`Analysis error: ${err.message}`);
    evidence.score = 0;
  }

  return evidence;
}

// Helper: count nesting depth of inner instructions
function countDepth(innerInstructions, depth = 1) {
  if (!innerInstructions || innerInstructions.length === 0) return depth;
  return Math.max(
    ...innerInstructions.map((ix) =>
      ix.innerInstructions ? countDepth(ix.innerInstructions, depth + 1) : depth
    )
  );
}

/**
 * Converts raw on-chain evidence into a boolean pass/fail for the UI checks.
 */
export function onchainCheckPassed(evidence) {
  if (evidence.score >= 14) return true;
  if (evidence.score >= 7) return "partial";
  return false;
}
