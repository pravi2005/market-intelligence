import React from 'react'

function Spinner() {
  return (
    <span style={{
      display: 'inline-block', width: '12px', height: '12px',
      border: '2px solid #2d3748', borderTop: '2px solid #fbbf24',
      borderRadius: '50%', animation: 'spin 0.8s linear infinite',
    }} />
  )
}

export default function UrlFeed({ urls, setUrls, onLoad, loading, error }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.1em', marginBottom: '20px' }}>
        PASTE TODAY'S NEWS URLS — UP TO 3 SOURCES
      </div>

      {urls.map((url, i) => (
        <div key={i} style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '10px', color: '#fbbf24', letterSpacing: '0.12em',
            marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{
              display: 'inline-block', width: '18px', height: '18px',
              borderRadius: '3px', background: '#1a1a0a',
              border: '1px solid #92400e', color: '#fbbf24',
              fontSize: '10px', textAlign: 'center', lineHeight: '18px',
            }}>{i + 1}</span>
            SOURCE {i + 1}
            {url.trim() && <span style={{ color: '#4ade80' }}>✓</span>}
          </div>
          <input
            value={url}
            onChange={(e) => {
              const next = [...urls]
              next[i] = e.target.value
              setUrls(next)
            }}
            placeholder="https://bloomberg.com/news/articles/..."
            disabled={loading}
            style={{
              width: '100%', background: 'transparent',
              border: 'none', borderBottom: '1px solid #2d3748',
              color: '#e2e8f0',
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: '13px', padding: '8px 0', outline: 'none',
              opacity: loading ? 0.5 : 1,
            }}
          />
        </div>
      ))}

      {error && (
        <div style={{
          background: '#2e0a0a', border: '1px solid #991b1b',
          borderRadius: '6px', padding: '12px',
          fontSize: '12px', color: '#f87171', marginBottom: '16px',
        }}>
          {error}
        </div>
      )}

      <button
        onClick={onLoad}
        disabled={loading || urls.every((u) => !u.trim())}
        style={{
          background: loading ? '#1a1a0a' : '#fbbf24',
          color: loading ? '#fbbf24' : '#0d1117',
          border: '1px solid #92400e', borderRadius: '6px',
          fontFamily: 'inherit', fontSize: '12px', fontWeight: '600',
          letterSpacing: '0.08em', padding: '12px 24px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
          transition: 'all 0.15s', marginTop: '8px',
        }}
      >
        {loading ? <><Spinner /> FETCHING ARTICLES...</> : '▶  LOAD & ANALYSE ARTICLES'}
      </button>

      {loading && (
        <div style={{ marginTop: '20px', fontSize: '11px', color: '#64748b', lineHeight: '1.8' }}>
          <div style={{ color: '#fbbf24', marginBottom: '4px' }}>// AGENT LOG</div>
          <div>→ Dispatching web search agent to fetch URLs...</div>
          <div>→ Extracting article content and metadata...</div>
          <div>→ Running sentiment and topic analysis...</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <Spinner /> Processing (this may take 15–30 seconds)
          </div>
        </div>
      )}
    </div>
  )
}
