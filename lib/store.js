/**
 * Simple file-based agent store.
 * Reads/writes to data/submitted-agents.json so submissions survive page refreshes.
 * (Replace with a real DB in production.)
 */

import fs from 'fs';
import path from 'path';

const STORE_PATH = path.join(process.cwd(), 'data', 'submitted-agents.json');

function readStore() {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeStore(agents) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(agents, null, 2), 'utf-8');
}

/** Return all submitted agents */
export function getAllSubmitted() {
  return readStore();
}

/** Save or update an agent by fullAddress */
export function upsertAgent(agent) {
  const agents = readStore();
  const idx = agents.findIndex((a) => a.fullAddress === agent.fullAddress);
  if (idx >= 0) {
    agents[idx] = { ...agents[idx], ...agent, updatedAt: new Date().toISOString() };
  } else {
    agents.push({ ...agent, submittedAt: new Date().toISOString() });
  }
  writeStore(agents);
}

/** Find a single submitted agent by address */
export function findSubmitted(address) {
  const agents = readStore();
  return agents.find(
    (a) => a.fullAddress === address || a.address === address
  ) || null;
}
