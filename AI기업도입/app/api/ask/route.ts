import { NextResponse } from "next/server";

import { askAI } from "@/lib/askAI";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { question, minSimilarity } = (await request.json()) as {
      question?: string;
      minSimilarity?: number;
    };

    console.log("[api/ask] request", { question, minSimilarity });

    if (!question?.trim()) {
      return NextResponse.json(
        { error: "question is required." },
        { status: 400 },
      );
    }

    const result = await askAI(question.trim(), {
      minSimilarity,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log("[api/ask] error", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}
