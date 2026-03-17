'use client';

import { useState, useEffect, useRef } from 'react';

// ── helpers ───────────────────────────────────────────────────────────────────

function useBaseUrl() {
  const [base, setBase] = useState('/api/v1');
  useEffect(() => {
    setBase(`${window.location.origin}/api/v1`);
  }, []);
  return base;
}

// ── sub-components ────────────────────────────────────────────────────────────

function MethodBadge({ method }) {
  const colors = {
    GET:  { bg: 'rgba(74,222,128,0.10)',   color: '#4ADE80', border: 'rgba(74,222,128,0.25)' },
    POST: { bg: 'rgba(212,168,67,0.10)',   color: '#D4A843', border: 'rgba(212,168,67,0.25)' },
    WS:   { bg: 'rgba(100,100,200,0.10)', color: '#8888CC', border: 'rgba(100,100,200,0.25)' },
  };
  const c = colors[method] || colors.GET;
  return (
    <span style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
      padding: '3px 8px', borderRadius: '2px',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      flexShrink: 0,
    }}>
      {method}
    </span>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        style={{
          position: 'absolute', top: '8px', right: '8px',
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.08em',
          padding: '4px 9px', borderRadius: '2px',
          border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.4)',
          color: copied ? '#4ADE80' : 'rgba(212,208,200,0.35)', cursor: 'pointer', transition: 'all 0.15s', zIndex: 1,
        }}
      >
        {copied ? '✓ INSCRIBED' : 'INSCRIBE'}
      </button>
      <pre style={{
        margin: 0, padding: '14px 16px', paddingRight: '80px',
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', lineHeight: 1.6,
        color: 'rgba(212,208,200,0.7)',
        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '2px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
      }}>
        {code}
      </pre>
    </div>
  );
}

// ── EndpointCard ──────────────────────────────────────────────────────────────

