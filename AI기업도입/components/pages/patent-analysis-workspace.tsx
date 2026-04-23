"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  LoaderCircle,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { requestAiPatentAnalysis } from "@/services/ai-client-service";
import {
  createPatent,
  deletePatent,
  getAllPatents,
  updatePatent,
} from "@/services/patent-record-service";
import { getPatentKeywords, getPatentScenario } from "@/services/patent-service";
import type { AiPatentAnalysis } from "@/types/ai";
import type { PatentRow, RiskLevel } from "@/types/domain";

function riskVariant(level: string) {
  if (level.includes("높")) return "danger" as const;
  if (level.includes("중")) return "warning" as const;
  return "success" as const;
}

export function PatentAnalysisWorkspace() {
  const keywords = getPatentKeywords();
  const [keyword, setKeyword] = useState(keywords[0] ?? "지문인식 시동장치");
  const [records, setRecords] = useState<PatentRow[]>([]);
  const [source, setSource] = useState<"supabase" | "fallback">("fallback");
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AiPatentAnalysis | null>(null);

  const scenario = useMemo(() => getPatentScenario(keyword), [keyword]);

  const filteredRecords = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return records;
    return records.filter((item) =>
      [item.title, item.summary ?? ""].join(" ").toLowerCase().includes(normalized),
    );
  }, [records, keyword]);

  async function loadPatents() {
    setLoadingRecords(true);
    const result = await getAllPatents();
    setRecords(result.data);
    setSource(result.source);
    setError(result.error ? result.error.message : null);
    setLoadingRecords(false);
  }

  useEffect(() => {
    void loadPatents();
  }, []);

  async function handleSaveScenarioPatent() {
    const seed = scenario.patents[0];
    if (!seed) return;

    const result = await createPatent({
      project_id: null,
      title: `${seed.title} (${keyword})`,
      summary: seed.summary,
      risk_level: seed.risk as RiskLevel,
      similarity: seed.similarity,
    });

    setError(result.error ? result.error.message : null);
    await loadPatents();
  }

  async function handleUpdateRisk(id: string, risk: string) {
    const result = await updatePatent(id, {
      risk_level: risk as RiskLevel,
    });
    setError(result.error ? result.error.message : null);
    await loadPatents();
  }

  async function handleDeletePatent(id: string) {
    const result = await deletePatent(id);
    setError(result.error ? result.error.message : null);
    await loadPatents();
  }

  async function handleAiAnalysis() {
    try {
      setLoadingAi(true);
      setError(null);
      const result = await requestAiPatentAnalysis(keyword, scenario);
      setAiAnalysis(result);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "특허 AI 분석 중 오류가 발생했습니다.",
      );
    } finally {
      setLoadingAi(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">
          Patent Risk Desk
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">특허 분석</h1>
        <p className="mt-3 text-sm leading-7 text-brand-100">
          입력 키워드 기반 특허 분석과 DB 저장 레코드를 함께 관리합니다.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <SectionCard
            title="분석 입력"
            description={`데이터 소스: ${source === "supabase" ? "Supabase" : "Fallback Mock"}`}
          >
            <div className="space-y-4">
              <label className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <span className="text-sm font-medium text-slate-700">
                  제품명 또는 기술 키워드
                </span>
                <input
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(event.target.value);
                    setAiAnalysis(null);
                  }}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {keywords.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setKeyword(item);
                      setAiAnalysis(null);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => void handleAiAnalysis()}
                  disabled={loadingAi}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {loadingAi ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  AI 특허 요약
                </button>
                <button
                  onClick={() => void handleSaveScenarioPatent()}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <Plus className="h-4 w-4" />
                  분석 결과 저장
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="회피 설계 아이디어" description="키워드 기반 회피 방향">
            <div className="space-y-3">
              {(aiAnalysis?.avoidanceIdeas ?? scenario.avoidanceIdeas.map((idea) => idea.detail)).map(
                (idea) => (
                  <div
                    key={idea}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-4"
                  >
                    <div className="flex items-center gap-2 text-brand-700">
                      <ArrowRight className="h-4 w-4" />
                      <p className="font-semibold text-slate-900">회피 설계 제안</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{idea}</p>
                  </div>
                ),
              )}
            </div>
          </SectionCard>

          <SectionCard title="경쟁사 특허 동향" description="시나리오 기반 추세 정보">
            <div className="space-y-3">
              {scenario.competitorTrends.map((trend) => (
                <div
                  key={trend.company}
                  className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand-700">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{trend.company}</p>
                      <p className="text-sm text-slate-500">{trend.focus}</p>
                    </div>
                  </div>
                  <StatusBadge label={trend.status} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard
            title="특허 레코드"
            description={`검색 결과 ${filteredRecords.length}건`}
          >
            <div className="overflow-hidden rounded-[28px] border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-500">
                    <th className="px-4 py-3 font-medium">특허</th>
                    <th className="px-4 py-3 font-medium">유사도</th>
                    <th className="px-4 py-3 font-medium">위험도</th>
                    <th className="px-4 py-3 font-medium">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingRecords ? (
                    <tr>
                      <td className="px-4 py-6 text-center text-slate-500" colSpan={4}>
                        로딩 중...
                      </td>
                    </tr>
                  ) : null}
                  {filteredRecords.map((patent) => (
                    <tr key={patent.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{patent.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{patent.id}</p>
                      </td>
                      <td className="px-4 py-4 font-semibold text-brand-700">
                        {patent.similarity}%
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={patent.risk_level}
                          onChange={(event) =>
                            void handleUpdateRisk(patent.id, event.target.value)
                          }
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                        >
                          <option value={patent.risk_level}>{patent.risk_level}</option>
                          <option value={"낮음"}>낮음</option>
                          <option value={"중간"}>중간</option>
                          <option value={"높음"}>높음</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => void handleDeletePatent(patent.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="핵심 청구항 요약" description="AI 또는 시나리오 기반">
            <div className="space-y-3">
              {(aiAnalysis?.keyClaims ?? scenario.patents.map((patent) => patent.claim)).map(
                (claim) => (
                  <div
                    key={claim}
                    className="rounded-3xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600"
                  >
                    {claim}
                  </div>
                ),
              )}
            </div>
          </SectionCard>

          <SectionCard title="특허 요약" description="위험도 및 종합 코멘트">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {scenario.patents[0]?.title ?? "요약 대상 없음"}
                </h3>
                <StatusBadge
                  label={aiAnalysis?.riskLevel ?? scenario.patents[0]?.risk ?? "중간"}
                  variant={riskVariant(
                    aiAnalysis?.riskLevel ?? scenario.patents[0]?.risk ?? "중간",
                  )}
                />
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {aiAnalysis?.summary ??
                  scenario.patents[0]?.summary ??
                  "요약 정보가 없습니다."}
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
