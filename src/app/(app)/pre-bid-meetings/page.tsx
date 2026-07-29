import { PreBidDashboard } from "@/components/workspace/stages/pre-bid-dashboard";
import { Calendar } from "lucide-react";

export default function GlobalPreBidMeetingsPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-slate-50">
      <div className="h-16 border-b border-slate-200 px-6 bg-white sticky top-0 z-10 flex items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 truncate">
              Global Pre-Bid Meetings
            </h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Schedule Meetings and Manage Contractor Queries
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <PreBidDashboard />
      </div>
    </div>
  );
}
