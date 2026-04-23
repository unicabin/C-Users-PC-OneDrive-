import { ResearchWorkspace } from "@/components/pages/research-workspace";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ResearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  return <ResearchWorkspace initialQuery={q ?? ""} />;
}
