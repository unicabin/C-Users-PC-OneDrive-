"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Plus, Trash2 } from "lucide-react";

import { useProjects } from "@/components/providers/project-provider";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPageContent } from "@/services/app-service";
import type { ProjectFormInput, ProjectPriority, ProjectStatus } from "@/types/domain";

const statusOptions: ProjectStatus[] = ["기획중", "분석중", "개발중", "완료"];
const priorityOptions: ProjectPriority[] = ["낮음", "중간", "높음", "긴급"];

function statusVariant(status: ProjectStatus) {
  if (status === "완료") return "success" as const;
  if (status === "개발중") return "warning" as const;
  return "neutral" as const;
}

function priorityVariant(priority: ProjectPriority) {
  if (priority === "긴급") return "danger" as const;
  if (priority === "높음") return "warning" as const;
  return "neutral" as const;
}

export function ProjectsWorkspace() {
  const router = useRouter();
  const content = getPageContent("projects");
  const {
    projects,
    loading,
    error,
    createNewProject,
    removeProject,
    updateStatus,
    getInitialForm,
  } = useProjects();
  const [form, setForm] = useState<ProjectFormInput>(getInitialForm());

  const summary = useMemo(
    () => ({
      total: projects.length,
      inProgress: projects.filter((project) => project.status !== "완료").length,
      completed: projects.filter((project) => project.status === "완료").length,
      critical: projects.filter((project) => project.priority === "긴급").length,
    }),
    [projects],
  );

  async function handleCreateProject() {
    if (!form.name.trim() || !form.owner.trim()) return;
    const created = await createNewProject(form);
    if (created) {
      setForm(getInitialForm());
    }
  }

  async function handleDeleteProject(projectId: string) {
    await removeProject(projectId);
  }

  async function handleStatusChange(projectId: string, status: ProjectStatus) {
    await updateStatus(projectId, status);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">Project Control Center</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{content.title}</h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-brand-100">{content.description}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
          <p className="text-sm font-medium text-slate-500">전체 프로젝트</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.total}건</p>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
          <p className="text-sm font-medium text-slate-500">진행중 프로젝트</p>
          <p className="mt-4 text-3xl font-semibold text-brand-700">{summary.inProgress}건</p>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
          <p className="text-sm font-medium text-slate-500">완료 프로젝트</p>
          <p className="mt-4 text-3xl font-semibold text-emerald-700">{summary.completed}건</p>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
          <p className="text-sm font-medium text-slate-500">긴급 프로젝트</p>
          <p className="mt-4 text-3xl font-semibold text-rose-600">{summary.critical}건</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="프로젝트 목록" description="프로젝트 선택, 상태 변경, 삭제 동작을 확인할 수 있습니다.">
          <div className="space-y-3">
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                프로젝트 데이터를 불러오는 중입니다.
              </div>
            ) : null}
            {projects.map((project) => (
              <article key={project.id} className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge label={project.status} variant={statusVariant(project.status)} />
                      <StatusBadge label={`중요도 ${project.priority}`} variant={priorityVariant(project.priority)} />
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900">{project.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{project.code} · {project.productGroup} · {project.owner}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      상세보기
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteProject(project.id)}
                      className="rounded-full border border-rose-200 px-3 py-2 text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <select
                    value={project.status}
                    onChange={(event) => void handleStatusChange(project.id, event.target.value as ProjectStatus)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1">
                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>진행률</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="프로젝트 생성"
          description="입력 후 생성 버튼을 누르면 목록에 즉시 반영됩니다."
          action={
            <button
              type="button"
              onClick={() => void handleCreateProject()}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              프로젝트 추가
            </button>
          }
        >
          <div className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">프로젝트명</span>
              <input
                value={form.name}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, name: event.target.value }));
                  console.log("[INPUT] name:", event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">설명</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                className="h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">제품군</span>
                <input
                  value={form.productGroup}
                  onChange={(event) => setForm((prev) => ({ ...prev, productGroup: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">담당자</span>
                <input
                  value={form.owner}
                  onChange={(event) => setForm((prev) => ({ ...prev, owner: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">상태</span>
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ProjectStatus }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">중요도</span>
                <select
                  value={form.priority}
                  onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value as ProjectPriority }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">목표 일정</span>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, targetDate: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">태그</span>
              <input
                value={form.tags}
                onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
                placeholder="예: 안전, 지문인식"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-brand-700">
                <FolderKanban className="h-4 w-4" />
                <p className="text-sm font-semibold">동작 확인 로그</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                입력, 클릭, 생성, 이동 시 브라우저 콘솔에 로그가 출력됩니다.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
