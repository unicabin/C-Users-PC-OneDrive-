import { researchDocuments } from "@/data/research-data";
import { withServiceContext } from "@/lib/data-provider";
import { getSupabaseClientAndUserId } from "@/services/supabase-service-utils";
import type {
  DocumentInsertInput,
  DocumentRow,
  DocumentFileType,
  ResearchDocument,
} from "@/types/domain";

type ServiceResult<T> = {
  data: T;
  error: Error | null;
  source: "supabase" | "fallback";
};

function toResearchDocument(row: DocumentRow): ResearchDocument {
  return {
    id: row.id,
    title: row.title,
    project: row.project_id ?? "미지정 프로젝트",
    type: row.file_type as DocumentFileType,
    importance: "중" as ResearchDocument["importance"],
    summary: row.content ?? "요약 정보가 없습니다.",
    tags: [row.category],
    updatedAt: row.created_at.slice(0, 10),
    owner: row.user_id,
    pages: "-",
    score: 80,
  };
}

function fallbackRows(): DocumentRow[] {
  return researchDocuments.map((doc, index) => ({
    id: doc.id,
    user_id: "mock-user",
    project_id: null,
    title: doc.title,
    content: doc.summary,
    category: "기타" as DocumentRow["category"],
    file_type: doc.type,
    created_at: `2026-04-${String((index % 28) + 1).padStart(2, "0")}T09:00:00.000Z`,
  }));
}

export async function getAllDocuments(): Promise<ServiceResult<DocumentRow[]>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      return { data: fallbackRows(), error, source: "fallback" };
    }

    const { data, error: dbError } = await client
      .from("documents")
      .select("id, user_id, project_id, title, content, category, file_type, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return {
      data: (data as DocumentRow[] | null) ?? [],
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function getDocumentsByProject(
  projectId: string,
): Promise<ServiceResult<DocumentRow[]>> {
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
      .from("documents")
      .select("id, user_id, project_id, title, content, category, file_type, created_at")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    return {
      data: (data as DocumentRow[] | null) ?? [],
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function getDocumentById(id: string): Promise<DocumentRow | null> {
  const result = await getAllDocuments();
  return result.data.find((doc) => doc.id === id) ?? null;
}

export async function createDocument(
  input: Omit<DocumentInsertInput, "user_id">,
): Promise<ServiceResult<DocumentRow | null>> {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) {
      const fallback: DocumentRow = {
        id: `doc-${Date.now()}`,
        user_id: "mock-user",
        project_id: input.project_id ?? null,
        title: input.title,
        content: input.content ?? null,
        category: input.category,
        file_type: input.file_type,
        created_at: new Date().toISOString(),
      };
      return { data: fallback, error, source: "fallback" };
    }

    const { data, error: dbError } = await client
      .from("documents")
      .insert({ ...input, user_id: userId })
      .select("id, user_id, project_id, title, content, category, file_type, created_at")
      .single();

    return {
      data: (data as DocumentRow | null) ?? null,
      error: dbError ?? null,
      source: "supabase",
    };
  });
}

export async function updateDocument(
  id: string,
  input: Partial<Omit<DocumentInsertInput, "user_id">>,
) {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) return { error };

    const { error: dbError } = await client
      .from("documents")
      .update(input)
      .eq("id", id)
      .eq("user_id", userId);

    return { error: dbError ?? null };
  });
}

export async function deleteDocument(id: string) {
  return withServiceContext(async () => {
    const { client, userId, error } = await getSupabaseClientAndUserId();
    if (!client || !userId || error) return { error };

    const { error: dbError } = await client
      .from("documents")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    return { error: dbError ?? null };
  });
}

export async function getAllResearchDocuments(): Promise<
  ServiceResult<ResearchDocument[]>
> {
  const rows = await getAllDocuments();
  return {
    data: rows.data.map(toResearchDocument),
    error: rows.error,
    source: rows.source,
  };
}
