"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calculator, UploadCloud, Users, Filter, Loader2, Sparkles, Target } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { generateMarketDataAction } from "@/app/actions/ai-actions";

export function MarketBenchmarking({ nextStage }: { nextStage?: string }) {
  const { data, updateData } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!data.structuredRequirements) return;
    
    setIsGenerating(true);
    setError(null);
    
    const result = await generateMarketDataAction(data.structuredRequirements);
    
    setIsGenerating(false);
    
    if (result.success && result.data) {
      updateData({ marketData: result.data });
    } else {
      setError(result.error || "Failed to generate market data");
    }
  };

  if (!data.structuredRequirements) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-slate-50 border-slate-200">
          <Target className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No Requirements Found</h3>
          <p className="text-slate-500 max-w-md mt-2">
            You need to complete the Requirement Intelligence phase before generating market benchmarks.
          </p>
          <Button onClick={() => router.push(`${pathname}?stage=REQUIREMENT_INTELLIGENCE`)} variant="outline" className="mt-6">
            Go to Requirement Intelligence
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Phase 2: Market & Cost Benchmarking</h2>
          <p className="text-slate-500 mt-1">AI compares your requirements against recent market data and predicts bidder availability.</p>
        </div>
        <div className="flex gap-2">
          {nextStage && data.marketData && (
            <Button onClick={() => router.push(`${pathname}?stage=${nextStage}`)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Proceed to Tender Assembly <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {!data.marketData ? (
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
              <Calculator className="w-5 h-5 text-indigo-600" /> Generate Benchmarks
            </CardTitle>
            <CardDescription className="text-indigo-700/70">
              Run market analysis against your {data.estimatedBudgetCr ? `₹${data.estimatedBudgetCr} Cr` : "estimated"} budget.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 flex flex-col items-center py-12">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm w-full max-w-md mb-4 text-center">
                Error: {error}
              </div>
            )}
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-12 px-8 text-base"
            >
              {isGenerating ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Scraping Market Data...</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" /> Generate Market Benchmarks</>
              )}
            </Button>
            <p className="text-sm text-slate-500 mt-2">This may take a few seconds as AI compiles recent vendor data.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end">
             <Button variant="outline" size="sm" onClick={() => updateData({ marketData: null })}>
               Regenerate Analysis
             </Button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="col-span-1 border-indigo-100 bg-indigo-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-indigo-800 mb-2">
                  <Calculator className="w-5 h-5" />
                  <h3 className="font-semibold text-sm">Market Prediction</h3>
                </div>
                <div className="text-3xl font-bold text-indigo-950 tracking-tight">₹{data.marketData.marketPredictionCr} Cr</div>
                <p className="text-xs text-indigo-700 mt-2">
                  {data.marketData.variancePercentage > 0 ? "+" : ""}{data.marketData.variancePercentage}% variance from your budget.
                </p>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-slate-500" /> Intelligence Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-slate-600">
                <p>Copilot scraped historical data from similar procurements to establish cost baselines and bidder constraints.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(data.marketData.sources || []).map((src, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-slate-100">{src}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 py-4">
                <CardTitle className="text-lg">Itemized Cost Benchmarks</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white border-b text-slate-600 font-semibold uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4">Component</th>
                      <th className="py-3 px-4 text-right">Market Avg</th>
                      <th className="py-3 px-4 text-right">Our Est.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(data.marketData.itemizedCosts || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900">{item.component}</td>
                        <td className="py-3 px-4 text-right text-slate-500">{item.marketAvg}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">{item.ourEst}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-white border-0 shadow-lg">
              <CardHeader className="pb-2 border-b border-white/10">
                <CardTitle className="text-sm font-medium text-indigo-200 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> AI Bidder Funnel Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 border-b border-white/10 flex justify-center items-center gap-4">
                  <Users className="w-10 h-10 text-emerald-400" />
                  <div>
                    <div className="text-4xl font-bold tracking-tight text-white mb-1">{data.marketData.vendorFunnel?.eligibleVendors || 0}</div>
                    <p className="text-sm text-indigo-200">Estimated Eligible Vendors</p>
                  </div>
                </div>
                <div className="pt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-indigo-200 mb-1">
                      <span>Total Market Pool</span>
                      <span>~{data.marketData.vendorFunnel?.totalPool || 0} Vendors</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-500 w-[100%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-indigo-200 mb-1">
                      <span>Pass Financial Criteria</span>
                      <span>~{data.marketData.vendorFunnel?.passFinancial || 0} Vendors</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-400" 
                        style={{ width: `${Math.round(((data.marketData.vendorFunnel?.passFinancial || 0) / (data.marketData.vendorFunnel?.totalPool || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-indigo-200 mb-1">
                      <span>Pass Technical Criteria</span>
                      <span className="font-bold text-white">{data.marketData.vendorFunnel?.eligibleVendors || 0} Vendors</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-400" 
                        style={{ width: `${Math.round(((data.marketData.vendorFunnel?.passTechnical || 0) / (data.marketData.vendorFunnel?.totalPool || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
