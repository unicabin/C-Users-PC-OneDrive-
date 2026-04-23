import { withServiceContext } from "@/lib/data-provider";
import { getSupabaseClientAndUserId } from "@/services/supabase-service-utils";
import type { PredictionInsertInput, PredictionRow } from "@/types/domain";

type ServiceResult<T> = {
  data: T;
  error: Error | null;
  source: "supabase" | "fallback";
};

const fallbackPredictions: PredictionRow[] = [
  {
    id: "pred-001",
    project_id: "pjt-001",
    score: 84,
    risk: "중간",
    recommendation: "진동 환경에서 커넥터 고정 보강 권장",
    created_at: "2026-04-12T09:00:00.000Z",
  },
  {
    id: "pred-002",
    project_id: "pjt-002",
    score: 88,
    risk: "낮음",
    recommendation: "방진 설계 유지, CAN 배선 쉴딩 적용",
    created_at: "2026-04-13T09:00:00.000Z",
  },
];

export async function getPredictionsByProject(
  projectId: string,
): Promise<ServiceResult<PredictionRow[]>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      return {
        data: fallbackPredictions.filter((row) => row.project_id === projectId),
        error,
        source: "fallback",
      };
    }

    const { data, error: dbError } = await client
      .from("predictions")
      .select("id, project_id, score, risk, recommendation, created_at, projects!inner(user_id)")
      .eq("project_id", projectId)
      .eq("projects.user_id", userId)
      .order("created_at", { ascending: false });

    const normalized = ((data ?? []) as Array<
      PredictionRow & { projects?: { user_id: string } | { user_id: string }[] }
    >).map(({ projects: _projects, ...rest }) => rest);

    return {
      data: normalized,
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function createPrediction(
  input: PredictionInsertInput,
): Promise<ServiceResult<PredictionRow | null>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      const fallback: PredictionRow = {
        id: `pred-${Date.now()}`,
        project_id: input.project_id,
        score: input.score,
        risk: input.risk,
        recommendation: input.recommendation ?? null,
        created_at: new Date().toISOString(),
      };
      return { data: fallback, error, source: "fallback" };
    }

    const { data: ownProject, error: projectError } = await client
      .from("projects")
      .select("id")
      .eq("id", input.project_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (projectError || !ownProject) {
      return {
        data: null,
        error: projectError ?? new Error("Project is not accessible."),
        source: "supabase",
      };
    }

    const { data, error: dbError } = await client
      .from("predictions")
      .insert(input)
      .select("id, project_id, score, risk, recommendation, created_at")
      .single();

    return {
      data: (data as PredictionRow | null) ?? null,
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function updatePrediction(
  id: string,
  input: Partial<PredictionInsertInput>,
) {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) return { error };

    const { data: target, error: targetError } = await client
      .from("predictions")
      .select("id, project_id, projects!inner(user_id)")
      .eq("id", id)
      .eq("projects.user_id", userId)
      .maybeSingle();

    if (targetError || !target) {
      return {
        error: targetError ?? new Error("Prediction is not accessible."),
      };
    }

    const { error: dbError } = await client
      .from("predictions")
      .update(input)
      .eq("id", id);

    return { error: dbError ?? null };
  });
}

export async function deletePrediction(id: string) {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) return { error };

    const { data: target, error: targetError } = await client
      .from("predictions")
      .select("id, projects!inner(user_id)")
      .eq("id", id)
      .eq("projects.user_id", userId)
      .maybeSingle();

    if (targetError || !target) {
      return {
        error: targetError ?? new Error("Prediction is not accessible."),
      };
    }

    const { error: dbError } = await client
      .from("predictions")
      .delete()
      .eq("id", id);

    return { error: dbError ?? null };
  });
}
