# 제조업 스마트 AI 플랫폼 (manufacturing-ai-platform)

## 프로젝트 개요

제조업 기업의 AI 도입을 지원하는 Next.js 15 플랫폼.  
RAG 기반 지식형 AI Agent와 ML 기반 예측/분석 엔진의 이중 구조로 구성.  
스택: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase

---

## 디렉토리 구조

```
app/                    # Next.js App Router 페이지
  page.tsx              # 대시보드 (메인)
  layout.tsx            # AppShell 레이아웃
  login/page.tsx        # 로그인
  projects/page.tsx     # 프로젝트 관리
  research/page.tsx     # 기술자료 검색 (RAG)
  patents/page.tsx      # 특허 분석
  prediction/page.tsx   # 성능 예측 (ML)
  automation/page.tsx   # 코드/설계 자동화 ✓ 완료
  ideas/page.tsx        # 아이디어 생성
  reports/page.tsx      # 보고서 출력
  tech-status/page.tsx  # 기술 구조 및 데이터 현황
  api/
    ai/documents/       # POST /api/ai/documents  → AI 문서 요약
    ai/ideas/           # POST /api/ai/ideas      → AI 아이디어 생성
    ai/patents/         # POST /api/ai/patents    → AI 특허 분석
    ai/generate-idea/   # POST /api/ai/generate-idea → 아이디어 텍스트 생성
    ask/                # RAG Q&A
    upload/             # 파일 업로드
    rag-status/         # RAG 인덱스 상태

components/
  auth/                 # 로그인 패널, 보호된 페이지 래퍼
  layout/               # AppShell, Header, Sidebar
  pages/                # 각 페이지의 실제 UI (WorkspaceComponent)
  ui/                   # SectionCard, StatusBadge 공통 UI
  documents/            # FileUpload, RagAsk, RagStatusCard
  providers/            # AuthProvider, ProjectProvider (React Context)

services/               # 비즈니스 로직 (데이터 fetch/가공)
data/                   # 목 데이터 및 정적 데이터
types/
  domain.ts             # 모든 도메인 타입 정의
  ai.ts                 # AI 응답 타입
lib/                    # Supabase 클라이언트, 유틸리티
```

---

## 완성된 페이지 / 미완성 페이지

| 페이지 | 상태 | 워크스페이스 컴포넌트 |
|--------|------|--------------------|
| 대시보드 | 완료 | `app/page.tsx` 직접 구현 |
| 프로젝트 관리 | 완료 | `ProjectsWorkspace` |
| 기술자료 검색 | 완료 | `ResearchWorkspace` |
| 특허 분석 | 완료 | `PatentAnalysisWorkspace` |
| 성능 예측 | 완료 | `PredictionWorkspace` |
| 아이디어 생성 | 완료 | `IdeaWorkspace` |
| 보고서 출력 | 완료 | `ReportPreviewWorkspace` |
| 기술 구조/데이터 현황 | 완료 | `tech-status/page.tsx` 직접 구현 |
| **코드/설계 자동화** | **완료** | `AutomationWorkspace` |

---

## 완료된 추가 작업 (자동화 이후)

- 사이드바 메뉴 레이블 정확화 ("설계 최적화" → "코드/설계 자동화")
- Supabase `automation_results` 테이블 + RLS 정책 추가 (`supabase/schema.sql`)
- 대시보드 "빠른 실행" 및 "통합 업무 흐름" 카드에 실제 페이지 이동 연결
- 모바일 햄버거 메뉴 + 슬라이드 드로어 네비게이션 추가
- 헤더 검색바 실제 동작 (Enter → `/research?q=검색어` 이동)
- `/ideas/simple` 구형 프로토타입 → `/ideas` 리다이렉트
- 대시보드 KPI 카드 Supabase 실시간 연동 (`services/dashboard-stats-service.ts`)
- 개발용 console.log 13개 제거 (클라이언트 컴포넌트)
- OneDrive 한글 경로 빌드 오류 수정 (`next.config.ts`)

---

## 다음 작업: 코드/설계 자동화 페이지 구현

### 목표
`app/automation/page.tsx`를 실제 기능이 있는 페이지로 교체.  
다른 완성된 페이지들(prediction, ideas)과 동일한 패턴을 따를 것.

### 구현 체크리스트 (자동화 에이전트가 순서대로 진행)

- [x] 1단계: `types/domain.ts`에 타입 추가
- [x] 2단계: `types/ai.ts`에 `AiAutomationResult` 타입 추가
- [x] 3단계: `data/automation-data.ts` 생성
- [x] 4단계: `services/automation-service.ts` 생성
- [x] 5단계: `services/automation-record-service.ts` 생성
- [x] 6단계: `services/ai-client-service.ts`에 `requestAiAutomation` 추가
- [x] 7단계: `app/api/ai/automation/route.ts` 생성
- [x] 8단계: `components/pages/automation-workspace.tsx` 생성
- [x] 9단계: `app/automation/page.tsx` 교체

**각 단계 완료 후 위 체크리스트에서 해당 항목을 `[x]`로 변경할 것.**

---

### 구현 상세

