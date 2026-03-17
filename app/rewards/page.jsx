export default function RewardsPage() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Faint eye icon */}
      <div
        style={{
          fontSize: '64px',
          marginBottom: '32px',
          opacity: 0.15,
          filter: 'drop-shadow(0 0 20px rgba(74,222,128,0.4))',
          animation: 'watchEye 3s ease-in-out infinite',
        }}
      >
        👁
      </div>

      {/* Page heading */}
      <h1
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 800,
          fontSize: 'clamp(28px, 5vw, 48px)',
          letterSpacing: '0.22em',
          color: '#D4D0C8',
          margin: '0 0 8px 0',
        }}
      >
        REWARDS
      </h1>

      {/* Divider line */}
      <div
        style={{
          width: '60px',
          height: '1px',
          background: 'rgba(74,222,128,0.3)',
          margin: '16px auto 24px',
          boxShadow: '0 0 8px rgba(74,222,128,0.3)',
        }}
      />

      {/* Coming soon label */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.22em',
          color: '#4ADE80',
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.15)',
          borderRadius: '2px',
          padding: '8px 20px',
          marginBottom: '24px',
          animation: 'runeGlow 2.5s ease-in-out infinite',
        }}
      >
        COMING SOON
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '18px',
          color: 'rgba(212,208,200,0.4)',
          maxWidth: '420px',
          lineHeight: 1.7,
          margin: 0,
          fontStyle: 'italic',
        }}
      >
        The watchers prepare your spoils. Rewards for those who serve the vigil are forthcoming.
      </p>
    </div>
  );
}
