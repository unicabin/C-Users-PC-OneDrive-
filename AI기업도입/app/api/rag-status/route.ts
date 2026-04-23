import { NextResponse } from "next/server";

import { hasSupabaseEnv, supabase } from "@/lib/supabase";

export const runtime = "nodejs";

type CheckResult = {
  key: string;
  ok: boolean;
  message: string;
};

function ok(key: string, message: string): CheckResult {
  return { key, ok: true, message };
}

function fail(key: string, message: string): CheckResult {
  return { key, ok: false, message };
}

export async function GET() {
  const checks: CheckResult[] = [];

  if (process.env.OPENAI_API_KEY) {
    checks.push(ok("openai_key", "OPENAI_API_KEY is configured."));
  } else {
    checks.push(fail("openai_key", "OPENAI_API_KEY is missing."));
  }

  if (hasSupabaseEnv() && supabase) {
    checks.push(ok("supabase_env", "Supabase URL and anon key are configured."));
  } else {
    checks.push(
      fail(
        "supabase_env",
        "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.",
      ),
    );
  }

  if (!supabase) {
    return NextResponse.json({
      ok: false,
      checks,
    });
  }

  const tableCheck = await supabase
    .from("document_chunks")
    .select("id", { head: true, count: "exact" });

  if (tableCheck.error) {
    checks.push(
      fail(
        "document_chunks",
        `document_chunks table check failed: ${tableCheck.error.message}`,
      ),
    );
  } else {
    checks.push(ok("document_chunks", "document_chunks table is reachable."));
  }

  const queryEmbedding = Array.from({ length: 1536 }, () => 0);
  const rpcCheck = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: 1,
  });

  if (rpcCheck.error) {
    checks.push(
      fail(
        "match_documents",
        `match_documents RPC check failed: ${rpcCheck.error.message}`,
      ),
    );
  } else {
    checks.push(ok("match_documents", "match_documents RPC is callable."));
  }

  return NextResponse.json({
    ok: checks.every((item) => item.ok),
    checks,
  });
}

