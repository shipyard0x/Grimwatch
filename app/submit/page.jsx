'use client';

import { useState } from 'react';

const CHECKS_INFO = [
  {
    key: 'onchain',
    label: 'ON-CHAIN SOUL ACTIVITY',
    icon: '\u26D3',
    color: '#4ADE80',
    desc: 'We scan your smart contract for verifiable interactions, transaction volume, and unique wallet interactions on Solana mainnet. Minimum threshold: 500 transactions.',
  },
  {
    key: 'codeAudit',
    label: 'CONTRACT GRIMOIRE AUDIT',
    icon: '\u{1F4DC}',
    color: '#4ADE80',
    desc: 'Source code must be publicly available and verifiable. We check GitHub repositories for commit history, test coverage, and third-party audit reports.',
  },
  {
    key: 'socialProof',
    label: 'IDENTITY BEYOND THE VEIL',
    icon: '\u{1F465}',
    color: '#D4A843',
    desc: 'Twitter/X account with organic followers. GitHub stars and community engagement signals. We verify follower authenticity and engagement rates.',
  },
  {
    key: 'aiInference',
    label: 'TRUE ARCANE INFERENCE',
    icon: '\u{1F9E0}',
    color: '#4ADE80',
    desc: 'Critical check: We detect actual on-chain ML/AI inference calls using known Solana AI program signatures. This is the primary differentiator from regular bots.',
  },
  {
    key: 'governance',
    label: 'COUNCIL OF GOVERNANCE',
    icon: '\u{1F3DB}',
    color: '#D4A843',
    desc: 'Optional but scored: DAO governance token with verifiable proposal history and on-chain voting records using Realms or custom governance programs.',
  },
];

function CheckInfoCard({ check }) {
  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.04)',
        marginBottom: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <span style={{ fontSize: '16px' }}>{check.icon}</span>
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: check.color,
          }}
        >
          {check.label}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '12px',
          color: 'rgba(212,208,200,0.45)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {check.desc}
      </p>
    </div>
  );
}

