"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, CheckCircle2, FileText, Loader2, Send, ShieldCheck, Mail } from "lucide-react";
import { WorkspaceContext } from "@/components/workspace/workspace-provider";
import { useContext } from "react";

export function TenderIssuance({ caseId }: { caseId?: string }) {
  const context = useContext(WorkspaceContext);
  const [shortlisted, setShortlisted] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [issued, setIssued] = useState((context?.data as any)?.tenderIssued || false);
  const [filterCaseId, setFilterCaseId] = useState<string>('');

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        const url = caseId ? `/api/pre-qualification?caseId=${caseId}` : `/api/pre-qualification`;
        const res = await fetch(url);
        const apps = await res.json();
        const short = apps.filter((a: any) => a.status === 'SHORTLISTED');
        setShortlisted(short);
        
        // Auto-select first case if in global mode
        if (!caseId && short.length > 0) {
          const firstCaseId = short[0].caseId;
          setFilterCaseId(firstCaseId);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchShortlisted();
  }, [caseId]);

  const handleIssueTender = async () => {
    setIssuing(true);
    // Simulate API call to package and email tender documents
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIssuing(false);
    setIssued(true);
    if (context) {
      context.updateData({ tenderIssued: true, issuedAt: new Date().toISOString() });
    }
  };

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>;
  }

  const uniqueCases = Array.from(new Set(shortlisted.filter(a => a.case).map(a => a.case.id)))
    .map(id => shortlisted.find(a => a.case?.id === id)?.case);

  const displayedShortlisted = caseId 
    ? shortlisted 
    : shortlisted.filter(a => a.caseId === filterCaseId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1.5 text-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tender Issuance</h2>
        <p className="text-sm text-slate-500">
          Securely distribute the final NIT documents to the pre-qualified contractors.
        </p>
      </div>

      {!caseId && uniqueCases.length > 0 && (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 text-center">Select Active Procurement</label>
            <select 
              className="w-full text-sm border-slate-300 rounded-md bg-white p-2.5 text-slate-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={filterCaseId}
              onChange={(e) => {
                setFilterCaseId(e.target.value);
                setIssued(false);
              }}
            >
              {uniqueCases.map((c: any) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <Card className="p-8 border-slate-200 shadow-sm bg-white">
        {!issued ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-indigo-600" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ready for Distribution</h3>
            <p className="text-sm text-slate-500 text-center max-w-md mb-8">
              There are {displayedShortlisted.length} contractors who have successfully passed the Pre-Qualification phase for this tender.
            </p>

            <div className="w-full border rounded-xl overflow-hidden mb-8">
              <div className="bg-slate-50 px-4 py-3 border-b text-sm font-semibold text-slate-700">
                Eligible Recipients ({displayedShortlisted.length})
              </div>
              <ScrollArea className="max-h-[300px]">
                <div className="divide-y divide-slate-100">
                  {displayedShortlisted.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No contractors have been shortlisted for this case yet.
                    </div>
                  ) : (
                    displayedShortlisted.map((app) => (
                      <div key={app.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{app.contractor.name}</p>
                            <p className="text-xs text-slate-500">{app.contractor.contactEmail}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Pre-Qualified
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            <Button 
              size="lg" 
              onClick={handleIssueTender} 
              disabled={issuing || displayedShortlisted.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full max-w-sm h-12 text-base font-semibold shadow-sm"
            >
              {issuing ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Packaging Documents...</>
              ) : (
                <><Send className="w-5 h-5 mr-2" /> Issue Tender Documents</>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10 text-emerald-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Tender Issued Successfully</h3>
            <p className="text-slate-500 text-center max-w-md mb-8">
              The Notice Inviting Tender (NIT) and all associated technical documents have been securely encrypted and delivered to {displayedShortlisted.length} pre-qualified contractors.
            </p>

            <div className="w-full max-w-sm border rounded-xl bg-slate-50 p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Recipients</span>
                <span className="font-semibold text-slate-900">{displayedShortlisted.length} Contractors</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Document Hash</span>
                <span className="font-mono text-xs text-slate-900 bg-slate-200/50 px-2 py-1 rounded">0x8f4a...29b1</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Issued On</span>
                <span className="font-semibold text-slate-900">{new Date((context?.data as any)?.issuedAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
