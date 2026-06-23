# Advista

Competitive intelligence research assistant. You describe your product and competitors through a conversational brief, then Advista fans out web searches, scrapes top results, and synthesizes an 8-category competitive intelligence report.

## Architecture

```
client/   React 19 + Vite + Tailwind + React Three Fiber
api/      FastAPI + Gemini (google-genai) + SerpAPI + Prisma (PostgreSQL)
```

## How it works

1. **Chat brief** — a conversational intake flow extracts your company, product, competitors, target customers, and strategic goals. Each turn uses Gemini structured output to produce only the delta fields learned that turn, which are merged into a stored `ResearchBrief`.
2. **Competitor enrichment** — when the LLM signals it needs web data, the API calls SerpAPI directly and runs a second structured extraction pass over the results; no grounding dependency.
3. **Research run** — `POST /research/run` fans out 8 parallel search queries (product positioning, pricing, customer sentiment, etc.), scrapes the top pages per category, then runs a map-reduce over Gemini: one focused synthesis call per category in parallel, reduced into a `CompetitiveIntelligenceReport`.
4. **Persistence** — sessions, messages, briefs, research runs, and reports are stored in PostgreSQL via Prisma.

## Getting started

### API

```bash
cd api
cp .env.example .env          # fill GEMINI_API_KEY, SERPAPI_KEY, DATABASE_URL, PORT
uv sync
prisma generate
prisma db push
uv run python src/main.py
```

Requires Python 3.14+, [uv](https://github.com/astral-sh/uv).

### Client

```bash
cd client
npm install
npm run dev
```

## Environment variables (api/.env)

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio key |
| `SERPAPI_KEY` | SerpAPI key for web search |
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Port for uvicorn (default 8000) |

## API routes

| Method | Path | Description |
|---|---|---|
| `POST` | `/chat` | Send a message; returns AI reply + brief delta |
| `POST` | `/research/run` | Trigger a research run from the current brief |
| `GET` | `/research/run/{id}` | Poll run status and retrieve report |

## Data models

- **Session** — groups messages, brief, and research runs
- **ResearchBrief** — 8-field profile (company, product, competitors, customers, goals, channels, positioning, context)
- **ResearchRun** — tracks status (PENDING → RUNNING → COMPLETED/FAILED) and stores the brief snapshot used
- **Report** — 10-section competitive intelligence report (executive summary, positioning, landscape, sentiment, gaps, pricing, momentum, ecosystem, actions, sources)

## Tech decisions

See [`api/decisions.md`](api/decisions.md) for documented architecture choices: why delta structured output over agent tool-calling, why SerpAPI over Gemini grounding, why map-reduce over single-shot synthesis, and more.
