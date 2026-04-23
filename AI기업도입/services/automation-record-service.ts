import { automationResultSeeds } from "@/data/automation-data";
import { withServiceContext } from "@/lib/data-provider";
import { getSupabaseClientAndUserId } from "@/services/supabase-service-utils";
import type { AutomationInsertInput, AutomationResult } from "@/types/domain";

type ServiceResult<T> = {
  data: T;
  error: Error | null;
  source: "supabase" | "fallback";
};

function fallbackResults(projectId: string): AutomationResult[] {
  return automationResultSeeds.map((seed, index) => ({
    id: `auto-${index + 1}`,
    project_id: projectId,
    template_title: seed.template_title,
    output: seed.output,
    created_at: `2026-04-${String((index % 28) + 1).padStart(2, "0")}T09:00:00.000Z`,
  }));
}

export async function getAutomationResultsByProject(
  projectId: string,
): Promise<ServiceResult<AutomationResult[]>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      return { data: fallbackResults(projectId), error, source: "fallback" };
    }

    const { data, error: dbError } = await client
      .from("automation_results")
      .select("id, project_id, template_title, output, created_at, projects!inner(user_id)")
      .eq("project_id", projectId)
      .eq("projects.user_id", userId)
      .order("created_at", { ascending: false });

    const normalized = ((data ?? []) as Array<
      AutomationResult & { projects?: unknown }
    >).map(({ projects: _projects, ...rest }) => rest);

    return {
      data: normalized,
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function createAutomationResult(
  input: AutomationInsertInput,
): Promise<ServiceResult<AutomationResult | null>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      const fallback: AutomationResult = {
        id: `auto-${Date.now()}`,
        project_id: input.project_id,
        template_title: input.template_title,
        output: input.output,
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
      .from("automation_results")
      .insert(input)
      .select("id, project_id, template_title, output, created_at")
      .single();

    return {
      data: (data as AutomationResult | null) ?? null,
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function deleteAutomationResult(id: string) {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) return { error };

    const { data: target, error: targetError } = await client
      .from("automation_results")
      .select("id, projects!inner(user_id)")
      .eq("id", id)
      .eq("projects.user_id", userId)
      .maybeSingle();

    if (targetError || !target) {
      return {
        error: targetError ?? new Error("Record is not accessible."),
      };
    }

    const { error: dbError } = await client
      .from("automation_results")
      .delete()
      .eq("id", id);

    return { error: dbError ?? null };
  });
}
