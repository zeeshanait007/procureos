"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send, X, MessageSquarePlus, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useChat } from '@ai-sdk/react';

export function AiCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, setMessages, status, sendMessage } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your Procoryx Copilot. I've analyzed the Business Problem from the previous stage. You can ask me to draft requirements, score clarity, or analyze market benchmarks!"
      }
    ],
    onError: (error) => {
      if (setMessages) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: "⚠️ **Connection Error**: I couldn't reach the Gemini API (please check if GOOGLE_GENERATIVE_AI_API_KEY is set in your environment).\n\n*Demo Fallback*: Based on my analysis, procuring these telemetry-enabled refractory bricks will reduce your dead stock capital lockup by precisely the 55% projected in the business case!"
          }
        ]);
      }
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ role: 'user', content: input });
    setInput("");
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleSuggestedAction = (action: string) => {
    if (sendMessage) {
      sendMessage({
        id: Date.now().toString(),
        role: 'user',
        content: action,
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm relative z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-700">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Procoryx Copilot</h3>
            <p className="text-xs text-slate-500">Procurement Case Expert</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-500 hover:bg-slate-100">
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 text-sm ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`border rounded-lg p-3 shadow-sm text-[13px] leading-relaxed whitespace-pre-wrap max-w-[80%] ${m.role === 'user' ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-700'}`}>
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-indigo-700" />
              </div>
              <div className="bg-white border rounded-lg p-3 shadow-sm text-slate-700 text-[13px] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> Thinking...
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="flex flex-col gap-2 mt-6">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 px-1">Suggested Actions</p>
              <Button onClick={() => handleSuggestedAction("Help me make my requirements more measurable")} variant="outline" className="justify-start text-left h-auto py-2.5 px-3 text-xs text-indigo-700 bg-indigo-50/50 border-indigo-200 hover:bg-indigo-100/50">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500 shrink-0" />
                Make requirements more measurable
              </Button>
              <Button onClick={() => handleSuggestedAction("Check alignment of the current tender with the Business Problem")} variant="outline" className="justify-start text-left h-auto py-2.5 px-3 text-xs text-indigo-700 bg-indigo-50/50 border-indigo-200 hover:bg-indigo-100/50">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500 shrink-0" />
                Check alignment with Business Problem
              </Button>
            </div>
          )}

          {!isLoading && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">Sample Questions</p>
              <div className="flex overflow-x-auto pb-2 gap-2 snap-x scrollbar-hide -mx-1 px-1">
                <Badge onClick={() => handleSuggestedAction("What are the standard market rates for this?")} className="shrink-0 snap-start cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium py-1.5 px-3 rounded-full shadow-sm transition-all hover:shadow-md">Market rates?</Badge>
                <Badge onClick={() => handleSuggestedAction("Can you summarize the scope of work?")} className="shrink-0 snap-start cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium py-1.5 px-3 rounded-full shadow-sm transition-all hover:shadow-md">Summarize Scope</Badge>
                <Badge onClick={() => handleSuggestedAction("What are the primary risks associated with this tender?")} className="shrink-0 snap-start cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium py-1.5 px-3 rounded-full shadow-sm transition-all hover:shadow-md">Identify Risks</Badge>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t bg-white shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            placeholder="Ask about this procurement..." 
            className="text-sm bg-slate-50 border border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded-full px-4 py-2 w-full"
            value={input || ""}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !(input || "").trim()} size="icon" className="shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
