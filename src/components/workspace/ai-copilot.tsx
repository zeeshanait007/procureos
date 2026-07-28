"use client";

import { useState } from "react";
import { Bot, Sparkles, Send, X, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AiCopilot() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all duration-300"
        >
          <MessageSquarePlus className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-700">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">ProcureOS Copilot</h3>
            <p className="text-xs text-slate-500">Procurement Case Expert</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-500 hover:bg-slate-100">
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-indigo-700" />
            </div>
            <div className="bg-white border rounded-lg p-3 shadow-sm text-slate-700 text-[13px] leading-relaxed">
              <p>Hi! I'm your ProcureOS Copilot. I've analyzed the <span className="font-semibold">Business Problem</span> from the previous stage.</p>
              <p className="mt-2">I have drafted an initial set of technical and business requirements for the <span className="italic">AI-Based Procurement Intelligence Platform</span>.</p>
              <p className="mt-2">You can review them in the center panel, or ask me to make modifications.</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 px-1">Suggested Actions</p>
            <Button variant="outline" className="justify-start text-left h-auto py-2.5 px-3 text-xs text-indigo-700 bg-indigo-50/50 border-indigo-200 hover:bg-indigo-100/50">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500 shrink-0" />
              Make requirements more measurable
            </Button>
            <Button variant="outline" className="justify-start text-left h-auto py-2.5 px-3 text-xs text-indigo-700 bg-indigo-50/50 border-indigo-200 hover:bg-indigo-100/50">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500 shrink-0" />
              Check alignment with Business Problem
            </Button>
            <Button variant="outline" className="justify-start text-left h-auto py-2.5 px-3 text-xs text-indigo-700 bg-indigo-50/50 border-indigo-200 hover:bg-indigo-100/50">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500 shrink-0" />
              Score these requirements
            </Button>
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t bg-white">
        <form className="flex gap-2">
          <Input 
            placeholder="Ask about this procurement..." 
            className="text-sm bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 rounded-full px-4"
          />
          <Button type="submit" size="icon" className="shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
