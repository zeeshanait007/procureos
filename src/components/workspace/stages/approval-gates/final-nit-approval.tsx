import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'

export function FinalNitApprovalGate({ caseData }: { caseData: any }) {
  
  const gates = caseData.approvalGates || []
  const requiredGates = ['ADMINISTRATIVE', 'BUDGET', 'STRATEGY', 'TECH_SPEC', 'COST_ESTIMATE']
  
  // Calculate readiness
  let completed = 0
  const dependencies = requiredGates.map(gt => {
    const g = gates.find((g: any) => g.gateType === gt)
    const isApproved = g?.status === 'APPROVED'
    if (isApproved) completed++
    return { type: gt, name: g?.gateName || gt, isApproved }
  })

  const score = Math.round((completed / requiredGates.length) * 100)
  const isReady = score === 100

  return (
    <div className="space-y-8">
      
      <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-2xl">
        <ShieldCheck className={`w-16 h-16 mx-auto mb-4 ${isReady ? 'text-emerald-500' : 'text-amber-500'}`} />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Tender Readiness Review</h3>
        <div className="text-5xl font-extrabold text-slate-900 mb-2">{score}%</div>
        <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">Readiness Score</p>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-slate-900">Mandatory Prerequisites</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dependencies.map((dep, idx) => (
            <div key={idx} className={`p-4 rounded-xl border flex items-center gap-3 ${dep.isApproved ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              {dep.isApproved ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              <span className={`font-semibold text-sm ${dep.isApproved ? 'text-emerald-900' : 'text-rose-900'}`}>{dep.name}</span>
              <span className="ml-auto text-xs font-bold uppercase tracking-wider opacity-60">
                {dep.isApproved ? 'Complete' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!isReady && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg text-rose-700 text-sm font-medium text-center">
          Publication blocked: You cannot approve the Final NIT until all mandatory dependencies are complete.
        </div>
      )}
      
      {isReady && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-emerald-700 text-sm font-medium text-center">
          All systems go. The NIT is ready for final authorization and publication to the public portal.
        </div>
      )}

    </div>
  )
}
