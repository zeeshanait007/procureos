"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Ambiguity {
  issue: string;
  suggestion: string;
}

export interface MarketData {
  marketPredictionCr: number;
  variancePercentage: number;
  sources: string[];
  itemizedCosts: {
    component: string;
    marketAvg: string;
    ourEst: string;
  }[];
  vendorFunnel: {
    eligibleVendors: string;
    totalPool: number;
    passFinancial: number;
    passTechnical: number;
  };
}

export interface TenderDraft {
  tenderTitle: string;
  tenderReference: string;
  biddingMethod: string;
  scopeOfWork: string;
  keyDeliverables: string[];
  preQualificationCriteria?: any[];
  financialBidFormat?: any[];
}

export interface ComplianceAlert {
  id: string;
  title: string;
  description: string;
  suggestedClause: string;
}

export interface PublishStatus {
  publishSummary: string;
  predictedResponseDays: number;
  recommendedPortals: string[];
}

export interface WorkspaceData {
  caseId: string | null;
  rawInput: string;
  structuredRequirements: string;
  objective?: string;
  ambiguities: Ambiguity[];
  clarityScore: number;
  estimatedBudgetCr: number | null;
  marketData: MarketData | null;
  tenderDraft: TenderDraft | null;
  complianceAlerts: ComplianceAlert[];
  publishStatus: PublishStatus | null;
}

interface WorkspaceContextType {
  data: WorkspaceData;
  setData: React.Dispatch<React.SetStateAction<WorkspaceData>>;
  updateData: (updates: Partial<WorkspaceData>) => void;
  saveCheckpoint: (stageName: string) => Promise<boolean>;
  isSaving: boolean;
}

const defaultData: WorkspaceData = {
  caseId: null,
  rawInput: "",
  structuredRequirements: "",
  ambiguities: [],
  clarityScore: 0,
  estimatedBudgetCr: null,
  marketData: null,
  tenderDraft: null,
  complianceAlerts: [],
  publishStatus: null,
};

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

import { useRouter } from "next/navigation";

export function WorkspaceProvider({ children, initialData }: { children: React.ReactNode, initialData?: Partial<WorkspaceData> }) {
  const [data, setData] = useState<WorkspaceData>({ ...defaultData, ...initialData });
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const updateData = (updates: Partial<WorkspaceData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const saveCheckpoint = async (stageName: string) => {
    if (!data.caseId) return false;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/cases/${data.caseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceData: JSON.stringify(data),
        }),
      });
      setIsSaving(false);
      if (response.ok) {
        router.refresh();
      }
      return response.ok;
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      return false;
    }
  };

  return (
    <WorkspaceContext.Provider value={{ data, setData, updateData, saveCheckpoint, isSaving }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
