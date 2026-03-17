'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import AgentList from '../../components/agents/AgentList';
import AgentDetail from '../../components/agents/AgentDetail';
import ScanOverlay from '../../components/ui/ScanOverlay';

const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const FILTERS = ['All Souls', 'Sealed', 'Waning', 'Void'];

const SORT_OPTIONS = [
  { value: 'score-desc', label: 'Score (High \u2192 Low)' },
  { value: 'score-asc', label: 'Score (Low \u2192 High)' },
  { value: 'name-asc', label: 'Name (A \u2192 Z)' },
  { value: 'launch-desc', label: 'Launch Date (Newest)' },
];

export default function AgentsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Souls');
  const [sort, setSort] = useState('score-desc');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [pendingAgent, setPendingAgent] = useState(null);
  const [liveError, setLiveError] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [allAgents, setAllAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const pollRef = useRef(null);

  // Fetch all agents from API (mock + submitted)
  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/agents');
      const data = await res.json();
      setAllAgents(data.agents || []);
    } catch {
      // fallback: keep current
    } finally {
      setLoadingAgents(false);
    }
  }, []);

  // Initial load + poll every 5s so scan results appear automatically
  useEffect(() => {
    fetchAgents();
    pollRef.current = setInterval(fetchAgents, 5000);
    return () => clearInterval(pollRef.current);
  }, [fetchAgents]);

  // Filter + sort agents from API data
  const filteredAgents = useMemo(() => {
    let agents = [...allAgents];

    if (search.trim()) {
      const q = search.toLowerCase();
      agents = agents.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.ticker?.toLowerCase().includes(q) ||
          a.address?.toLowerCase().includes(q) ||
          a.fullAddress?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q)
      );
    }

    if (filter === 'Sealed')   agents = agents.filter((a) => a.verified === true);
    else if (filter === 'Waning')    agents = agents.filter((a) => a.verified === 'pending');
    else if (filter === 'Void') agents = agents.filter((a) => a.verified === false);

    if (sort === 'score-desc') agents.sort((a, b) => b.score - a.score);
    else if (sort === 'score-asc') agents.sort((a, b) => a.score - b.score);
    else if (sort === 'name-asc') agents.sort((a, b) => a.name?.localeCompare(b.name));
    else if (sort === 'launch-desc')
      agents.sort((a, b) => new Date(b.launchDate) - new Date(a.launchDate));

    return agents;
  }, [search, filter, sort, allAgents]);

  const handleSelectAgent = useCallback((agent) => {
    if (selectedAgent?.fullAddress === agent.fullAddress) return;
    setPendingAgent(agent);
    setScanning(true);
    setLiveError(null);
  }, [selectedAgent]);

  const handleScanComplete = useCallback(() => {
    setScanning(false);
    setSelectedAgent(pendingAgent);
    setPendingAgent(null);
  }, [pendingAgent]);

  const handleBack = useCallback(() => {
    setSelectedAgent(null);
    setLiveError(null);
  }, []);

  // Live address lookup — called when user presses Enter on a Solana address
  const handleLiveLookup = useCallback(async (address) => {
    setLiveError(null);
    setLiveLoading(true);
    const stub = { name: address.slice(0, 6) + '...', logo: '?', fullAddress: address, address: address.slice(0,4)+'...'+address.slice(-4) };
    setPendingAgent(stub);
    setScanning(true);
    try {
      const res = await fetch(`/api/v1/agents/${address}`);
      const data = await res.json();
      if (!res.ok) {
        setLiveError(data.error || 'Lookup failed');
        setScanning(false);
        setPendingAgent(null);
      } else {
        // scan overlay will finish; store result so handleScanComplete picks it up
        setPendingAgent(data.agent);
      }
    } catch (e) {
      setLiveError(e.message);
      setScanning(false);
      setPendingAgent(null);
    } finally {
      setLiveLoading(false);
    }
  }, []);

  const filterCounts = useMemo(() => ({
    'All Souls': allAgents.length,
    'Sealed': allAgents.filter((a) => a.verified === true).length,
    'Waning': allAgents.filter((a) => a.verified === 'pending').length,
    'Void': allAgents.filter((a) => a.verified === false).length,
  }), [allAgents]);

  return (
    <>
      {/* Scan Overlay */}
      {scanning && pendingAgent && (
        <ScanOverlay
          agentName={pendingAgent.name}
          logoLetter={pendingAgent.logo}
          onComplete={handleScanComplete}
        />
      )}

      <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>

        {/* ── Top bar ── */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            background: 'rgba(10,10,15,0.8)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h1
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: '18px',
                  letterSpacing: '0.1em',
                  color: '#D4D0C8',
                  margin: 0,
                }}
              >
                AGENT EXPLORER
              </h1>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '13px',
                  color: 'rgba(212,208,200,0.35)',
                  margin: '3px 0 0',
                }}
              >
                {filteredAgents.length} of {allAgents.length} agents shown
              </p>
            </div>

            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: '11px',
                fontFamily: "'IBM Plex Mono', monospace",
                letterSpacing: '0.04em',
                minWidth: '200px',
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search + filters row */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(212,208,200,0.25)',
                  fontSize: '12px',
                  pointerEvents: 'none',
                }}
              >
                &#128269;
              </span>
              <input
                type="text"
                placeholder="Speak the name you seek — or inscribe a Solana address to gaze upon..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setLiveError(null); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && SOLANA_ADDRESS_RE.test(search.trim())) {
                    handleLiveLookup(search.trim());
                  }
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 32px',
                }}
              />
              {/* Live lookup hint */}
              {SOLANA_ADDRESS_RE.test(search.trim()) && (
                <button
                  onClick={() => handleLiveLookup(search.trim())}
                  disabled={liveLoading}
                  style={{
                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                    padding: '4px 10px', borderRadius: '2px', fontSize: '10px', fontWeight: 700,
                    fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em',
                    background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)',
                    color: '#4ADE80', cursor: 'pointer',
                  }}
                >
                  {liveLoading ? 'SCANNING...' : '⏎ SCAN LIVE'}
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {FILTERS.map((f) => {
                const isActive = filter === f;
                let activeColor = '#4ADE80';
                if (f === 'Waning') activeColor = '#D4A843';
                if (f === 'Void') activeColor = '#DC2626';
                if (f === 'All Souls') activeColor = 'rgba(212,208,200,0.8)';

                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                      padding: '6px 12px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      border: isActive ? `1px solid ${activeColor}50` : '1px solid rgba(255,255,255,0.08)',
                      background: isActive ? `${activeColor}12` : 'transparent',
                      color: isActive ? activeColor : 'rgba(212,208,200,0.45)',
                    }}
                  >
                    {f}
                    <span
                      style={{
                        marginLeft: '5px',
                        fontSize: '9px',
                        opacity: 0.6,
                      }}
                    >
                      {filterCounts[f]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Live error banner ── */}
        {liveError && (
          <div style={{
            padding: '10px 24px', background: 'rgba(220,38,38,0.08)',
            borderBottom: '1px solid rgba(220,38,38,0.2)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ color: '#DC2626', fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace" }}>
              ✗ {liveError}
            </span>
            <button onClick={() => setLiveError(null)} style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '12px',
            }}>✕</button>
          </div>
        )}

        {/* ── Split panel ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left — Agent list (38%) */}
          <div
            style={{
              width: selectedAgent ? '38%' : '100%',
              flexShrink: 0,
              borderRight: selectedAgent ? '1px solid rgba(255,255,255,0.04)' : 'none',
              overflowY: 'auto',
              padding: '16px',
              transition: 'width 0.3s ease',
            }}
          >
            <AgentList
              agents={filteredAgents}
              selectedId={selectedAgent?.id}
              onSelect={handleSelectAgent}
            />
          </div>

          {/* Right — Agent detail (62%) */}
          {selectedAgent && (
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <AgentDetail agent={selectedAgent} onBack={handleBack} />
            </div>
          )}

          {/* Empty state when no agent selected */}
          {!selectedAgent && filteredAgents.length > 0 && (
            <div
              style={{
                display: 'none', // hidden — full width list when no selection
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
