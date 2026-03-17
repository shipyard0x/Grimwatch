'use client';

export default function CheckRow({ label, status, description }) {
  let color, bgColor, icon, badge;

  if (status === true) {
    color = '#4ADE80';
    bgColor = 'rgba(74,222,128,0.08)';
    icon = '■';
    badge = 'SEALED';
  } else if (status === 'partial') {
    color = '#D4A843';
    bgColor = 'rgba(212,168,67,0.08)';
    icon = '◧';
    badge = 'WANING';
  } else {
    color = '#DC2626';
    bgColor = 'rgba(220,38,38,0.08)';
    icon = '□';
    badge = 'VOID';
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.04)',
        marginBottom: '6px',
      }}
    >
      {/* Icon box */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '2px',
          background: bgColor,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '13px',
            color: color,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {icon}
        </span>
      </div>

      {/* Label & description */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#D4D0C8',
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '12px',
              color: 'rgba(212,208,200,0.4)',
              marginTop: '2px',
              fontStyle: 'italic',
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Badge */}
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '8px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          padding: '3px 8px',
          borderRadius: '2px',
          background: bgColor,
          color: color,
          border: `1px solid ${color}30`,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {badge}
      </div>
    </div>
  );
}
