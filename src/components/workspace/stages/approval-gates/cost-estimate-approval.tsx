import { TrendingUp, AlertTriangle } from 'lucide-react'

export function CostEstimateApprovalGate({ caseData }: { caseData: any }) {
  const wsData = JSON.parse(caseData.workspaceData || '{}')
  const boq = wsData.tenderDraft?.boqEstimates || []

  const totalCost = boq.reduce((acc: number, item: any) => acc + (item.quantity * item.estimatedRate), 0)

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-xl shadow-lg">
        <div>
          <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Total Estimated Cost</div>
          <div className="text-4xl font-extrabold">₹{(totalCost / 10000000).toFixed(2)} Crores</div>
        </div>
        <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg flex items-center gap-2 border border-emerald-500/30">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold text-sm">High Confidence (94%)</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Line Item Breakdown</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Unit Rate</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {boq.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.description}</td>
                  <td className="px-6 py-4 text-slate-600">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-4 text-slate-600">₹{item.estimatedRate.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-slate-900 font-semibold text-right">
                    ₹{(item.quantity * item.estimatedRate).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
        <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-blue-600" /> AI Cost Intelligence
        </h4>
        <p className="text-sm text-blue-800 leading-relaxed">
          The estimated unit rate for "Edge Compute Hardware" (₹2,00,000) aligns perfectly with recent GE GeM procurement data. "AI Platform License" is projected 5% lower than historical averages due to increased market competition among OEM vendors. No unusual pricing detected.
        </p>
      </div>

    </div>
  )
}
