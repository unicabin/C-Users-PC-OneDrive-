import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

import { chunkText } from "@/lib/chunk";
import { saveChunks } from "@/lib/saveChunks";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let parser: PDFParse | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    console.log("[api/upload] request received", {
      hasFile: file instanceof File,
      fileName: file instanceof File ? file.name : null,
      fileType: file instanceof File ? file.type : null,
    });

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "file field is required." },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF upload is supported for RAG indexing." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    console.log("[api/upload] parsing pdf", {
      fileName: file.name,
      bytes: buffer.length,
    });

    parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    const text = data.text.trim();

    if (!text) {
      return NextResponse.json(
        { error: "No text could be extracted from this PDF." },
        { status: 400 },
      );
    }

    const chunks = chunkText(text, 500);

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "No chunks were generated from this PDF." },
        { status: 400 },
      );
    }

    await saveChunks(chunks, file.name);

    console.log("[api/upload] completed", {
      fileName: file.name,
      chunkCount: chunks.length,
    });

    return NextResponse.json({
      message: "Upload and RAG indexing completed.",
      chunkCount: chunks.length,
      fileName: file.name,
    });
  } catch (error) {
    console.log("[api/upload] error", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected upload error occurred.",
      },
      { status: 500 },
    );
  } finally {
    await parser?.destroy();
  }
}
