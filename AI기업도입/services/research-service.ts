import {
  researchDocuments,
  researchNaturalQuestions,
  researchQuickKeywords,
  researchRecentSearchSeeds,
  researchSummaryCards,
} from "@/data/research-data";
import { readStorage, writeStorage } from "@/lib/client-storage";
import { withServiceContext } from "@/lib/data-provider";
import type { ResearchDocument, ResearchSortOption } from "@/types/domain";

const recentSearchStorageKey = "unitop-research-recent-searches";

export function getResearchPageData() {
  return withServiceContext(() => ({
    quickKeywords: researchQuickKeywords,
    naturalQuestions: researchNaturalQuestions,
    recentSearchSeeds: researchRecentSearchSeeds,
    documents: researchDocuments,
    summaryCards: researchSummaryCards,
  }));
}

export function filterResearchDocuments(documents: ResearchDocument[], searchTerm: string) {
  const normalized = searchTerm.trim().toLowerCase();
  if (!normalized) return documents;

  return documents.filter((document) =>
    [document.title, document.summary, document.project, document.owner, ...document.tags]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

export function sortResearchDocuments(documents: ResearchDocument[], sortBy: ResearchSortOption) {
  const sorted = [...documents];

  if (sortBy === "latest") {
    return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  if (sortBy === "importance") {
    const importanceRank = { 최상: 3, 상: 2, 중: 1 };
    return sorted.sort((a, b) => importanceRank[b.importance] - importanceRank[a.importance] || b.score - a.score);
  }

  return sorted.sort((a, b) => b.score - a.score || b.updatedAt.localeCompare(a.updatedAt));
}

export function getRecommendedResearchDocuments(documents: ResearchDocument[], selectedDocument?: ResearchDocument) {
  if (!selectedDocument) return [];

  return documents
    .filter((document) => document.id !== selectedDocument.id)
    .map((document) => ({
      title: document.title,
      type: document.type,
      relation:
        document.project === selectedDocument.project
          ? "동일 프로젝트군 문서"
          : document.tags.some((tag) => selectedDocument.tags.includes(tag))
            ? "핵심 키워드가 겹치는 연관 문서"
            : "추가 비교 검토용 문서",
    }))
    .slice(0, 3);
}

export function getRecentResearchSearches() {
  return readStorage(recentSearchStorageKey, researchRecentSearchSeeds);
}

export function saveRecentResearchSearch(searchTerm: string) {
  const normalized = searchTerm.trim();
  if (!normalized) return getRecentResearchSearches();

  const next = [normalized, ...getRecentResearchSearches().filter((item) => item !== normalized)].slice(0, 6);
  writeStorage(recentSearchStorageKey, next);
  return next;
}
