"use client";
import { useState, useTransition } from "react";
import { CheckCircle2, CircleDashed, ArrowRightCircle, Lock, AlertTriangle, ShieldCheck, FileCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const CREATION_STAGES = [
  { id: "REQUIREMENT_INTELLIGENCE", name: "Requirement Intelligence" },
  { id: "MARKET_BENCHMARKING", name: "Market Benchmarking" },
  { id: "AI_TENDER_ASSEMBLY", name: "AI Tender Assembly" },
  { id: "COMPLIANCE_REVIEW", name: "Compliance Review" },
  { id: "PUBLISH_TRACK", name: "Publish & Track" },
];

function getGateIcon(status: string) {
  switch (status) {
    case 'APPROVED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case 'SUBMITTED': return <ArrowRightCircle className="w-4 h-4 text-amber-500" />;
    case 'CHANGES_REQUESTED': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    case 'LOCKED': return <Lock className="w-4 h-4 text-slate-300" />;
    default: return <CircleDashed className="w-4 h-4 text-slate-300" />;
  }
}

function getGateBadge(status: string) {
  switch (status) {
    case 'APPROVED': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[9px] px-1.5 py-0">Approved</Badge>;
    case 'SUBMITTED': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 uppercase text-[9px] px-1.5 py-0">Pending</Badge>;
    case 'CHANGES_REQUESTED': return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 uppercase text-[9px] px-1.5 py-0">Changes Req</Badge>;
    case 'LOCKED': return <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 uppercase text-[9px] px-1.5 py-0">Locked</Badge>;
    default: return null;
  }
}

export function StageNavigation({ activeStage, activeGate, gates = [] }: { activeStage?: string, activeGate?: string, gates?: any[] }) {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  // Clear loading state when search parameters change (navigation completes)
  // useTransition handles pending state, but we manually track which link was clicked
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setLoadingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#FBFBFC]">
      <div className="px-5 h-16 border-b border-slate-200 bg-white flex flex-col justify-center shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-indigo-700 bg-indigo-50 border border-indigo-100 text-[9px] font-bold tracking-widest uppercase">
            Governance & Execution
          </div>
        </div>
        <h3 className="font-semibold text-slate-900 text-[13px] leading-tight">Procurement Lifecycle</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 py-6">
        <div className="relative">
          {/* Vertical connection line */}
          <div className="absolute left-[1.125rem] top-4 bottom-6 w-px bg-slate-200" />
          
          <div className="space-y-6">
            
            {/* Phase 1: Creation */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-9 mb-3">Workspace Stages</h4>
              {CREATION_STAGES.map((stage, index) => {
                const isActive = stage.id === activeStage;
                const href = `?stage=${stage.id}`;
                const isLoading = isPending && loadingHref === href;
                
                return (
                  <a
                    key={stage.id}
                    href={href}
                    onClick={(e) => handleNav(e, href)}
                    className={`group relative flex items-start gap-3 p-2 -mx-2 rounded-lg transition-all duration-200 ${
                      isActive ? "bg-white shadow-sm border border-slate-200" : "hover:bg-slate-200/50 opacity-80 hover:opacity-100 cursor-pointer"
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-center w-5 h-5 mt-0.5 rounded-full bg-[#FBFBFC] transition-colors duration-200">
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                      ) : isActive ? (
                        <div className="relative flex items-center justify-center">
                          <ArrowRightCircle className="w-5 h-5 text-indigo-600 fill-indigo-50" />
                        </div>
                      ) : (
                        <CircleDashed className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <span className={`block text-[13px] font-semibold truncate transition-colors duration-200 ${isActive ? "text-indigo-900" : "text-slate-600"}`}>
                        {stage.name}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Phase 2: Governance Gates */}
            <div className="space-y-2 pt-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-9 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Approval Gates
              </h4>
              {gates.map((gate) => {
                const isActive = gate.gateType === activeGate;
                const href = `?gate=${gate.gateType}`;
                const isLoading = isPending && loadingHref === href;
                
                return (
                  <a
                    key={gate.id}
                    href={href}
                    onClick={(e) => handleNav(e, href)}
                    className={`group relative flex items-start gap-3 p-2 -mx-2 rounded-lg transition-all duration-200 ${
                      isActive ? "bg-indigo-50 border border-indigo-200 shadow-sm" : "hover:bg-slate-200/50 opacity-90 hover:opacity-100 cursor-pointer"
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-center w-5 h-5 mt-0.5 rounded-full bg-[#FBFBFC] transition-colors duration-200">
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                      ) : (
                        getGateIcon(gate.status)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className={`block text-[13px] font-semibold truncate transition-colors duration-200 ${isActive ? "text-indigo-900" : "text-slate-700"}`}>
                        {gate.gateName}
                      </span>
                      {getGateBadge(gate.status)}
                    </div>
                  </a>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
