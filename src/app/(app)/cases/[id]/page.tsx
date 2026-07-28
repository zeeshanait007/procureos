import { StageNavigation } from "@/components/workspace/stage-navigation";
import { AiCopilot } from "@/components/workspace/ai-copilot";
import { RequirementIntelligence } from "@/components/workspace/stages/requirement-intelligence";
import { MarketBenchmarking } from "@/components/workspace/stages/market-benchmarking";
import { AITenderAssembly } from "@/components/workspace/stages/ai-tender-assembly";
import { ComplianceReview } from "@/components/workspace/stages/compliance-review";
import { PublishTrackStage } from "@/components/workspace/stages/publish-track";
import { WorkspaceHeaderActions } from "@/components/workspace/workspace-header-actions";
import { GateController } from "@/components/workspace/stages/approval-gates/gate-controller";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

const STAGES = [
  { id: "REQUIREMENT_INTELLIGENCE", name: "1. Requirement Intelligence" },
  { id: "MARKET_BENCHMARKING", name: "2. Market Benchmarking" },
  { id: "AI_TENDER_ASSEMBLY", name: "3. AI Tender Assembly" },
  { id: "COMPLIANCE_REVIEW", name: "4. Compliance & Review" },
  { id: "PUBLISH_TRACK", name: "5. Publish & Track" },
];

export default async function ProcurementCaseWorkspace({ 
  params,
  searchParams,
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ stage?: string, gate?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const caseData = await prisma.procurementCase.findUnique({
    where: { id: resolvedParams.id },
    include: { approvalGates: { orderBy: { sequence: 'asc' } } }
  });

  if (!caseData) {
    notFound();
  }

  const currentUser = await getCurrentUser();

  // If a gate is explicitly requested in URL, set it, else fallback to stage or default
  const activeGateId = resolvedSearchParams.gate;
  const activeStageId = resolvedSearchParams.stage || (!activeGateId ? "REQUIREMENT_INTELLIGENCE" : undefined);

  return (
    <div className="flex flex-1 overflow-hidden bg-white">
      {/* Left Panel - Stage & Governance Navigation */}
      <div className="w-64 border-r bg-slate-50/50 hidden md:block shrink-0">
        <StageNavigation activeStage={activeStageId} activeGate={activeGateId} gates={caseData.approvalGates} />
      </div>

      {/* Center Panel - Current Stage Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <div className="h-16 border-b border-slate-200 px-6 bg-white sticky top-0 z-10 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Procurement Case • {resolvedParams.id}
            </p>
            <h2 className="text-[15px] font-bold text-slate-900 truncate">
              {caseData.title}
            </h2>
          </div>
          <WorkspaceHeaderActions currentStageId={activeStageId || activeGateId || ""} />
        </div>
        <div className="p-6">
          {activeStageId === "REQUIREMENT_INTELLIGENCE" && <RequirementIntelligence nextStage="MARKET_BENCHMARKING" />}
          {activeStageId === "MARKET_BENCHMARKING" && <MarketBenchmarking nextStage="AI_TENDER_ASSEMBLY" />}
          {activeStageId === "AI_TENDER_ASSEMBLY" && <AITenderAssembly nextStage="COMPLIANCE_REVIEW" />}
          {activeStageId === "COMPLIANCE_REVIEW" && <ComplianceReview nextStage="PUBLISH_TRACK" />}
          {activeStageId === "PUBLISH_TRACK" && <PublishTrackStage approvalGates={caseData.approvalGates} />}

          {/* Render Governance Gates when selected */}
          {activeGateId && (
            <GateController 
              gate={caseData.approvalGates.find((g: any) => g.gateType === activeGateId)} 
              caseData={caseData} 
              currentUser={currentUser}
            />
          )}
        </div>
      </div>

      {/* Right Panel - AI Copilot */}
      <AiCopilot />
    </div>
  );
}
