"use client";

import { useEffect, useState } from "react";
import {
  Code2,
  FileText,
  LoaderCircle,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";

import { useProjects } from "@/components/providers/project-provider";
import { SectionCard } from "@/components/ui/section-card";
import { requestAiAutomation } from "@/services/ai-client-service";
import {
  createAutomationResult,
  deleteAutomationResult,
  getAutomationResultsByProject,
} from "@/services/automation-record-service";
import {
  getAutomationCategories,
  getAutomationTemplates,
  getTemplatesByCategory,
} from "@/services/automation-service";
import type { AiAutomationResult } from "@/types/ai";
import type { AutomationCategory, AutomationInsertInput, AutomationResult } from "@/types/domain";


export function AutomationWorkspace() {
  const { projects } = useProjects();
  const categories = getAutomationCategories();
  const allTemplates = getAutomationTemplates();

  const [selectedCategory, setSelectedCategory] = useState<AutomationCategory | "전체">("전체");
  const [selectedTemplateId, setSelectedTemplateId] = useState(allTemplates[0]?.id ?? "");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [aiResult, setAiResult] = useState<AiAutomationResult | null>(null);
  const [savedResults, setSavedResults] = useState<AutomationResult[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"supabase" | "fallback">("fallback");

  const filteredTemplates = getTemplatesByCategory(selectedCategory);
  const selectedTemplate = allTemplates.find((t) => t.id === selectedTemplateId);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (projects[0] && !selectedProjectId) {
        setSelectedProjectId(projects[0].id);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const templates = getTemplatesByCategory(selectedCategory);
    if (templates.length > 0) {
      setSelectedTemplateId(templates[0].id);
    }
  }, [selectedCategory]);

  async function loadSavedResults(projectId: string) {
    if (!projectId) return;
    setLoadingSaved(true);
    const response = await getAutomationResultsByProject(projectId);
    setSavedResults(response.data);
    setSource(response.source);
    setLoadingSaved(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!selectedProjectId) return;
      void loadSavedResults(selectedProjectId);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedProjectId]);

  async function handleGenerate() {
    const prompt = customPrompt.trim() || selectedTemplate?.prompt || "";
    if (!prompt) return;

    const project = projects.find((p) => p.id === selectedProjectId);

    try {
      setLoadingAi(true);
      setError(null);
      const result = await requestAiAutomation({
        prompt,
        projectContext: project?.name ?? "",
      });
      setAiResult(result);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "산출물 생성 중 오류가 발생했습니다.",
      );
    } finally {
      setLoadingAi(false);
    }
  }

  async function handleSave() {
    if (!aiResult || !selectedProjectId) return;
    const payload: AutomationInsertInput = {
      project_id: selectedProjectId,
      template_title: aiResult.title,
      output: aiResult.output,
    };
    const response = await createAutomationResult(payload);
    if (response.error) {
      setError(response.error.message);
      return;
    }
    await loadSavedResults(selectedProjectId);
  }

  async function handleDelete(id: string) {
    const response = await deleteAutomationResult(id);
    setError(response.error ? response.error.message : null);
    await loadSavedResults(selectedProjectId);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">
          Code & Design Automation
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          코드 / 설계 자동화
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-brand-100">
          템플릿을 선택하거나 직접 요청을 입력하면 코드, 설계서, 사양서,
          체크리스트를 자동으로 생성합니다.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="입력 설정"
          description={`데이터 소스: ${source === "supabase" ? "Supabase" : "Fallback Mock"}`}
        >
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                프로젝트 선택
              </span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
              >
                <option value="">선택하세요</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                카테고리
              </span>
              <div className="flex flex-wrap gap-2">
                {(["전체", ...categories] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as AutomationCategory | "전체")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                템플릿 선택
              </span>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
              >
                {filteredTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.category}] {t.title}
                  </option>
                ))}
              </select>
              {selectedTemplate ? (
                <p className="mt-2 text-xs text-slate-500">
                  {selectedTemplate.description}
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                직접 입력 (선택)
              </span>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="템플릿 대신 직접 요청을 입력하세요..."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none resize-none"
              />
            </label>

            <button
              onClick={() => void handleGenerate()}
              disabled={loadingAi}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {loadingAi ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              AI 생성
            </button>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
              <p className="text-sm font-medium text-slate-500">저장된 산출물</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {savedResults.length}건
              </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
              <p className="text-sm font-medium text-slate-500">템플릿 수</p>
              <p className="mt-4 text-3xl font-semibold text-brand-700">
                {allTemplates.length}종
              </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
              <p className="text-sm font-medium text-slate-500">선택 카테고리</p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">
                {selectedCategory}
              </p>
            </div>
          </div>

          {aiResult ? (
            <SectionCard
              title={aiResult.title}
              description={`언어/형식: ${aiResult.language}`}
              action={
                <button
                  onClick={() => void handleSave()}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <Save className="h-4 w-4" />
                  저장
                </button>
              }
            >
              <div className="space-y-4">
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-3xl border border-slate-200 bg-slate-950 p-5 text-sm leading-7 text-green-400">
                  {aiResult.output}
                </pre>
                {aiResult.notes.length > 0 ? (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-800">주의사항</p>
                    <ul className="mt-2 space-y-1">
                      {aiResult.notes.map((note, i) => (
                        <li key={i} className="text-sm text-amber-700">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </SectionCard>
          ) : (
            <SectionCard title="생성 결과" description="AI 생성 버튼을 눌러 산출물을 만드세요">
              <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                <Code2 className="mr-2 h-5 w-5" />
                아직 생성된 산출물이 없습니다
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      <SectionCard title="저장된 산출물" description="프로젝트별 생성 이력">
        <div className="space-y-3">
          {loadingSaved ? (
            <p className="text-sm text-slate-500">불러오는 중...</p>
          ) : null}
          {savedResults.length === 0 && !loadingSaved ? (
            <p className="text-sm text-slate-400">저장된 산출물이 없습니다.</p>
          ) : null}
          {savedResults.map((result) => (
            <div
              key={result.id}
              className="rounded-3xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-700" />
                  <p className="text-sm font-semibold text-slate-900">
                    {result.template_title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400">{result.created_at.slice(0, 10)}</p>
                  <button
                    onClick={() => void handleDelete(result.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    삭제
                  </button>
                </div>
              </div>
              <pre className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs leading-6 text-slate-700">
                {result.output}
              </pre>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
