import { emptyProjectForm, projectSeedData } from "@/data/project-data";
import { withServiceContext } from "@/lib/data-provider";
import { getSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase/client";
import type {
  ProjectFormInput,
  ProjectRecord,
  ProjectRow,
  ProjectStatus,
} from "@/types/domain";

type ProjectServiceResult<T> = {
  data: T;
  error: Error | null;
  source: "supabase" | "fallback";
};

async function getAuthenticatedUserId() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      userId: null,
      error: new Error("Supabase 환경변수가 설정되지 않았습니다."),
    };
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) {
    return {
      userId: null,
      error: error ?? new Error("로그인 사용자 정보를 확인할 수 없습니다."),
    };
  }

  return {
    userId: user.id,
    error: null,
  };
}

function getProgressByStatus(status: ProjectStatus) {
  if (status === "완료") return 100;
  if (status === "개발중") return 76;
  if (status === "분석중") return 52;
  return 24;
}

function getPriorityByStatus(status: ProjectStatus) {
  if (status === "완료") return "중간" as const;
  if (status === "개발중") return "높음" as const;
  if (status === "분석중") return "긴급" as const;
  return "중간" as const;
}

function mapRowToProject(row: ProjectRow, index: number): ProjectRecord {
  return {
    id: row.id,
    code: `UT-${String(24000 + index + 1).padStart(5, "0")}`,
    name: row.name,
    description: row.description ?? "",
    productGroup: "미분류",
    owner: "미지정",
    status: row.status,
    priority: getPriorityByStatus(row.status),
    progress: getProgressByStatus(row.status),
    createdAt: row.created_at.slice(0, 10),
    updatedAt: row.created_at.slice(0, 10),
    targetDate: "",
    tags: [],
  };
}

async function getProjectRowsFromDb() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      data: null,
      error: hasSupabaseEnv()
        ? new Error("Supabase 클라이언트를 초기화하지 못했습니다.")
        : new Error("Supabase 환경변수가 없어 샘플 프로젝트 데이터를 사용합니다."),
    };
  }

  const authResult = await getAuthenticatedUserId();

  if (authResult.error || !authResult.userId) {
    return {
      data: null,
      error: authResult.error,
    };
  }

  const response = await client
    .from("projects")
    .select("id, user_id, name, description, status, created_at")
    .eq("user_id", authResult.userId)
    .order("created_at", { ascending: false });

  return response;
}

export function getProjectFormInitialValue() {
  return withServiceContext(() => emptyProjectForm);
}

export async function getProjects(): Promise<ProjectServiceResult<ProjectRecord[]>> {
  return withServiceContext(async () => {
    const { data, error } = await getProjectRowsFromDb();

    if (error || !data) {
      return {
        data: projectSeedData,
        error,
        source: "fallback" as const,
      };
    }

    return {
      data: data.map((row, index) => mapRowToProject(row as ProjectRow, index)),
      error: null,
      source: "supabase" as const,
    };
  });
}

export async function getProjectById(projectId: string) {
  const result = await getProjects();
  return result.data.find((project) => project.id === projectId) ?? null;
}

export async function createProject(input: ProjectFormInput) {
  return withServiceContext(async () => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      const fallbackProject: ProjectRecord = {
        id: `pjt-${Date.now()}`,
        code: `UT-${String(24000 + projectSeedData.length + 1).padStart(5, "0")}`,
        name: input.name,
        description: input.description,
        productGroup: input.productGroup,
        owner: input.owner,
        status: input.status,
        priority: input.priority,
        progress: getProgressByStatus(input.status),
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        targetDate: input.targetDate,
        tags: input.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      return {
        data: fallbackProject,
        error: new Error(
          "Supabase 환경변수가 없어 샘플 모드로 프로젝트를 생성했습니다.",
        ),
        source: "fallback" as const,
      };
    }

    const authResult = await getAuthenticatedUserId();

    if (authResult.error || !authResult.userId) {
      return {
        data: null,
        error: authResult.error ?? new Error("로그인한 사용자 정보를 찾을 수 없습니다."),
        source: "supabase" as const,
      };
    }

    const { data, error } = await client
      .from("projects")
      .insert({
        user_id: authResult.userId,
        name: input.name,
        description: input.description,
        status: input.status,
      })
      .select("id, user_id, name, description, status, created_at")
      .single();

    if (error || !data) {
      return {
        data: null,
        error: error ?? new Error("프로젝트 저장에 실패했습니다."),
        source: "supabase" as const,
      };
    }

    return {
      data: mapRowToProject(data as ProjectRow, 0),
      error: null,
      source: "supabase" as const,
    };
  });
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  return withServiceContext(async () => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      return {
        error: new Error(
          "Supabase 환경변수가 설정되지 않아 상태 변경을 DB에 반영할 수 없습니다.",
        ),
      };
    }

    const authResult = await getAuthenticatedUserId();

    if (authResult.error || !authResult.userId) {
      return {
        error: authResult.error ?? new Error("로그인한 사용자 정보를 찾을 수 없습니다."),
      };
    }

    const { error } = await client
      .from("projects")
      .update({ status })
      .eq("id", projectId)
      .eq("user_id", authResult.userId);

    return { error: error ?? null };
  });
}

export async function updateProject(
  projectId: string,
  input: Partial<ProjectFormInput>,
) {
  return withServiceContext(async () => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      return {
        error: new Error(
          "Supabase 환경변수가 설정되지 않아 수정 내용을 DB에 반영할 수 없습니다.",
        ),
      };
    }

    const authResult = await getAuthenticatedUserId();

    if (authResult.error || !authResult.userId) {
      return {
        error: authResult.error ?? new Error("로그인한 사용자 정보를 찾을 수 없습니다."),
      };
    }

    const { error } = await client
      .from("projects")
      .update({
        name: input.name,
        description: input.description,
        status: input.status,
      })
      .eq("id", projectId)
      .eq("user_id", authResult.userId);

    return { error: error ?? null };
  });
}

export async function deleteProject(projectId: string) {
  return withServiceContext(async () => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      return {
        error: new Error(
          "Supabase 환경변수가 설정되지 않아 삭제를 DB에 반영할 수 없습니다.",
        ),
      };
    }

    const authResult = await getAuthenticatedUserId();

    if (authResult.error || !authResult.userId) {
      return {
        error: authResult.error ?? new Error("로그인한 사용자 정보를 찾을 수 없습니다."),
      };
    }

    const { error } = await client
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", authResult.userId);
    return { error: error ?? null };
  });
}
