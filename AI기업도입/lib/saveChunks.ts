import { supabase } from "@/lib/supabase";
import { createEmbedding } from "@/lib/embedding";

export async function saveChunks(chunks: string[], docName: string) {
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  console.log("[saveChunks] saving chunks", {
    documentName: docName,
    chunkCount: chunks.length,
  });

  for (const [index, chunk] of chunks.entries()) {
    console.log("[saveChunks] saving chunk", {
      documentName: docName,
      index: index + 1,
      total: chunks.length,
    });

    const embedding = await createEmbedding(chunk);

    const { error } = await supabase.from("document_chunks").insert({
      content: chunk,
      embedding,
      document_name: docName,
    });

    if (error) {
      console.log("[saveChunks] insert error", error);
      throw new Error(error.message);
    }
  }

  console.log("[saveChunks] saved chunks", {
    documentName: docName,
    chunkCount: chunks.length,
  });
}
