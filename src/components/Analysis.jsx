import React, { useRef, useEffect } from 'react'

const VERDICT_STYLE = {
  YES:       { color: '#4ade80', label: 'YES — Likely' },
  NO:        { color: '#f87171', label: 'NO — Unlikely' },
  LIKELY:    { color: '#86efac', label: 'LIKELY' },
  UNLIKELY:  { color: '#fca5a5', label: 'UNLIKELY' },
  UNCERTAIN: { color: '#fbbf24', label: 'UNCERTAIN' },
  NEUTRAL:   { color: '#94a3b8', label: 'NEUTRAL' },
}

const EXAMPLE_QUESTIONS = [
  'Will gold see momentum this week?',
  'Should I be bullish or cautious on equities?',
  'Is the Fed likely to cut rates soon?',
]

function Spinner() {
  return (
    <span style={{
      display: 'inline-block', width: '12px', height: '12px',
      border: '2px solid #2d3748', borderTop: '2px solid #fbbf24',
      borderRadius: '50%', animation: 'spin 0.8s linear infinite',
    }} />
  )
}

function parseAnswer(text) {
  return {
    reasoning: text.match(/REASONING:([\s\S]*?)(?=EVIDENCE:|RISK|SOURCES:|$)/i)?.[1]?.trim(),
    evidence:  text.match(/EVIDENCE:([\s\S]*?)(?=RISK FACTORS:|SOURCES:|$)/i)?.[1]?.trim(),
    risk:      text.match(/RISK FACTORS:([\s\S]*?)(?=SOURCES:|$)/i)?.[1]?.trim(),
    sources:   text.match(/SOURCES:([\s\S]*?)(?=$)/i)?.[1]?.trim(),
  }
}

