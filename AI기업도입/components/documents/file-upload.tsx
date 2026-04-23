"use client";

import { useState } from "react";

export function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
        chunkCount?: number;
        fileName?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }

      setMessage(
        `${data.fileName ?? file.name} 업로드 완료 · ${data.chunkCount ?? 0}개 chunk 저장`,
      );
      event.target.value = "";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setMessage(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        onChange={handleUpload}
        accept=".pdf,application/pdf"
        disabled={uploading}
        className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-60"
      />
      <div className="text-sm text-slate-600">
        {uploading ? "문서 분석 및 AI 학습 중..." : message}
      </div>
    </div>
  );
}