function EndpointCard({ ep, baseUrl }) {
  const [open, setOpen]             = useState(false);
  const [address, setAddress]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [liveResponse, setLiveResponse] = useState(null);
  const [liveError, setLiveError]   = useState(null);
  const needsAddress = ep.pathTemplate.includes(':address');

  async function tryIt() {
    setLoading(true);
    setLiveResponse(null);
    setLiveError(null);
    try {
      const url = ep.pathTemplate.replace(':address', address.trim());
      const res = await fetch(url);
      const data = await res.json();
      setLiveResponse(JSON.stringify(data, null, 2));
    } catch (e) {
      setLiveError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: open ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.05)',
      borderRadius: '2px', overflow: 'hidden', marginBottom: '12px', transition: 'border-color 0.2s',
    }}>
      {/* Header row */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer', borderBottom: open ? '1px solid rgba(255,255,255,0.04)' : 'none',
        }}
      >
        <MethodBadge method={ep.method} />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#D4D0C8', flex: 1 }}>
          {ep.pathTemplate}
        </span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(212,208,200,0.3)', letterSpacing: '0.06em' }}>
          {ep.title}
        </span>
        <span style={{ color: 'rgba(212,208,200,0.2)', fontSize: '10px', marginLeft: '4px' }}>
          {open ? '▲' : '▼'}
        </span>
      </div>

      {open && (
        <div style={{ padding: '20px' }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'rgba(212,208,200,0.45)', lineHeight: 1.7, marginTop: 0, marginBottom: '16px' }}>
            {ep.description}
          </p>

          {/* Parameters */}
          {ep.params.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(212,208,200,0.2)', marginBottom: '8px' }}>
                PARAMETERS
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                {ep.params.map((p, i) => (
                  <div key={p.name} style={{
                    display: 'grid', gridTemplateColumns: '130px 60px 1fr', gap: '12px',
                    padding: '10px 14px', alignItems: 'start',
                    borderBottom: i < ep.params.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#4ADE80' }}>{p.name}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#D4A843' }}>{p.type}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(212,208,200,0.35)' }}>{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request body */}
          {ep.requestBody && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(212,208,200,0.2)', marginBottom: '8px' }}>
                REQUEST SCROLL
              </div>
              <CodeBlock code={ep.requestBody} />
            </div>
          )}

          {/* Example response (static) */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(212,208,200,0.2)', marginBottom: '8px' }}>
              EXAMPLE OMEN
            </div>
            <CodeBlock code={ep.exampleResponse} />
          </div>

          {/* ── Try It panel ── */}
          {ep.method === 'GET' && (
            <div style={{
              background: 'rgba(74,222,128,0.02)', border: '1px solid rgba(74,222,128,0.1)',
              borderRadius: '2px', padding: '16px',
            }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(74,222,128,0.4)', marginBottom: '12px' }}>
                ▶ INVOKE THE WATCHER — LIVE
              </div>

              {needsAddress && (
                <div style={{ marginBottom: '10px' }}>
                  <input
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Speak the address you seek..."
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                      padding: '8px 12px', borderRadius: '2px',
                      border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(0,0,0,0.3)',
                      color: '#D4D0C8', outline: 'none',
                    }}
                  />
                </div>
              )}

              <button
                onClick={tryIt}
                disabled={loading || (needsAddress && !address.trim())}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.1em',
                  padding: '7px 18px', borderRadius: '2px', cursor: loading ? 'wait' : 'pointer',
                  border: '1px solid rgba(74,222,128,0.25)', background: 'rgba(74,222,128,0.06)',
                  color: loading ? 'rgba(74,222,128,0.35)' : '#4ADE80',
                  opacity: (needsAddress && !address.trim()) ? 0.4 : 1,
                  transition: 'all 0.15s',
                }}
              >
                {loading ? 'THE WATCHERS GAZE...' : 'SEND COMMAND'}
              </button>

              {liveError && (
                <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '2px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#DC2626' }}>
                    THE VIGIL FAILED: {liveError}
                  </span>
                </div>
              )}

              {liveResponse && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(74,222,128,0.4)', marginBottom: '6px' }}>
                    THE OMEN RETURNED
                  </div>
                  <CodeBlock code={liveResponse} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── endpoint definitions ──────────────────────────────────────────────────────

const ENDPOINTS = [
  {
    id: 'list-agents',
    method: 'GET',
    pathTemplate: '/api/v1/agents',
    title: 'List Souls',
    description: 'Returns all indexed souls. Merges built-in agents with any user-submitted agents from the grimoire store.',
    params: [
      { name: 'filter', type: 'query', desc: 'Filter by status: verified | unverified | pending' },
      { name: 'search', type: 'query', desc: 'Search by name or ticker' },
    ],
    exampleResponse: `{
  "agents": [
    {
      "id": 1,
      "name": "GRIFFAIN",
      "ticker": "$GRIFFAIN",
      "address": "5K7...x9Qp",
      "verified": true,
      "score": 94,
      "category": "DeFi Agent",
      "mcap": "$18.4M",
      "volume24h": "$2.1M",
      "checks": { "onchain": true, "codeAudit": true, "socialProof": true }
    }
  ],
  "total": 6
}`,
  },
  {
    id: 'get-agent',
    method: 'GET',
    pathTemplate: '/api/v1/agents/:address',
    title: 'Get Soul',
    description: 'Returns full details for a single soul. If found in the grimoire, returns stored data. Otherwise runs a live Helius on-chain scan.',
    params: [
      { name: 'address', type: 'path', desc: 'Solana contract address (base58, 32–44 chars)' },
    ],
    exampleResponse: `{
  "source": "mock",
  "agent": {
    "name": "GRIFFAIN",
    "ticker": "$GRIFFAIN",
    "fullAddress": "5K7mRzBqVcN8x9Qp...",
    "verified": true,
    "score": 94,
    "checks": {
      "onchain": true,
      "codeAudit": true,
      "socialProof": true,
      "aiInference": true,
      "governance": true
    }
  }
}`,
  },
  {
    id: 'get-score',
    method: 'GET',
    pathTemplate: '/api/v1/agents/:address/score',
    title: 'Get Vigil Score',
    description: 'Returns the vigil score, tier label, tier colour, and last-updated timestamp for a specific soul.',
    params: [
      { name: 'address', type: 'path', desc: 'Solana contract address (base58)' },
    ],
    exampleResponse: `{
  "address": "5K7mRzBqVcN8x9Qp...",
  "score": 94,
  "tier": "SEALED",
  "color": "#4ADE80",
  "verified": true,
  "lastUpdated": "2025-06-01T00:00:00Z"
}`,
  },
  {
    id: 'get-badge',
    method: 'GET',
    pathTemplate: '/api/v1/agents/:address/badge',
    title: "Get Watcher's Seal",
    description: "Returns seal metadata including status, tier, checks bitmask, mint date, expiry (90 days from mint), and Arweave metadata URI for sealed souls.",
    params: [
      { name: 'address', type: 'path', desc: 'Solana contract address (base58)' },
    ],
    exampleResponse: `{
  "address": "5K7mRzBqVcN8x9Qp...",
  "badge": {
    "status": "SEALED",
    "tier": "SEALED",
    "trustScore": 94,
    "mintedAt": "2025-06-01T00:00:00Z",
    "expiresAt": "2025-08-30T00:00:00Z",
    "checksBitmask": 31,
    "metadataUri": "https://arweave.net/grimwatch-seal-5K7mRzBq"
  }
}`,
  },
  {
    id: 'get-history',
    method: 'GET',
    pathTemplate: '/api/v1/agents/:address/history',
    title: 'Get Vigil History',
    description: 'Returns a synthetic 30-day vigil score history trending toward the current score, with daily tier labels.',
    params: [
      { name: 'address', type: 'path', desc: 'Solana contract address (base58)' },
    ],
    exampleResponse: `{
  "address": "5K7mRzBqVcN8x9Qp...",
  "history": [
    { "date": "2026-02-15", "score": 88, "tier": "SEALED" },
    { "date": "2026-02-16", "score": 91, "tier": "SEALED" },
    { "date": "2026-03-16", "score": 94, "tier": "SEALED" }
  ]
}`,
  },
  {
    id: 'get-stats',
    method: 'GET',
    pathTemplate: '/api/v1/stats',
    title: 'Vigil Stats',
    description: 'Returns real-time aggregate statistics computed from all known souls (mock + submitted).',
    params: [],
    exampleResponse: `{
  "totalScanned": 6,
  "certified": 3,
  "pending": 1,
  "larpsDetected": 1,
  "avgTrustScore": 61,
  "lastUpdated": "2026-03-16T12:00:00Z"
}`,
  },
  {
    id: 'submit-agent',
    method: 'POST',
    pathTemplate: '/api/v1/agents',
    title: 'Submit for Vigil',
    description: 'Submit a new soul address. The soul is saved immediately with status "scanning" and a background Helius scan runs within ~10 seconds, updating the score automatically.',
    params: [
      { name: 'address', type: 'body', desc: 'Solana contract address (required)' },
      { name: 'name',    type: 'body', desc: 'Project name (optional)' },
      { name: 'twitter', type: 'body', desc: 'Twitter handle e.g. @myagent (optional)' },
      { name: 'github',  type: 'body', desc: 'GitHub repo e.g. myorg/myrepo (optional)' },
    ],
    requestBody: `{
  "address": "YourSolanaAddressHere...",
  "name": "MYAGENT",
  "twitter": "@myagent_sol",
  "github": "myorg/myagent"
}`,
    exampleResponse: `{
  "message": "Agent submitted — scan started",
  "address": "YourSolanaAddressHere...",
  "estimatedTime": "~10 seconds",
  "status": "scanning"
}`,
  },
];

// ── WS section (static, no Try It) ───────────────────────────────────────────

const WS_EVENTS = [
  { name: 'agent.verified',      desc: 'Fired when a soul is SEALED by the watchers' },
  { name: 'agent.submitted',     desc: 'Fired when a new soul is offered to the vigil' },
  { name: 'agent.score_updated', desc: 'Fired when a periodic rescan updates a soul vigil score' },
  { name: 'agent.larp_detected', desc: 'Fired when a soul is cast into the VOID' },
  { name: 'stats.updated',       desc: 'Fired when vigil-wide statistics are recalculated' },
];

const WS_EXAMPLE = `// Connect to WebSocket
const ws = new WebSocket('wss://grimwatch.protocol/ws/v1');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    channels: ['agent.verified', 'agent.larp_detected'],
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // { type: 'agent.verified', agent: { name, address, score }, timestamp }
  console.log('Omen received:', data);
};`;

// ── page ──────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const baseUrl = useBaseUrl();
  const [activeNav, setActiveNav] = useState(null);

  function scrollTo(id) {
    setActiveNav(id);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  return (
    <div style={{
      maxWidth: '1100px', margin: '0 auto', padding: '40px 24px',
      display: 'grid', gridTemplateColumns: '220px 1fr', gap: '32px', alignItems: 'start',
    }}>

      {/* ── Sidebar ── */}
      <div style={{
        position: 'sticky', top: '80px',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '2px', padding: '16px',
        opacity: 0, animation: 'fadeUp 0.4s ease-out 0.05s forwards',
      }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', color: 'rgba(212,208,200,0.2)', marginBottom: '12px' }}>
          SCROLLS
        </div>
        {ENDPOINTS.map(ep => (
          <button
            key={ep.id}
            onClick={() => scrollTo(ep.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
              padding: '7px 10px', marginBottom: '4px', borderRadius: '2px', border: 'none',
              background: activeNav === ep.id ? 'rgba(74,222,128,0.05)' : 'transparent',
              cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (activeNav !== ep.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            onMouseLeave={e => { if (activeNav !== ep.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', fontWeight: 700,
              padding: '1px 5px', borderRadius: '2px', flexShrink: 0,
              background: ep.method === 'GET' ? 'rgba(74,222,128,0.08)' : 'rgba(212,168,67,0.08)',
              color: ep.method === 'GET' ? '#4ADE80' : '#D4A843',
            }}>
              {ep.method}
            </span>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              color: activeNav === ep.id ? '#4ADE80' : 'rgba(212,208,200,0.35)',
            }}>
              {ep.title}
            </span>
          </button>
        ))}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', margin: '12px 0' }} />

        <button
          onClick={() => scrollTo('websocket')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
            padding: '7px 10px', borderRadius: '2px', border: 'none',
            background: 'transparent', cursor: 'pointer', textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '2px', background: 'rgba(100,100,200,0.08)', color: '#8888CC', flexShrink: 0 }}>
            WS
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(212,208,200,0.35)' }}>
            Omens
          </span>
        </button>
      </div>

      {/* ── Main content ── */}
      <div style={{ opacity: 0, animation: 'fadeUp 0.4s ease-out 0.1s forwards' }}>

        {/* Page header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '2px', height: '24px', background: '#4ADE80', boxShadow: '0 0 8px rgba(74,222,128,0.4)' }} />
            <h1 style={{ fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: '18px', letterSpacing: '0.18em', color: '#D4D0C8', margin: 0 }}>
              THE GRIMOIRE OF COMMANDS
            </h1>
          </div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'rgba(212,208,200,0.35)', marginLeft: '12px', lineHeight: 1.6 }}>
            GRIMWATCH REST API v1 — All scrolls return JSON.{' '}
            Base Sigil:{' '}
            <code style={{ color: '#4ADE80', fontSize: '11px' }}>{baseUrl}</code>
          </p>

          <div style={{
            marginTop: '16px', padding: '12px 16px', borderRadius: '2px',
            background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.12)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ color: '#4ADE80', fontSize: '14px' }}>👁</span>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(212,208,200,0.45)', margin: 0 }}>
              <strong style={{ color: '#4ADE80' }}>Live scrolls:</strong> All GET scrolls below are live — click{' '}
              <strong style={{ color: '#4ADE80' }}>▶ INVOKE</strong> inside any card to call the real API and see the watcher's response.
            </p>
          </div>

          <div style={{
            marginTop: '10px', padding: '12px 16px', borderRadius: '2px',
            background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.15)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ color: '#D4A843', fontSize: '14px' }}>⚠</span>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(212,208,200,0.45)', margin: 0 }}>
              <strong style={{ color: '#D4A843' }}>Public vigil:</strong> All GET scrolls are open. POST scrolls require an{' '}
              <code style={{ color: '#D4A843', fontSize: '10px' }}>X-API-Key</code> rune in production.
            </p>
          </div>
        </div>

        {/* Endpoint cards */}
        {ENDPOINTS.map(ep => (
          <div id={ep.id} key={ep.id}>
            <EndpointCard ep={ep} baseUrl={baseUrl} />
          </div>
        ))}

        {/* WebSocket section */}
        <div id="websocket" style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(100,100,200,0.15)',
          borderRadius: '2px', overflow: 'hidden', marginBottom: '12px',
        }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <MethodBadge method="WS" />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#D4D0C8', flex: 1 }}>
              wss://grimwatch.protocol/ws/v1
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(212,208,200,0.3)', letterSpacing: '0.06em' }}>
              Realtime Omens
            </span>
          </div>
          <div style={{ padding: '20px' }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'rgba(212,208,200,0.4)', lineHeight: 1.7, marginBottom: '16px', marginTop: 0 }}>
              Subscribe to realtime omens for soul verification status changes, new offerings, and vigil score updates.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(212,208,200,0.2)', marginBottom: '8px' }}>OMENS</div>
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                {WS_EVENTS.map((ev, i) => (
                  <div key={ev.name} style={{
                    display: 'grid', gridTemplateColumns: '220px 1fr', gap: '12px',
                    padding: '10px 14px', alignItems: 'start',
                    borderBottom: i < WS_EVENTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#8888CC' }}>{ev.name}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(212,208,200,0.35)' }}>{ev.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(212,208,200,0.2)', marginBottom: '8px' }}>INSCRIPTION</div>
              <CodeBlock code={WS_EXAMPLE} />
            </div>
          </div>
        </div>

        {/* Rate limits */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '2px', padding: '20px', marginBottom: '16px',
        }}>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(212,208,200,0.3)', marginBottom: '14px', marginTop: 0 }}>
            VIGIL LIMITS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { tier: 'PUBLIC',   limit: '60 req/min',  color: 'rgba(212,208,200,0.5)' },
              { tier: 'API RUNE', limit: '600 req/min', color: '#D4A843' },
              { tier: 'PARTNER',  limit: 'Unlimited',   color: '#4ADE80' },
            ].map(t => (
              <div key={t.tier} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '2px', padding: '14px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(212,208,200,0.25)', marginBottom: '8px' }}>{t.tier}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '14px', color: t.color }}>{t.limit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
