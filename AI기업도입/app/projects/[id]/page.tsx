import { ProtectedPage } from "@/components/auth/protected-page";
import { ProjectDetailWorkspace } from "@/components/pages/project-detail-workspace";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ProtectedPage>
      <ProjectDetailWorkspace projectId={id} />
    </ProtectedPage>
  );
}
