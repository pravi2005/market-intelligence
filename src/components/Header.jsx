import React from 'react'

export default function Header({ articleCount }) {
  return (
    <div style={{
      padding: '16px 24px',
      borderBottom: '1px solid #1e2d3d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#0a0f16',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '6px',
          background: '#fbbf24', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '16px',
        }}>⬡</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', letterSpacing: '0.05em' }}>
            MARKET INTELLIGENCE
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.1em' }}>
            NEWS-DRIVEN ANALYSIS ENGINE
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          display: 'inline-block', width: '8px', height: '8px',
          borderRadius: '50%',
          background: articleCount > 0 ? '#4ade80' : '#374151',
          animation: articleCount > 0 ? 'pulse 2s ease-in-out infinite' : 'none',
        }} />
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          {articleCount > 0 ? `${articleCount} ARTICLE${articleCount > 1 ? 'S' : ''} LOADED` : 'STANDBY'}
        </span>
      </div>
    </div>
  )
}