**1. `types/domain.ts`에 타입 추가**
```ts
export type AutomationTemplate = {
  id: string;
  title: string;
  category: "코드" | "설계" | "사양서" | "체크리스트";
  description: string;
  prompt: string;
};

export type AutomationResult = {
  id: string;
  project_id: string;
  template_title: string;
  output: string;
  created_at: string;
};

export type AutomationInsertInput = {
  project_id: string;
  template_title: string;
  output: string;
};
```

**2. `types/ai.ts`에 타입 추가**
```ts
export type AiAutomationResult = {
  title: string;
  output: string;
  language: string;
  notes: string[];
};
```

**3. `data/automation-data.ts` 생성** — 목 템플릿 데이터
```ts
import type { AutomationTemplate } from "@/types/domain";

export const automationTemplates: AutomationTemplate[] = [
  {
    id: "tmpl-001",
    title: "모터 드라이버 초기화 코드",
    category: "코드",
    description: "CAN 통신 기반 모터 드라이버 초기화 코드를 생성합니다.",
    prompt: "CAN 통신을 사용하는 모터 드라이버 초기화 코드를 C언어로 작성해줘",
  },
  {
    id: "tmpl-002",
    title: "센서 인터페이스 설계서",
    category: "설계",
    description: "센서 입력 인터페이스 설계 초안을 작성합니다.",
    prompt: "I2C 센서 인터페이스 설계서 초안을 작성해줘",
  },
  {
    id: "tmpl-003",
    title: "소프트웨어 요구사항 사양서",
    category: "사양서",
    description: "SRS 문서 초안을 자동 생성합니다.",
    prompt: "소프트웨어 요구사항 사양서(SRS) 초안을 작성해줘",
  },
  {
    id: "tmpl-004",
    title: "코드 리뷰 체크리스트",
    category: "체크리스트",
    description: "임베디드 C 코드 리뷰용 체크리스트를 생성합니다.",
    prompt: "임베디드 C 코드 리뷰 체크리스트를 만들어줘",
  },
];
```

**4. `services/automation-service.ts` 생성**
```ts
import { automationTemplates } from "@/data/automation-data";
import { withServiceContext } from "@/lib/data-provider";

export function getAutomationTemplates() {
  return withServiceContext(() => automationTemplates);
}
```

**5. `services/automation-record-service.ts` 생성** — Supabase CRUD  
`services/idea-record-service.ts`와 동일한 패턴 사용. 테이블명: `automation_results`

**6. `services/ai-client-service.ts`에 함수 추가**
```ts
export async function requestAiAutomation(input: {
  prompt: string;
  projectContext: string;
}) {
  return postJson<AiAutomationResult>("/api/ai/automation", input);
}
```

**7. `app/api/ai/automation/route.ts` 생성**  
`app/api/ai/ideas/route.ts`와 동일한 패턴. OpenAI API로 코드/설계 산출물 생성.

**8. `components/pages/automation-workspace.tsx` 생성**  
`IdeaWorkspace` 패턴 참고:
- 프로젝트 선택 + 템플릿 선택 드롭다운 + 커스텀 프롬프트 입력
- AI 생성 결과 표시 (코드 블록 또는 텍스트)
- 저장된 결과 목록 (Supabase 연동, fallback 처리 포함)

**9. `app/automation/page.tsx` 교체**
```tsx
import { AutomationWorkspace } from "@/components/pages/automation-workspace";
export default function AutomationPage() {
  return <AutomationWorkspace />;
}
```

---

## 코드 패턴 및 컨벤션

### 페이지 컴포넌트 구조
```tsx
"use client";

import { useEffect, useState } from "react";
import { useProjects } from "@/components/providers/project-provider";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";

export function XxxWorkspace() {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"supabase" | "fallback">("fallback");

  // Supabase fetch → 실패 시 fallback 데이터 사용 패턴
  useEffect(() => {
    const timer = window.setTimeout(async () => {
      // fetch logic
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedProjectId]);

  return (
    <div className="space-y-5">
      {/* 헤더 배너 */}
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        ...
      </section>
      {/* 콘텐츠 — SectionCard 사용 */}
      <SectionCard title="..." icon={<IconName />}>
        ...
      </SectionCard>
    </div>
  );
}
```

### Supabase 연동 규칙
- 항상 `hasSupabaseEnv()` 체크 후 사용
- 실패 시 `source`를 `"fallback"`으로 유지하고 목 데이터 표시
- `user_id`는 `useAuth()` 훅에서 가져옴

### AI API 호출 규칙
- `services/ai-client-service.ts`의 `postJson` 헬퍼만 사용
- 로딩 상태: `setLoadingAi(true/false)` + `setError(null)` 초기화 후 호출
- 결과는 로컬 state에 저장 후 Supabase에 선택적 저장

### UI 스타일 규칙
- 카드: `rounded-[32px] border border-white/70 bg-white shadow-panel`
- 헤더 배너: `bg-brand-900 text-white`
- 공통 카드는 반드시 `SectionCard` 컴포넌트 사용
- 상태 표시는 반드시 `StatusBadge` 컴포넌트 사용
- 이모지 사용 금지, 아이콘은 `lucide-react`만 사용

---

## 환경 변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

Supabase 미설정 시 모든 페이지는 목(mock) 데이터로 자동 동작함.

---

## 개발 서버 실행

```bash
npm run dev
# http://localhost:3000
```
