import * as cheerio from "cheerio";

export async function scrapeWebsite(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    // We add some basic headers to mimic a normal browser request and avoid basic blocks
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, nav, footer, header to get core content
    $("script, style, noscript, nav, footer, header").remove();

    // Extract text and clean up whitespace
    let text = $("body").text().replace(/\s+/g, " ").trim();

    // Trim to 10k characters to prevent Gemini token explosion
    if (text.length > 10000) {
      text = text.substring(0, 10000);
    }

    return text;
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error("Unable to scrape website content. The site might be blocking automated requests or taking too long to respond.");
  }
}
