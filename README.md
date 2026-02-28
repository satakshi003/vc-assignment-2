# 🚀 Ventura — AI-Powered VC Intelligence Platform

A production-grade internal VC intelligence tool built with Next.js 14, structured AI enrichment, and modern frontend architecture.

---

## 🧠 Overview

Ventura is a lightweight internal venture capital intelligence platform designed to simulate real-world VC sourcing workflows.

It enables investors to:

- Discover and filter startups
- Enrich company websites using AI
- Extract structured investment signals
- Organize companies into named watchlists
- Perform bulk triage
- Export curated lists
- Track high-confidence signals

The system focuses on **structured intelligence extraction**, clean UX, and workflow efficiency — not feature bloat.

---

## 🎯 Problem Statement

Early-stage VCs often:

- Manually browse company websites
- Copy insights into spreadsheets
- Track signals informally
- Lose context across tools

Ventura solves this by:

- Scraping public websites
- Extracting structured intelligence using Gemini
- Presenting confidence-weighted signals
- Enabling workflow-native triage (bulk selection, watchlists)

---

## ✨ Key Features

### 🔍 Companies Directory

- Search (URL-based hydration)
- Industry filtering
- Sorting (A–Z)
- Pagination
- Responsive card layout (mobile)
- Bulk selection workflow

---

### ⚡ Live AI Enrichment

On company profile:

- Server-side website scraping (Cheerio)
- Gemini structured extraction
- Executive summary
- What-they-do bullets
- Keywords
- Intelligence signals (timeline view)
- Confidence scoring (High / Medium / Low)
- Source references
- Timestamped analysis
- Cached results (localStorage)

---

### 📊 Intelligence Signals Timeline

Signals are:

- Categorized (Growth, Product, Hiring, Funding, Content, Other)
- Confidence-weighted
- Sorted by signal strength
- Presented in vertical timeline UI
- Filterable by confidence
- Backward-compatible with older cache structure

---

### 📂 Multi-Named Watchlists

- Create / Rename / Delete lists
- Add companies to multiple lists
- Bulk add from directory
- Duplicate prevention
- CSV & JSON export per list
- Legacy migration from single list
- Local persistence

---

### 🧰 Power-User Workflow Enhancements

- Bulk select + bulk save
- Indeterminate select-all logic
- ⌘K / Ctrl+K quick focus search
- Toast-based non-blocking notifications
- Animated action bars
- Structured confirmation modals
- Fully responsive layout

---

### 🎨 UX & Design

- Minimal enterprise aesthetic
- Dark mode support
- Framer Motion subtle animations
- Layout-safe responsive behavior
- No native browser dialogs
- Accessible focus states

---

## 🏗 Architecture

### Frontend

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- next-themes

### Backend (API Route)

- `/api/enrich`
- Server-side scraping via Cheerio
- Gemini API call (structured JSON response)
- Strict JSON parsing
- Fallback handling
- Timestamp injection

### Data Persistence

- localStorage
- Structured migration logic
- No exposed API keys
- No client-side secrets

---

## 🔄 Enrichment Flow

1. User clicks **"Enrich"**
2. Frontend sends `POST` request to `/api/enrich`
3. Server:
   - Fetches website HTML
   - Extracts readable content
   - Trims to safe length
   - Sends to Gemini
4. Gemini returns structured JSON:
   - `summary`
   - `whatTheyDo`
   - `keywords`
   - `signals` (structured)
5. Response parsed + validated
6. Displayed in timeline UI
7. Cached locally

---

## 🛡 Security Considerations

- Gemini API key stored in environment variables
- No key exposure to client
- Server-only enrichment
- Defensive JSON parsing
- Graceful scraping failure handling

---

## 📦 Folder Structure

```
app/
  layout.tsx
  page.tsx
  companies/
  lists/
  api/enrich/

components/
  Sidebar.tsx
  Header.tsx
  ClientLayout.tsx
  CompanyTable.tsx
  SignalsTimeline.tsx
  EnrichmentPanel.tsx
  ListModal.tsx
  ConfirmModal.tsx
  InputModal.tsx
  NotesSection.tsx
  ui/ToastProvider.tsx

lib/
  listManager.ts
  gemini.ts
  scrape.ts
  useToast.ts
  utils.ts

data/
  companies.json

types/
  company.ts
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone <repo-url>
cd ventura
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📤 Deployment

Optimized for **Vercel**.

1. Push to GitHub
2. Import project in Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy

No additional configuration required.

---

## ⚖️ Design Decisions

**Why server-side enrichment?**
To protect the API key and simulate realistic production architecture. The client never touches the Gemini key.

**Why localStorage instead of a database?**
Assignment scope optimization. Focused on UX and enrichment logic rather than persistence layer complexity.

**Why structured signals?**
VCs think in signals, not summaries. Structured confidence scoring makes the system decision-oriented rather than descriptive.

**Why no queue/vector DB?**
Intentional scope discipline. One clean enrichment path beats incomplete complex architecture.

---

## ⚠️ Limitations

- Scraping may fail on heavy JS-rendered sites
- No background job queue
- No real-time updates
- localStorage persistence only

---

## 🔮 Future Improvements

- Background enrichment queue
- Vector-based similarity search
- Multi-user authentication
- Real database persistence
- CRM-style activity feed
- Automatic signal refresh cadence

---

## 🧪 Evaluation Criteria Alignment

| Criteria | Implementation |
|---|---|
| Interface Quality | Responsive, animated, enterprise UI |
| Live Enrichment | Fully working structured AI pipeline |
| Engineering | Secure, typed, clean modular code |
| Creativity | Bulk triage, timeline signals, quick search |

---

## 🏁 Final Thoughts

Ventura is intentionally **structured**, **focused**, **workflow-native**, and **production-conscious**.

The goal was not to overbuild — but to simulate a real internal VC tool with clean architecture and thoughtful UX.
