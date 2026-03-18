# 👁 GRIMWATCH

### The Grim Watchers of the Chain

> *Grimwatch peers into the darkness of Solana. The grim watchers verify AI agents and seal the worthy. The void claims the rest.*

**Live:** [grimwatch.xyz](https://grimwatch.xyz)

---

## What is Grimwatch?

Grimwatch is a real-time AI agent verification platform built on Solana. It continuously scans the blockchain, discovers new AI agent tokens, and scores them across five key dimensions — giving traders and holders a transparent, on-chain view of which agents are legitimate and which are void.

No guesswork. No hype. Just data.

---

## How It Works

### Discovery
Grimwatch uses the [DexScreener](https://dexscreener.com) public API to continuously discover new AI agent tokens on Solana — scanning for keywords like `ai agent`, `eliza`, `ai16z`, `autonomous agent`, and more. Only tokens with real liquidity ($5K+) are considered.

### Verification (The Five Gazes)
Each discovered agent is scanned across five dimensions using the [Helius](https://helius.dev) RPC/DAS API:

| Gaze | What It Checks |
|------|---------------|
| **On-Chain Presence** | Token exists, has metadata, verified mint |
| **Liquidity Health** | DEX liquidity depth and stability |
| **Holder Distribution** | Wallet concentration, whale risk |
| **Social Signals** | Twitter/X activity, community presence |
| **Trading Activity** | Volume, transaction frequency, organic activity |

### Scoring & Tiers
Each agent receives a composite score (0–100) and is assigned a tier:

| Tier | Score | Meaning |
|------|-------|---------|
| **SEALED** | 85–100 | Verified, legitimate, strong signals |
| **WANING** | 60–84 | Moderate signals, watch closely |
| **OBSCURED** | 30–59 | Weak signals, proceed with caution |
| **VOID** | 0–29 | Failed verification, high risk |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Custom CSS — IBM Plex Mono + Cinzel + Cormorant Garamond |
| Blockchain Data | Helius RPC/DAS API |
| Token Discovery | DexScreener Public API |
| Hosting | Vercel |
| Data Store | File-based JSON (upgrading to on-chain) |

---

## Running Locally

```bash
git clone https://github.com/maazabdullah12/Grimwatch.git
cd Grimwatch
npm install
```

Create a `.env.local` file:
```
HELIUS_API_KEY=your_helius_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=GRIMWATCH
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

On first load, the Explorer auto-seeds itself by fetching live Solana AI agent tokens. Give it 10–15 seconds to populate.

---

## API

Grimwatch exposes a public REST API:

```
GET  /api/v1/agents          — List all tracked agents
GET  /api/v1/agents/:address — Get agent details + verification score
POST /api/v1/agents          — Submit an agent for verification
GET  /api/v1/agents/seed     — Trigger a fresh discovery scan
```

Full docs available at [grimwatch.xyz/docs](https://grimwatch.xyz/docs)

---

## Roadmap

- [x] Live blockchain discovery
- [x] On-chain verification scoring
- [x] Public explorer
- [x] Submit for verification
- [ ] Agent Prediction Market — bet on whether an agent stays SEALED or goes VOID
- [ ] Watcher Leaderboard — public rankings for top callers
- [ ] Death Watch Feed — early rug alerts for token holders
- [ ] $GRIM token integration + staking

---

## Contributing

Open source and open to watchers. PRs welcome.

---

*Built by the Grim Watchers. For the chain.*
