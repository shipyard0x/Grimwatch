'use client';

import { useEffect, useState } from 'react';
import ScoreRing from '../ui/ScoreRing';
import VerificationBadge from '../ui/VerificationBadge';
import CheckRow from '../ui/CheckRow';
import { getTier, statusColor, statusLabel } from '../../lib/scoring';

/**
 * AgentDetail
 * Full detail panel for a selected agent.
 * @param {object} agent
 * @param {function} onBack - called when back button is clicked (mobile)
 */
export default function AgentDetail({ agent, onBack }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, [agent.id]);

  const tier = getTier(agent.score);
  const verColor = statusColor(agent.verified);
  const verLabel = statusLabel(agent.verified);

  // Safe defaults for fields absent on live-scanned agents
  const chain = agent.chain_activity || {};
  const social = agent.social || {};
  const checks = agent.checks || {};

  const checks_list = [
    {
      key: 'onchain',
      label: 'ON-CHAIN SOUL ACTIVITY',
      desc: 'Verifiable smart contract interactions on Solana mainnet',
    },
    {
      key: 'codeAudit',
      label: 'CONTRACT GRIMOIRE AUDIT',
      desc: 'Source code published, reviewed, and audited',
    },
    {
      key: 'socialProof',
      label: 'IDENTITY BEYOND THE VEIL',
      desc: 'Verified Twitter/GitHub presence with organic engagement',
    },
    {
      key: 'aiInference',
      label: 'TRUE ARCANE INFERENCE',
      desc: 'Confirmed on-chain ML/AI inference calls detected',
    },
    {
      key: 'governance',
      label: 'COUNCIL OF GOVERNANCE',
      desc: 'DAO governance token with verifiable proposal history',
    },
  ];

  const StatCell = ({ label, value, color: c }) => (
    <div
      style={{
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '2px',
        padding: '10px 14px',
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: 'rgba(212,208,200,0.35)',
          marginBottom: '5px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '13px',
          color: c || '#D4D0C8',
        }}
      >
        {value}
      </div>
    </div>
  );

  // Badge expiry (1 year from launch, fallback to today)
  const _ld = agent.launchDate || new Date().toISOString().slice(0, 10);
  const launchYear = parseInt(_ld.split('-')[0]);
  const expiryDate = `${launchYear + 1}-${_ld.slice(5)}`;

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(12px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '2px',
          padding: '6px 12px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.08em',
          color: 'rgba(212,208,200,0.45)',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#4ADE80';
          e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(212,208,200,0.45)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        ← RETURN TO THE VIGIL
      </button>

      {/* ── Agent Header ── */}
      <div
        style={{
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '2px',
          padding: '20px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          {/* Large logo */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '2px',
              background: `${verColor}18`,
              border: `2px solid ${verColor}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `0 0 16px ${verColor}20`,
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: '28px',
                color: verColor,
              }}
            >
              {agent.logo}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Name + badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h2
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#D4D0C8',
                  letterSpacing: '0.06em',
                  margin: 0,
                }}
              >
                {agent.name}
              </h2>
              <VerificationBadge verified={agent.verified} size="md" />
              {/* Status pill */}
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  padding: '3px 10px',
                  borderRadius: '2px',
                  background: `${verColor}15`,
                  color: verColor,
                  border: `1px solid ${verColor}40`,
                }}
              >
                {verLabel}
              </span>
            </div>

            {/* Ticker + address */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  color: 'rgba(212,208,200,0.5)',
                }}
              >
                {agent.ticker}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: 'rgba(212,208,200,0.25)',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {agent.fullAddress}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(212,208,200,0.4)',
                }}
              >
                {agent.category}
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '13px',
                color: 'rgba(212,208,200,0.6)',
                lineHeight: 1.6,
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              {agent.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── Score + Stats ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        {/* Score ring */}
        <div
          style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '2px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <ScoreRing score={agent.score} size={88} />
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.08em',
              color: tier.color,
              textAlign: 'center',
              background: tier.bg,
              padding: '3px 8px',
              borderRadius: '2px',
              border: `1px solid ${tier.color}40`,
            }}
          >
            {tier.label}
          </div>
        </div>

        {/* Stat grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}
        >
          <StatCell label="MARKET CAP" value={agent.mcap} color="#D4D0C8" />
          <StatCell label="24H VOLUME" value={agent.volume24h} color="#D4D0C8" />
          <StatCell label="SUMMONED" value={agent.launchDate} color="rgba(212,208,200,0.7)" />
          <StatCell label="INSCRIPTIONS" value={chain.txCount != null ? chain.txCount.toLocaleString() : '—'} color="#4ADE80" />
          <StatCell label="LAST SEEN" value={chain.lastTx || '—'} color="rgba(212,208,200,0.7)" />
          <StatCell label="ENCOUNTERS" value={chain.uniqueInteractions != null ? chain.uniqueInteractions.toLocaleString() : '—'} color="rgba(212,208,200,0.8)" />
        </div>
      </div>

      {/* ── Verification Checks ── */}
      <div
        style={{
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '10px',
            letterSpacing: '0.14em',
            color: 'rgba(212,208,200,0.35)',
            marginBottom: '10px',
          }}
        >
          THE FIVE GAZES
        </div>
        {checks_list.map((check) => (
          <CheckRow
            key={check.key}
            label={check.label}
            status={checks[check.key]}
            description={check.desc}
          />
        ))}
      </div>

      {/* ── Social + Code cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        {/* Social card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '2px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '9px',
              letterSpacing: '0.14em',
              color: 'rgba(212,208,200,0.3)',
              marginBottom: '12px',
            }}
          >
            WHISPERS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: '#1DA1F2',
                }}
              >
                {social.twitter || '—'}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: 'rgba(212,208,200,0.5)',
                }}
              >
                {social.followers || ''}
              </span>
            </div>

            {social.github ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    color: 'rgba(212,208,200,0.6)',
                  }}
                >
                  Archive/{social.github.split('/').pop()}
                </span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '10px',
                    color: '#D4A843',
                  }}
                >
                  ★ {social.stars}
                </span>
              </div>
            ) : (
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: 'rgba(212,208,200,0.2)',
                }}
              >
                No GitHub repository
              </span>
            )}
          </div>
        </div>

        {/* Code card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '2px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '9px',
              letterSpacing: '0.14em',
              color: 'rgba(212,208,200,0.3)',
              marginBottom: '12px',
            }}
          >
            SCROLLS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: agent.code_verified ? '#4ADE80' : '#DC2626',
                  boxShadow: agent.code_verified
                    ? '0 0 6px rgba(74,222,128,0.6)'
                    : '0 0 6px rgba(220,38,38,0.6)',
                }}
              />
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: agent.code_verified ? '#4ADE80' : '#DC2626',
                }}
              >
                {agent.code_verified ? 'SCROLLS VERIFIED' : 'SCROLLS ABSENT'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: 'rgba(212,208,200,0.35)',
                }}
              >
                Invocations
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: 'rgba(212,208,200,0.6)',
                }}
              >
                {chain.contractCalls != null ? chain.contractCalls.toLocaleString() : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Badge status card ── */}
      <div
        style={{
          background: agent.verified === true
            ? 'rgba(74,222,128,0.03)'
            : agent.verified === 'pending'
            ? 'rgba(212,168,67,0.03)'
            : 'rgba(220,38,38,0.03)',
          border: `1px solid ${verColor}25`,
          borderRadius: '2px',
          padding: '16px',
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '9px',
            letterSpacing: '0.14em',
            color: 'rgba(212,208,200,0.3)',
            marginBottom: '12px',
          }}
        >
          WATCHER'S SEAL
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'rgba(212,208,200,0.3)', marginBottom: '4px', letterSpacing: '0.08em' }}>MINTED</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#D4D0C8' }}>{agent.verified === true ? agent.launchDate : '-'}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'rgba(212,208,200,0.3)', marginBottom: '4px', letterSpacing: '0.08em' }}>EXPIRY</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#D4D0C8' }}>{agent.verified === true ? expiryDate : '-'}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'rgba(212,208,200,0.3)', marginBottom: '4px', letterSpacing: '0.08em' }}>STATUS</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: verColor, fontWeight: 600 }}>{verLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
