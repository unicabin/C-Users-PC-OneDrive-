type EmbeddingResponse = {
  data?: Array<{
    embedding?: number[];
  }>;
  error?: {
    message?: string;
  };
};

export async function createEmbedding(text: string): Promise<number[]> {
  console.log("[embedding] creating embedding", { length: text.length });

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  const data = (await res.json()) as EmbeddingResponse;

  if (!res.ok) {
    console.log("[embedding] OpenAI error", data.error);
    throw new Error(data.error?.message ?? "Failed to create embedding.");
  }

  const embedding = data.data?.[0]?.embedding;

  if (!embedding?.length) {
    throw new Error("OpenAI did not return an embedding.");
  }

  console.log("[embedding] embedding created", { dimensions: embedding.length });
  return embedding;
}
