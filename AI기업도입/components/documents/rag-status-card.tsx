"use client";

import { useEffect, useMemo, useState } from "react";

type CheckItem = {
  key: string;
  ok: boolean;
  message: string;
};

type RagStatusResponse = {
  ok: boolean;
  checks: CheckItem[];
};

export function RagStatusCard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<RagStatusResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/rag-status");
        const data = (await response.json()) as RagStatusResponse;

        if (!response.ok) {
          throw new Error("Failed to load RAG status.");
        }

        if (!cancelled) {
          setStatus(data);
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Failed to load RAG status.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const title = useMemo(() => {
    if (loading) return "점검 중...";
    if (error) return "점검 실패";
    return status?.ok ? "RAG 준비 완료" : "RAG 설정 필요";
  }, [loading, error, status]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">RAG 상태 점검</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            loading
              ? "bg-slate-100 text-slate-600"
              : status?.ok
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
          }`}
        >
          {title}
        </span>
      </div>

      {error ? (
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-3 space-y-2">
        {(status?.checks ?? []).map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-700">{item.key}</span>
              <span
                className={`text-xs font-semibold ${
                  item.ok ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {item.ok ? "OK" : "FAIL"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

