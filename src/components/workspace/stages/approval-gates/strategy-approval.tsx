import { ShieldAlert, Info } from 'lucide-react'

export function StrategyApprovalGate({ caseData }: { caseData: any }) {
  return (
    <div className="space-y-8">
      
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6">
        <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4" /> Proposed Procurement Strategy
        </h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <div className="text-xs font-semibold text-indigo-400 uppercase">Procurement Method</div>
            <div className="font-medium text-indigo-900">{caseData.procurementMethod || 'Open e-Tender'}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-400 uppercase">Bid System</div>
            <div className="font-medium text-indigo-900">{caseData.bidSystem || 'Two-Bid System'}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-400 uppercase">Evaluation Method</div>
            <div className="font-medium text-indigo-900">{caseData.evaluationMethod || 'Technical + Financial'}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-400 uppercase">Contract Duration</div>
            <div className="font-medium text-indigo-900">{caseData.durationMonths} Months</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Justification for Strategy</h4>
        <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
          An Open e-Tender with a Two-Bid System ensures maximum market participation while allowing us to strictly evaluate the AI capabilities in the technical round before considering financial proposals. This mitigates the risk of selecting an incompetent low-cost bidder.
        </p>
      </div>

      <div className="border border-amber-200 bg-amber-50 rounded-xl p-5">
        <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-3">
          <ShieldAlert className="w-4 h-4" /> AI Risk Analysis
        </h4>
        <ul className="list-disc pl-5 text-sm text-amber-900 space-y-2">
          <li><strong>Compliance Risk:</strong> The Two-Bid evaluation is appropriate for complex IT services according to CVC guidelines.</li>
          <li><strong>Restrictive Conditions:</strong> Ensure Pre-Qualification criteria do not exclude qualified startups (consider MSME exemption policies).</li>
          <li><strong>Timeline Risk:</strong> Open tenders typically require a minimum 21-day publication window. Ensure this aligns with the project start date.</li>
        </ul>
      </div>

    </div>
  )
}
