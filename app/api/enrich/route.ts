import { NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/scrape";
import { extractIntelligence } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, companyName, overview } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log(`[Enrich] Fetching website content from: ${url}`);
    let text = "";
    try {
      text = await scrapeWebsite(url);
      if (text.length < 50) {
        text = "Insufficient readable content found on website natively.";
      }
    } catch (e) {
      console.warn(`[Enrich] Scraping failed for ${url}`);
      text = "Scraping failed or was blocked by the website.";
    }

    console.log(`[Enrich] Content scraped (length: ${text.length}). Sending to Gemini...`);
    const data = await extractIntelligence(url, companyName, overview, text);

    return NextResponse.json({
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    console.error("[Enrich API Error]", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during enrichment";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
