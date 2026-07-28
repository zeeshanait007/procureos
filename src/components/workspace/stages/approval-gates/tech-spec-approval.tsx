import { CheckCircle2, ShieldAlert } from 'lucide-react'

export function TechSpecApprovalGate({ caseData }: { caseData: any }) {
  const wsData = JSON.parse(caseData.workspaceData || '{}')
  const tender = wsData.tenderDraft || {}

  return (
    <div className="space-y-6">
      
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
        <h4 className="text-sm font-semibold text-slate-900 mb-4">Scope of Work</h4>
        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{tender.scopeOfWork || 'No scope defined.'}</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
        <h4 className="text-sm font-semibold text-slate-900 mb-4">Key Deliverables</h4>
        <ul className="space-y-3">
          {(tender.keyDeliverables || []).map((item: string, idx: number) => (
            <li key={idx} className="flex gap-3 text-sm text-slate-700">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
        <h4 className="text-sm font-semibold text-slate-900 mb-4">Pre-Qualification Criteria</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(tender.preQualificationCriteria || []).map((crit: any, idx: number) => (
            <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="font-semibold text-slate-800 text-sm mb-1">{crit.title}</div>
              <div className="text-xs text-slate-600">{crit.description}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export function TechSpecAIPanel() {
  return (
    <div className="h-full bg-indigo-50/30 border-l border-indigo-100 p-6">
      <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-6">
        <ShieldAlert className="w-5 h-5 text-indigo-600" /> AI Technical Review
      </h3>
      
      <div className="space-y-4 text-sm">
        <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-emerald-700 mb-2">
            <CheckCircle2 className="w-4 h-4" /> Clear Acceptance Criteria
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">The deliverables are well-defined and measurable.</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-amber-700 mb-2">
            <ShieldAlert className="w-4 h-4" /> Ambiguous Requirement
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">"24/7 Support" does not specify the SLA response time (e.g., L1 within 1 hour). Consider clarifying before approval.</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-emerald-700 mb-2">
            <CheckCircle2 className="w-4 h-4" /> Vendor Neutrality
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">The specifications do not mandate any proprietary vendor technologies.</p>
        </div>
      </div>
    </div>
  )
}
