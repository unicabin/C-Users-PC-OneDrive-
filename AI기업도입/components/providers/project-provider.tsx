"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  createProject,
  deleteProject,
  getProjectFormInitialValue,
  getProjects,
  updateProjectStatus,
} from "@/services/project-service";
import type { ProjectFormInput, ProjectRecord, ProjectStatus } from "@/types/domain";

type ProjectContextValue = {
  projects: ProjectRecord[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  createNewProject: (input: ProjectFormInput) => Promise<ProjectRecord | null>;
  updateStatus: (projectId: string, status: ProjectStatus) => Promise<void>;
  removeProject: (projectId: string) => Promise<void>;
  getProject: (projectId: string) => ProjectRecord | null;
  getInitialForm: () => ProjectFormInput;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshProjects() {
    setLoading(true);
    const result = await getProjects();
    setProjects(result.data);
    setError(result.error ? result.error.message : null);
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshProjects();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const value: ProjectContextValue = {
    projects,
    loading,
    error,
    refreshProjects,
    createNewProject: async (input) => {
      if (!input.name.trim() || !input.owner.trim()) return null;
      const result = await createProject(input);
      setError(result.error ? result.error.message : null);

      // Keep app interactive even when DB env/auth is not ready.
      if (result.source === "fallback" && result.data) {
        setProjects((prev) => [result.data as ProjectRecord, ...prev]);
      } else {
        await refreshProjects();
      }

      return result.data;
    },
    updateStatus: async (projectId, status) => {
      const result = await updateProjectStatus(projectId, status);
      setError(result.error ? result.error.message : null);
      if (result.error) {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId ? { ...project, status } : project,
          ),
        );
      } else {
        await refreshProjects();
      }
    },
    removeProject: async (projectId) => {
      const result = await deleteProject(projectId);
      setError(result.error ? result.error.message : null);
      if (result.error) {
        setProjects((prev) => prev.filter((project) => project.id !== projectId));
      } else {
        await refreshProjects();
      }
    },
    getProject: (projectId) =>
      projects.find((project) => project.id === projectId) ?? null,
    getInitialForm: () => getProjectFormInitialValue(),
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectProvider");
  }
  return context;
}
