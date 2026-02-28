# VC Intelligence Interface

A Next.js 14 structured intelligence platform for internal venture capital sourcing, featuring Live AI Enrichment powered by Gemini.

## Architecture

This project is built using:
- **Next.js 14 App Router** for advanced layouts, nested routing, and fast performance.
- **TypeScript** for end-to-end type safety.
- **Tailwind CSS** for responsive, modern UI styling.
- **Cheerio** for server-side HTML scraping to extract relevant textual information from company websites.
- **Google Gemini 1.5 Flash API** for structured JSON intelligence extraction. 
- **Browser LocalStorage** for client-side persistence of lists, saved searches, user notes, and caching of enrichment reports.

## How Live Enrichment Works

When the "Enrich Now" button is clicked:
1. The frontend hits `/api/enrich` via a `POST` request, providing the target company website URL.
2. The Server intercepts the request and uses `fetch` paired with `cheerio` to fetch the external website HTML, trimming unnecessary elements (`<nav>`, `<script>`, `<style>`).
3. The content is trimmed to ~10k characters.
4. The remaining text is fed to `gemini-1.5-flash` using `@google/generative-ai`, prompted specifically to extract keywords, sources, a brief summary, "what they do" bullets, and derived signals.
5. The API mandates standard JSON output, which is returned directly to the frontend and displayed in an interactive timeline, automatically caching indefinitely in `localStorage`.

## Local Setup Instructions

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your Google Gemini API key to `.env.local`.

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

The app is built keeping Vercel in mind (App Router, functional edge-ready API routes).

1. Push the code to a new GitHub repository.
2. Head to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your GitHub repository.
4. Under Environment Variables, add:
   - `GEMINI_API_KEY`: [YOUR_API_KEY]
5. Click **Deploy**. Vercel will auto-detect the Next.js setup and run `npm run build` flawlessly.