function FormField({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        style={{
          display: 'block',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'rgba(212,208,200,0.5)',
          marginBottom: '8px',
        }}
      >
        {label}
        {required && (
          <span style={{ color: '#DC2626', marginLeft: '4px' }}>*</span>
        )}
      </label>
      {children}
      {hint && (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '11px',
            color: 'rgba(212,208,200,0.25)',
            marginTop: '6px',
            marginBottom: 0,
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export default function SubmitPage() {
  const [form, setForm] = useState({
    address: '',
    name: '',
    website: '',
    twitter: '',
    github: '',
  });
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState('idle'); // idle | scanning | success
  const [scanProgress, setScanProgress] = useState(0);

  const solanaAddressPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  const validate = () => {
    const errs = {};
    if (!form.address.trim()) {
      errs.address = 'Contract address is required';
    } else if (!solanaAddressPattern.test(form.address.trim())) {
      errs.address = 'Invalid Solana address format (base58, 32-44 chars)';
    }
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setPhase('scanning');
    setScanProgress(0);

    const start = Date.now();
    const duration = 2000;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setScanProgress(Math.round(pct));
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        setPhase('success');
      }
    };
    requestAnimationFrame(tick);
  };

  const handleReset = () => {
    setForm({ address: '', name: '', website: '', twitter: '', github: '' });
    setErrors({});
    setPhase('idle');
    setScanProgress(0);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div
        style={{
          marginBottom: '40px',
          opacity: 0,
          animation: 'fadeSlideUp 0.4s ease-out 0.05s forwards',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div
            style={{
              width: '4px',
              height: '24px',
              background: '#4ADE80',
              borderRadius: '2px',
              boxShadow: '0 0 8px rgba(74,222,128,0.5)',
            }}
          />
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: '0.1em',
              color: '#D4D0C8',
              margin: 0,
            }}
          >
            SUBMIT FOR THE VIGIL
          </h1>
        </div>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '14px',
            color: 'rgba(212,208,200,0.4)',
            marginLeft: '14px',
          }}
        >
          Inscribe your Solana agent's address. The Watchers will peer into the chain and render judgement.
          Results are typically available within 2–4 hours.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '28px',
          alignItems: 'start',
          opacity: 0,
          animation: 'fadeSlideUp 0.4s ease-out 0.15s forwards',
        }}
      >
        {/* ── Form ── */}
        <div
          style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '2px',
            padding: '28px',
          }}
        >
          {phase === 'idle' && (
            <form onSubmit={handleSubmit} noValidate>
              <FormField
                label="CONTRACT ADDRESS"
                required
                hint="Your agent's deployed Solana program address (base58 encoded)"
              >
                <input
                  type="text"
                  value={form.address}
                  onChange={handleChange('address')}
                  placeholder="e.g. 5K7mRzBqVcN8x9QpDFgH..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderColor: errors.address ? '#DC2626' : undefined,
                  }}
                />
                {errors.address && (
                  <p
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10px',
                      color: '#DC2626',
                      marginTop: '6px',
                      marginBottom: 0,
                    }}
                  >
                    \u26A0 {errors.address}
                  </p>
                )}
              </FormField>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', paddingTop: '20px' }}>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    color: 'rgba(212,208,200,0.25)',
                    marginBottom: '16px',
                  }}
                >
                  OPTIONAL FIELDS — Help improve your verification score
                </p>

                <FormField label="PROJECT NAME" hint="Human-readable name for your agent">
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="e.g. GRIFFAIN"
                    style={{ width: '100%', padding: '10px 14px' }}
                  />
                </FormField>

                <FormField label="WEBSITE URL" hint="Official project website or documentation">
                  <input
                    type="url"
                    value={form.website}
                    onChange={handleChange('website')}
                    placeholder="https://yourproject.io"
                    style={{ width: '100%', padding: '10px 14px' }}
                  />
                </FormField>

                <FormField label="TWITTER / X HANDLE" hint="Twitter handle without @ symbol">
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '13px',
                        color: 'rgba(212,208,200,0.3)',
                        pointerEvents: 'none',
                      }}
                    >
                      @
                    </span>
                    <input
                      type="text"
                      value={form.twitter}
                      onChange={handleChange('twitter')}
                      placeholder="yourhandle"
                      style={{ width: '100%', padding: '10px 14px 10px 26px' }}
                    />
                  </div>
                </FormField>

                <FormField label="GITHUB REPOSITORY" hint="Format: username/repository-name">
                  <input
                    type="text"
                    value={form.github}
                    onChange={handleChange('github')}
                    placeholder="e.g. griffain-protocol/core"
                    style={{ width: '100%', padding: '10px 14px' }}
                  />
                </FormField>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '2px',
                  border: '1px solid rgba(74,222,128,0.4)',
                  background: 'rgba(74,222,128,0.1)',
                  color: '#4ADE80',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: '0 0 16px rgba(74,222,128,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(74,222,128,0.16)';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(74,222,128,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(74,222,128,0.1)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(74,222,128,0.1)';
                }}
              >
                INVOKE THE WATCHERS
              </button>
            </form>
          )}

          {phase === 'scanning' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 20px',
                gap: '24px',
              }}
            >
              {/* Eye with watchEye animation */}
              <div
                style={{
                  fontSize: '64px',
                  animation: 'watchEye 1.5s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 12px rgba(74,222,128,0.5))',
                }}
              >
                👁
              </div>

              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '13px', letterSpacing: '0.16em', color: '#4ADE80', fontWeight: 600 }}>
                THE WATCHERS GAZE...
              </div>

              <div style={{ width: '280px' }}>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${scanProgress}%`,
                      background: 'linear-gradient(90deg, rgba(74,222,128,0.5), #4ADE80)',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px rgba(74,222,128,0.4)',
                      transition: 'width 0.05s linear',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'rgba(212,208,200,0.3)' }}>
                  <span>THE WATCHERS GAZE...</span>
                  <span>{scanProgress}%</span>
                </div>
              </div>

              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: 'rgba(212,208,200,0.35)', textAlign: 'center' }}>
                Scanning contract <code style={{ color: '#4ADE80', fontSize: '11px' }}>{form.address.slice(0, 12)}...</code>
              </p>
            </div>
          )}

          {phase === 'success' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 20px',
                gap: '20px',
                textAlign: 'center',
                opacity: 0,
                animation: 'fadeSlideUp 0.4s ease-out forwards',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '2px',
                  background: 'rgba(74,222,128,0.1)',
                  border: '2px solid rgba(74,222,128,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 24px rgba(74,222,128,0.2)',
                }}
              >
                <span style={{ fontSize: '32px', color: '#4ADE80' }}>\u2713</span>
              </div>

              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '16px', letterSpacing: '0.1em', color: '#4ADE80', margin: '0 0 8px' }}>
                  THE WATCHERS STIR
                </h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', color: 'rgba(212,208,200,0.55)', lineHeight: 1.6, margin: 0 }}>
                  The soul has been offered to the vigil. Seek it in the Explorer.
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '2px',
                  padding: '16px 20px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(212,208,200,0.3)' }}>ADDRESS</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#D4D0C8' }}>{form.address.slice(0, 16)}...</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(212,208,200,0.3)' }}>STATUS</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#4ADE80', fontWeight: 600 }}>SCANNING</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(212,208,200,0.3)' }}>EST. TIME</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#D4D0C8' }}>~10 seconds</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                style={{
                  padding: '10px 24px',
                  borderRadius: '2px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  color: 'rgba(212,208,200,0.5)',
                  fontFamily: "'Cinzel', serif",
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#D4D0C8';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(212,208,200,0.5)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                OFFER ANOTHER SOUL
              </button>
            </div>
          )}
        </div>

        {/* ── Sidebar info ── */}
        <div>
          <div
            style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '2px',
              padding: '20px',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
                letterSpacing: '0.14em',
                color: 'rgba(212,208,200,0.3)',
                marginBottom: '16px',
                marginTop: 0,
              }}
            >
              THE FIVE GAZES
            </h3>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: 'rgba(212,208,200,0.45)', lineHeight: 1.6, marginBottom: '16px', marginTop: 0 }}>
              Grimwatch casts five gazes upon the soul. Each gaze is weighted to produce a final Vigil Score from 0–100.
            </p>
            {CHECKS_INFO.map((c) => (
              <CheckInfoCard key={c.key} check={c} />
            ))}
          </div>

          {/* Score tiers */}
          <div
            style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '2px',
              padding: '20px',
            }}
          >
            <h3
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
                letterSpacing: '0.14em',
                color: 'rgba(212,208,200,0.3)',
                marginBottom: '14px',
                marginTop: 0,
              }}
            >
              SCORE TIERS
            </h3>
            {[
              { range: '85–100', label: 'SEALED', color: '#4ADE80' },
              { range: '60–84', label: 'WANING', color: '#D4A843' },
              { range: '30–59', label: 'OBSCURED', color: '#555555' },
              { range: '0–29', label: 'VOID', color: '#DC2626' },
            ].map((tier) => (
              <div
                key={tier.range}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '10px', color: tier.color, fontWeight: 600 }}>
                  {tier.label}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'rgba(212,208,200,0.3)' }}>
                  {tier.range}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
