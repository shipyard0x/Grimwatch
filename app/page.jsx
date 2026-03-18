'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// MOCK_AGENTS and PLATFORM_STATS replaced by live API fetch below
import { getTier, scoreColor, statusColor, statusLabel } from '../lib/scoring';
import VerificationBadge from '../components/ui/VerificationBadge';

function StatCard({ label, value, sub, color, icon }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const target = typeof value === 'number' ? value : 0;
    if (target === 0) return;
    const duration = 1200;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  const displayVal = typeof value === 'number' ? displayed : value;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '2px',
        padding: '20px 24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.boxShadow = `0 0 16px ${color}10`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `${color}08`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.14em',
          color: 'rgba(212,208,200,0.35)',
          marginBottom: '10px',
        }}
      >
        {icon && <span style={{ marginRight: '6px' }}>{icon}</span>}
        {label}
      </div>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: '36px',
          color: color,
          lineHeight: 1,
          marginBottom: '6px',
        }}
      >
        {displayVal}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '12px',
            color: 'rgba(212,208,200,0.3)',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function AgentRow({ agent, delay = 0 }) {
  const sColor = scoreColor(agent.score);
  const vColor = statusColor(agent.verified);
  const vLabel = statusLabel(agent.verified);

  return (
    <Link
      href="/agents"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.04)',
        textDecoration: 'none',
        transition: 'all 0.15s',
        opacity: 0,
        animation: `fadeSlideUp 0.35s ease-out ${delay}s forwards`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '2px',
          background: `${sColor}15`,
          border: `1px solid ${sColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '14px', color: sColor }}>
          {agent.logo}
        </span>
      </div>

      {/* Name + ticker */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: '13px', color: '#D4D0C8' }}>
            {agent.name}
          </span>
          <VerificationBadge verified={agent.verified} size="sm" />
        </div>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(212,208,200,0.3)' }}>
          {agent.ticker} · {agent.category}
        </span>
      </div>

      {/* Status */}
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          padding: '3px 8px',
          borderRadius: '2px',
          background: `${vColor}15`,
          color: vColor,
          border: `1px solid ${vColor}30`,
        }}
      >
        {vLabel}
      </span>

      {/* Score */}
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: '18px',
          color: sColor,
          minWidth: '32px',
          textAlign: 'right',
        }}
      >
        {agent.score}
      </span>
    </Link>
  );
}

function TrendingCard({ agent, rank, delay = 0 }) {
  const tier = getTier(agent.score);
  const sColor = scoreColor(agent.score);

  return (
    <Link
      href="/agents"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '18px',
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.04)',
        textDecoration: 'none',
        transition: 'all 0.18s',
        opacity: 0,
        animation: `fadeSlideUp 0.35s ease-out ${delay}s forwards`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
        e.currentTarget.style.borderColor = `${sColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
      }}
    >
      {/* Rank badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          color: 'rgba(212,208,200,0.2)',
        }}
      >
        #{rank}
      </div>

      {/* Logo + score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '2px',
            background: `${sColor}18`,
            border: `1.5px solid ${sColor}35`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '20px', color: sColor }}>
            {agent.logo}
          </span>
        </div>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '15px', color: '#D4D0C8', marginBottom: '3px' }}>
            {agent.name}
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(212,208,200,0.35)' }}>
            {agent.ticker} · {agent.category}
          </div>
        </div>
      </div>

      {/* Score + tier */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '28px', color: sColor }}>
            {agent.score}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(212,208,200,0.3)', marginLeft: '6px' }}>
            / 100
          </span>
        </div>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 8px',
            borderRadius: '2px',
            background: tier.bg,
            color: tier.color,
            border: `1px solid ${tier.color}30`,
          }}
        >
          {tier.label}
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'rgba(212,208,200,0.3)', marginBottom: '3px' }}>MARKET CAP</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#D4D0C8' }}>{agent.mcap}</div>
        </div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'rgba(212,208,200,0.3)', marginBottom: '3px' }}>24H VOLUME</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#D4D0C8' }}>{agent.volume24h}</div>
        </div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'rgba(212,208,200,0.3)', marginBottom: '3px' }}>TXS</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#4ADE80' }}>
            {agent.chain_activity.txCount.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [allAgents, setAllAgents] = useState([]);

  useEffect(() => {
    async function load() {
      const [statsRes, agentsRes] = await Promise.all([
        fetch('/api/v1/stats'),
        fetch('/api/v1/agents'),
      ]);
      const statsData  = await statsRes.json();
      const agentsData = await agentsRes.json();
      setStats(statsData);
      setAllAgents(agentsData.agents || []);
    }
    load();
  }, []);

  const recentAgents = [...allAgents].slice(0, 4);
  const topAgents    = [...allAgents].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

      {/* ── Hero ── */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '60px',
          opacity: 0,
          animation: 'fadeSlideUp 0.5s ease-out 0.1s forwards',
        }}
      >
        {/* Protocol label */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(74,222,128,0.06)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '2px',
            padding: '6px 16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px rgba(74,222,128,0.8)', animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: '#4ADE80' }}>
            SOLANA MAINNET · v0.1.0
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: 'clamp(32px, 6vw, 64px)',
            letterSpacing: '0.08em',
            margin: '0 0 12px',
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: '#D4D0C8' }}>GRIM</span>
          <span style={{ color: '#4ADE80' }}>WATCH</span>
        </h1>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: 'rgba(212,208,200,0.5)',
            maxWidth: '520px',
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Grimwatch peers into the darkness of Solana. The grim watchers verify AI agents — sealing the worthy, casting fakes into the void.
        </p>

        {/* Token CA Banner */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(212,168,67,0.06)',
            border: '1px solid rgba(212,168,67,0.2)',
            borderRadius: '2px',
            padding: '10px 20px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(212,168,67,0.6)' }}>
            $GRIM TOKEN
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.06em',
              color: '#D4A843',
              background: 'rgba(212,168,67,0.08)',
              padding: '3px 10px',
              borderRadius: '2px',
              border: '1px solid rgba(212,168,67,0.15)',
            }}
          >
            LAUNCHING SOON — CA WILL BE POSTED HERE
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/agents"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              padding: '12px 24px',
              borderRadius: '2px',
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.35)',
              color: '#4ADE80',
              textDecoration: 'none',
              transition: 'all 0.15s',
              boxShadow: '0 0 16px rgba(74,222,128,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(74,222,128,0.15)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(74,222,128,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(74,222,128,0.1)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(74,222,128,0.1)';
            }}
          >
            EXPLORE AGENTS
          </Link>
          <Link
            href="/submit"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              padding: '12px 24px',
              borderRadius: '2px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(212,208,200,0.6)',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = '#D4D0C8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(212,208,200,0.6)';
            }}
          >
            SUBMIT FOR THE VIGIL
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '48px',
          opacity: 0,
          animation: 'fadeSlideUp 0.4s ease-out 0.25s forwards',
        }}
      >
        <StatCard label="TOTAL SCANNED"    value={stats?.totalScanned  ?? '—'} sub="agents indexed on-chain" color="#D4D0C8"  icon="🔍" />
        <StatCard label="GRIMWATCH SEALED" value={stats?.certified      ?? '—'} sub="agents verified"         color="#4ADE80"  icon="✓" />
        <StatCard label="LARPs DETECTED"   value={stats?.larpsDetected  ?? '—'} sub="flagged as fake"         color="#DC2626"  icon="⚠" />
        <StatCard label="AVG TRUST SCORE"  value={stats?.avgTrustScore  ?? '—'} sub="across all agents"       color="#D4A843"  icon="★" />
      </div>

      {/* ── Bottom two-column layout ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
      >
        {/* Recent Gazes */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: 'rgba(212,208,200,0.5)',
                margin: 0,
              }}
            >
              RECENT GAZES
            </h2>
            <Link
              href="/agents"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#4ADE80',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
            >
              VIEW ALL \u2192
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentAgents.map((agent, i) => (
              <AgentRow key={agent.id} agent={agent} delay={0.3 + i * 0.07} />
            ))}
          </div>
        </div>

        {/* Trending Agents */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: 'rgba(212,208,200,0.5)',
                margin: 0,
              }}
            >
              TOP AGENTS BY SCORE
            </h2>
            <Link
              href="/agents"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#4ADE80',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
            >
              EXPLORE \u2192
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topAgents.map((agent, i) => (
              <TrendingCard key={agent.id} agent={agent} rank={i + 1} delay={0.35 + i * 0.08} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer bar ── */}
      <div
        style={{
          marginTop: '60px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(212,208,200,0.2)', letterSpacing: '0.08em' }}>
          GRIMWATCH PROTOCOL v0.1.0 — SOLANA AI AGENT VERIFICATION
        </span>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {['Explorer', 'Submit', 'API Docs'].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase().replace(' ', '')}`}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: 'rgba(212,208,200,0.25)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://x.com/GrimwatchHQ"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: 'rgba(74,222,128,0.5)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            𝕏 @GrimwatchHQ
          </a>
          <a
            href="https://github.com/shipyard0x/Grimwatch"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: 'rgba(212,208,200,0.35)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '4px 10px',
              borderRadius: '2px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#D4D0C8';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(212,208,200,0.35)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            }}
          >
            ⌥ GITHUB
          </a>
        </div>
      </div>
    </div>
  );
}
