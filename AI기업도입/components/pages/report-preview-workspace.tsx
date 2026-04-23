"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileSpreadsheet, LoaderCircle, Printer } from "lucide-react";

import { useProjects } from "@/components/providers/project-provider";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getProjectReportData } from "@/services/report-service";
import type { ReportRow, ReportSection } from "@/types/domain";

export function ReportPreviewWorkspace() {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!selectedProjectId && projects[0]) {
        setSelectedProjectId(projects[0].id);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!selectedProjectId) return;
      setLoading(true);
      const report = await getProjectReportData(selectedProjectId);
      setRows(report.rows);
      setSections(report.sections);
      setError(report.error ? report.error.message : null);
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedProjectId]);

  function handlePrint() {
    window.print();
  }

  async function handlePdf() {
    if (!reportRef.current) return;

    try {
      setDownloadingPdf(true);
      setError(null);

      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = (html2pdfModule.default ?? html2pdfModule) as unknown as {
        (): {
          set: (options: Record<string, unknown>) => {
            from: (element: HTMLElement) => { save: () => Promise<void> };
          };
        };
      };

      const filename = `report-${selectedProjectId || "project"}-${new Date().toISOString().slice(0, 10)}.pdf`;

      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(reportRef.current)
        .save();
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "PDF 저장 중 오류가 발생했습니다.",
      );
    } finally {
      setDownloadingPdf(false);
    }
  }

  function handleExcel() {
    const lines: string[] = [];
    lines.push("구분,내용");
    rows.forEach(([label, value]) => {
      lines.push(`"${label.replaceAll('"', '""')}","${value.replaceAll('"', '""')}"`);
    });
    sections.forEach((section) => {
      lines.push(`"${section.title.replaceAll('"', '""')}","${section.content.replaceAll('"', '""')}"`);
    });

    const blob = new Blob(["\uFEFF" + lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `report-${selectedProjectId || "project"}-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const projectName =
    projects.find((project) => project.id === selectedProjectId)?.name ??
    "프로젝트 선택 필요";

  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">
          Report Studio
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">보고서 출력</h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-brand-100">
          프로젝트별 기술자료/특허/성능예측/아이디어 결과를 보고서 형식으로
          자동 조합해 미리보기합니다.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
        <SectionCard title="출력 옵션" description="프로젝트 선택 및 출력 버튼">
          <div className="space-y-3">
            <label className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
              <span className="text-sm font-medium text-slate-700">
                프로젝트 선택
              </span>
              <select
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              >
                <option value="">선택하세요</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={handlePdf}
              disabled={downloadingPdf}
              className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <Download className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-slate-900">PDF 저장</p>
                  <p className="text-sm text-slate-500">A4 보고서 다운로드</p>
                </div>
              </div>
              <StatusBadge
                label={downloadingPdf ? "생성 중" : "동작 연결"}
                variant="success"
              />
            </button>

            <button
              onClick={handlePrint}
              className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <Printer className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-slate-900">인쇄</p>
                  <p className="text-sm text-slate-500">브라우저 인쇄 창 열기</p>
                </div>
              </div>
              <StatusBadge label="동작 연결" variant="success" />
            </button>

            <button
              onClick={handleExcel}
              className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <FileSpreadsheet className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-slate-900">엑셀 내보내기</p>
                  <p className="text-sm text-slate-500">요약 테이블 데이터 내보내기</p>
                </div>
              </div>
              <StatusBadge label="동작 연결" variant="success" />
            </button>
          </div>
        </SectionCard>

        <div className="rounded-[36px] border border-slate-200 bg-slate-200/50 p-4 shadow-panel">
          <div
            ref={reportRef}
            className="mx-auto max-w-4xl rounded-[28px] border border-slate-300 bg-white p-8 shadow-sm"
          >
            <div className="border-b border-slate-200 pb-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                Project Report Preview
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                스마트 제품개발 AI 분석 보고서
              </h2>
              <p className="mt-2 text-sm text-slate-500">{projectName}</p>
            </div>

            {loading ? (
              <div className="mt-8 flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 py-10 text-sm text-slate-600">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                보고서 데이터 생성 중...
              </div>
            ) : (
              <>
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <tbody className="divide-y divide-slate-200">
                      {rows.map(([label, value]) => (
                        <tr key={label}>
                          <td className="w-44 bg-slate-50 px-4 py-3 font-medium text-slate-700">
                            {label}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-slate-900">
                      프로젝트 개요
                    </h3>
                    <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                      본 보고서는 선택 프로젝트의 핵심 데이터를 통합해 제품개발
                      의사결정을 지원하기 위한 문서입니다.
                    </div>
                  </section>

                  {sections.map((section) => (
                    <section key={section.title}>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {section.title}
                      </h3>
                      <div className="mt-3 whitespace-pre-line rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                        {section.content}
                      </div>
                    </section>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
