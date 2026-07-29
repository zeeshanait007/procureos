"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <button 
      onClick={handleLogout}
      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      title="Sign Out"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
