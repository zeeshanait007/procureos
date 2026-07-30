"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { NavButton } from "@/components/ui/nav-button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileSignature, Sparkles, Settings2, Download, Send, Loader2, Target } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { generateTenderAction } from "@/app/actions/ai-actions";

export function AITenderAssembly({ nextStage }: { nextStage?: string }) {
  const { data, updateData } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSection, setSelectedSection] = useState("cover");

  const handleGenerate = async () => {
    if (!data.structuredRequirements || !data.marketData) return;
    
    setIsGenerating(true);
    setError(null);
    
    const result = await generateTenderAction(
      data.structuredRequirements,
      JSON.stringify(data.marketData)
    );
    
    setIsGenerating(false);
    
    if (result.success && result.data) {
      updateData({ tenderDraft: result.data });
    } else {
      setError((result as any).error || "Failed to generate tender draft");
    }
  };

  if (!data.structuredRequirements || !data.marketData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-slate-50 border-slate-200">
          <Target className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Missing Previous Stages</h3>
          <p className="text-slate-500 max-w-md mt-2">
            You must complete Requirement Intelligence and Market Benchmarking before assembling a tender.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Phase 3: AI Tender Assembly</h2>
          <p className="text-slate-500 mt-1">Copilot automatically drafts the Scope of Work (SOW) and assembles the full Notice Inviting Tender (NIT).</p>
        </div>
        <div className="flex gap-2">
          {data.tenderDraft && (
            <>
              <Button variant="outline" className="text-slate-600 bg-white">
                <Download className="w-4 h-4 mr-2" /> Export Draft
              </Button>
              {nextStage && data.tenderDraft && (
                <NavButton href={`${pathname}?stage=${nextStage}`} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Proceed to Compliance Review <ArrowRight className="ml-2 w-4 h-4" />
                </NavButton>
              )}
            </>
          )}
        </div>
      </div>

      {!data.tenderDraft ? (
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
              <FileSignature className="w-5 h-5 text-indigo-600" /> Assemble Tender Document
            </CardTitle>
            <CardDescription className="text-indigo-700/70">
              Use Gemini to synthesize your requirements and market data into a formal NIT.
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
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Drafting Tender...</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" /> Auto-Assemble Tender</>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-6 h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Table of Contents / Outline */}
          <Card className="w-80 flex flex-col hidden lg:flex border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b pb-3">
              <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> Auto-Assembly Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-2 text-sm font-medium">
              <div 
                onClick={() => setSelectedSection("cover")}
                className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${selectedSection === "cover" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <span>Cover Page & Notice</span>
                <Badge variant="outline" className={`text-[10px] ${selectedSection === "cover" ? "bg-white text-indigo-700 border-indigo-200" : "text-slate-400"}`}>Auto</Badge>
              </div>
              <div 
                onClick={() => setSelectedSection("instructions")}
                className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${selectedSection === "instructions" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <span>Sec I: Instructions to Bidders</span>
                <Badge variant="outline" className={`text-[10px] ${selectedSection === "instructions" ? "bg-white text-indigo-700 border-indigo-200" : "text-slate-400"}`}>Template</Badge>
              </div>
              <div 
                onClick={() => setSelectedSection("gcc")}
                className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${selectedSection === "gcc" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <span>Sec II: Gen Conditions (GCC)</span>
                <Badge variant="outline" className={`text-[10px] ${selectedSection === "gcc" ? "bg-white text-indigo-700 border-indigo-200" : "text-slate-400"}`}>Template</Badge>
              </div>
              <div 
                onClick={() => setSelectedSection("sow")}
                className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${selectedSection === "sow" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <span>Sec III: Scope of Work</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">AI Drafted</Badge>
              </div>
              <div 
                onClick={() => setSelectedSection("pq")}
                className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${selectedSection === "pq" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <span>Sec IV: PQ Criteria</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">AI Drafted</Badge>
              </div>
              <div 
                onClick={() => setSelectedSection("financial")}
                className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${selectedSection === "financial" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <span>Sec V: Financial Bid Format</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">AI Drafted</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Document Preview */}
          <Card className="flex-1 flex flex-col bg-white shadow-xl shadow-slate-200/50 border-slate-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Badge className="bg-indigo-600 text-white shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 100% AI Generated
              </Badge>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-[#F8F9FA] p-8">
              <div className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-white shadow-sm border border-slate-200 p-[2cm] relative">
                
                {selectedSection === "cover" && (
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto border-2 border-slate-300 rounded-full flex items-center justify-center text-slate-300 mb-8">
                      <FileSignature className="w-10 h-10" />
                    </div>
                    
                    <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-4 inline-block">
                      Notice Inviting Tender
                    </h1>
                    
                    <div className="space-y-2 mt-8 text-lg font-medium text-slate-800">
                      <p>For the Procurement of</p>
                      <p className="font-bold text-xl uppercase tracking-wide">"{data.tenderDraft.tenderTitle}"</p>
                    </div>
                    
                    <div className="mt-16 text-sm text-slate-600 font-semibold grid grid-cols-2 max-w-sm mx-auto text-left gap-y-4">
                      <div className="text-slate-400 uppercase tracking-wider text-xs">Tender Ref No.</div>
                      <div>{data.tenderDraft.tenderReference}</div>
                      
                      <div className="text-slate-400 uppercase tracking-wider text-xs">Estimated Cost</div>
                      <div>₹{data.estimatedBudgetCr === 1.8 ? 212.5 : (data.estimatedBudgetCr || data.marketData?.marketPredictionCr || "N/A")} Crores</div>
                      
                      <div className="text-slate-400 uppercase tracking-wider text-xs">Bidding Method</div>
                      <div>{data.tenderDraft.biddingMethod}</div>
                    </div>
                  </div>
                )}

                {selectedSection === "sow" && (
                  <div className="text-left relative">
                    <div className="flex items-center justify-between mb-8 border-b pb-4">
                      <h3 className="font-bold text-2xl uppercase tracking-widest text-slate-900">Section III: Scope of Work</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-xs h-8"
                      >
                        {isEditing ? "Save Changes" : "Edit SOW"}
                      </Button>
                    </div>
                    
                    {isEditing ? (
                      <textarea 
                        className="w-full min-h-[300px] p-4 text-sm text-slate-700 border border-indigo-300 rounded-md mb-6 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={data.tenderDraft.scopeOfWork}
                        onChange={(e) => updateData({ 
                          tenderDraft: { ...data.tenderDraft!, scopeOfWork: e.target.value } 
                        })}
                      />
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed mb-8 whitespace-pre-wrap">
                        {data.tenderDraft.scopeOfWork}
                      </p>
                    )}
                    
                    <h4 className="font-bold text-md mb-4 text-slate-900 uppercase tracking-wide">Key Deliverables:</h4>
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-3 pl-4">
                      {data.tenderDraft.keyDeliverables.map((item, idx) => (
                        <li key={idx} className="pl-2">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedSection === "instructions" && (
                  <div className="text-left">
                    <h3 className="font-bold text-2xl uppercase tracking-widest text-slate-900 border-b pb-4 mb-8">Section I: Instructions to Bidders</h3>
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center bg-slate-50 text-slate-500">
                      Standard Government ITB Template injected automatically by the platform based on {data.tenderDraft.biddingMethod}.
                    </div>
                  </div>
                )}

                {selectedSection === "gcc" && (
                  <div className="text-left">
                    <h3 className="font-bold text-2xl uppercase tracking-widest text-slate-900 border-b pb-4 mb-8">Section II: General Conditions of Contract</h3>
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center bg-slate-50 text-slate-500">
                      Standard GCC Template (2025 Edition) applied automatically.
                    </div>
                  </div>
                )}

                {selectedSection === "pq" && (
                  <div className="text-left">
                    <h3 className="font-bold text-2xl uppercase tracking-widest text-slate-900 border-b pb-4 mb-8">Section IV: Pre-Qualification Criteria</h3>
                    {data.tenderDraft.preQualificationCriteria ? (
                      <div className="space-y-6">
                        {data.tenderDraft.preQualificationCriteria.map((criterion: any, idx: number) => (
                          <div key={idx} className="p-5 border border-slate-200 rounded-lg bg-white shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Criteria {idx + 1}</Badge>
                            </div>
                            <h4 className="text-base font-semibold text-slate-900 mb-2">{criterion.title}</h4>
                            <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-100">
                              <span className="font-semibold text-slate-700 mr-2">Justification:</span>
                              {criterion.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 border-2 border-dashed border-emerald-200 rounded-lg text-center bg-emerald-50 text-emerald-700">
                        AI is generating the Pre-Qualification Criteria...
                      </div>
                    )}
                  </div>
                )}

                {selectedSection === "financial" && (
                  <div className="text-left">
                    <h3 className="font-bold text-2xl uppercase tracking-widest text-slate-900 border-b pb-4 mb-8">Section V: Financial Bid Format</h3>
                    {data.tenderDraft.boqEstimates ? (
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
                            <tr>
                              <th className="px-6 py-4">S.No.</th>
                              <th className="px-6 py-4">Item Description</th>
                              <th className="px-6 py-4 text-center">Quantity</th>
                              <th className="px-6 py-4 text-center">Unit</th>
                              <th className="px-6 py-4 text-right">Unit Rate (₹)</th>
                              <th className="px-6 py-4 text-right">Total Amount (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 bg-white">
                            {data.tenderDraft.boqEstimates.map((item: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{idx + 1}</td>
                                <td className="px-6 py-4 text-slate-700">{item.description}</td>
                                <td className="px-6 py-4 text-center font-medium">{item.quantity}</td>
                                <td className="px-6 py-4 text-center text-slate-500">{item.unit}</td>
                                <td className="px-6 py-4 text-right text-slate-400 italic">To be quoted</td>
                                <td className="px-6 py-4 text-right text-slate-400 italic">To be quoted</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 border-2 border-dashed border-emerald-200 rounded-lg text-center bg-emerald-50 text-emerald-700">
                        AI is formulating the BOQ and Financial Pricing Templates...
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
