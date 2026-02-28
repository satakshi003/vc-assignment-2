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

export interface EnrichedData {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  derivedSignals: string[];
  sources: string[];
  timestamp: string;
}
