import { redirect } from "next/navigation";
import { getCurrentIdentity, checkProjectAccess } from "@/lib/project-access";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceCanvas } from "@/components/editor/workspace-canvas";

interface WorkspacePageProps {
  params: Promise<{ roomId: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { roomId } = await params;
  const { userId, userEmail } = await getCurrentIdentity();

  if (!userId) redirect("/sign-in");

  const access = await checkProjectAccess(roomId, userId, userEmail);

  if (!access) return <AccessDenied />;

  return (
    <WorkspaceCanvas
      projectName={access.project.name}
      projectId={access.project.id}
      isOwner={access.isOwner}
    />
  );
}
