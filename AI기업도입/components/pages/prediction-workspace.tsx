"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Save, Trash2 } from "lucide-react";

import { useProjects } from "@/components/providers/project-provider";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  createPrediction,
  deletePrediction,
  getPredictionsByProject,
} from "@/services/prediction-record-service";
import {
  getPredictionInitialForm,
  predictPrototypePerformance,
} from "@/services/prediction-service";
import type { PredictionInsertInput, PredictionRow, RiskLevel } from "@/types/domain";

function riskBadgeVariant(risk: string) {
  if (risk === "높음") return "danger" as const;
  if (risk === "중간") return "warning" as const;
  return "success" as const;
}

export function PredictionWorkspace() {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [form, setForm] = useState(getPredictionInitialForm());
  const [rows, setRows] = useState<PredictionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingRows, setLoadingRows] = useState(false);

  const prediction = useMemo(() => predictPrototypePerformance(form), [form]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!selectedProjectId && projects[0]) setSelectedProjectId(projects[0].id);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [projects, selectedProjectId]);

  async function loadRows(projectId: string) {
    if (!projectId) return;
    setLoadingRows(true);
    const response = await getPredictionsByProject(projectId);
    setRows(response.data);
    setError(response.error ? response.error.message : null);
    setLoadingRows(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!selectedProjectId) return;
      void loadRows(selectedProjectId);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedProjectId]);

  async function handleSave() {
    if (!selectedProjectId) return;
    const payload: PredictionInsertInput = {
      project_id: selectedProjectId,
      score: prediction.score,
      risk: prediction.riskLevel as unknown as RiskLevel,
      recommendation: prediction.recommendations.join(" / "),
    };
    const result = await createPrediction(payload);
    setError(result.error ? result.error.message : null);
    await loadRows(selectedProjectId);
  }

  async function handleDelete(id: string) {
    const result = await deletePrediction(id);
    setError(result.error ? result.error.message : null);
    await loadRows(selectedProjectId);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-bold">ML 기반 성능 예측</h1>
        <p className="mt-2 text-sm text-gray-600">
          Rule-based + Mock Prediction 구조로 구현되어 있으며, 추후 ML 모델 추론 API로
          교체 가능한 서비스 구조입니다.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="입력 파라미터" description="대표 유스케이스 입력값">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">프로젝트</span>
              <select
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">선택하세요</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            {[
              ["제품명", "productName"],
              ["전압", "voltage"],
              ["센서 종류", "sensorType"],
              ["통신 방식", "communication"],
              ["사용 환경", "environment"],
              ["장착 위치", "mountPosition"],
            ].map(([label, key]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                />
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="예측 결과"
          description="성능 점수 · 위험도 · 추천 개선사항"
          action={
            <button
              onClick={() => void handleSave()}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              <Save className="h-4 w-4" />
              결과 저장
            </button>
          }
        >
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <p className="text-xs text-slate-500">성능 점수</p>
                <p className="mt-2 text-3xl font-bold">{prediction.score}</p>
              </div>
              <div className="rounded-2xl border bg-slate-50 p-4">
                <p className="text-xs text-slate-500">위험도</p>
                <div className="mt-2">
                  <StatusBadge
                    label={prediction.riskLevel}
                    variant={riskBadgeVariant(prediction.riskLevel)}
                  />
                </div>
              </div>
              <div className="rounded-2xl border bg-slate-50 p-4">
                <p className="text-xs text-slate-500">모델 상태</p>
                <p className="mt-2 text-sm font-medium text-slate-700">Rule-Based</p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-700">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-semibold">추천 개선사항</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {prediction.recommendations.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">{prediction.modelHint}</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="저장된 예측 이력" description="predictions 테이블 저장 데이터">
        {loadingRows ? <p className="text-sm text-gray-500">불러오는 중...</p> : null}
        <div className="space-y-3">
          {rows.map((row) => (
            <article key={row.id} className="rounded-2xl border bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">
                    점수 {row.score} · 위험도 {row.risk}
                  </p>
                  <p className="text-xs text-slate-500">{row.created_at}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(row.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-1.5 text-xs text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  삭제
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600">{row.recommendation}</p>
            </article>
          ))}
          {rows.length === 0 ? (
            <p className="text-sm text-slate-500">저장된 예측 결과가 없습니다.</p>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
