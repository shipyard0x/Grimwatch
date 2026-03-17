'use client';

import AgentCard from './AgentCard';

/**
 * AgentList
 * Renders a list of AgentCard components with staggered fade-in animations.
 * @param {object[]} agents
 * @param {number|null} selectedId
 * @param {function} onSelect
 */
export default function AgentList({ agents, selectedId, onSelect }) {
  if (!agents || agents.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '2px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '20px', color: 'rgba(212,208,200,0.2)' }}>👁</span>
        </div>
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            color: 'rgba(212,208,200,0.3)',
            letterSpacing: '0.08em',
            textAlign: 'center',
          }}
        >
          The vigil finds nothing.
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '13px',
            color: 'rgba(212,208,200,0.2)',
            textAlign: 'center',
          }}
        >
          No souls match your query.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {agents.map((agent, index) => (
        <div
          key={agent.id}
          style={{
            opacity: 0,
            animation: `fadeSlideUp 0.35s ease-out ${index * 0.06}s forwards`,
          }}
        >
          <AgentCard
            agent={agent}
            selected={selectedId === agent.id}
            onClick={() => onSelect(agent)}
          />
        </div>
      ))}
    </div>
  );
}
