"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Lightbulb,
  LoaderCircle,
  Pencil,
  RefreshCcw,
  Save,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users2,
} from "lucide-react";

import { useProjects } from "@/components/providers/project-provider";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  requestAiGenerateIdeaText,
  requestAiIdeas,
} from "@/services/ai-client-service";
import {
  createIdea,
  deleteIdea,
  getIdeasByProject,
  updateIdea,
} from "@/services/idea-record-service";
import { generateIdeaResults, getIdeaOptions } from "@/services/idea-service";
import type { AiIdeaResult } from "@/types/ai";
import type { IdeaInsertInput, IdeaRow } from "@/types/domain";

export function IdeaWorkspace() {
  const { projects } = useProjects();
  const { markets, productGroups, directions, initialInput } = getIdeaOptions();
  const [form, setForm] = useState(initialInput);
  const [variantSeed, setVariantSeed] = useState(0);
  const [aiIdeas, setAiIdeas] = useState<AiIdeaResult[] | null>(null);
  const [simpleAiResult, setSimpleAiResult] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingSimpleAi, setLoadingSimpleAi] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [savedIdeas, setSavedIdeas] = useState<IdeaRow[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [source, setSource] = useState<"supabase" | "fallback">("fallback");
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const mockIdeas = useMemo(
    () => generateIdeaResults(form, variantSeed),
    [form, variantSeed],
  );
  const displayedIdeas = aiIdeas ?? mockIdeas;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (projects[0] && !selectedProjectId) {
        setSelectedProjectId(projects[0].id);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [projects, selectedProjectId]);

  async function loadSavedIdeas(projectId: string) {
    if (!projectId) return;
    setLoadingSaved(true);
    const response = await getIdeasByProject(projectId);
    setSavedIdeas(response.data);
    setSource(response.source);
    setError(response.error ? response.error.message : null);
    setLoadingSaved(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!selectedProjectId) return;
      void loadSavedIdeas(selectedProjectId);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedProjectId]);

  async function handleGenerateAiIdeas() {
    try {
      setLoadingAi(true);
      setError(null);
      setSimpleAiResult("");
      const response = await requestAiIdeas(
        form,
        mockIdeas.map((idea) => idea.title),
      );
      setAiIdeas(response.ideas);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "AI 아이디어 생성 중 오류가 발생했습니다.",
      );
    } finally {
      setLoadingAi(false);
    }
  }

  async function handleGenerateSimpleIdeas() {
    try {
      setLoadingSimpleAi(true);
      setError(null);
      const response = await requestAiGenerateIdeaText({
        keyword: form.keyword,
        category: form.productGroup,
        goal: form.direction,
      });
      setSimpleAiResult(response.result);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "간단 아이디어 생성 중 오류가 발생했습니다.",
      );
    } finally {
      setLoadingSimpleAi(false);
    }
  }

  async function handleSaveIdeas() {
    if (!selectedProjectId) return;
    const targets = displayedIdeas.slice(0, 3);
    for (const idea of targets) {
      const payload: IdeaInsertInput = {
        project_id: selectedProjectId,
        title: idea.title,
        description: `${idea.coreFeature}\n${idea.pitch}`,
        effect: idea.effects.join(" / "),
      };
      const response = await createIdea(payload);
      if (response.error) {
        setError(response.error.message);
        break;
      }
    }
    await loadSavedIdeas(selectedProjectId);
  }

  async function handleUpdateIdeaTitle() {
    if (!editId || !editTitle.trim()) return;
    const response = await updateIdea(editId, { title: editTitle.trim() });
    setError(response.error ? response.error.message : null);
    await loadSavedIdeas(selectedProjectId);
    setEditId("");
    setEditTitle("");
  }

  async function handleDeleteIdea(id: string) {
    const response = await deleteIdea(id);
    setError(response.error ? response.error.message : null);
    await loadSavedIdeas(selectedProjectId);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">
          Idea Generator
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          신제품 아이디어 생성
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-brand-100">
          입력 조건에 따라 아이디어를 생성하고 프로젝트별로 저장합니다.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="입력 조건"
          description={`데이터 소스: ${source === "supabase" ? "Supabase" : "Fallback Mock"}`}
        >
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                프로젝트 선택
              </span>
              <select
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
              >
                <option value="">선택하세요</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                키워드
              </span>
              <input
                value={form.keyword}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, keyword: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "대상 시장", key: "market", options: markets },
                { label: "제품군", key: "productGroup", options: productGroups },
                { label: "목표 방향", key: "direction", options: directions },
              ].map(({ label, key, options }) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {label}
                  </span>
                  <select
                    value={form[key as keyof typeof form]}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, [key]: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
              <p className="text-sm font-medium text-slate-500">생성 아이디어</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {displayedIdeas.length}건
              </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
              <p className="text-sm font-medium text-slate-500">방향</p>
              <p className="mt-4 text-2xl font-semibold text-brand-700">
                {form.direction}
              </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
              <p className="text-sm font-medium text-slate-500">생성 방식</p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">
                {aiIdeas ? "구조화 AI" : "기본 카드"}
              </p>
            </div>
          </div>

          <SectionCard
            title="아이디어 결과 카드"
            description="발표자료에 바로 활용 가능한 형태"
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAiIdeas(null);
                    setSimpleAiResult("");
                    setVariantSeed((prev) => prev + 1);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <RefreshCcw className="h-4 w-4" />
                  기본안 갱신
                </button>
                <button
                  onClick={() => void handleGenerateAiIdeas()}
                  disabled={loadingAi}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {loadingAi ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  구조화 AI 생성
                </button>
                <button
                  onClick={() => void handleGenerateSimpleIdeas()}
                  disabled={loadingSimpleAi}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                >
                  {loadingSimpleAi ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  간단 API 생성
                </button>
                <button
                  onClick={() => void handleSaveIdeas()}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <Save className="h-4 w-4" />
                  결과 저장
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              {displayedIdeas.map((idea) => (
                <article
                  key={idea.title}
                  className="rounded-[28px] border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-brand-700" />
                        <h3 className="text-xl font-semibold text-slate-900">
                          {idea.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {idea.pitch}
                      </p>
                    </div>
                    <StatusBadge label={idea.emphasis} />
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-4">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-brand-700" />
                        <p className="font-medium text-slate-900">핵심 기능</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {idea.coreFeature}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-brand-700" />
                        <p className="font-medium text-slate-900">기대효과</p>
                      </div>
                      <div className="mt-3 space-y-2">
                        {idea.effects.map((effect) => (
                          <p key={effect} className="text-sm leading-6 text-slate-600">
                            {effect}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-brand-700" />
                        <p className="font-medium text-slate-900">차별화 포인트</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {idea.differentiation}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2">
                        <Users2 className="h-4 w-4 text-brand-700" />
                        <p className="font-medium text-slate-900">추천 고객군</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {idea.customers}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>

          {simpleAiResult ? (
            <SectionCard
              title="간단 API 생성 결과"
              description="/api/ai/generate-idea 응답 원문"
            >
              <pre className="whitespace-pre-wrap rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {simpleAiResult}
              </pre>
            </SectionCard>
          ) : null}
        </div>
      </div>

      <SectionCard title="저장된 아이디어" description="프로젝트별 수정/삭제">
        <div className="space-y-3">
          {loadingSaved ? <p className="text-sm text-slate-500">불러오는 중...</p> : null}
          {savedIdeas.map((idea) => (
            <div key={idea.id} className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{idea.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{idea.created_at}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDeleteIdea(idea.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  삭제
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {idea.description}
              </p>
              <p className="mt-2 text-sm text-slate-500">{idea.effect}</p>

              <div className="mt-3 flex gap-2">
                <input
                  value={editId === idea.id ? editTitle : ""}
                  onFocus={() => {
                    setEditId(idea.id);
                    setEditTitle(idea.title);
                  }}
                  onChange={(event) => setEditTitle(event.target.value)}
                  placeholder="아이디어명 수정"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
                />
                <button
                  onClick={() => void handleUpdateIdeaTitle()}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <Pencil className="h-4 w-4" />
                  수정
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
