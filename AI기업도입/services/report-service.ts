import { reportRows, reportSections } from "@/data/report-data";
import { withServiceContext } from "@/lib/data-provider";
import { getAllDocuments } from "@/services/document-service";
import { getIdeasByProject } from "@/services/idea-record-service";
import { getAllPatents } from "@/services/patent-record-service";
import { getPredictionsByProject } from "@/services/prediction-record-service";
import type { ReportRow, ReportSection } from "@/types/domain";

export function getReportPreviewData() {
  return withServiceContext(() => ({
    rows: reportRows,
    sections: reportSections,
  }));
}

export async function getProjectReportData(projectId: string) {
  return withServiceContext(async () => {
    const [documentsRes, patentsRes, predictionsRes, ideasRes] =
      await Promise.all([
        getAllDocuments(),
        getAllPatents(),
        getPredictionsByProject(projectId),
        getIdeasByProject(projectId),
      ]);

    const rows: ReportRow[] = [
      ["프로젝트 ID", projectId],
      ["기술자료 건수", `${documentsRes.data.length}건`],
      ["특허 분석 건수", `${patentsRes.data.length}건`],
      ["성능 예측 건수", `${predictionsRes.data.length}건`],
      ["아이디어 건수", `${ideasRes.data.length}건`],
      [
        "데이터 소스",
        [
          documentsRes.source,
          patentsRes.source,
          predictionsRes.source,
          ideasRes.source,
        ]
          .map((source) => source.toUpperCase())
          .join(" / "),
      ],
    ];

    const topDocument = documentsRes.data[0];
    const topPatent = patentsRes.data[0];
    const topPrediction = predictionsRes.data[0];
    const topIdea = ideasRes.data[0];

    const sections: ReportSection[] = [
      {
        title: "기술자료 검색 요약",
        content: topDocument
          ? `${topDocument.title}\n${topDocument.content ?? "요약 내용 없음"}`
          : "연결된 기술자료가 없습니다.",
      },
      {
        title: "특허 분석 요약",
        content: topPatent
          ? `${topPatent.title} · 위험도 ${topPatent.risk_level} · 유사도 ${topPatent.similarity}%\n${topPatent.summary ?? "요약 없음"}`
          : "연결된 특허 분석 데이터가 없습니다.",
      },
      {
        title: "성능 예측 요약",
        content: topPrediction
          ? `점수 ${topPrediction.score}점 · 위험도 ${topPrediction.risk}\n${topPrediction.recommendation ?? "권장사항 없음"}`
          : "연결된 성능 예측 결과가 없습니다.",
      },
      {
        title: "신제품 아이디어 요약",
        content: topIdea
          ? `${topIdea.title}\n${topIdea.description ?? ""}\n기대효과: ${topIdea.effect ?? "-"}`
          : "연결된 아이디어 결과가 없습니다.",
      },
      {
        title: "종합 의견",
        content:
          "현재 프로젝트의 데이터 연결 상태를 기준으로 볼 때, 기술자료-특허-성능-아이디어 흐름이 서비스 레이어를 통해 일관되게 집계되고 있습니다. 실제 의사결정 단계에서는 고위험 특허와 성능 리스크를 우선 검토하고, 저장된 아이디어 중 즉시 PoC 가능한 안건부터 실행하는 것을 권장합니다.",
      },
    ];

    return {
      rows,
      sections,
      error:
        documentsRes.error ??
        patentsRes.error ??
        predictionsRes.error ??
        ideasRes.error ??
        null,
    };
  });
}
