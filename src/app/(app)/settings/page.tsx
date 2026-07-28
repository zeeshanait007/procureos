"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Shield, Building, Key, Activity, Mail } from "lucide-react";
import { useState } from "react";

export default function AdministrationPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50/50">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Administration Settings</h1>
              <p className="text-slate-500 mt-1">Manage system configurations, access controls, and organization details.</p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
            </div>
          </div>

          <div className="flex gap-8 mt-8">
            {/* Sidebar navigation for settings */}
            <div className="w-64 shrink-0 space-y-1">
              <button 
                onClick={() => setActiveTab("general")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "general" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"}`}
              >
                <Building className="w-4 h-4" /> General Settings
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "users" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"}`}
              >
                <Users className="w-4 h-4" /> User Management
              </button>
              <button 
                onClick={() => setActiveTab("roles")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "roles" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"}`}
              >
                <Shield className="w-4 h-4" /> Roles & Permissions
              </button>
              <button 
                onClick={() => setActiveTab("api")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "api" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"}`}
              >
                <Key className="w-4 h-4" /> API & Integrations
              </button>
              <button 
                onClick={() => setActiveTab("logs")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "logs" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"}`}
              >
                <Activity className="w-4 h-4" /> Audit Logs
              </button>
            </div>

            {/* Main content area */}
            <div className="flex-1 space-y-6">
              {activeTab === "general" && (
                <Card className="border-slate-200 shadow-sm animate-in fade-in duration-300">
                  <CardHeader className="border-b border-slate-100 bg-white rounded-t-xl">
                    <CardTitle className="text-lg">Organization Profile</CardTitle>
                    <CardDescription>Update your company details and global preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Organization Name</label>
                      <input type="text" defaultValue="Acme Corporation" className="w-full h-10 px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Primary Domain</label>
                      <input type="text" defaultValue="acme.com" className="w-full h-10 px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Default Currency</label>
                      <select className="w-full h-10 px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                        <option>INR - Indian Rupee</option>
                        <option>USD - US Dollar</option>
                        <option>EUR - Euro</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "users" && (
                <Card className="border-slate-200 shadow-sm animate-in fade-in duration-300">
                  <CardHeader className="border-b border-slate-100 bg-white rounded-t-xl flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">User Directory</CardTitle>
                      <CardDescription>Manage active users and their assignments.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">Invite User</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {[
                        { name: "Alice (Business Head)", email: "alice@acme.com", role: "Business Head" },
                        { name: "Bob (Finance)", email: "bob@acme.com", role: "Finance Authority" },
                        { name: "Charlie (CPO)", email: "charlie@acme.com", role: "Procurement Head" },
                        { name: "Diana (CIO)", email: "diana@acme.com", role: "Technical Committee" },
                      ].map((u, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-slate-50 text-slate-600">{u.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(activeTab === "roles" || activeTab === "api" || activeTab === "logs") && (
                <div className="flex flex-col items-center justify-center h-64 bg-white border border-slate-200 border-dashed rounded-xl animate-in fade-in duration-300">
                  <Settings className="w-10 h-10 text-slate-300 mb-3" />
                  <h3 className="text-lg font-medium text-slate-900">Module Configuration</h3>
                  <p className="text-sm text-slate-500 max-w-md text-center mt-1">This administration module is fully functional via API. The UI dashboard configuration will be available in the upcoming release.</p>
                  <Button variant="outline" className="mt-4">Read Documentation</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
