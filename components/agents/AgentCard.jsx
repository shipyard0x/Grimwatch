'use client';

import VerificationBadge from '../ui/VerificationBadge';
import { scoreColor, statusLabel } from '../../lib/scoring';

/**
 * AgentCard
 * Compact card for the agent list.
 * @param {object} agent
 * @param {boolean} selected - highlight with green border
 * @param {function} onClick
 */
export default function AgentCard({ agent, selected, onClick }) {
  const color = scoreColor(agent.score);

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? 'rgba(74,222,128,0.04)' : 'rgba(255,255,255,0.01)',
        border: selected
          ? '1px solid rgba(74,222,128,0.35)'
          : '1px solid rgba(255,255,255,0.03)',
        borderRadius: '2px',
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.18s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: selected ? '0 0 12px rgba(74,222,128,0.1)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)';
        }
      }}
    >
      {/* Selected indicator bar */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: '#4ADE80',
            boxShadow: '0 0 8px rgba(74,222,128,0.6)',
          }}
        />
      )}

      {/* Logo avatar */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '2px',
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '16px',
            color: color,
          }}
        >
          {agent.logo}
        </span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: '13px',
              color: '#D4D0C8',
              letterSpacing: '0.04em',
            }}
          >
            {agent.name}
          </span>
          <VerificationBadge verified={agent.verified} size="sm" />
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: 'rgba(212,208,200,0.35)',
            }}
          >
            {agent.ticker}
          </span>
        </div>

        {/* Address + category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: 'rgba(212,208,200,0.3)',
            }}
          >
            {agent.address}
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '9px',
              padding: '2px 6px',
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(212,208,200,0.5)',
              letterSpacing: '0.04em',
            }}
          >
            {agent.category}
          </span>
        </div>
      </div>

      {/* Score */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '2px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: '20px',
            color: color,
            lineHeight: 1,
          }}
        >
          {agent.score}
        </span>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '8px',
            letterSpacing: '0.1em',
            color: 'rgba(212,208,200,0.3)',
          }}
        >
          SCORE
        </span>
      </div>
    </div>
  );
}
