import { patentScenarios } from "@/data/patent-data";
import { withServiceContext } from "@/lib/data-provider";
import { getSupabaseClientAndUserId } from "@/services/supabase-service-utils";
import type { PatentInsertInput, PatentRow } from "@/types/domain";

type ServiceResult<T> = {
  data: T;
  error: Error | null;
  source: "supabase" | "fallback";
};

function fallbackRows(): PatentRow[] {
  return Object.values(patentScenarios)
    .flatMap((scenario, scenarioIndex) =>
      scenario.patents.map((patent, patentIndex) => ({
        id: patent.id,
        user_id: "mock-user",
        project_id: null,
        title: patent.title,
        summary: patent.summary,
        risk_level: patent.risk,
        similarity: patent.similarity,
        created_at: `2026-04-${String(((scenarioIndex + patentIndex) % 28) + 1).padStart(2, "0")}T09:00:00.000Z`,
      })),
    )
    .slice(0, 20);
}

export async function getAllPatents(): Promise<ServiceResult<PatentRow[]>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      return { data: fallbackRows(), error, source: "fallback" };
    }

    const { data, error: dbError } = await client
      .from("patents")
      .select("id, user_id, project_id, title, summary, risk_level, similarity, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return {
      data: (data as PatentRow[] | null) ?? [],
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function getPatentsByProject(
  projectId: string,
): Promise<ServiceResult<PatentRow[]>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      return {
        data: fallbackRows()
          .map((row, index) => ({
            ...row,
            project_id: index % 2 === 0 ? projectId : null,
          }))
          .filter((row) => row.project_id === projectId),
        error,
        source: "fallback",
      };
    }

    const { data, error: dbError } = await client
      .from("patents")
      .select("id, user_id, project_id, title, summary, risk_level, similarity, created_at")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    return {
      data: (data as PatentRow[] | null) ?? [],
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function getPatentById(id: string): Promise<PatentRow | null> {
  const result = await getAllPatents();
  return result.data.find((row) => row.id === id) ?? null;
}

export async function createPatent(
  input: Omit<PatentInsertInput, "user_id">,
): Promise<ServiceResult<PatentRow | null>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      const fallback: PatentRow = {
        id: `pat-${Date.now()}`,
        user_id: "mock-user",
        project_id: input.project_id ?? null,
        title: input.title,
        summary: input.summary ?? null,
        risk_level: input.risk_level,
        similarity: input.similarity,
        created_at: new Date().toISOString(),
      };
      return { data: fallback, error, source: "fallback" };
    }

    const { data, error: dbError } = await client
      .from("patents")
      .insert({ ...input, user_id: userId })
      .select("id, user_id, project_id, title, summary, risk_level, similarity, created_at")
      .single();

    return {
      data: (data as PatentRow | null) ?? null,
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function updatePatent(
  id: string,
  input: Partial<Omit<PatentInsertInput, "user_id">>,
) {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) return { error };

    const { error: dbError } = await client
      .from("patents")
      .update(input)
      .eq("id", id)
      .eq("user_id", userId);

    return { error: dbError ?? null };
  });
}

export async function deletePatent(id: string) {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) return { error };

    const { error: dbError } = await client
      .from("patents")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    return { error: dbError ?? null };
  });
}
