/**
 * Helius API client — wraps Enhanced Transactions, RPC, and DAS APIs.
 * Requires HELIUS_API_KEY in .env.local
 */

const API_KEY = process.env.HELIUS_API_KEY || "";
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`;
const REST_BASE = "https://api.helius.xyz/v0";

if (!API_KEY && process.env.NODE_ENV !== "test") {
  console.warn("[Helius] No HELIUS_API_KEY found — real verification will be unavailable.");
}

// ─── RPC helper ──────────────────────────────────────────────────────────────

async function rpc(method, params = []) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`RPC ${method} failed: ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`RPC error: ${json.error.message}`);
  return json.result;
}

// ─── Enhanced Transactions API ────────────────────────────────────────────────

/**
 * Fetch up to `limit` enhanced (parsed) transactions for an address.
 * Returns array of Helius EnrichedTransaction objects.
 */
export async function getEnhancedTransactions(address, limit = 100) {
  const url = `${REST_BASE}/addresses/${address}/transactions?api-key=${API_KEY}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Helius enhanced txs failed (${res.status}): ${text}`);
  }
  return res.json(); // array of enriched transactions
}

/**
 * Fetch raw signatures for an address via RPC (faster, less data).
 */
export async function getSignatures(address, limit = 1000) {
  return rpc("getSignaturesForAddress", [address, { limit }]);
}

// ─── Account / Token Info ─────────────────────────────────────────────────────

/**
 * Get basic account info for a Solana address.
 */
export async function getAccountInfo(address) {
  return rpc("getAccountInfo", [address, { encoding: "jsonParsed" }]);
}

/**
 * Get token mint info (name, symbol, supply, decimals) via DAS getAsset.
 * Works for SPL tokens that have Metaplex metadata.
 */
export async function getTokenMetadata(mintAddress) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "veridia",
      method: "getAsset",
      params: { id: mintAddress },
    }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.result || null;
}

/**
 * Get token supply from RPC.
 */
export async function getTokenSupply(mintAddress) {
  try {
    const result = await rpc("getTokenSupply", [mintAddress]);
    return result?.value || null;
  } catch {
    return null;
  }
}

/**
 * Get the largest token accounts (top holders) — used for distribution check.
 */
export async function getLargestTokenAccounts(mintAddress, limit = 10) {
  try {
    const result = await rpc("getTokenLargestAccounts", [mintAddress]);
    return result?.value?.slice(0, limit) || [];
  } catch {
    return [];
  }
}

// ─── Program / Contract helpers ───────────────────────────────────────────────

/**
 * Check if the address is an executable program (smart contract).
 */
export async function isProgramAddress(address) {
  try {
    const info = await getAccountInfo(address);
    return info?.value?.executable === true;
  } catch {
    return false;
  }
}

/**
 * Get the upgrade authority for a BPF upgradeable program.
 * Returns null if not upgradeable or not a program.
 */
export async function getProgramUpgradeAuthority(programAddress) {
  try {
    // Upgradeable BPF stores data in a ProgramData account
    const programDataAddress = await rpc("getAccountInfo", [
      programAddress,
      { encoding: "jsonParsed" },
    ]);
    const parsed = programDataAddress?.value?.data?.parsed;
    if (parsed?.type === "program") {
      const pdaAddress = parsed.info?.programData;
      if (pdaAddress) {
        const pdaInfo = await getAccountInfo(pdaAddress);
        return pdaInfo?.value?.data?.parsed?.info?.authority || null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export { API_KEY, RPC_URL };
