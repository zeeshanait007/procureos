"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, CheckCircle2, ChevronRight, FileText, Landmark, Loader2, Sparkles, XCircle } from "lucide-react";
import { evaluatePreQualificationAction } from "@/app/actions/ai-actions";

export function PreQualification({ caseId }: { caseId?: string }) {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [filterCaseId, setFilterCaseId] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [aiEvaluating, setAiEvaluating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    fetchApplications();
  }, [caseId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const url = caseId ? `/api/pre-qualification?caseId=${caseId}` : `/api/pre-qualification`;
      const res = await fetch(url);
      const data = await res.json();
      setApplications(data);
      if (data.length > 0) setSelectedApp(data[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runAiEvaluation = async () => {
    if (!selectedApp) return;
    setAiEvaluating(true);
    setAiResult(null);
    try {
      // Mock criteria for the demo (normally fetched from the case)
      const pqCriteria = [
        { title: "Financial Turnover", description: "Average annual turnover of at least $2M in the last 3 financial years." },
        { title: "Prior Experience", description: "Successful completion of at least 2 similar predictive maintenance projects in the last 5 years." }
      ];
      
      const contractorData = {
        orgStructure: JSON.parse(selectedApp.orgStructureData || '{}'),
        financialStability: JSON.parse(selectedApp.financialStabilityData || '{}')
      };

      const result = await evaluatePreQualificationAction(contractorData, pqCriteria);
      setAiResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAiEvaluating(false);
    }
  };

  const handleDecision = async (status: 'SHORTLISTED' | 'REJECTED') => {
    if (!selectedApp) return;
    try {
      await fetch(`/api/pre-qualification/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status,
          evalComments: aiResult?.summary || 'Manual decision',
          evalScore: aiResult?.score || null
        })
      });
      await fetchApplications();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>;
  }

  const uniqueCases = Array.from(new Set(applications.filter(a => a.case).map(a => a.case.id)))
    .map(id => applications.find(a => a.case?.id === id)?.case);

  const displayedApplications = filterCaseId === 'ALL' 
    ? applications 
    : applications.filter(a => a.caseId === filterCaseId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {caseId ? "Contractor Pre-Qualification" : "Global Contractor Pipeline"}
        </h2>
        <p className="text-sm text-slate-500">
          {caseId 
            ? "Review and evaluate incoming contractor applications against your specified criteria."
            : "Monitor and evaluate all incoming contractor applications across active procurements."}
        </p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-220px)] min-h-[600px]">
        {/* Left Side: Contractor List */}
        <div className="w-1/3 flex flex-col gap-3">
          <div className="font-semibold text-sm text-slate-700 flex flex-col gap-3 px-1">
            <div className="flex justify-between items-center">
              <span>Applicants ({displayedApplications.length})</span>
            </div>
            
            {!caseId && uniqueCases.length > 0 && (
              <select 
                className="w-full text-sm border-slate-200 rounded-md bg-white p-2 text-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterCaseId}
                onChange={(e) => {
                  setFilterCaseId(e.target.value);
                  setSelectedApp(null);
                  setAiResult(null);
                }}
              >
                <option value="ALL">All Active Procurements</option>
                {uniqueCases.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            )}
          </div>
          <ScrollArea className="flex-1 -mx-1 px-1 mt-2">
            <div className="space-y-2 pb-4">
              {displayedApplications.map(app => (
                <button
                  key={app.id}
                  onClick={() => { setSelectedApp(app); setAiResult(null); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selectedApp?.id === app.id
                      ? "bg-white border-indigo-200 shadow-[0_2px_12px_-4px_rgba(79,70,229,0.15)] ring-1 ring-indigo-50"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900 truncate pr-2">{app.contractor.name}</h3>
                    {app.status === 'PENDING' && <Badge variant="outline" className="bg-slate-50 text-slate-500 text-[10px]">Pending</Badge>}
                    {app.status === 'SHORTLISTED' && <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Shortlisted</Badge>}
                    {app.status === 'REJECTED' && <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">Rejected</Badge>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[12px] text-slate-500 truncate">{app.contractor.country}</p>
                    {!caseId && app.case && (
                      <p className="text-[11px] font-medium text-indigo-600 truncate mt-1 bg-indigo-50/50 p-1 rounded">
                        {app.case.title}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side: Evaluation Dashboard */}
        {selectedApp ? (
          <Card className="w-2/3 flex flex-col overflow-hidden border-slate-200 shadow-sm">
            <div className="border-b border-slate-100 p-6 bg-slate-50/50 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedApp.contractor.name}</h2>
                <div className="flex gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Reg: {selectedApp.contractor.registrationNo}</span>
                  <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> Email: {selectedApp.contractor.contactEmail}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="h-8 border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => handleDecision('REJECTED')}>Reject</Button>
                <Button className="h-8 bg-indigo-600 hover:bg-indigo-700" onClick={() => handleDecision('SHORTLISTED')}>Shortlist</Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Org Structure */}
                <div className="border rounded-xl p-5 bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    Organizational Structure
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(JSON.parse(selectedApp.orgStructureData || '{}')).map(([k, v]) => (
                      <div key={k}>
                        <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-sm text-slate-900">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financials */}
                <div className="border rounded-xl p-5 bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-500" />
                    Financial Stability
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(JSON.parse(selectedApp.financialStabilityData || '{}')).map(([k, v]) => (
                      <div key={k}>
                        <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-sm text-slate-900">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Evaluation Section */}
              <div className="border rounded-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      AI Pre-Qualification Analysis
                    </h3>
                    <p className="text-[13px] text-indigo-700/70 mt-1">
                      Evaluate submitted documents against tender criteria.
                    </p>
                  </div>
                  {!aiResult && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      onClick={runAiEvaluation}
                      disabled={aiEvaluating}
                    >
                      {aiEvaluating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : "Run AI Evaluation"}
                    </Button>
                  )}
                </div>

                {aiResult && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                      <div className="flex-1">
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recommendation</span>
                        <div className="flex items-center gap-2">
                          {aiResult.recommendation === 'SHORTLIST' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-rose-500" />}
                          <span className={`font-semibold ${aiResult.recommendation === 'SHORTLIST' ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {aiResult.recommendation}
                          </span>
                        </div>
                      </div>
                      <div className="w-px h-12 bg-slate-200" />
                      <div className="flex-1 px-4">
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confidence Score</span>
                        <div className="flex items-end gap-1">
                          <span className="text-2xl font-bold text-slate-900 leading-none">{aiResult.score}</span>
                          <span className="text-sm font-medium text-slate-500 mb-0.5">/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Evaluation Summary</span>
                      <p className="text-[13px] text-slate-700 leading-relaxed">
                        {aiResult.summary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        ) : (
          <div className="w-2/3 flex items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-sm text-slate-500">Select a contractor to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
