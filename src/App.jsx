import React, { useState } from 'react'
import Header from './components/Header.jsx'
import UrlFeed from './components/UrlFeed.jsx'
import Articles from './components/Articles.jsx'
import Analysis from './components/Analysis.jsx'
import { fetchArticles, askMarketQuestion } from './utils/api.js'

const TABS = [
  { id: 'feed',     label: '01 / URL Feed' },
  { id: 'articles', label: '02 / Articles' },
  { id: 'analysis', label: '03 / Analysis' },
]

export default function App() {
  // ── URL Feed state ─────────────────────────────────────────────────────────
  const [urls, setUrls] = useState(['', '', ''])
  const [loadingArticles, setLoadingArticles] = useState(false)
  const [loadError, setLoadError] = useState('')

  // ── Articles state ─────────────────────────────────────────────────────────
  const [articles, setArticles] = useState([])

  // ── Analysis / Q&A state ───────────────────────────────────────────────────
  const [question, setQuestion] = useState('')
  const [qaHistory, setQaHistory] = useState([])
  const [asking, setAsking] = useState(false)

  // ── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('feed')

  // ── Badge counts ───────────────────────────────────────────────────────────
  const badgeCounts = {
    feed:     urls.filter((u) => u.trim()).length,
    articles: articles.length,
    analysis: qaHistory.length,
  }

  // ── Load articles from URLs ────────────────────────────────────────────────
  async function handleLoad() {
    setLoadingArticles(true)
    setLoadError('')
    setArticles([])
    try {
      const result = await fetchArticles(urls)
      setArticles(result)
      setActiveTab('articles')
    } catch (err) {
      setLoadError('Failed to fetch articles. Check your URLs and try again. ' + err.message)
    } finally {
      setLoadingArticles(false)
    }
  }

  // ── Ask a market question ──────────────────────────────────────────────────
  async function handleAsk() {
    if (!question.trim() || articles.length === 0 || asking) return
    const q = question.trim()
    setQuestion('')
    setAsking(true)
    setActiveTab('analysis')

    // Optimistically add the entry with no answer yet
    setQaHistory((prev) => [...prev, { question: q, answer: null, verdict: null }])

    try {
      const answerText = await askMarketQuestion(q, articles)
      const verdictMatch = answerText.match(/VERDICT:\s*([A-Z]+)/i)
      const verdict = verdictMatch ? verdictMatch[1].toUpperCase() : 'UNCERTAIN'

      setQaHistory((prev) =>
        prev.map((item, idx) =>
          idx === prev.length - 1 ? { ...item, answer: answerText, verdict } : item
        )
      )
    } catch (err) {
      setQaHistory((prev) =>
        prev.map((item, idx) =>
          idx === prev.length - 1
            ? { ...item, answer: 'Error: ' + err.message, verdict: 'UNCERTAIN' }
            : item
        )
      )
    } finally {
      setAsking(false)
    }
  }

  return (
    <div style={{
      background: '#0d1117',
      minHeight: '600px',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      color: '#e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #1e2d3d',
    }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Top bar */}
      <Header articleCount={articles.length} />

      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '1px solid #1e2d3d',
        background: '#0a0f16', padding: '0 24px',
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #fbbf24' : '2px solid transparent',
              color: activeTab === tab.id ? '#fbbf24' : '#475569',
              fontFamily: 'inherit', fontSize: '11px', letterSpacing: '0.08em',
              padding: '12px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
            {badgeCounts[tab.id] > 0 && (
              <span style={{
                background: activeTab === tab.id ? '#fbbf24' : '#1e2d3d',
                color: activeTab === tab.id ? '#0d1117' : '#64748b',
                borderRadius: '10px', fontSize: '10px',
                padding: '1px 6px', fontWeight: '600',
              }}>
                {badgeCounts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '24px', minHeight: '500px' }}>
        {activeTab === 'feed' && (
          <UrlFeed
            urls={urls}
            setUrls={setUrls}
            onLoad={handleLoad}
            loading={loadingArticles}
            error={loadError}
          />
        )}
        {activeTab === 'articles' && <Articles articles={articles} />}
        {activeTab === 'analysis' && (
          <Analysis
            qaHistory={qaHistory}
            question={question}
            setQuestion={setQuestion}
            onAsk={handleAsk}
            asking={asking}
            hasArticles={articles.length > 0}
          />
        )}
      </div>
    </div>
  )
}
