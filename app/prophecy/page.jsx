'use client';

const MOCK_MARKETS = [
  {
    id: 1,
    agent: 'AIXBT',
    symbol: '$AIXBT',
    question: 'Will AIXBT remain SEALED in 30 days?',
    sealedPct: 72,
    voidPct: 28,
    volume: '142,800',
    closes: '30d',
    status: 'SEALED',
    statusColor: '#4ADE80',
  },
  {
    id: 2,
    agent: 'GRIFFAIN',
    symbol: '$GRIFFAIN',
    question: 'Will GRIFFAIN go VOID within 14 days?',
    sealedPct: 41,
    voidPct: 59,
    volume: '89,200',
    closes: '14d',
    status: 'WANING',
    statusColor: '#D4A843',
  },
  {
    id: 3,
    agent: 'ZEREBRO',
    symbol: '$ZEREBRO',
    question: 'Will ZEREBRO stay above score 60 in 7 days?',
    sealedPct: 88,
    voidPct: 12,
    volume: '204,500',
    closes: '7d',
    status: 'SEALED',
    statusColor: '#4ADE80',
  },
  {
    id: 4,
    agent: 'DEGENAI',
    symbol: '$DEGENAI',
    question: 'Will DEGENAI fall OBSCURED within 30 days?',
    sealedPct: 33,
    voidPct: 67,
    volume: '61,100',
    closes: '30d',
    status: 'OBSCURED',
    statusColor: '#555555',
  },
];

function ComingSoonOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10,10,15,0.82)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '2px',
        zIndex: 10,
        gap: '8px',
      }}
    >
      <span style={{ fontSize: '20px', opacity: 0.3, animation: 'watchEye 3s ease-in-out infinite' }}>👁</span>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.22em',
          color: '#4ADE80',
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.15)',
          borderRadius: '2px',
          padding: '4px 12px',
          animation: 'runeGlow 2.5s ease-in-out infinite',
        }}
      >
        COMING SOON
      </span>
    </div>
  );
}

function MarketCard({ market }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(74,222,128,0.08)',
        borderRadius: '2px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#D4D0C8',
              }}
            >
              {market.agent}
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                color: 'rgba(212,208,200,0.4)',
                letterSpacing: '0.1em',
              }}
            >
              {market.symbol}
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '15px',
              color: 'rgba(212,208,200,0.6)',
              margin: 0,
              fontStyle: 'italic',
              lineHeight: 1.4,
            }}
          >
            {market.question}
          </p>
        </div>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.14em',
            color: market.statusColor,
            background: `${market.statusColor}10`,
            border: `1px solid ${market.statusColor}30`,
            borderRadius: '2px',
            padding: '3px 8px',
            whiteSpace: 'nowrap',
          }}
        >
          {market.status}
        </span>
      </div>

      {/* Probability bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#4ADE80', letterSpacing: '0.1em' }}>
            SEALED {market.sealedPct}%
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#DC2626', letterSpacing: '0.1em' }}>
            VOID {market.voidPct}%
          </span>
        </div>
        <div
          style={{
            height: '6px',
            background: 'rgba(220,38,38,0.25)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${market.sealedPct}%`,
              background: 'linear-gradient(90deg, #4ADE80, rgba(74,222,128,0.6))',
              boxShadow: '0 0 8px rgba(74,222,128,0.4)',
              borderRadius: '2px',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(74,222,128,0.06)',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', letterSpacing: '0.14em', color: 'rgba(212,208,200,0.3)', marginBottom: '2px' }}>VOLUME</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#D4D0C8' }}>${market.volume}</div>
        </div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', letterSpacing: '0.14em', color: 'rgba(212,208,200,0.3)', marginBottom: '2px' }}>CLOSES IN</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#D4D0C8' }}>{market.closes}</div>
        </div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', letterSpacing: '0.14em', color: 'rgba(212,208,200,0.3)', marginBottom: '2px' }}>WATCHERS</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#D4D0C8' }}>—</div>
        </div>
      </div>

      {/* Bet buttons */}
      <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
        <button
          disabled
          style={{
            flex: 1,
            padding: '10px',
            background: 'rgba(74,222,128,0.06)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '2px',
            fontFamily: "'Cinzel', serif",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#4ADE80',
            cursor: 'not-allowed',
          }}
        >
          ✦ STAKE SEALED
        </button>
        <button
          disabled
          style={{
            flex: 1,
            padding: '10px',
            background: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: '2px',
            fontFamily: "'Cinzel', serif",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#DC2626',
            cursor: 'not-allowed',
          }}
        >
          ✕ STAKE VOID
        </button>

        <ComingSoonOverlay />
      </div>
    </div>
  );
}

