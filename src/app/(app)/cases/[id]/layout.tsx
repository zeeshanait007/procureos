import { WorkspaceProvider } from "@/components/workspace/workspace-provider";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CaseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const caseData = await prisma.procurementCase.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!caseData) {
    notFound();
  }

  let parsedWorkspaceData = {};
  if (caseData.workspaceData) {
    try {
      parsedWorkspaceData = JSON.parse(caseData.workspaceData);
    } catch (e) {
      console.error("Failed to parse workspace data", e);
    }
  }

  return (
    <WorkspaceProvider initialData={{ ...parsedWorkspaceData, caseId: resolvedParams.id }}>
      {children}
    </WorkspaceProvider>
  );
}
