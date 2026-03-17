'use client';

import { useEffect, useRef, useState } from 'react';
import { scoreColor } from '../../lib/scoring';

/**
 * ScoreRing
 * SVG donut ring that animates from 0 to the score value on mount.
 * @param {number} score - 0 to 100
 * @param {number} size - pixel diameter (default 100)
 */
export default function ScoreRing({ score: rawScore, size = 100 }) {
  const score = (typeof rawScore === 'number' && !isNaN(rawScore)) ? rawScore : 0;
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(null);
  const startRef = useRef(null);

  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(score);

  // Animate from 0 to score
  useEffect(() => {
    const duration = 1200;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [score]);

  const offset = circumference - (displayed / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 6px ${color}80)`,
            transition: 'stroke-dashoffset 0.05s linear',
          }}
        />
      </svg>

      {/* Center label */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            fontSize: size * 0.22,
            color: color,
            lineHeight: 1,
          }}
        >
          {displayed}
        </span>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: size * 0.09,
            letterSpacing: '0.12em',
            color: 'rgba(212,208,200,0.35)',
            marginTop: '2px',
          }}
        >
          VIGIL
        </span>
      </div>
    </div>
  );
}
