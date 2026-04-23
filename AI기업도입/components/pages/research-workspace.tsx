"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  History,
  LoaderCircle,
  Save,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { FileUpload } from "@/components/documents/file-upload";
import { RagAsk } from "@/components/documents/rag-ask";
import { RagStatusCard } from "@/components/documents/rag-status-card";
import { requestAiDocumentSummary } from "@/services/ai-client-service";
import {
  createDocument,
  deleteDocument,
  getAllResearchDocuments,
  updateDocument,
} from "@/services/document-service";
import {
  getRecentResearchSearches,
  getRecommendedResearchDocuments,
  getResearchPageData,
  saveRecentResearchSearch,
  sortResearchDocuments,
} from "@/services/research-service";
import type { AiDocumentSummary } from "@/types/ai";
import type {
  DocumentInsertInput,
  ResearchDocument,
  ResearchSortOption,
} from "@/types/domain";

const importanceVariant = {
  최상: "danger",
  상: "warning",
  중: "neutral",
} as const;

const defaultCategory =
  "개발이력" as unknown as DocumentInsertInput["category"];
const defaultFileType = "PDF" as unknown as DocumentInsertInput["file_type"];

export function ResearchWorkspace({ initialQuery = "" }: { initialQuery?: string }) {
  const pageData = getResearchPageData();
  const [documents, setDocuments] = useState<ResearchDocument[]>(
    pageData.documents,
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>(
    pageData.documents[0]?.id ?? "",
  );
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [question, setQuestion] = useState(
    pageData.naturalQuestions[0] ?? "관련 설계 문서를 요약해줘",
  );
  const [sortBy, setSortBy] = useState<ResearchSortOption>("relevance");
  const [recentSearches, setRecentSearches] = useState<string[]>(
    getRecentResearchSearches(),
  );
  const [aiSummary, setAiSummary] = useState<AiDocumentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"supabase" | "fallback">("fallback");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocSummary, setNewDocSummary] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const filteredDocuments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const base = keyword
      ? documents.filter((document) =>
          [document.title, document.summary, ...document.tags]
            .join(" ")
            .toLowerCase()
            .includes(keyword),
        )
      : documents;
    return sortResearchDocuments(base, sortBy);
  }, [documents, searchTerm, sortBy]);

  const selectedDocument =
    filteredDocuments.find((doc) => doc.id === selectedDocumentId) ??
    filteredDocuments[0] ??
    null;

  const recommendedDocuments = getRecommendedResearchDocuments(
    filteredDocuments,
    selectedDocument ?? undefined,
  );

  async function loadDocuments() {
    setLoadingDocs(true);
    const result = await getAllResearchDocuments();
    setDocuments(result.data);
    setSource(result.source);
    if (result.data[0]) {
      setSelectedDocumentId((prev) => prev || result.data[0].id);
      setEditTitle((prev) => prev || result.data[0].title);
    }
    setError(result.error ? result.error.message : null);
    setLoadingDocs(false);
  }

  useEffect(() => {
    void loadDocuments();
  }, []);

  useEffect(() => {
    if (selectedDocument) {
      setEditTitle(selectedDocument.title);
      setAiSummary(null);
    }
  }, [selectedDocument]);

  function runSearch(term: string) {
    setSearchTerm(term);
    setRecentSearches(saveRecentResearchSearch(term));
  }

  async function handleAiSummary() {
    if (!selectedDocument) return;
    try {
      setLoading(true);
      setError(null);
      const result = await requestAiDocumentSummary(question, selectedDocument);
      setAiSummary(result);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "문서 AI 요약 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDocument() {
    if (!newDocTitle.trim()) return;
    const result = await createDocument({
      title: newDocTitle.trim(),
      content: newDocSummary.trim() || null,
      category: defaultCategory,
      file_type: defaultFileType,
      project_id: null,
    });
    setError(result.error ? result.error.message : null);
    setNewDocTitle("");
    setNewDocSummary("");
    await loadDocuments();
  }

  async function handleUpdateTitle() {
    if (!selectedDocument || !editTitle.trim()) return;
    const result = await updateDocument(selectedDocument.id, {
      title: editTitle.trim(),
    });
    setError(result.error ? result.error.message : null);
    await loadDocuments();
  }

  async function handleDeleteDocument() {
    if (!selectedDocument) return;
    const result = await deleteDocument(selectedDocument.id);
    setError(result.error ? result.error.message : null);
    await loadDocuments();
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">
          Research Intelligence
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          기술자료 검색
        </h1>
        <p className="mt-3 text-sm leading-7 text-brand-100">
          사내 기술자료 검색과 요약을 수행하고, 문서 데이터를 서비스 레이어를 통해
          조회/저장합니다.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <SectionCard
            title="기술자료 업로드"
            description="PDF/DOCX/XLSX 파일 업로드 후 AI 학습 데이터로 저장합니다."
          >
            <FileUpload />
          </SectionCard>
          <SectionCard
            title="문서 기반 AI 질문"
            description="업로드된 PDF chunk를 검색해 답변을 생성합니다."
          >
            <RagAsk />
            <div className="mt-4">
              <RagStatusCard />
            </div>
          </SectionCard>
          <SectionCard
            title="검색 영역"
            description={`데이터 소스: ${source === "supabase" ? "Supabase" : "Fallback Mock"}`}
          >
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <label className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <span className="text-sm font-medium text-slate-700">
                    키워드 검색
                  </span>
                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      onBlur={(event) => runSearch(event.target.value)}
                      className="w-full bg-transparent text-sm text-slate-800 outline-none"
                    />
                  </div>
                </label>

                <label className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <span className="text-sm font-medium text-slate-700">
                    정렬
                  </span>
                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(event.target.value as ResearchSortOption)
                    }
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                  >
                    <option value="relevance">관련도순</option>
                    <option value="latest">최신순</option>
                    <option value="importance">중요도순</option>
                  </select>
                </label>
              </div>

              <label className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <span className="text-sm font-medium text-slate-700">
                  자연어 질문
                </span>
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  className="mt-3 h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {pageData.quickKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => runSearch(keyword)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="문서 리스트"
            description={`검색 결과 ${filteredDocuments.length}건`}
          >
            <div className="space-y-3">
              {loadingDocs ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  문서를 불러오는 중입니다.
                </div>
              ) : null}
              {filteredDocuments.map((document) => (
                <article
                  key={document.id}
                  onClick={() => setSelectedDocumentId(document.id)}
                  className={`cursor-pointer rounded-[26px] border p-5 transition ${
                    selectedDocument?.id === document.id
                      ? "border-brand-300 bg-brand-50/70 shadow-sm"
                      : "border-slate-200 bg-white hover:border-brand-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge label={document.type} />
                        <StatusBadge
                          label={`중요도 ${document.importance}`}
                          variant={
                            importanceVariant[
                              document.importance as keyof typeof importanceVariant
                            ]
                          }
                        />
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                          관련도 {document.score}%
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-slate-900">
                        {document.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {document.project} · {document.owner} ·{" "}
                        {document.updatedAt}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {document.summary}
                  </p>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard
            title="문서 상세"
            description="선택 문서 요약/수정/삭제"
            action={
              <button
                onClick={() => void handleAiSummary()}
                disabled={loading || !selectedDocument}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                AI 요약
              </button>
            }
          >
            {selectedDocument ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {selectedDocument.title}
                    </h3>
                    <StatusBadge label={selectedDocument.type} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {aiSummary?.summary ?? selectedDocument.summary}
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    문서 제목 수정
                  </span>
                  <div className="flex gap-2">
                    <input
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => void handleUpdateTitle()}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      <Save className="h-4 w-4" />
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteDocument()}
                      className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </button>
                  </div>
                </label>
              </div>
            ) : (
              <p className="text-sm text-slate-500">문서를 선택하세요.</p>
            )}
          </SectionCard>

          <SectionCard title="관련 문서 추천" description="선택 문서 기준 추천 목록">
            <div className="space-y-3">
              {recommendedDocuments.map((document) => (
                <div
                  key={document.title}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-800">{document.title}</p>
                    <StatusBadge label={document.type} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {document.relation}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="최근 검색 기록" description="클릭 시 검색어 재사용">
            <div className="space-y-3">
              {recentSearches.map((item) => (
                <button
                  key={item}
                  onClick={() => runSearch(item)}
                  className="flex w-full items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand-700">
                    <History className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="신규 문서 등록" description="서비스 CRUD 동작 확인용">
            <div className="space-y-3">
              <input
                value={newDocTitle}
                onChange={(event) => setNewDocTitle(event.target.value)}
                placeholder="문서 제목"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <textarea
                value={newDocSummary}
                onChange={(event) => setNewDocSummary(event.target.value)}
                placeholder="문서 요약"
                className="h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <button
                onClick={() => void handleCreateDocument()}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                <FileText className="h-4 w-4" />
                문서 저장
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
