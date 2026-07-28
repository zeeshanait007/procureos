import { useWorkspace } from "../../workspace-provider"

export function AdminApprovalGate({ caseData }: { caseData: any }) {
  const { data } = useWorkspace()
  const wsData = JSON.parse(caseData.workspaceData || '{}')
  const objective = data.objective || wsData.objective || "No objective defined."
  
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Business Problem</h4>
        <p className="text-slate-900 bg-slate-50 p-4 rounded-lg border border-slate-100">{objective}</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Strategic Alignment</h4>
        <p className="text-slate-900 bg-slate-50 p-4 rounded-lg border border-slate-100">Aligns with Digital Transformation 2026 initiatives to modernize heavy machinery telemetry.</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Consequences of Not Procuring</h4>
        <p className="text-slate-900 bg-slate-50 p-4 rounded-lg border border-slate-100">Estimated 30% increase in unplanned downtime, resulting in approximately $2M annual losses in operational capacity.</p>
      </div>
    </div>
  )
}
