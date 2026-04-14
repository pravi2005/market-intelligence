# Market Intelligence Engine

An AI-powered financial news analysis tool. Paste up to 3 daily news URLs (Bloomberg, Reuters, FT, etc.), then ask market questions and get clear verdicts — with cited sources for manual verification.

---

## How it works

1. **Feed URLs** — Paste 3 news article URLs from any financial publication
2. **AI fetches & analyses** — A web search agent visits each URL and extracts structured data (title, summary, key points, sentiment)
3. **Ask questions** — Type any market question (e.g. *"Will gold see momentum this week?"*)
4. **Get verdicts** — Receive a clear YES / NO / LIKELY / UNLIKELY answer with evidence and source links

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| AI Model | Claude Sonnet (`claude-sonnet-4-20250514`) |
| Agent tool | Anthropic `web_search_20250305` |
| Deployment | GitHub Pages via GitHub Actions |

---

## Project structure

```
market-intelligence/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← Auto-deploys to GitHub Pages on push
├── public/
│   └── .nojekyll               ← Prevents Jekyll processing
├── src/
│   ├── main.jsx                ← React entry point
│   ├── App.jsx                 ← Root component, manages all state
│   ├── components/
│   │   ├── Header.jsx          ← Top bar with status indicator
│   │   ├── UrlFeed.jsx         ← URL input panel (Tab 1)
│   │   ├── Articles.jsx        ← Loaded articles display (Tab 2)
│   │   └── Analysis.jsx        ← Q&A chat interface (Tab 3)
│   └── utils/
│       └── api.js              ← All Anthropic API calls live here
├── index.html                  ← HTML entry point
├── vite.config.js              ← Vite config with dynamic base URL
├── package.json
├── .gitignore
└── README.md
```

---

## Setup & deployment (GitHub Pages)

### Step 1 — Fork / create the repository

Create a new repository on GitHub and push all these files to the `main` branch.

### Step 2 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### Step 3 — Push to main

Every time you push to `main`, GitHub Actions will automatically:
- Install dependencies (`npm install`)
- Build the project (`npm run build`)
- Deploy the `dist/` folder to GitHub Pages

Your live URL will be:
```
https://<your-username>.github.io/<repo-name>/
```

### Step 4 — Run locally (optional)

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Usage

1. Open the app in your browser
2. Go to **01 / URL Feed** and paste up to 3 news article URLs
3. Click **LOAD & ANALYSE ARTICLES** and wait ~15-30 seconds
4. Go to **02 / Articles** to review what was extracted
5. Go to **03 / Analysis**, type your question, and press Enter
6. Read the verdict, evidence, and click the source links to verify manually

---

## Notes

- The AI only answers from the articles you load — it does not use its training data for market calls
- Answers include evidence citations like `[Article 1]`, `[Article 2]` so you know exactly which source supports each claim
- Source links are always shown at the bottom of every answer for manual verification
- You can ask multiple questions per session without reloading articles
