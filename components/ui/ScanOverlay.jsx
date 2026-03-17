'use client';

import { useEffect, useState } from 'react';

/**
 * ScanOverlay
 * Full-screen scanning animation overlay.
 * Calls onComplete after ~1.8 seconds.
 * @param {string} agentName - name of agent being scanned
 * @param {string} logoLetter - single letter for the logo avatar
 * @param {function} onComplete - called when scan is done
 */
export default function ScanOverlay({ agentName, logoLetter, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0=init, 1=scanning, 2=done

  useEffect(() => {
    // Animate progress bar
    const start = Date.now();
    const duration = 1600;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.round(pct));
      if (elapsed < 300) setPhase(0);
      else if (elapsed < 1400) setPhase(1);
      else setPhase(2);

      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 200);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete]);

  const phaseColor = phase === 2 ? '#4ADE80' : 'rgba(74,222,128,0.8)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(10,10,15,0.96)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
      }}
    >
      {/* Eye icon with watchEye animation */}
      <div
        style={{
          fontSize: '64px',
          animation: 'watchEye 1.5s ease-in-out infinite',
          filter: 'drop-shadow(0 0 12px rgba(74,222,128,0.5))',
        }}
      >
        👁
      </div>

      {/* Main heading */}
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0.3em',
          color: '#4ADE80',
          textAlign: 'center',
          animation: 'runeGlow 2s ease-in-out infinite',
        }}
      >
        THE WATCHERS GAZE...
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '15px',
          fontStyle: 'italic',
          color: 'rgba(212,208,200,0.5)',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        Peering into the darkness of the chain
      </div>

      {/* Agent name */}
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '16px',
          fontWeight: 600,
          color: '#D4D0C8',
          letterSpacing: '0.15em',
          textAlign: 'center',
        }}
      >
        {agentName}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '240px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            height: '3px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, rgba(74,222,128,0.6), #4ADE80)',
              borderRadius: '2px',
              boxShadow: '0 0 8px rgba(74,222,128,0.5)',
              transition: 'width 0.05s linear',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            color: 'rgba(212,208,200,0.3)',
            letterSpacing: '0.08em',
          }}
        >
          <span>SCANNING ON-CHAIN DATA</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', opacity: 0.15 }}>
        <div style={{ width: '16px', height: '16px', borderTop: '1px solid #4ADE80', borderLeft: '1px solid #4ADE80' }} />
      </div>
      <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.15 }}>
        <div style={{ width: '16px', height: '16px', borderTop: '1px solid #4ADE80', borderRight: '1px solid #4ADE80' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', opacity: 0.15 }}>
        <div style={{ width: '16px', height: '16px', borderBottom: '1px solid #4ADE80', borderLeft: '1px solid #4ADE80' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', opacity: 0.15 }}>
        <div style={{ width: '16px', height: '16px', borderBottom: '1px solid #4ADE80', borderRight: '1px solid #4ADE80' }} />
      </div>
    </div>
  );
}
