const MODEL = 'claude-sonnet-4-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'

// ─── Fetch and analyse articles from provided URLs ───────────────────────────
export async function fetchArticles(urls) {
  const validUrls = urls.filter((u) => u.trim().length > 0)
  if (validUrls.length === 0) throw new Error('No valid URLs provided')

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: `You are a financial news analyst. The user provides news article URLs. 
Use web search to visit each URL and extract information. 
Return ONLY a valid JSON array — no markdown fences, no preamble, no explanation. 
Each element must have exactly these fields:
{
  "url": "original url",
  "title": "article title",
  "source": "publication name e.g. Bloomberg",
  "date": "publication date or Today",
  "summary": "2-3 sentence summary of the article",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "bullish" or "bearish" or "neutral",
  "topics": ["e.g. Gold", "Oil", "Fed", "Equities"]
}
Return just the JSON array. Nothing else.`,
      messages: [
        {
          role: 'user',
          content: `Fetch and analyse these news article URLs:\n\n${validUrls
            .map((u, i) => `${i + 1}. ${u}`)
            .join('\n')}\n\nReturn the JSON array.`,
        },
      ],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const textBlock = data.content?.find((b) => b.type === 'text')
  if (!textBlock) throw new Error('No text response from API')

  let jsonText = textBlock.text.trim().replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(jsonText)
  return Array.isArray(parsed) ? parsed : [parsed]
}

// ─── Ask a market question against loaded articles ────────────────────────────
export async function askMarketQuestion(question, articles) {
  if (!question.trim()) throw new Error('Question is empty')
  if (articles.length === 0) throw new Error('No articles loaded')

  const articleContext = articles
    .map(
      (a, i) =>
        `[Article ${i + 1}] "${a.title}" (${a.source}, ${a.date})\nURL: ${a.url}\nSummary: ${a.summary}\nKey Points: ${a.keyPoints?.join('; ')}\nSentiment: ${a.sentiment}\nTopics: ${a.topics?.join(', ')}`
    )
    .join('\n\n---\n\n')

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: `You are a precise financial market analyst. You ONLY analyse based on the provided news articles.
Answer market questions with this EXACT structure (use these exact headers):

VERDICT: [one of: YES / NO / LIKELY / UNLIKELY / UNCERTAIN / NEUTRAL]

REASONING:
[2-4 sentences explaining your conclusion based on the articles]

EVIDENCE:
- [Specific fact from article with [Article N] citation]
- [Another fact with citation]
- [Third fact if available]

RISK FACTORS:
[1-2 sentences on what could change this outlook]

SOURCES:
- Article 1: [title] — [url]
- Article 2: [title] — [url]
(list only the articles relevant to this answer)

Be direct. Give a clear verdict. Market participants need actionable clarity.`,
      messages: [
        {
          role: 'user',
          content: `NEWS ARTICLES FOR TODAY:\n\n${articleContext}\n\n---\n\nQUESTION: ${question}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.find((b) => b.type === 'text')?.text || 'No response.'
  return text
}
