import { getSupabaseClientAndUserId } from "@/services/supabase-service-utils";

export type LiveDashboardStats = {
  activeProjects: number;
  highRiskPatents: number;
  totalPredictions: number;
  totalAutomations: number;
  source: "supabase" | "fallback";
};

const FALLBACK: LiveDashboardStats = {
  activeProjects: 12,
  highRiskPatents: 3,
  totalPredictions: 28,
  totalAutomations: 0,
  source: "fallback",
};

export async function getLiveDashboardStats(): Promise<LiveDashboardStats> {
  const { client, userId, error } = await getSupabaseClientAndUserId();
  if (!client || !userId || error) return FALLBACK;

  const [projectsRes, patentsRes, predictionsRes, automationsRes] =
    await Promise.all([
      client
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .neq("status", "완료"),
      client
        .from("patents")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("risk_level", "높음"),
      client
        .from("predictions")
        .select("id", { count: "exact", head: true })
        .in(
          "project_id",
          (
            await client
              .from("projects")
              .select("id")
              .eq("user_id", userId)
          ).data?.map((p) => p.id) ?? [],
        ),
      client
        .from("automation_results")
        .select("id", { count: "exact", head: true })
        .in(
          "project_id",
          (
            await client
              .from("projects")
              .select("id")
              .eq("user_id", userId)
          ).data?.map((p) => p.id) ?? [],
        ),
    ]);

  return {
    activeProjects: projectsRes.count ?? FALLBACK.activeProjects,
    highRiskPatents: patentsRes.count ?? FALLBACK.highRiskPatents,
    totalPredictions: predictionsRes.count ?? FALLBACK.totalPredictions,
    totalAutomations: automationsRes.count ?? FALLBACK.totalAutomations,
    source: "supabase",
  };
}