function QAEntry({ entry }) {
  const vs = VERDICT_STYLE[entry.verdict] || VERDICT_STYLE.UNCERTAIN
  const sections = entry.answer ? parseAnswer(entry.answer) : {}

  return (
    <div style={{ marginBottom: '24px', animation: 'fadeIn 0.4s ease' }}>
      {/* Question bubble */}
      <div style={{
        background: '#0a0f16', border: '1px solid #1e2d3d',
        borderRadius: '6px', padding: '10px 14px',
        fontSize: '13px', color: '#94a3b8', marginBottom: '12px',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
      }}>
        <span style={{ color: '#fbbf24', fontSize: '11px', whiteSpace: 'nowrap' }}>Q›</span>
        {entry.question}
      </div>

      {/* Answer block */}
      {!entry.answer ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '12px', padding: '12px 0' }}>
          <Spinner /> Analysing articles and generating market insight...
        </div>
      ) : (
        <div style={{ background: '#0f1923', border: '1px solid #1e2d3d', borderRadius: '8px', overflow: 'hidden' }}>
          {/* Verdict bar */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid #1e2d3d',
            display: 'flex', alignItems: 'center', gap: '12px', background: '#0a0f16',
          }}>
            <span style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.1em' }}>VERDICT</span>
            <span style={{ color: vs.color, fontSize: '15px', fontWeight: '600', letterSpacing: '0.05em' }}>
              {vs.label}
            </span>
          </div>

          <div style={{ padding: '16px' }}>
            {sections.reasoning && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', marginBottom: '6px' }}>REASONING</div>
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>{sections.reasoning}</p>
              </div>
            )}

            {sections.evidence && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', marginBottom: '6px' }}>EVIDENCE</div>
                {sections.evidence.split('\n').filter((l) => l.trim().startsWith('-')).map((line, j) => (
                  <div key={j} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', lineHeight: '1.6' }}>
                    <span style={{ color: '#4ade80', flexShrink: 0 }}>›</span>
                    {line.replace(/^-\s*/, '')}
                  </div>
                ))}
              </div>
            )}

            {sections.risk && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', marginBottom: '6px' }}>RISK FACTORS</div>
                <p style={{ fontSize: '12px', color: '#f87171', lineHeight: '1.7', margin: 0 }}>{sections.risk}</p>
              </div>
            )}

            {sections.sources && (
              <div style={{ background: '#0a0f16', borderRadius: '6px', padding: '10px 12px', border: '1px solid #1e2d3d' }}>
                <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  SOURCES FOR MANUAL VERIFICATION
                </div>
                {sections.sources.split('\n').filter((l) => l.trim()).map((line, j) => {
                  const urlMatch = line.match(/https?:\/\/[^\s]+/)
                  return (
                    <div key={j} style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                      <span style={{ color: '#fbbf24' }}>↗ </span>
                      {urlMatch ? (
                        <a href={urlMatch[0]} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#60a5fa', textDecoration: 'none' }}>
                          {line.replace(/^-\s*/, '').replace(urlMatch[0], '').replace(/—\s*$/, '').trim() || urlMatch[0]}
                        </a>
                      ) : (
                        <span>{line.replace(/^-\s*/, '')}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Analysis({ qaHistory, question, setQuestion, onAsk, asking, hasArticles }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [qaHistory, asking])

  return (
    <div>
      {/* Empty state */}
      {qaHistory.length === 0 && !asking && (
        <div style={{ textAlign: 'center', color: '#475569', fontSize: '13px', padding: '40px 0 24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⬡</div>
          {!hasArticles
            ? 'Load articles first, then ask your market questions here.'
            : 'Ask a market question below to get AI-powered analysis.'}
          {hasArticles && (
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {EXAMPLE_QUESTIONS.map((ex, i) => (
                <button key={i} onClick={() => setQuestion(ex)} style={{
                  background: 'transparent', border: '1px solid #2d3748',
                  color: '#64748b', borderRadius: '4px', fontSize: '11px',
                  padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
                  onMouseOver={(e) => { e.target.style.borderColor = '#fbbf24'; e.target.style.color = '#fbbf24' }}
                  onMouseOut={(e) => { e.target.style.borderColor = '#2d3748'; e.target.style.color = '#64748b' }}
                >
                  {ex}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Q&A history */}
      <div style={{ maxHeight: '380px', overflowY: 'auto', marginBottom: '16px' }}>
        {qaHistory.map((entry, idx) => <QAEntry key={idx} entry={entry} />)}
        <div ref={bottomRef} />
      </div>

      {/* Question input bar */}
      <div style={{
        border: '1px solid #2d3748', borderRadius: '8px',
        background: '#0a0f16', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <span style={{ color: '#fbbf24', fontSize: '12px', flexShrink: 0 }}>ASK›</span>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onAsk() } }}
          placeholder={!hasArticles ? 'Load articles first...' : 'Will there be momentum in gold? Is the market bullish?'}
          disabled={asking || !hasArticles}
          style={{
            flex: 1, background: 'transparent', border: 'none',
            color: '#e2e8f0',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: '13px', outline: 'none',
            opacity: asking || !hasArticles ? 0.5 : 1,
          }}
        />
        <button
          onClick={onAsk}
          disabled={asking || !question.trim() || !hasArticles}
          style={{
            background: question.trim() && !asking && hasArticles ? '#fbbf24' : '#1a1a0a',
            color: question.trim() && !asking && hasArticles ? '#0d1117' : '#4a5568',
            border: '1px solid #92400e', borderRadius: '4px',
            fontFamily: 'inherit', fontSize: '11px', fontWeight: '600',
            padding: '8px 14px', cursor: 'pointer', letterSpacing: '0.08em',
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
          }}
        >
          {asking ? <><Spinner /> ANALYSING</> : 'ANALYSE ›'}
        </button>
      </div>
      <div style={{ fontSize: '10px', color: '#374151', textAlign: 'right', marginTop: '6px' }}>
        Press Enter to submit
      </div>
    </div>
  )
}
