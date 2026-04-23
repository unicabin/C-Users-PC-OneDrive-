"use client";

import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";

const HISTORY_STORAGE_KEY = "rag_ask_tuning_history_v1";
const QUESTION_THRESHOLD_STORAGE_KEY = "rag_question_threshold_map_v1";
const AUTO_APPLY_STORAGE_KEY = "rag_auto_apply_threshold_v1";
const QUESTION_MATCH_SCORE_STORAGE_KEY = "rag_question_match_score_v1";
const MAX_HISTORY = 8;

type Source = {
  document_name: string;
  similarity: number;
};

type AskMeta = {
  blocked: boolean;
  minSimilarityThreshold: number;
  maxSimilarity: number;
  sourceCount: number;
};

type AskHistoryItem = {
  id: number;
  question: string;
  minSimilarity: number;
  maxSimilarity: number;
  blocked: boolean;
  sourceCount: number;
  topSourceName: string;
  createdAt: string;
};

type AskResponse = {
  answer?: string;
  sources?: Array<{
    document_name?: string;
    similarity?: number | string;
  }>;
  meta?: {
    blocked?: boolean;
    minSimilarityThreshold?: number | string;
    maxSimilarity?: number | string;
    sourceCount?: number | string;
  };
  error?: string;
};

type GroupedQuestion = {
  question: string;
  runs: number;
  passCount: number;
  blockCount: number;
  avgMaxSimilarity: number;
  bestThreshold: number;
  latestAt: string;
};

type QuestionThresholdMap = Record<string, number>;

type ThresholdMatch = {
  key: string;
  threshold: number;
  score: number;
};

function toSafeNumber(value: number | string | undefined) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function normalizeQuestionKey(question: string) {
  return question.trim().toLowerCase().replace(/\s+/g, " ");
}

function tokenizeQuestion(question: string) {
  return normalizeQuestionKey(question)
    .split(/[^a-z0-9가-힣]+/i)
    .map((token) => token.trim())
    .filter(Boolean);
}

function jaccardSimilarity(a: string, b: string) {
  const aTokens = new Set(tokenizeQuestion(a));
  const bTokens = new Set(tokenizeQuestion(b));

  if (aTokens.size === 0 || bTokens.size === 0) {
    return 0;
  }

  let intersection = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) {
      intersection += 1;
    }
  }

  const union = new Set([...aTokens, ...bTokens]).size;
  return union > 0 ? intersection / union : 0;
}

function prefixSimilarity(a: string, b: string) {
  const shorterLength = Math.min(a.length, b.length);
  if (shorterLength === 0) {
    return 0;
  }

  let commonPrefixLength = 0;
  for (let i = 0; i < shorterLength; i += 1) {
    if (a[i] !== b[i]) {
      break;
    }
    commonPrefixLength += 1;
  }

  return commonPrefixLength / shorterLength;
}

function questionSimilarityScore(a: string, b: string) {
  const jaccard = jaccardSimilarity(a, b);
  const prefix = prefixSimilarity(normalizeQuestionKey(a), normalizeQuestionKey(b));

  return jaccard * 0.7 + prefix * 0.3;
}

function findBestThresholdMatch(
  question: string,
  thresholdMap: QuestionThresholdMap,
  minMatchScore: number,
): ThresholdMatch | null {
  const normalized = normalizeQuestionKey(question);
  if (!normalized) {
    return null;
  }

  const exact = thresholdMap[normalized];
  if (exact !== undefined) {
    return {
      key: normalized,
      threshold: exact,
      score: 1,
    };
  }

  let best: ThresholdMatch | null = null;

  for (const [key, threshold] of Object.entries(thresholdMap)) {
    const score = questionSimilarityScore(normalized, key);

    if (!best || score > best.score) {
      best = {
        key,
        threshold,
        score,
      };
    }
  }

  if (!best || best.score < minMatchScore) {
    return null;
  }

  return best;
}

function normalizeSources(rawSources: AskResponse["sources"]): Source[] {
  if (!rawSources?.length) {
    return [];
  }

  return rawSources
    .map((source, index) => ({
      document_name: source.document_name || `unknown_document_${index + 1}`,
      similarity: toSafeNumber(source.similarity),
    }))
    .sort((a, b) => b.similarity - a.similarity);
}

