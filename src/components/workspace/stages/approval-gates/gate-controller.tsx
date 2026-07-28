'use client'

import { GateLayout } from "./gate-layout"
import { AdminApprovalGate } from "./admin-approval"
import { BudgetApprovalGate } from "./budget-approval"
import { StrategyApprovalGate } from "./strategy-approval"
import { TechSpecApprovalGate, TechSpecAIPanel } from "./tech-spec-approval"
import { CostEstimateApprovalGate } from "./cost-estimate-approval"
import { FinalNitApprovalGate } from "./final-nit-approval"

import { processApprovalDecision } from "@/app/actions/approval-actions"
import { useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"

export function GateController({ gate, caseData, currentUser }: { gate: any, caseData: any, currentUser: any }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const handleApprove = async (comments: string) => {
    startTransition(async () => {
      await processApprovalDecision(gate.id, 'APPROVED', comments)
      const sortedGates = [...caseData.approvalGates].sort((a: any, b: any) => a.sequence - b.sequence)
      const currentIndex = sortedGates.findIndex((g: any) => g.id === gate.id)
      const nextGate = sortedGates[currentIndex + 1]
      
      if (nextGate) {
        router.push(`${pathname}?gate=${nextGate.gateType}`)
      }
    })
  }

  const handleReject = async (comments: string) => {
    startTransition(async () => {
      await processApprovalDecision(gate.id, 'REJECTED', comments)
    })
  }

  const handleRequestChanges = async (comments: string) => {
    startTransition(async () => {
      await processApprovalDecision(gate.id, 'CHANGES_REQUESTED', comments)
    })
  }

  const handleEditDraft = () => {
    let stageId = ''
    switch (gate.gateType) {
      case 'ADMINISTRATIVE':
      case 'BUDGET':
        stageId = 'REQUIREMENT_INTELLIGENCE'; break;
      case 'STRATEGY':
        stageId = 'MARKET_BENCHMARKING'; break;
      case 'TECH_SPEC':
      case 'COST_ESTIMATE':
        stageId = 'AI_TENDER_ASSEMBLY'; break;
      case 'FINAL_NIT':
        stageId = 'COMPLIANCE_REVIEW'; break;
    }
    if (stageId) router.push(`${pathname}?stage=${stageId}`)
  }

  const renderGateContent = () => {
    switch (gate.gateType) {
      case 'ADMINISTRATIVE': return <AdminApprovalGate caseData={caseData} />
      case 'BUDGET': return <BudgetApprovalGate caseData={caseData} />
      case 'STRATEGY': return <StrategyApprovalGate caseData={caseData} />
      case 'TECH_SPEC': return <TechSpecApprovalGate caseData={caseData} />
      case 'COST_ESTIMATE': return <CostEstimateApprovalGate caseData={caseData} />
      case 'FINAL_NIT': return <FinalNitApprovalGate caseData={caseData} />
      default: return <div>Specific UI for {gate.gateType} is under construction.</div>
    }
  }

  const renderAIPanel = () => {
    if (gate.gateType === 'TECH_SPEC') return <TechSpecAIPanel />
    return undefined
  }

  return (
    <GateLayout
      gate={gate}
      currentUser={currentUser}
      title={gate.gateName}
      description={`Review and approve the ${gate.gateName.toLowerCase()} for this procurement.`}
      onApprove={handleApprove}
      onReject={handleReject}
      onRequestChanges={handleRequestChanges}
      onEditDraft={handleEditDraft}
      aiPanel={renderAIPanel()}
    >
      {renderGateContent()}
    </GateLayout>
  )
}
