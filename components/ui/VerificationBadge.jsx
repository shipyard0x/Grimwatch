'use client';

export default function VerificationBadge({ verified, size = 'md' }) {
  const sizeMap = {
    sm: { outer: 18, inner: 12, font: 9 },
    md: { outer: 28, inner: 18, font: 13 },
    lg: { outer: 48, inner: 32, font: 22 },
  };

  const dim = sizeMap[size] || sizeMap.md;

  let color, bgColor, shadowColor, icon;

  if (verified === true) {
    color = '#4ADE80';
    bgColor = 'rgba(74,222,128,0.1)';
    shadowColor = 'rgba(74,222,128,0.35)';
    icon = '✦';
  } else if (verified === 'pending') {
    color = '#D4A843';
    bgColor = 'rgba(212,168,67,0.1)';
    shadowColor = 'rgba(212,168,67,0.35)';
    icon = '◑';
  } else {
    color = '#DC2626';
    bgColor = 'rgba(220,38,38,0.1)';
    shadowColor = 'rgba(220,38,38,0.35)';
    icon = '✕';
  }

  return (
    <div
      title={
        verified === true
          ? 'Sealed by the Watchers'
          : verified === 'pending'
          ? 'Waning — Under Observation'
          : 'Void — Cast into darkness'
      }
      style={{
        width: dim.outer,
        height: dim.outer,
        borderRadius: '2px',
        background: bgColor,
        border: `1px solid ${color}50`,
        boxShadow: `0 0 6px ${shadowColor}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: dim.font,
          color: color,
          lineHeight: 1,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {icon}
      </span>
    </div>
  );
}
