import {
  dashboardIdeaRecommendations,
  dashboardPatentAlerts,
  dashboardPredictionSummaries,
  dashboardQuickActions,
  dashboardRecentDocuments,
  dashboardRecentProjects,
  dashboardWorkflowCards,
} from "@/data/dashboard-data";
import { withServiceContext } from "@/lib/data-provider";

export function getDashboardOverview() {
  return withServiceContext(() => ({
    recentProjects: dashboardRecentProjects,
    recentDocuments: dashboardRecentDocuments,
    patentAlerts: dashboardPatentAlerts,
    ideaRecommendations: dashboardIdeaRecommendations,
    predictionSummaries: dashboardPredictionSummaries,
    quickActions: dashboardQuickActions,
    workflowCards: dashboardWorkflowCards,
  }));
}
