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

Return valid JSON only with exactly this schema:
{
  "summary": "1-2 sentences summarizing what the company does and its value proposition",
  "whatTheyDo": ["bullet 1", "bullet 2", "bullet 3"], 
  "keywords": ["tag1", "tag2"],
  "derivedSignals": ["signal 1", "signal 2"],
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
