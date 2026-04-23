import { createEmbedding } from "@/lib/embedding";
import { supabase } from "@/lib/supabase";

export type MatchedDocument = {
  id: string;
  content: string;
  document_name: string;
  similarity: number;
};

type RpcMatchedDocument = {
  id?: string | null;
  content?: string | null;
  document_name?: string | null;
  similarity?: number | string | null;
};

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export async function searchDocuments(
  query: string,
  matchCount = 5,
): Promise<MatchedDocument[]> {
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  console.log("[search] searching documents", { query, matchCount });

  const queryEmbedding = await createEmbedding(query);

  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  });

  if (error) {
    console.log("[search] rpc error", error);
    throw new Error(error.message);
  }

  const normalized = ((data ?? []) as RpcMatchedDocument[])
    .map((item, index) => ({
      id: item.id ?? `unknown-${index}`,
      content: item.content ?? "",
      document_name: item.document_name ?? "unknown_document",
      similarity: toNumber(item.similarity),
    }))
    .sort((a, b) => b.similarity - a.similarity);

  console.log("[search] matched documents", { count: normalized.length });

  return normalized;
}
