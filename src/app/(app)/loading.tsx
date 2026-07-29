import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-50/30">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-white p-3 shadow-sm border border-slate-100">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading data...</p>
      </div>
    </div>
  );
}
