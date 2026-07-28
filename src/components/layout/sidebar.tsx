"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  Settings,
  Briefcase,
  LifeBuoy,
  CheckSquare,
} from "lucide-react";

export function Sidebar({ currentUser }: { currentUser?: any }) {
  const pathname = usePathname() || "";
  const isAdmin = currentUser?.role?.name === "Platform Owner" || currentUser?.role?.name === "Business Head";

  return (
    <div className="flex h-screen w-[260px] flex-col border-r border-slate-200 bg-slate-50/50 text-slate-600 shrink-0">
      <div className="flex h-16 items-center px-5 shrink-0">
        <h1 className="text-[15px] font-bold text-slate-900 tracking-wide flex items-center gap-2.5">
          <div className="bg-indigo-600 p-1.5 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs leading-none">❖</span>
          </div>
          ProcureOS
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-6">
          <div>
            <h3 className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Core Platform</h3>
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/dashboard" 
                  className={`flex items-center gap-3 px-2.5 py-2 text-[13px] font-medium rounded-md transition-colors ${
                    pathname === "/dashboard" 
                      ? "bg-slate-200/50 text-slate-900" 
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-indigo-600"
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${pathname === "/dashboard" ? "text-indigo-600" : "text-slate-400"}`} /> Command Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/cases" 
                  className={`flex items-center gap-3 px-2.5 py-2 text-[13px] font-medium rounded-md transition-colors ${
                    pathname.startsWith("/cases") 
                      ? "bg-slate-200/50 text-slate-900" 
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-indigo-600"
                  }`}
                >
                  <Briefcase className={`w-4 h-4 ${pathname.startsWith("/cases") ? "text-indigo-600" : "text-slate-400"}`} /> Active Procurements
                </Link>
              </li>
              <li>
                <Link 
                  href="/approvals" 
                  className={`flex items-center gap-3 px-2.5 py-2 text-[13px] font-medium rounded-md transition-colors ${
                    pathname.startsWith("/approvals") 
                      ? "bg-slate-200/50 text-slate-900" 
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-indigo-600"
                  }`}
                >
                  <CheckSquare className={`w-4 h-4 ${pathname.startsWith("/approvals") ? "text-indigo-600" : "text-slate-400"}`} /> Approval Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Intelligence</h3>
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/risk-radar" 
                  className={`flex items-center gap-3 px-2.5 py-2 text-[13px] font-medium rounded-md transition-colors ${
                    pathname.startsWith("/risk-radar") 
                      ? "bg-slate-200/50 text-slate-900" 
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-indigo-600"
                  }`}
                >
                  <ShieldAlert className={`w-4 h-4 ${pathname.startsWith("/risk-radar") ? "text-indigo-600" : "text-slate-400"}`} /> Risk Radar
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      
      <div className="p-3 px-4 shrink-0">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="absolute inset-0 rounded-full border border-emerald-500 animate-ping opacity-50"></div>
            </div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">All Systems Operational</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">AI Agents are online and processing data.</p>
        </div>
      </div>
      
      <div className="p-3 border-t border-slate-200 space-y-1 bg-slate-50/80">
        {isAdmin && (
          <Link 
            href="/settings" 
            className={`flex items-center gap-3 px-2.5 py-2 text-[13px] font-medium rounded-md transition-colors ${
              pathname.startsWith("/settings") 
                ? "bg-slate-200/50 text-slate-900" 
                : "text-slate-600 hover:bg-slate-200/50 hover:text-indigo-600"
            }`}
          >
            <Settings className={`w-4 h-4 ${pathname.startsWith("/settings") ? "text-indigo-600" : "text-slate-400"}`} /> Administration
          </Link>
        )}
        <Link 
          href="/help" 
          className={`flex items-center gap-3 px-2.5 py-2 text-[13px] font-medium rounded-md transition-colors ${
            pathname.startsWith("/help") 
              ? "bg-slate-200/50 text-slate-900" 
              : "text-slate-600 hover:bg-slate-200/50 hover:text-indigo-600"
          }`}
        >
          <LifeBuoy className={`w-4 h-4 ${pathname.startsWith("/help") ? "text-indigo-600" : "text-slate-400"}`} /> Help & Support
        </Link>
        
        {currentUser && (
          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center px-2 py-2 rounded-lg hover:bg-slate-200/50 cursor-pointer transition-colors group">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{currentUser.name.split(' ')[0]}</p>
              <p className="text-[11px] text-slate-500 truncate">{currentUser.role?.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
