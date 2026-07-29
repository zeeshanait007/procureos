"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { NavButton } from "@/components/ui/nav-button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, ShieldAlert, Sparkles, CheckSquare, Loader2, Target } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { runComplianceCheckAction } from "@/app/actions/ai-actions";

export function ComplianceReview({ nextStage }: { nextStage?: string }) {
  const { data, updateData } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track which alerts have been injected
  const [injectedAlertIds, setInjectedAlertIds] = useState<string[]>([]);

  const handleRunCheck = async () => {
    if (!data.tenderDraft) return;
    
    setIsChecking(true);
    setError(null);
    
    const result = await runComplianceCheckAction(JSON.stringify(data.tenderDraft));
    
    setIsChecking(false);
    
    if (result.success && result.data && result.data.alerts) {
      updateData({ complianceAlerts: result.data.alerts });
    } else {
      setError((result as any).error || "Failed to run compliance check");
    }
  };

  const handleInject = (alertId: string, suggestedClause: string) => {
    if (!data.tenderDraft) return;
    
    // Append the clause to the scope of work
    const updatedTender = { ...data.tenderDraft };
    updatedTender.scopeOfWork += `\n\nLegal Amendment: ${suggestedClause}`;
    
    updateData({ tenderDraft: updatedTender });
    setInjectedAlertIds(prev => [...prev, alertId]);
  };

  if (!data.tenderDraft) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-slate-50 border-slate-200">
          <Target className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No Tender Draft Available</h3>
          <p className="text-slate-500 max-w-md mt-2">
            You must generate the tender draft in the previous stage before running compliance checks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Phase 4: Compliance & Review</h2>
          <p className="text-slate-500 mt-1">AI flags legal risks and coordinates cross-functional human sign-offs.</p>
        </div>
        <div className="flex gap-2">
          {nextStage && data.complianceAlerts.length > 0 && (
            <NavButton href={`${pathname}?stage=${nextStage}`} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Proceed to Publish & Track <ArrowRight className="ml-2 w-4 h-4" />
            </NavButton>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        
        {/* AI Legal Agent Review */}
        <Card className="border-indigo-200 shadow-sm overflow-hidden">
          <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-900">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-lg">AI Legal Agent Pre-Check</h3>
            </div>
            {data.complianceAlerts.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleRunCheck} disabled={isChecking}>
                {isChecking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Re-Run Check"}
              </Button>
            )}
          </div>
          
          <CardContent className="p-6">
            {data.complianceAlerts.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm w-full max-w-md mb-4 text-center">
                    Error: {error}
                  </div>
                )}
                <Button 
                  onClick={handleRunCheck} 
                  disabled={isChecking}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  {isChecking ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Scanning Document...</>
                  ) : (
                    <><ShieldAlert className="mr-2 h-5 w-5" /> Run Legal Compliance Check</>
                  )}
                </Button>
                <p className="text-sm text-slate-500 mt-4 text-center max-w-md">
                  Gemini will analyze the generated Notice Inviting Tender to detect missing clauses or legal risks.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {data.complianceAlerts.map((alert) => {
                  const isResolved = injectedAlertIds.includes(alert.id);
                  
                  return (
                    <div key={alert.id} className="flex items-start gap-4">
                      {isResolved ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                      ) : (
                        <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{alert.title}</h4>
                        <p className="text-sm text-slate-600 mb-4">{alert.description}</p>
                        
                        <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Suggested Amendment</p>
                          <p className="text-sm text-slate-800 italic">"{alert.suggestedClause}"</p>
                          <div className="mt-4 flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleInject(alert.id, alert.suggestedClause)}
                              disabled={isResolved}
                              className={isResolved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700 h-8 text-xs"}
                            >
                              {isResolved ? "Injected into Draft" : "Inject into Draft"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Human Committee Reviews */}
        {data.complianceAlerts.length > 0 && (
          <Card className="border-emerald-200 shadow-sm overflow-hidden animate-in fade-in duration-500 delay-300">
            <div className="bg-emerald-50/50 p-4 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg">Committee Sign-offs</h3>
              </div>
              <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Cleared
              </Badge>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-emerald-100/50">
                <div className="p-4 bg-white flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs font-bold text-slate-600">LR</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-900 text-sm">Linda Reynolds (General Counsel)</span>
                      <span className="text-xs text-slate-400">Just now</span>
                    </div>
                    <p className="text-sm text-slate-600">The legal clauses added by the AI Agent look solid. They fully protect our rights. Approved.</p>
                  </div>
                </div>

                <div className="p-4 bg-white flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs font-bold text-slate-600">MD</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-900 text-sm">Marcus Davis (VP Finance)</span>
                      <span className="text-xs text-slate-400">Just now</span>
                    </div>
                    <p className="text-sm text-slate-600">Payment terms are aligned with standard milestones and the budget is locked. Cleared.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
