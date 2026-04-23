import { ideaSeeds } from "@/data/idea-data";
import { withServiceContext } from "@/lib/data-provider";
import { getSupabaseClientAndUserId } from "@/services/supabase-service-utils";
import type { IdeaInsertInput, IdeaRow } from "@/types/domain";

type ServiceResult<T> = {
  data: T;
  error: Error | null;
  source: "supabase" | "fallback";
};

function fallbackIdeas(projectId: string): IdeaRow[] {
  return ideaSeeds.slice(0, 5).map((idea, index) => ({
    id: `idea-${index + 1}`,
    project_id: projectId,
    title: idea.title,
    description: idea.pitch,
    effect: idea.effects.join(", "),
    created_at: `2026-04-${String((index % 28) + 1).padStart(2, "0")}T09:00:00.000Z`,
  }));
}

export async function getIdeasByProject(
  projectId: string,
): Promise<ServiceResult<IdeaRow[]>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      return { data: fallbackIdeas(projectId), error, source: "fallback" };
    }

    const { data, error: dbError } = await client
      .from("ideas")
      .select("id, project_id, title, description, effect, created_at, projects!inner(user_id)")
      .eq("project_id", projectId)
      .eq("projects.user_id", userId)
      .order("created_at", { ascending: false });

    const normalized = ((data ?? []) as Array<
      IdeaRow & { projects?: { user_id: string } | { user_id: string }[] }
    >).map(({ projects: _projects, ...rest }) => rest);

    return {
      data: normalized,
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function createIdea(
  input: IdeaInsertInput,
): Promise<ServiceResult<IdeaRow | null>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      const fallback: IdeaRow = {
        id: `idea-${Date.now()}`,
        project_id: input.project_id,
        title: input.title,
        description: input.description ?? null,
        effect: input.effect ?? null,
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
      .from("ideas")
      .insert(input)
      .select("id, project_id, title, description, effect, created_at")
      .single();

    return {
      data: (data as IdeaRow | null) ?? null,
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function updateIdea(id: string, input: Partial<IdeaInsertInput>) {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) return { error };

    const { data: target, error: targetError } = await client
      .from("ideas")
      .select("id, project_id, projects!inner(user_id)")
      .eq("id", id)
      .eq("projects.user_id", userId)
      .maybeSingle();

    if (targetError || !target) {
      return {
        error: targetError ?? new Error("Idea is not accessible."),
      };
    }

    const { error: dbError } = await client
      .from("ideas")
      .update(input)
      .eq("id", id);

    return { error: dbError ?? null };
  });
}

export async function deleteIdea(id: string) {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) return { error };

    const { data: target, error: targetError } = await client
      .from("ideas")
      .select("id, projects!inner(user_id)")
      .eq("id", id)
      .eq("projects.user_id", userId)
      .maybeSingle();

    if (targetError || !target) {
      return {
        error: targetError ?? new Error("Idea is not accessible."),
      };
    }

    const { error: dbError } = await client
      .from("ideas")
      .delete()
      .eq("id", id);

    return { error: dbError ?? null };
  });
}
