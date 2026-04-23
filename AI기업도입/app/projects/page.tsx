"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { useProjects } from "@/components/providers/project-provider";

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, loading, error, createNewProject, getInitialForm } = useProjects();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const kpi = useMemo(
    () => ({
      total: projects.length,
      done: projects.filter((p) => p.status === "완료").length,
    }),
    [projects],
  );

  async function handleCreate() {
    if (!name.trim()) return;
    const base = getInitialForm();

    setSaving(true);
    await createNewProject({
      ...base,
      name: name.trim(),
      description: `${name.trim()} 프로젝트`,
      owner: base.owner || "관리자",
    });
    setName("");
    setSaving(false);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">Project Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">프로젝트 관리</h1>
        <p className="mt-3 text-sm text-brand-100">
          사용자 입력, 저장, 상세 조회까지 프로젝트 중심 워크플로우를 관리합니다.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
          <p className="text-sm text-slate-500">전체 프로젝트</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{kpi.total}</p>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
          <p className="text-sm text-slate-500">완료 프로젝트</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-700">{kpi.done}</p>
        </div>
      </div>

      <section className="rounded-3xl border border-white/70 bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="새 프로젝트명 입력"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
          />
          <button
            onClick={() => void handleCreate()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {saving ? "생성 중..." : "프로젝트 생성"}
          </button>
        </div>
        {error ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            {error}
          </p>
        ) : null}
      </section>

      <section className="rounded-3xl border border-white/70 bg-white p-5 shadow-panel">
        <h2 className="text-lg font-semibold text-slate-900">프로젝트 목록</h2>
        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-sm text-slate-500">프로젝트를 불러오는 중입니다.</p>
          ) : null}
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{project.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  상태: {project.status} · 진행률: {project.progress}% · 담당: {project.owner}
                </p>
              </div>
              <button
                onClick={() => router.push(`/projects/${project.id}`)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                상세 보기
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
