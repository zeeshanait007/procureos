"use client";

import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { useState } from "react";

export function WorkspaceHeaderActions({ currentStageId }: { currentStageId: string }) {
  const { saveCheckpoint, isSaving } = useWorkspace();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSave = async () => {
    setSaveStatus("idle");
    const success = await saveCheckpoint(currentStageId);
    
    if (success) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } else {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSave} 
        disabled={isSaving}
        className={`h-8 text-xs ${saveStatus === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : saveStatus === "error" ? "bg-rose-50 text-rose-700 border-rose-200" : ""}`}
      >
        {isSaving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
        {saveStatus === "success" ? "Saved!" : saveStatus === "error" ? "Error Saving" : "Save Checkpoint"}
      </Button>

      <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md flex items-center gap-1.5 border border-emerald-200 shadow-sm uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Copilot Active
      </span>
    </div>
  );
}