function normalizeMeta(rawMeta: AskResponse["meta"], sources: Source[]): AskMeta {
  const sourceCount = toSafeNumber(rawMeta?.sourceCount) || sources.length;

  return {
    blocked: Boolean(rawMeta?.blocked),
    minSimilarityThreshold: toSafeNumber(rawMeta?.minSimilarityThreshold),
    maxSimilarity: toSafeNumber(rawMeta?.maxSimilarity),
    sourceCount,
  };
}

function getRecommendedThreshold(history: AskHistoryItem[]) {
  if (!history.length) {
    return 0.5;
  }

  const passed = history.filter((item) => !item.blocked);

  if (!passed.length) {
    return 0.45;
  }

  const sorted = [...passed]
    .map((item) => item.maxSimilarity)
    .sort((a, b) => a - b);
  const index = Math.floor((sorted.length - 1) * 0.2);
  const baseline = sorted[index] ?? 0.5;

  return Number(clamp01(baseline - 0.03).toFixed(2));
}

function escapeCsv(value: string | number | boolean) {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
}

function downloadHistoryCsv(history: AskHistoryItem[]) {
  const header = [
    "time",
    "question",
    "threshold",
    "max_similarity",
    "blocked",
    "source_count",
    "top_source",
  ];
  const lines = [header.map(escapeCsv).join(",")];

  for (const item of history) {
    lines.push(
      [
        item.createdAt,
        item.question,
        item.minSimilarity.toFixed(2),
        item.maxSimilarity.toFixed(2),
        item.blocked,
        item.sourceCount,
        item.topSourceName,
      ]
        .map(escapeCsv)
        .join(","),
    );
  }

  const blob = new Blob([`\uFEFF${lines.join("\n")}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `rag-tuning-history-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function groupHistoryByQuestion(history: AskHistoryItem[]): GroupedQuestion[] {
  const map = new Map<string, AskHistoryItem[]>();

  for (const item of history) {
    const key = normalizeQuestionKey(item.question);
    const bucket = map.get(key) ?? [];
    bucket.push(item);
    map.set(key, bucket);
  }

  return Array.from(map.entries())
    .map(([, items]) => {
      const runs = items.length;
      const passCount = items.filter((item) => !item.blocked).length;
      const blockCount = runs - passCount;
      const avgMaxSimilarity =
        items.reduce((sum, item) => sum + item.maxSimilarity, 0) / runs;
      const bestThreshold = items.reduce(
        (max, item) => Math.max(max, item.minSimilarity),
        0,
      );
      const latestAt = items[0]?.createdAt ?? "-";

      return {
        question: items[0]?.question ?? "-",
        runs,
        passCount,
        blockCount,
        avgMaxSimilarity,
        bestThreshold,
        latestAt,
      };
    })
    .sort((a, b) => b.runs - a.runs);
}

export function RagAsk() {
  const [question, setQuestion] = useState("");
  const [minSimilarity, setMinSimilarity] = useState(0.5);
  const [autoApplyThreshold, setAutoApplyThreshold] = useState(true);
  const [questionMatchMinScore, setQuestionMatchMinScore] = useState(0.6);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [meta, setMeta] = useState<AskMeta | null>(null);
  const [history, setHistory] = useState<AskHistoryItem[]>([]);
  const [questionThresholdMap, setQuestionThresholdMap] =
    useState<QuestionThresholdMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as AskHistoryItem[];
      if (!Array.isArray(parsed)) return;
      setHistory(parsed.slice(0, MAX_HISTORY));
    } catch (nextError) {
      console.log("[RagAsk] failed to load history", nextError);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(QUESTION_THRESHOLD_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as QuestionThresholdMap;
      if (!parsed || typeof parsed !== "object") return;
      const normalizedEntries = Object.entries(parsed).map(([key, value]) => [
        key,
        clamp01(toSafeNumber(value)),
      ]);
      setQuestionThresholdMap(
        Object.fromEntries(normalizedEntries) as QuestionThresholdMap,
      );
    } catch (nextError) {
      console.log("[RagAsk] failed to load question thresholds", nextError);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTO_APPLY_STORAGE_KEY);
      if (!raw) return;
      setAutoApplyThreshold(raw === "true");
    } catch (nextError) {
      console.log("[RagAsk] failed to load auto-apply setting", nextError);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(QUESTION_MATCH_SCORE_STORAGE_KEY);
      if (!raw) return;
      const parsed = clamp01(toSafeNumber(raw));
      setQuestionMatchMinScore(parsed || 0.6);
    } catch (nextError) {
      console.log("[RagAsk] failed to load match score setting", nextError);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (nextError) {
      console.log("[RagAsk] failed to save history", nextError);
    }
  }, [history]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        QUESTION_THRESHOLD_STORAGE_KEY,
        JSON.stringify(questionThresholdMap),
      );
    } catch (nextError) {
      console.log("[RagAsk] failed to save question thresholds", nextError);
    }
  }, [questionThresholdMap]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        AUTO_APPLY_STORAGE_KEY,
        autoApplyThreshold ? "true" : "false",
      );
    } catch (nextError) {
      console.log("[RagAsk] failed to save auto-apply setting", nextError);
    }
  }, [autoApplyThreshold]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        QUESTION_MATCH_SCORE_STORAGE_KEY,
        questionMatchMinScore.toString(),
      );
    } catch (nextError) {
      console.log("[RagAsk] failed to save match score setting", nextError);
    }
  }, [questionMatchMinScore]);

  const recommendedThreshold = useMemo(
    () => getRecommendedThreshold(history),
    [history],
  );
  const groupedHistory = useMemo(() => groupHistoryByQuestion(history), [history]);
  const questionKey = useMemo(() => normalizeQuestionKey(question), [question]);

  const questionSpecificHistory = useMemo(
    () =>
      history.filter(
        (item) => normalizeQuestionKey(item.question) === questionKey,
      ),
    [history, questionKey],
  );

  const questionRecommendedThreshold = useMemo(() => {
    if (!questionSpecificHistory.length) {
      return recommendedThreshold;
    }
    return getRecommendedThreshold(questionSpecificHistory);
  }, [questionSpecificHistory, recommendedThreshold]);

  const bestThresholdMatch = useMemo(
    () =>
      findBestThresholdMatch(
        question,
        questionThresholdMap,
        questionMatchMinScore,
      ),
    [question, questionThresholdMap, questionMatchMinScore],
  );

  useEffect(() => {
    if (!autoApplyThreshold || !question.trim() || !bestThresholdMatch) {
      return;
    }
    setMinSimilarity(bestThresholdMatch.threshold);
  }, [autoApplyThreshold, question, bestThresholdMatch]);

  async function handleAsk() {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setSources([]);
      setMeta(null);

      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          minSimilarity,
        }),
      });

      const data = (await response.json()) as AskResponse;
      if (!response.ok) {
        throw new Error(data.error ?? "Question request failed.");
      }

      const normalizedSources = normalizeSources(data.sources);
      const normalizedMeta = normalizeMeta(data.meta, normalizedSources);

      setAnswer(data.answer ?? "");
      setSources(normalizedSources);
      setMeta(normalizedMeta);
      setHistory((prev) => {
        const nextItem: AskHistoryItem = {
          id: Date.now(),
          question: question.trim(),
          minSimilarity: normalizedMeta.minSimilarityThreshold,
          maxSimilarity: normalizedMeta.maxSimilarity,
          blocked: normalizedMeta.blocked,
          sourceCount: normalizedMeta.sourceCount,
          topSourceName: normalizedSources[0]?.document_name ?? "-",
          createdAt: new Date().toLocaleTimeString(),
        };
        return [nextItem, ...prev].slice(0, MAX_HISTORY);
      });
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Question request failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Question</span>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask based on uploaded documents."
          className="mt-2 h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-brand-300"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">
          Min similarity threshold (0~1)
        </span>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={minSimilarity}
            onChange={(event) => setMinSimilarity(Number(event.target.value))}
            className="w-full"
          />
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={minSimilarity}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (Number.isFinite(value)) {
                setMinSimilarity(clamp01(value));
              }
            }}
            className="w-24 rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none"
          />
        </div>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">
          Similar-question match score (0~1)
        </span>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={questionMatchMinScore}
            onChange={(event) =>
              setQuestionMatchMinScore(Number(event.target.value))
            }
            className="w-full"
          />
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={questionMatchMinScore}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (Number.isFinite(value)) {
                setQuestionMatchMinScore(clamp01(value));
              }
            }}
            className="w-24 rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none"
          />
        </div>
      </label>

      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
        <input
          type="checkbox"
          checked={autoApplyThreshold}
          onChange={(event) => setAutoApplyThreshold(event.target.checked)}
        />
        Auto-apply matched question threshold
      </label>

      {bestThresholdMatch ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Matched key: {bestThresholdMatch.key} / score{" "}
          {bestThresholdMatch.score.toFixed(2)} / threshold{" "}
          {bestThresholdMatch.threshold.toFixed(2)}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {[0.45, 0.5, 0.6].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setMinSimilarity(preset)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              minSimilarity === preset
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {preset.toFixed(2)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMinSimilarity(recommendedThreshold)}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
        >
          Global rec {recommendedThreshold.toFixed(2)}
        </button>
        <button
          type="button"
          onClick={() => setMinSimilarity(questionRecommendedThreshold)}
          disabled={!question.trim()}
          className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 disabled:opacity-50"
        >
          Question rec {questionRecommendedThreshold.toFixed(2)}
        </button>
        {bestThresholdMatch ? (
          <button
            type="button"
            onClick={() => setMinSimilarity(bestThresholdMatch.threshold)}
            className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
          >
            Match {bestThresholdMatch.threshold.toFixed(2)}
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!question.trim()}
          onClick={() => {
            if (!questionKey) return;
            setQuestionThresholdMap((prev) => ({
              ...prev,
              [questionKey]: minSimilarity,
            }));
          }}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50"
        >
          Save current threshold for this question
        </button>
        {bestThresholdMatch ? (
          <button
            type="button"
            onClick={() => {
              setQuestionThresholdMap((prev) => {
                const next = { ...prev };
                delete next[bestThresholdMatch.key];
                return next;
              });
            }}
            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
          >
            Remove matched saved threshold
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => void handleAsk()}
        disabled={loading || !question.trim()}
        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Ask
      </button>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {meta ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">Status:</span>
            <span
              className={`rounded-full px-2 py-0.5 font-semibold ${
                meta.blocked
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {meta.blocked ? "Blocked" : "Passed"}
            </span>
          </div>
          <p className="mt-1">
            Max similarity {meta.maxSimilarity.toFixed(2)} / threshold{" "}
            {meta.minSimilarityThreshold.toFixed(2)} / sources {meta.sourceCount}
          </p>
        </div>
      ) : null}

      {answer ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">Answer</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {answer}
          </p>
        </div>
      ) : null}

      {sources.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Sources</p>
          {sources.map((source) => (
            <div
              key={`${source.document_name}-${source.similarity}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">
                  {source.document_name}
                </p>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700">
                  similarity: {source.similarity.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {history.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">
              Tuning history (latest {MAX_HISTORY})
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => downloadHistoryCsv(history)}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
              >
                Clear history
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr className="text-left">
                  <th className="px-3 py-2">time</th>
                  <th className="px-3 py-2">threshold</th>
                  <th className="px-3 py-2">max similarity</th>
                  <th className="px-3 py-2">status</th>
                  <th className="px-3 py-2">source</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 text-slate-600">{item.createdAt}</td>
                    <td className="px-3 py-2">{item.minSimilarity.toFixed(2)}</td>
                    <td className="px-3 py-2">{item.maxSimilarity.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 font-semibold ${
                          item.blocked
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.blocked ? "blocked" : "passed"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {item.topSourceName} ({item.sourceCount})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {groupedHistory.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">
            Grouped question summary
          </p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr className="text-left">
                  <th className="px-3 py-2">question</th>
                  <th className="px-3 py-2">runs</th>
                  <th className="px-3 py-2">pass/block</th>
                  <th className="px-3 py-2">avg max similarity</th>
                  <th className="px-3 py-2">best threshold</th>
                  <th className="px-3 py-2">latest</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {groupedHistory.map((group) => (
                  <tr key={group.question}>
                    <td className="px-3 py-2 text-slate-700">{group.question}</td>
                    <td className="px-3 py-2">{group.runs}</td>
                    <td className="px-3 py-2">
                      {group.passCount}/{group.blockCount}
                    </td>
                    <td className="px-3 py-2">
                      {group.avgMaxSimilarity.toFixed(2)}
                    </td>
                    <td className="px-3 py-2">{group.bestThreshold.toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-600">{group.latestAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {Object.keys(questionThresholdMap).length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">
            Saved question thresholds
          </p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr className="text-left">
                  <th className="px-3 py-2">question key</th>
                  <th className="px-3 py-2">threshold</th>
                  <th className="px-3 py-2">action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Object.entries(questionThresholdMap).map(([key, value]) => (
                  <tr key={key}>
                    <td className="px-3 py-2 text-slate-700">{key}</td>
                    <td className="px-3 py-2">{value.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          setQuestion(key);
                          setMinSimilarity(value);
                        }}
                        className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700"
                      >
                        apply+fill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
