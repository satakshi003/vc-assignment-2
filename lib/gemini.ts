import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function extractIntelligence(url: string, companyName: string, overview: string, websiteText: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prompt = `Extract structured VC intelligence for the company: ${companyName || 'Unknown'} (${url}).
Use the following scraped website content and baseline overview to build a rich intelligence report.

Baseline Overview: 
${overview || 'None provided'}

Scraped Website Content (might be incomplete if blocked):
"""
${websiteText}
"""

Return valid JSON only with exactly this schema, replacing the old string list with exactly 2 to 4 high-quality structured signals. Ensure categories are one of: Hiring, Product, Growth, Funding, Content, or Other.
{
  "summary": "1-2 sentences summarizing what the company does and its value proposition",
  "whatTheyDo": ["bullet 1", "bullet 2", "bullet 3"], 
  "keywords": ["tag1", "tag2"],
  "signals": [
    {
      "title": "Short signal name",
      "category": "Hiring | Product | Growth | Funding | Content | Other",
      "confidence": "High | Medium | Low",
      "description": "1-2 sentence explanation of why this is a meaningful VC signal. Avoid generic fluff.",
      "detectedFrom": "Short excerpt or indicator directly from the website text"
    }
  ],
  "sources": ["${url}"]
}

Do not include markdown wrappers around the JSON, just pure JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  const responseText = response.text || "";

  try {
    return JSON.parse(responseText.replace(/```json/gi, '').replace(/```/g, '').trim());
  } catch {
    throw new Error("Failed to parse JSON from Gemini response.");
  }
}
