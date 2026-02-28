import { Company, VCList } from "@/types/company";

const STORAGE_KEY = "ventura-lists";
const LEGACY_KEY = "saved-companies";

// --- CORE UTILS ---

export function getLists(): VCList[] {
  if (typeof window === "undefined") return [];

  // Migration Check
  const legacyData = localStorage.getItem(LEGACY_KEY);
  if (legacyData) {
    try {
      const parsedLegacy = JSON.parse(legacyData) as Company[];
      if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
        // Create initial default list with migrated data
        const migratedList: VCList = {
          id: `list_${Math.random().toString(36).substring(2, 9)}`,
          name: "Default List",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          companies: parsedLegacy,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([migratedList]));
        localStorage.removeItem(LEGACY_KEY); // Clean up old structure
        return [migratedList];
      }
    } catch {
      localStorage.removeItem(LEGACY_KEY); // Clean up corrupted legacy
    }
  }

  // Normal Load
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLists(lists: VCList[]): void {
  if (typeof window === "undefined") return;
  // Sort most recently updated first inherently before saving
  const sorted = [...lists].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
}

// --- CRUD ---

export function createList(name: string): VCList {
  const lists = getLists();
  const newList: VCList = {
    id: `list_${Math.random().toString(36).substring(2, 9)}`,
    name: name.trim() || "New List",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    companies: [],
  };
  lists.unshift(newList); // Prepend to lists internally
  saveLists(lists);
  return newList;
}

export function deleteList(listId: string): void {
  const lists = getLists();
  saveLists(lists.filter((l) => l.id !== listId));
}

export function renameList(listId: string, newName: string): void {
  const lists = getLists();
  const target = lists.find((l) => l.id === listId);
  if (target) {
    target.name = newName.trim() || target.name;
    target.updatedAt = new Date().toISOString();
    saveLists(lists);
  }
}

// --- COMPANY ASSOCIATION ---

export function addCompanyToList(listId: string, company: Company): void {
  const lists = getLists();
  const target = lists.find((l) => l.id === listId);
  if (target) {
    // Prevent duplicates within the same list
    const exists = target.companies.some((c) => c.id === company.id);
    if (!exists) {
      target.companies.push(company);
      target.updatedAt = new Date().toISOString();
      saveLists(lists);
    }
  }
}

export function addCompaniesToList(listId: string, companies: Company[]): void {
  const lists = getLists();
  const target = lists.find((l) => l.id === listId);
  if (target) {
    let addedCount = 0;
    for (const company of companies) {
      const exists = target.companies.some((c) => c.id === company.id);
      if (!exists) {
        target.companies.push(company);
        addedCount++;
      }
    }
    if (addedCount > 0) {
      target.updatedAt = new Date().toISOString();
      saveLists(lists);
    }
  }
}

export function removeCompanyFromList(listId: string, companyId: string): void {
  const lists = getLists();
  const target = lists.find((l) => l.id === listId);
  if (target) {
    const originalLength = target.companies.length;
    target.companies = target.companies.filter((c) => c.id !== companyId);

    // Only update timestamp if an actual removal happened
    if (originalLength !== target.companies.length) {
      target.updatedAt = new Date().toISOString();
      saveLists(lists);
    }
  }
}

export function getCompanyListStatuses(companyId: string): string[] {
  const lists = getLists();
  return lists
    .filter((list) => list.companies.some((c) => c.id === companyId))
    .map((list) => list.id);
}
