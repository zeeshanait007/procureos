"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { CheckCircle2, DownloadCloud, Eye, Globe2, Sparkles, Timer, Loader2, Target, Send, FileSignature, ShieldAlert } from "lucide-react";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { useRouter } from "next/navigation";
import { publishTenderAction } from "@/app/actions/ai-actions";

export function PublishTrackStage({ approvalGates = [], nextStage }: { approvalGates?: any[], nextStage?: string }) {
  const router = useRouter();
  const { data, updateData } = useWorkspace();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!data.tenderDraft) return;
    
    setIsPublishing(true);
    setError(null);
    
    const result = await publishTenderAction(JSON.stringify(data.tenderDraft));
    
    setIsPublishing(false);
    
    if (result.success && result.data) {
      updateData({ publishStatus: result.data });
    } else {
      setError(result.error || "Failed to publish tender");
    }
  };

  if (!data.tenderDraft) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-slate-50 border-slate-200">
          <Target className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Tender Not Ready</h3>
          <p className="text-slate-500 max-w-md mt-2">
            You must assemble and review the tender draft before it can be published.
          </p>
        </div>
      </div>
    );
  }

  const allGatesApproved = approvalGates && approvalGates.length > 0 && approvalGates.every((gate: any) => gate.status === 'APPROVED');

  if (!allGatesApproved) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-amber-50 border-amber-200">
          <ShieldAlert className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-amber-800">Pending Approvals</h3>
          <p className="text-amber-700 max-w-md mt-2">
            You must clear all mandatory approval gates in the Approval Center before publishing this NIT to the market.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Phase 5: Publish & Track</h2>
          <p className="text-slate-500 mt-1">Push the finalized tender to procurement portals and track AI predictions.</p>
        </div>
      </div>

      {!data.publishStatus ? (
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
              <Send className="w-5 h-5 text-indigo-600" /> Ready for Publication
            </CardTitle>
            <CardDescription className="text-indigo-700/70">
              The tender "{data.tenderDraft.tenderTitle}" has cleared all legal and compliance checks.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 flex flex-col items-center py-12">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm w-full max-w-md mb-4 text-center">
                Error: {error}
              </div>
            )}
            <Button 
              onClick={handlePublish} 
              disabled={isPublishing}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-12 px-8 text-base"
            >
              {isPublishing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Publishing to Portals...</>
              ) : (
                <><Globe2 className="mr-2 h-5 w-5" /> Publish Tender</>
              )}
            </Button>
            <p className="text-sm text-slate-500 mt-2 text-center max-w-md">
              Gemini will generate the public listing summary and predict the bidder response timeline.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 bg-emerald-600 rounded-2xl text-white shadow-xl relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Tender Successfully Published</h3>
                <p className="text-emerald-100 font-medium">{data.tenderDraft.tenderReference} is now live.</p>
                <p className="text-emerald-50 text-sm mt-2 italic border-l-2 border-emerald-400 pl-3">
                  "{data.publishStatus.publishSummary}"
                </p>
              </div>
            </div>
            
            <div className="relative z-10 bg-black/20 p-4 rounded-xl border border-white/10 text-center min-w-[150px]">
              <div className="flex items-center justify-center gap-2 text-emerald-200 text-sm font-semibold mb-1 uppercase tracking-wider">
                <Timer className="w-4 h-4" /> Time Remaining
              </div>
              <div className="text-3xl font-bold tabular-nums">{data.publishStatus.predictedResponseDays}d 0h</div>
              <div className="text-xs text-emerald-200 mt-1">until bid submission closes</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <Card className="hover:border-indigo-300 transition-colors cursor-pointer group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500 font-medium uppercase tracking-wider flex items-center gap-2">
                  <Globe2 className="w-4 h-4" /> Portals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 mb-2">{data.publishStatus.recommendedPortals.length} Active</div>
                <div className="flex flex-wrap gap-2">
                  {data.publishStatus.recommendedPortals.map((portal, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700">{portal}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-indigo-300 transition-colors cursor-pointer group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500 font-medium uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600 mb-1">0</div>
                <p className="text-xs text-slate-500">Unique vendor views across portals</p>
              </CardContent>
            </Card>

            <Card className="hover:border-indigo-300 transition-colors cursor-pointer group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500 font-medium uppercase tracking-wider flex items-center gap-2">
                  <DownloadCloud className="w-4 h-4" /> Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 mb-1">0</div>
                <p className="text-xs text-slate-500">Vendors have downloaded the NIT</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-indigo-200">
            <CardHeader className="bg-indigo-50/50 pb-4 border-b border-indigo-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" /> AI Bid Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-700 mb-4">
                Based on current market conditions and the complexity of this tender, Gemini predicts:
              </p>
              <ul className="space-y-3 text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> We expect {data.marketData?.vendorFunnel.eligibleVendors || "4-6"} final bids to be submitted.</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bidders will likely require the full {data.publishStatus.predictedResponseDays} days to respond.</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                  <FileSignature className="mr-2 w-5 h-5" /> View Published NIT Document
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] xl:w-[90vw] max-w-[95vw] h-[90vh] rounded-2xl overflow-hidden p-0 bg-white flex flex-col shadow-2xl">
                {/* Header Bar */}
                <div className="h-16 border-b border-slate-100 bg-white/90 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
                  <div className="flex items-center gap-3">
                    <FileSignature className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-slate-500 text-sm">NIT Document Viewer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hidden sm:inline-flex">Published</Badge>
                    <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2 text-slate-600 hover:text-slate-900">
                      <DownloadCloud className="w-4 h-4" /> 
                      <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                    <DialogClose asChild>
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">Close</Button>
                    </DialogClose>
                  </div>
                </div>

                {/* Main Readable Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 scroll-smooth bg-white selection:bg-indigo-100">
                  <div className="max-w-6xl mx-auto">
                    {/* Document Title Header */}
                    <div className="mb-16">
                      <div className="text-indigo-600 font-semibold tracking-wider text-sm uppercase mb-4">Notice Inviting Tender</div>
                      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                        {data.tenderDraft.tenderTitle}
                      </h1>
                    </div>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8 border-y border-slate-100 mb-16">
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Tender Ref No.</div>
                        <div className="font-medium text-slate-900">{data.tenderDraft.tenderReference}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Estimated Cost</div>
                        <div className="font-medium text-slate-900">₹{data.estimatedBudgetCr || data.marketData?.marketPredictionCr} Crores</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Bidding Method</div>
                        <div className="font-medium text-slate-900">{data.tenderDraft.biddingMethod}</div>
                      </div>
                    </div>

                    {/* SOW */}
                    <div className="mb-16">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Scope of Work</h2>
                      <p className="text-lg text-slate-700 leading-relaxed mb-8 whitespace-pre-wrap">
                        {data.tenderDraft.scopeOfWork}
                      </p>
                      
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Key Deliverables</h3>
                      <ul className="list-none space-y-4">
                        {data.tenderDraft.keyDeliverables.map((item, idx) => (
                          <li key={idx} className="flex gap-4">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">{idx + 1}</span>
                            <span className="text-slate-700 text-lg leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* PQ Criteria */}
                    {data.tenderDraft.preQualificationCriteria && (
                      <div className="mb-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 border-t border-slate-100 pt-16">Pre-Qualification Criteria</h2>
                        <div className="space-y-8">
                          {data.tenderDraft.preQualificationCriteria.map((criterion: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100/50">
                              <Badge variant="outline" className="mb-4 bg-white text-indigo-700 border-indigo-200 uppercase tracking-widest text-[10px]">
                                {criterion.category}
                              </Badge>
                              <h4 className="text-xl font-semibold text-slate-900 mb-3">{criterion.criterion}</h4>
                              <p className="text-slate-600 text-base leading-relaxed">{criterion.justification}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BOQ Table (allowed to be wider than 3xl) */}
                  {data.tenderDraft.financialBidFormat && (
                    <div className="max-w-5xl mx-auto mb-32 border-t border-slate-100 pt-16">
                      <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center md:text-left">Financial Bid Format</h2>
                      <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                        <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                            <tr>
                              <th className="px-6 py-5">S.No.</th>
                              <th className="px-6 py-5 min-w-[300px]">Item Description</th>
                              <th className="px-6 py-5 text-center">Quantity</th>
                              <th className="px-6 py-5 text-center">Unit</th>
                              <th className="px-6 py-5 text-right">Unit Rate (₹)</th>
                              <th className="px-6 py-5 text-right">Total Amount (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {data.tenderDraft.financialBidFormat.map((item: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-5 font-medium text-slate-400">{idx + 1}</td>
                                <td className="px-6 py-5 text-slate-800 whitespace-normal leading-relaxed">{item.itemDescription}</td>
                                <td className="px-6 py-5 text-center font-semibold text-slate-900">{item.quantity}</td>
                                <td className="px-6 py-5 text-center text-slate-500">{item.unit}</td>
                                <td className="px-6 py-5 text-right text-slate-400 italic">To be quoted</td>
                                <td className="px-6 py-5 text-right text-slate-400 italic">To be quoted</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {nextStage && (
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button 
                onClick={() => router.push(`?stage=${nextStage}`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Continue to Tender Issuance
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
