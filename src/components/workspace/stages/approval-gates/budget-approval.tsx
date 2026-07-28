export function BudgetApprovalGate({ caseData }: { caseData: any }) {
  const wsData = JSON.parse(caseData.workspaceData || '{}')
  const estimatedCr = wsData.marketData?.marketPredictionCr || 0
  const estimatedCostStr = `₹${estimatedCr.toFixed(2)} Crores`

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Budget Required</h4>
          <p className="text-3xl font-extrabold text-slate-900">{estimatedCostStr}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Budget Available (FY26)</h4>
          <p className="text-3xl font-extrabold text-emerald-900">₹50.00 Crores</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Budget Head</div>
          <div className="font-medium text-slate-900">IT Infrastructure & Software (844-01-IT)</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Expenditure Type</div>
          <div className="font-medium text-slate-900">CapEx (Capital Expenditure)</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Funding Source</div>
          <div className="font-medium text-slate-900">Internal Accruals</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Multi-Year Commitment</div>
          <div className="font-medium text-slate-900">Yes (24 Months)</div>
        </div>
      </div>
    </div>
  )
}
