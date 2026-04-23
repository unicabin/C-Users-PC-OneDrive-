"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileText, Lightbulb, ShieldAlert, Target } from "lucide-react";

import { useProjects } from "@/components/providers/project-provider";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDocumentsByProject } from "@/services/document-service";
import { getIdeasByProject } from "@/services/idea-record-service";
import { getPatentsByProject } from "@/services/patent-record-service";
import { getPredictionsByProject } from "@/services/prediction-record-service";
import type { DocumentRow, IdeaRow, PatentRow, PredictionRow } from "@/types/domain";

type DetailTab = "ideas" | "patents" | "predictions" | "documents";

const tabConfig: Array<{ key: DetailTab; label: string; icon: typeof Lightbulb }> = [
  { key: "ideas", label: "아이디어", icon: Lightbulb },
  { key: "patents", label: "특허 분석", icon: ShieldAlert },
  { key: "predictions", label: "성능 예측", icon: Target },
  { key: "documents", label: "기술자료", icon: FileText },
];

export function ProjectDetailWorkspace({ projectId }: { projectId: string }) {
  const { getProject, loading } = useProjects();
  const project = getProject(projectId);
  const [activeTab, setActiveTab] = useState<DetailTab>("ideas");
  const [ideas, setIdeas] = useState<IdeaRow[]>([]);
  const [patents, setPatents] = useState<PatentRow[]>([]);
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(
    () => ({
      ideas: ideas.length,
      patents: patents.length,
      predictions: predictions.length,
      documents: documents.length,
    }),
    [ideas.length, patents.length, predictions.length, documents.length],
  );

  const loadLinkedData = useCallback(async () => {
    setLoadingData(true);
    const [ideaRes, patentRes, predictionRes, documentRes] = await Promise.all([
      getIdeasByProject(projectId),
      getPatentsByProject(projectId),
      getPredictionsByProject(projectId),
      getDocumentsByProject(projectId),
    ]);

    setIdeas(ideaRes.data);
    setPatents(patentRes.data);
    setPredictions(predictionRes.data);
    setDocuments(documentRes.data);
    setError(
      ideaRes.error?.message ??
        patentRes.error?.message ??
        predictionRes.error?.message ??
        documentRes.error?.message ??
        null,
    );
    setLoadingData(false);
  }, [projectId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLinkedData();
    }, 0);

    const interval = window.setInterval(() => {
      void loadLinkedData();
    }, 5000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [loadLinkedData]);

  if (loading) {
    return (
      <SectionCard title="프로젝트 상세" description="프로젝트 정보를 불러오는 중입니다.">
        <div className="text-sm text-slate-500">잠시만 기다려 주세요.</div>
      </SectionCard>
    );
  }

  if (!project) {
    return (
      <SectionCard title="프로젝트 상세" description="프로젝트를 찾을 수 없습니다.">
        <Link href="/projects" className="text-sm font-medium text-brand-700">
          프로젝트 목록으로 이동
        </Link>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>
      </div>

      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">{project.code}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{project.name}</h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-brand-100">{project.description}</p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] border border-white/70 bg-white p-4 shadow-panel">
          <p className="text-xs text-slate-500">아이디어</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.ideas}</p>
        </div>
        <div className="rounded-[24px] border border-white/70 bg-white p-4 shadow-panel">
          <p className="text-xs text-slate-500">특허 분석</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.patents}</p>
        </div>
        <div className="rounded-[24px] border border-white/70 bg-white p-4 shadow-panel">
          <p className="text-xs text-slate-500">성능 예측</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.predictions}</p>
        </div>
        <div className="rounded-[24px] border border-white/70 bg-white p-4 shadow-panel">
          <p className="text-xs text-slate-500">기술자료</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.documents}</p>
        </div>
      </div>

      <SectionCard
        title="프로젝트 통합 데이터"
        description="새로 생성된 데이터는 5초마다 자동 반영됩니다."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                  active
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loadingData ? (
          <p className="text-sm text-slate-500">연결 데이터를 불러오는 중입니다...</p>
        ) : null}

        {activeTab === "ideas" ? (
          <div className="space-y-3">
            {ideas.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <p className="mt-2 text-xs text-slate-500">기대효과: {item.effect ?? "-"}</p>
              </article>
            ))}
            {ideas.length === 0 ? <p className="text-sm text-slate-500">저장된 아이디어가 없습니다.</p> : null}
          </div>
        ) : null}

        {activeTab === "patents" ? (
          <div className="space-y-3">
            {patents.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <StatusBadge label={item.risk_level} />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                <p className="mt-2 text-xs text-slate-500">유사도: {item.similarity}%</p>
              </article>
            ))}
            {patents.length === 0 ? <p className="text-sm text-slate-500">저장된 특허 분석이 없습니다.</p> : null}
          </div>
        ) : null}

        {activeTab === "predictions" ? (
          <div className="space-y-3">
            {predictions.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">성능 점수 {item.score}점</h3>
                  <StatusBadge label={item.risk} />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.recommendation}</p>
                <p className="mt-2 text-xs text-slate-500">{item.created_at}</p>
              </article>
            ))}
            {predictions.length === 0 ? <p className="text-sm text-slate-500">저장된 성능 예측이 없습니다.</p> : null}
          </div>
        ) : null}

        {activeTab === "documents" ? (
          <div className="space-y-3">
            {documents.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <StatusBadge label={item.file_type} />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.content}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {item.category} · {item.created_at}
                </p>
              </article>
            ))}
            {documents.length === 0 ? <p className="text-sm text-slate-500">저장된 기술자료가 없습니다.</p> : null}
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
}
