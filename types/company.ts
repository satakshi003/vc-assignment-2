export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  website: string;
  logo: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface VCList {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  companies: Company[];
}

export interface Signal {
  id: string;
  title: string;
  category: "Hiring" | "Product" | "Growth" | "Funding" | "Content" | "Other";
  confidence: "High" | "Medium" | "Low";
  description: string;
  detectedFrom: string;
}

export interface EnrichedData {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  derivedSignals?: string[]; // Legacy
  signals?: Signal[];
  sources: string[];
  timestamp: string;
}
