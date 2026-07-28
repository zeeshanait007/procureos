"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, LifeBuoy, FileText, Video, ExternalLink, MessageSquare, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function HelpSupportPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50/50">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto py-8">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-2">
              <LifeBuoy className="w-8 h-8 text-indigo-700" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">How can we help you today?</h1>
            <p className="text-slate-500 text-lg">Browse our knowledge base, read the governance guides, or get in touch with our enterprise support team.</p>
            
            <div className="relative max-w-xl mx-auto mt-6">
              <input 
                type="text" 
                placeholder="Search for articles, guides, or troubleshooting..." 
                className="w-full h-12 pl-12 pr-4 rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              />
              <div className="absolute left-4 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">User Manuals</h3>
                  <p className="text-sm text-slate-500 mt-1">Detailed guides on using the AI Copilot and managing your procurement cases.</p>
                </div>
                <div className="pt-2">
                  <span className="text-blue-600 text-sm font-semibold flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Browse Guides <ExternalLink className="w-3 h-3" /></span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Governance Policies</h3>
                  <p className="text-sm text-slate-500 mt-1">Read the updated compliance and statutory regulations for e-Tendering.</p>
                </div>
                <div className="pt-2">
                  <span className="text-purple-600 text-sm font-semibold flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Read Policies <ExternalLink className="w-3 h-3" /></span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Video Tutorials</h3>
                  <p className="text-sm text-slate-500 mt-1">Watch step-by-step videos on how to navigate the Approval Gates workflow.</p>
                </div>
                <div className="pt-2">
                  <span className="text-emerald-600 text-sm font-semibold flex items-center justify-center gap-1 group-hover:gap-2 transition-all">Watch Videos <ExternalLink className="w-3 h-3" /></span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 mt-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 flex-1">
              <h2 className="text-2xl font-bold">Still need help?</h2>
              <p className="text-slate-400 max-w-lg">Our enterprise support team is available 24/7 to assist you with critical procurement issues or technical difficulties.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 h-12 px-6 font-semibold">
                <MessageSquare className="w-4 h-4 mr-2" /> Open a Ticket
              </Button>
              <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-white h-12 px-6 font-semibold">
                <PhoneCall className="w-4 h-4 mr-2" /> 1-800-PROCURE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
