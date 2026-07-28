import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, CheckCircle2, Clock, FileWarning, TrendingUp } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NewCaseButton } from "@/components/dashboard/new-case-button";

export default async function Dashboard() {
  const cases = await prisma.procurementCase.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // Calculate KPIs
  const activeCasesCount = cases.length;
  
  let totalPipelineValue = 0;
  let pendingApprovalsCount = 0;
  let totalCycleTimeMs = 0;
  
  let bottleneckCasesCount = 0;
  let consistencyRiskCount = 0;

  cases.forEach((pc) => {
    // Pipeline Value
    if (pc.workspaceData) {
      try {
        const parsed = JSON.parse(pc.workspaceData);
        if (parsed.estimatedBudgetCr) {
          totalPipelineValue += Number(parsed.estimatedBudgetCr);
        }

        // Consistency Risk Detection
        if (parsed.complianceAlerts && Array.isArray(parsed.complianceAlerts)) {
          const hasHighRisk = parsed.complianceAlerts.some((a: any) => a.severity === 'high');
          if (hasHighRisk) {
            consistencyRiskCount++;
          }
        }
      } catch (e) {
        // Ignore parse errors for individual cases
      }
    }

    // Pending Approvals
    if (pc.status === "PUBLISHED") {
      pendingApprovalsCount++;
    }

    // Bottleneck Detection (stuck in a stage for > 7 days)
    const msSinceUpdate = new Date().getTime() - new Date(pc.updatedAt).getTime();
    const daysSinceUpdate = msSinceUpdate / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 7 && pc.status !== "PUBLISHED") {
      bottleneckCasesCount++;
    }

    // Cycle Time
    const cycleTimeMs = new Date(pc.updatedAt).getTime() - new Date(pc.createdAt).getTime();
    totalCycleTimeMs += cycleTimeMs;
  });

  const avgCycleTimeDays = activeCasesCount > 0 
    ? Math.max(1, Math.round(totalCycleTimeMs / activeCasesCount / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="flex-1 overflow-y-auto p-8 w-full">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Command Center</h1>
            <p className="text-slate-500 mt-1">Organization-wide procurement intelligence & monitoring.</p>
          </div>
          <NewCaseButton />
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Activity className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCasesCount}</div>
              <p className="text-xs text-slate-500">Live tracked procurements</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalPipelineValue.toFixed(1)} Cr</div>
              <p className="text-xs text-slate-500">Across {activeCasesCount} active cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Cycle Time</CardTitle>
              <Clock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCycleTimeDays} days</div>
              <p className="text-xs text-slate-500">From initiation to latest update</p>
            </CardContent>
          </Card>
          <Link href="/cases?filter=pending" className="block transition-transform hover:scale-[1.02]">
            <Card className="h-full border-amber-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-amber-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{pendingApprovalsCount}</div>
                <p className="text-xs text-amber-700/70 mt-1">Click to view pending cases</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* AI Insights */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">AI-Generated Insights</h2>
          <div className="grid gap-4 md:grid-cols-2">
            
            {bottleneckCasesCount > 0 ? (
              <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <AlertTitle className="font-semibold text-amber-800">Approval Bottleneck</AlertTitle>
                <AlertDescription className="mt-2 text-sm text-amber-700">
                  {bottleneckCasesCount} procurement cases have been waiting for approval/compliance for more than 7 days.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <AlertTitle className="font-semibold text-emerald-800">No Bottlenecks</AlertTitle>
                <AlertDescription className="mt-2 text-sm text-emerald-700">
                  All active cases are progressing smoothly within expected timelines.
                </AlertDescription>
              </Alert>
            )}

            {consistencyRiskCount > 0 ? (
              <Alert className="border-indigo-200 bg-indigo-50 text-indigo-900">
                <FileWarning className="h-5 w-5 text-indigo-600" />
                <AlertTitle className="font-semibold text-indigo-800">Consistency Risk Detected</AlertTitle>
                <AlertDescription className="mt-2 text-sm text-indigo-700">
                  {consistencyRiskCount} tender drafts contain high-severity compliance inconsistencies or risks. Review recommended.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <AlertTitle className="font-semibold text-emerald-800">Compliance Healthy</AlertTitle>
                <AlertDescription className="mt-2 text-sm text-emerald-700">
                  No high-severity compliance risks detected in active tender drafts.
                </AlertDescription>
              </Alert>
            )}

          </div>
        </div>

        {/* Pipeline Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Procurement Pipeline</CardTitle>
            <CardDescription>Top cases needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100">
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">Case Title</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">Stage</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">Last Updated</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {cases.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        No active procurement cases found. Click "New Procurement Case" to start.
                      </td>
                    </tr>
                  ) : (
                    cases.map((pc) => (
                      <tr key={pc.id} className="border-b transition-colors hover:bg-slate-100/50">
                        <td className="p-4 align-middle font-medium">{pc.title}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                            {pc.status.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle text-slate-500">
                          {new Date(pc.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[13px]">
                          <Link href={`/cases/${pc.id}`} className="text-indigo-600 hover:underline font-medium">
                            Review & Resume
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
