"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Target, AlertTriangle, IndianRupee, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { analyzeRequirementsAction } from "@/app/actions/ai-actions";

const SAMPLE_PROMPT = "We are upgrading the control systems at the Bhilai Steel Plant (SAIL) and need to procure 50 ruggedized industrial workstations for the blast furnace control rooms. They must be able to operate in high-temperature (up to 55°C) and high-dust environments. Need minimum 16GB ECC RAM, dual gigabit ethernet, and redundant power supplies. Must support legacy RS-232 serial connections for older PLCs. Delivery required within 45 days. The estimated budget is roughly 1.8 Cr. Include 5-year onsite comprehensive warranty and quarterly maintenance.";

export function RequirementIntelligence({ nextStage }: { nextStage?: string }) {
  const { data, updateData } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!data.rawInput.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    const result = await analyzeRequirementsAction(data.rawInput);
    
    setIsAnalyzing(false);
    
    if (result.success && result.data) {
      updateData({
        structuredRequirements: result.data.structuredRequirements,
        objective: result.data.objective || "",
        ambiguities: result.data.ambiguities || [],
        clarityScore: result.data.clarityScore || 0,
        estimatedBudgetCr: result.data.estimatedBudgetCr || 0,
      });
    } else {
      setError((result as any).error || "Failed to analyze requirements");
    }
  };

  const handleApplyFix = (index: number) => {
    // In a real app, this would append the suggestion to the structured requirements
    // For now, we'll just dismiss the ambiguity to simulate it being fixed
    const newAmbiguities = [...data.ambiguities];
    newAmbiguities.splice(index, 1);
    
    updateData({
      ambiguities: newAmbiguities,
      clarityScore: Math.min(100, data.clarityScore + 15) // Boost score
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Phase 1: Requirement Intelligence</h2>
          <p className="text-slate-500 mt-1">AI analyzes the business problem and verifies requirement clarity.</p>
        </div>
        <div className="flex gap-2">
          {nextStage && data.structuredRequirements && (
            <Button onClick={() => router.push(`${pathname}?stage=${nextStage}`)} className="bg-indigo-600 hover:bg-indigo-700">
              Proceed to Market Benchmarking <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {!data.structuredRequirements ? (
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
              <Sparkles className="w-5 h-5 text-indigo-600" /> Input Procurement Needs
            </CardTitle>
            <CardDescription className="text-indigo-700/70">
              Paste your messy, unstructured requirements below. Gemini will parse, structure, and analyze them.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Textarea 
              className="min-h-[150px] text-sm text-slate-700 border-slate-200 resize-none" 
              placeholder="e.g. We need to buy 500 laptops for the new office..."
              value={data.rawInput}
              onChange={(e) => updateData({ rawInput: e.target.value })}
            />
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                Error: {error}
              </div>
            )}
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !data.rawInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                {isAnalyzing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing with Gemini...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Run AI Analysis</>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => updateData({ rawInput: SAMPLE_PROMPT })}
                className="text-slate-600"
              >
                Load Sample Input
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="md:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100 pb-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" /> Structured Requirements
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => updateData({ structuredRequirements: "" })} className="h-8 text-xs">
                  Edit Input
                </Button>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200" variant="outline">
                  <Sparkles className="w-3 h-3 mr-1" /> AI Draft
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              
              {data.ambiguities.length > 0 && data.ambiguities.map((amb, idx) => (
                <div key={idx} className="p-3 bg-rose-50 text-rose-800 rounded-md border border-rose-100 flex items-start gap-3 text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold block mb-1">Ambiguity Detected: {amb.issue}</span>
                    <span className="text-rose-700/90">{amb.suggestion}</span>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={() => handleApplyFix(idx)} className="h-7 text-xs bg-rose-600 hover:bg-rose-700">Accept AI Fix</Button>
                      <Button variant="outline" size="sm" onClick={() => handleApplyFix(idx)} className="h-7 text-xs bg-transparent border-rose-200">Ignore</Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Textarea 
                className="min-h-[300px] font-mono text-sm text-slate-700 border-slate-200 bg-slate-50/30" 
                value={data.structuredRequirements}
                onChange={(e) => updateData({ structuredRequirements: e.target.value })}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-indigo-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-indigo-600" strokeWidth="3" strokeDasharray={`${data.clarityScore}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <span className="absolute text-lg font-bold text-indigo-700">{data.clarityScore}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-900">Clarity Score</h3>
                  </div>
                </div>
                <p className="text-sm text-indigo-700">
                  {data.clarityScore > 80 ? "Excellent requirement clarity. Highly testable and measurable. Ready for Market Benchmarking." : "Requirements need clarification. Address the ambiguities to improve market response."}
                </p>
              </CardContent>
            </Card>

            {data.estimatedBudgetCr !== null && (
              <Card className="bg-slate-900 text-slate-50 border-slate-800 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Estimated Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1 mt-2">
                    <IndianRupee className="w-6 h-6 text-emerald-400" />
                    <span className="text-4xl font-bold tracking-tight">{data.estimatedBudgetCr}</span>
                    <span className="text-xl text-slate-400 font-medium ml-1">Cr</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">AI estimates this aligns with current market rates based on your requirements.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