export default function ProphecyPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 800,
              fontSize: 'clamp(22px, 4vw, 36px)',
              letterSpacing: '0.2em',
              color: '#D4D0C8',
              margin: 0,
            }}
          >
            THE PROPHECY MARKET
          </h1>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: '#D4A843',
              background: 'rgba(212,168,67,0.08)',
              border: '1px solid rgba(212,168,67,0.2)',
              borderRadius: '2px',
              padding: '3px 10px',
              animation: 'runeGlow 2.5s ease-in-out infinite',
            }}
          >
            COMING SOON
          </span>
        </div>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '17px',
            color: 'rgba(212,208,200,0.45)',
            margin: 0,
            fontStyle: 'italic',
          }}
        >
          Stake your conviction. Wager on the fate of agents. The watchers settle all debts.
        </p>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.08)',
          borderRadius: '2px',
          marginBottom: '32px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {[
          { label: 'TOTAL VOLUME', value: '—' },
          { label: 'OPEN MARKETS', value: '—' },
          { label: 'WATCHERS STAKED', value: '—' },
          { label: 'SETTLED TODAY', value: '—' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: '16px 20px',
              background: 'rgba(10,10,15,0.8)',
            }}
          >
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', letterSpacing: '0.16em', color: 'rgba(212,208,200,0.3)', marginBottom: '4px' }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '18px', color: '#4ADE80' }}>
              {stat.value}
            </div>
          </div>
        ))}
        <ComingSoonOverlay />
      </div>

      {/* Filter row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL MARKETS', 'CLOSING SOON', 'HIGH VOLUME', 'MY STAKES'].map((f, i) => (
            <button
              key={f}
              disabled
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                padding: '6px 12px',
                borderRadius: '2px',
                border: i === 0 ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(74,222,128,0.08)',
                background: i === 0 ? 'rgba(74,222,128,0.06)' : 'transparent',
                color: i === 0 ? '#4ADE80' : 'rgba(212,208,200,0.35)',
                cursor: 'not-allowed',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          disabled
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            padding: '8px 20px',
            borderRadius: '2px',
            border: '1px solid rgba(74,222,128,0.2)',
            background: 'rgba(74,222,128,0.06)',
            color: '#4ADE80',
            cursor: 'not-allowed',
            opacity: 0.5,
          }}
        >
          + PROPOSE A MARKET
        </button>
      </div>

      {/* Market cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '12px', marginBottom: '40px' }}>
        {MOCK_MARKETS.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {/* My Stakes section */}
      <div
        style={{
          border: '1px solid rgba(74,222,128,0.08)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid rgba(74,222,128,0.06)',
            background: 'rgba(74,222,128,0.03)',
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: '#D4D0C8',
            }}
          >
            MY ACTIVE STAKES
          </span>
        </div>
        <div
          style={{
            padding: '48px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', color: 'rgba(212,208,200,0.2)' }}>
            CONNECT WALLET TO VIEW YOUR STAKES
          </div>
        </div>

        {/* Connect wallet button */}
        <div style={{ padding: '0 20px 20px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <button
            disabled
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              padding: '10px 32px',
              borderRadius: '2px',
              border: '1px solid rgba(74,222,128,0.2)',
              background: 'rgba(74,222,128,0.06)',
              color: '#4ADE80',
              cursor: 'not-allowed',
              opacity: 0.5,
            }}
          >
            CONNECT WALLET
          </button>
          <ComingSoonOverlay />
        </div>
      </div>

      {/* How it works */}
      <div style={{ marginTop: '48px' }}>
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'rgba(212,208,200,0.4)',
            marginBottom: '20px',
          }}
        >
          HOW THE PROPHECY MARKET WORKS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            { icon: '👁', title: 'PICK YOUR FATE', desc: 'Choose an agent. Stake on whether it stays SEALED or falls to VOID within the timeframe.' },
            { icon: '⚖', title: 'THE WATCHERS JUDGE', desc: "Grimwatch's on-chain scanner settles each market at close. No human intervention." },
            { icon: '✦', title: 'EARN YOUR SPOILS', desc: 'Correct stakers split the losing pool. The more you stake, the more you earn.' },
            { icon: '⚔', title: 'PROPOSE A MARKET', desc: 'Token holders can propose new markets. Community votes to open them.' },
          ].map((step) => (
            <div
              key={step.title}
              style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(74,222,128,0.06)',
                borderRadius: '2px',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>{step.icon}</div>
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#4ADE80',
                  marginBottom: '8px',
                }}
              >
                {step.title}
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '14px',
                  color: 'rgba(212,208,200,0.45)',
                  margin: 0,
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
