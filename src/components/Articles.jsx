import React from 'react'

const SENTIMENT_COLOR = {
  bullish: { bg: '#0a2e1a', text: '#4ade80', border: '#166534' },
  bearish: { bg: '#2e0a0a', text: '#f87171', border: '#991b1b' },
  neutral:  { bg: '#1a1a0a', text: '#fbbf24', border: '#92400e' },
}

export default function Articles({ articles }) {
  if (articles.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#475569', fontSize: '13px', padding: '60px 0' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📰</div>
        No articles loaded yet. Go to the URL Feed tab and load your news sources.
      </div>
    )
  }

  return (
    <div>
      {articles.map((article, i) => {
        const sent = SENTIMENT_COLOR[article.sentiment] || SENTIMENT_COLOR.neutral
        return (
          <div key={i} style={{
            background: '#0f1923',
            border: '1px solid #1e2d3d',
            borderLeft: `3px solid ${sent.text}`,
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '16px',
            animation: 'fadeIn 0.4s ease',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', gap: '12px', marginBottom: '10px',
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  [{String(i + 1).padStart(2, '0')}] {article.source?.toUpperCase()} • {article.date}
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500', textDecoration: 'none', lineHeight: '1.4' }}
                >
                  {article.title}
                </a>
              </div>
              <span style={{
                background: sent.bg, color: sent.text,
                border: `1px solid ${sent.border}`,
                borderRadius: '4px', fontSize: '10px',
                padding: '3px 8px', whiteSpace: 'nowrap',
                letterSpacing: '0.08em', fontWeight: '600', flexShrink: 0,
              }}>
                {article.sentiment?.toUpperCase()}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.7', margin: '0 0 12px' }}>
              {article.summary}
            </p>

            <div style={{ marginBottom: '10px' }}>
              {article.keyPoints?.map((pt, j) => (
                <div key={j} style={{
                  fontSize: '11px', color: '#cbd5e1',
                  display: 'flex', gap: '8px', marginBottom: '4px', lineHeight: '1.5',
                }}>
                  <span style={{ color: '#fbbf24', flexShrink: 0 }}>›</span>
                  {pt}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {article.topics?.map((t, j) => (
                <span key={j} style={{
                  background: '#1a1f2e', color: '#64748b',
                  border: '1px solid #2d3748', borderRadius: '3px',
                  fontSize: '10px', padding: '2px 8px', letterSpacing: '0.08em',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
