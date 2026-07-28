import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldAlert, Activity, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function RiskRadar() {
  const cases = await prisma.procurementCase.findMany({
    orderBy: { updatedAt: "desc" },
  });

  let highPriorityRisks = 0;
  let totalComplianceAlerts = 0;
  let bottlenecks = 0;

  const allAlerts: { caseId: string, caseTitle: string, alert: any }[] = [];

  cases.forEach(pc => {
    // Bottlenecks > 5 days
    const daysSinceUpdate = (new Date().getTime() - new Date(pc.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 5 && pc.status !== "PUBLISHED") {
      bottlenecks++;
    }

    if (pc.workspaceData) {
      try {
        const parsed = JSON.parse(pc.workspaceData);
        if (parsed.complianceAlerts && Array.isArray(parsed.complianceAlerts)) {
          totalComplianceAlerts += parsed.complianceAlerts.length;
          
          let hasHigh = false;
          parsed.complianceAlerts.forEach((a: any) => {
            if (a.severity === "high") hasHigh = true;
            allAlerts.push({ caseId: pc.id, caseTitle: pc.title, alert: a });
          });
          
          if (hasHigh) highPriorityRisks++;
        }
      } catch (e) {
        // Ignore parse error
      }
    }
  });

  // Calculate Process Bottlenecks from Approval Gates
  const completedGates = await prisma.approvalGate.findMany({
    where: { 
      status: 'APPROVED',
      submittedDate: { not: null },
      decisionDate: { not: null }
    }
  });

  const gateTotals: Record<string, { totalMs: number, count: number }> = {};
  completedGates.forEach(gate => {
    const durationMs = gate.decisionDate!.getTime() - gate.submittedDate!.getTime();
    if (!gateTotals[gate.gateType]) gateTotals[gate.gateType] = { totalMs: 0, count: 0 };
    gateTotals[gate.gateType].totalMs += durationMs;
    gateTotals[gate.gateType].count++;
  });

  const avgDelays: Record<string, number> = {};
  let worstStageName = "None";
  let maxDelay = 0;

  const stageDisplayNames: Record<string, string> = {
    "ADMINISTRATIVE": "Admin Approval",
    "BUDGET": "Budget Approval",
    "STRATEGY": "Strategy Approval",
    "TECH_SPEC": "Tech Spec Approval",
    "COST_ESTIMATE": "Cost Estimate",
    "FINAL_NIT": "Final NIT"
  };

  Object.entries(gateTotals).forEach(([gateType, data]) => {
    const avgDays = data.totalMs / data.count / (1000 * 60 * 60 * 24);
    avgDelays[gateType] = avgDays;
    if (avgDays > maxDelay) {
      maxDelay = avgDays;
      worstStageName = stageDisplayNames[gateType] || gateType;
    }
  });

  // Sort alerts: high > medium > low
  const severityRank: Record<string, number> = { high: 3, medium: 2, low: 1 };
  allAlerts.sort((a, b) => {
    const rankA = severityRank[a.alert.severity] || 0;
    const rankB = severityRank[b.alert.severity] || 0;
    return rankB - rankA;
  });

  const topAlerts = allAlerts.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Risk Radar</h1>
        <p className="text-slate-500 mt-1">AI-driven identification of bottlenecks, legal risks, and budget overruns.</p>
      </div>

      {/* Risk Summary Tiles */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-rose-50 border-rose-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-rose-800 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> High Priority Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-900">{highPriorityRisks}</div>
            <p className="text-xs text-rose-700 mt-1">Cases with critical risks</p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 text-sm font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Legal / Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{totalComplianceAlerts}</div>
            <p className="text-xs text-amber-700 mt-1">Clauses flagged by AI</p>
          </CardContent>
        </Card>

        <Card className="bg-indigo-50 border-indigo-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-800 text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4" /> Bottlenecks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900">{bottlenecks}</div>
            <p className="text-xs text-indigo-700 mt-1">Cases stalled &gt; 5 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Critical Risk Registry</CardTitle>
            <CardDescription>Top organizational risks ranked by AI severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAlerts.length === 0 ? (
                <div className="p-4 text-center text-slate-500 border rounded-lg bg-slate-50">
                  No active risks detected. Run compliance checks in your cases to populate this registry.
                </div>
              ) : (
                topAlerts.map((item, idx) => {
                  const severity = item.alert.severity || 'low';
                  const description = item.alert.description || 'No description available';
                  const recommendation = item.alert.recommendation || 'No recommendation available';
                  
                  return (
                    <div key={idx} className={`p-4 border rounded-lg relative overflow-hidden ${severity === 'high' ? 'border-rose-200 bg-rose-50/50' : severity === 'medium' ? 'border-amber-200 bg-amber-50/50' : 'border-blue-200 bg-blue-50/50'}`}>
                      <div className="absolute top-0 right-0 p-2">
                        <Badge variant={severity === 'high' ? 'destructive' : 'outline'} className={severity === 'high' ? 'bg-rose-500' : severity === 'medium' ? 'text-amber-700 border-amber-500' : 'text-blue-700 border-blue-500'}>
                          {severity.toUpperCase()}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-slate-900 pr-20">{description.substring(0, 50)}...</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        <Link href={`/cases/${item.caseId}?stage=COMPLIANCE_REVIEW`} className="hover:underline hover:text-indigo-600">
                          Case: {item.caseTitle}
                        </Link>
                      </p>
                      <p className={`text-xs mt-2 font-medium p-2 rounded inline-block ${severity === 'high' ? 'text-rose-700 bg-rose-100' : severity === 'medium' ? 'text-amber-700 bg-amber-100' : 'text-blue-700 bg-blue-100'}`}>
                        {recommendation}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Process Bottlenecks</CardTitle>
            <CardDescription>Departments causing delays in the digital thread</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[300px] justify-center items-center relative">
              <div className="w-full h-full border-b border-l border-slate-200 relative flex items-end justify-around pb-2 px-4 pt-10">
                <div className="absolute top-0 left-4 text-xs font-medium text-slate-400">Average Delay (Days)</div>
                
                {/* Dynamically rendered bars */}
                <div className="w-16 bg-slate-200 rounded-t-sm relative group" style={{ height: `${Math.max(10, Math.min(100, (avgDelays['ADMINISTRATIVE'] || 0.1) * 15))}%` }}>
                  <div className="absolute -top-6 w-full text-center text-xs font-semibold text-slate-600">{(avgDelays['ADMINISTRATIVE'] || 0).toFixed(1)}</div>
                  <div className="absolute -bottom-8 w-24 -left-4 text-center text-xs text-slate-500">Admin</div>
                </div>

                <div className="w-16 bg-indigo-300 rounded-t-sm relative group" style={{ height: `${Math.max(10, Math.min(100, (avgDelays['TECH_SPEC'] || 0.1) * 15))}%` }}>
                  <div className="absolute -top-6 w-full text-center text-xs font-semibold text-indigo-700">{(avgDelays['TECH_SPEC'] || 0).toFixed(1)}</div>
                  <div className="absolute -bottom-8 w-24 -left-4 text-center text-xs text-slate-500">Tech Eval</div>
                </div>

                <div className="w-16 bg-amber-300 rounded-t-sm relative group" style={{ height: `${Math.max(10, Math.min(100, (avgDelays['BUDGET'] || 0.1) * 15))}%` }}>
                  <div className="absolute -top-6 w-full text-center text-xs font-semibold text-amber-700">{(avgDelays['BUDGET'] || 0).toFixed(1)}</div>
                  <div className="absolute -bottom-8 w-24 -left-4 text-center text-xs text-slate-500 font-medium">Finance</div>
                </div>

                <div className="w-16 bg-rose-400 rounded-t-sm relative group" style={{ height: `${Math.max(10, Math.min(100, (avgDelays['FINAL_NIT'] || 0.1) * 15))}%` }}>
                  <div className="absolute -top-6 w-full text-center text-xs font-semibold text-rose-700">{(avgDelays['FINAL_NIT'] || 0).toFixed(1)}</div>
                  <div className="absolute -bottom-8 w-24 -left-4 text-center text-xs text-slate-500 font-bold">Legal</div>
                </div>
              </div>
              <div className="mt-12 w-full text-sm text-slate-500 flex justify-between items-center bg-slate-50 p-3 rounded border">
                <span>{worstStageName} is currently the biggest bottleneck.</span>
                <span className="text-indigo-600 flex items-center gap-1 cursor-pointer font-medium hover:underline">
                  View Detail <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
