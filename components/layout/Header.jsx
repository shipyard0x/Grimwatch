'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/agents', label: 'Explorer' },
  { href: '/submit', label: 'Submit' },
  { href: '/docs', label: 'API Docs' },
  { href: '/rewards', label: 'Rewards' },
  { href: '/prophecy', label: 'Prophecy Market' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        height: '60px',
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(74,222,128,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Logo */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(74,222,128,0.25)',
            animation: 'candleFlicker 3s ease-in-out infinite',
          }}
        >
          <Image src="/logo.png" alt="Grimwatch" width={36} height={36} style={{ display: 'block' }} />
        </div>

        {/* Wordmark */}
        <div>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 800,
              fontSize: '16px',
              letterSpacing: '0.2em',
              lineHeight: 1,
            }}
          >
            <span style={{ color: '#D4D0C8' }}>GRIM</span>
            <span style={{ color: '#4ADE80' }}>WATCH</span>
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '7px',
              letterSpacing: '0.18em',
              color: 'rgba(212,208,200,0.3)',
              marginTop: '2px',
            }}
          >
            THE GRIM WATCHERS OF THE CHAIN
          </div>
        </div>
      </Link>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                padding: '6px 12px',
                borderRadius: '2px',
                textDecoration: 'none',
                transition: 'all 0.15s',
                color: isActive ? '#4ADE80' : 'rgba(212,208,200,0.5)',
                background: isActive ? 'rgba(74,222,128,0.06)' : 'transparent',
                border: isActive ? '1px solid rgba(74,222,128,0.15)' : '1px solid transparent',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right side: X link + wallet + vigil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* X / Twitter link */}
        <a
          href="https://x.com/GrimwatchHQ"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '2px',
            border: '1px solid rgba(74,222,128,0.1)',
            background: 'transparent',
            color: 'rgba(212,208,200,0.4)',
            textDecoration: 'none',
            fontSize: '12px',
            fontFamily: 'serif',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)';
            e.currentTarget.style.color = '#4ADE80';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(74,222,128,0.1)';
            e.currentTarget.style.color = 'rgba(212,208,200,0.4)';
          }}
          title="@GrimwatchHQ on X"
        >
          𝕏
        </a>

        {/* Wallet connect button */}
        <button
          disabled
          title="Wallet connect — coming soon"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            padding: '5px 12px',
            borderRadius: '2px',
            border: '1px solid rgba(74,222,128,0.15)',
            background: 'rgba(74,222,128,0.04)',
            color: 'rgba(212,208,200,0.35)',
            cursor: 'not-allowed',
            whiteSpace: 'nowrap',
          }}
        >
          CONNECT WALLET
        </button>

        {/* Vigil indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(74,222,128,0.15)',
            borderRadius: '2px',
            padding: '4px 12px',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#4ADE80',
              boxShadow: '0 0 6px rgba(74,222,128,0.6)',
              animation: 'candleFlicker 3s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '9px',
              letterSpacing: '0.14em',
              color: '#4ADE80',
              fontWeight: 600,
            }}
          >
            VIGIL ACTIVE
          </span>
        </div>
      </div>
    </header>
  );
}
