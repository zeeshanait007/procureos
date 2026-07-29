"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Calendar, Video, MessageSquare, Brain, CheckCircle2, AlertCircle } from "lucide-react";
import Cal, { getCalApi } from "@calcom/embed-react";

export function PreBidDashboard() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'QUERIES'>('SCHEDULE');
  const [resolvingQuery, setResolvingQuery] = useState<string | null>(null);
  
  // For demo purposes, allow user to change the Cal.com link if the default 404s
  const [calLink, setCalLink] = useState<string>("peer/meet");
  const [tempCalLink, setTempCalLink] = useState<string>("peer/meet");

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await fetch("/api/pre-bid-meetings");
      const data = await res.json();
      setMeetings(data);
      if (data.length > 0 && !selectedCaseId) {
        setSelectedCaseId(data[0].caseId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      cal("ui", {
        styles: { branding: { brandColor: "#4f46e5" } },
        hideEventTypeDetails: true,
        hideBranding: true,
        layout: "month_view"
      });
    })();
  }, [activeTab]);

  const handleAIResolve = async (queryId: string, question: string) => {
    setResolvingQuery(queryId);
    
    // Simulate AI delay for generating response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const suggestedAnswer = `Based on Section 4.2 of the NIT documents, the technical requirements for the control systems specify that all components must be certified for industrial heavy-duty environments. This covers the scope of your query regarding standard commercial vs industrial grade.`;

    try {
      await fetch("/api/pre-bid-queries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: queryId,
          aiSuggestedAnswer: suggestedAnswer,
          status: "ANSWERED"
        })
      });
      await fetchMeetings(); // refresh
    } catch (e) {
      console.error(e);
    } finally {
      setResolvingQuery(null);
    }
  };

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>;
  }

  const uniqueCases = Array.from(new Set(meetings.filter(m => m.case).map(m => m.case.id)))
    .map(id => meetings.find(m => m.case?.id === id)?.case);

  const activeMeeting = meetings.find(m => m.caseId === selectedCaseId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {uniqueCases.length > 0 ? (
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 text-center">Select Procurement Case</label>
            <select 
              className="w-full text-sm border-slate-300 rounded-md bg-white p-2.5 text-slate-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
            >
              {uniqueCases.map((c: any) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          No Pre-Bid meetings have been created yet.
          {/* Note: In a real app, we would have a way to pick from ANY active case and create a meeting. 
              For this demo, if the list is empty, we just show this. */}
        </div>
      )}

      {activeMeeting && (
        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar Tabs */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('SCHEDULE')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'SCHEDULE' 
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Calendar className="w-5 h-5" /> Schedule Meeting
            </button>
            <button
              onClick={() => setActiveTab('QUERIES')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'QUERIES' 
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <MessageSquare className="w-5 h-5" /> 
              Contractor Queries
              {activeMeeting.queries?.filter((q:any) => q.status === 'PENDING').length > 0 && (
                <Badge className="ml-auto bg-rose-100 text-rose-700 hover:bg-rose-100 border-none">
                  {activeMeeting.queries.filter((q:any) => q.status === 'PENDING').length}
                </Badge>
              )}
            </button>
          </div>

          {/* Main Content */}
          <Card className="p-0 border-slate-200 shadow-sm bg-white overflow-hidden min-h-[500px] flex flex-col">
            {activeTab === 'SCHEDULE' ? (
              <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Schedule Pre-Bid Meeting</h3>
                    <p className="text-sm text-slate-500">Pick a time slot for the virtual meeting with all shortlisted contractors.</p>
                  </div>
                  
                  {/* Demo Control to change link */}
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={tempCalLink}
                        onChange={(e) => setTempCalLink(e.target.value)}
                        className="text-xs border-slate-300 rounded px-2 py-1.5 w-[150px]"
                        placeholder="username/event"
                      />
                      <Button size="sm" variant="outline" className="h-[30px] text-xs px-2" onClick={() => setCalLink(tempCalLink)}>
                        Load
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 relative p-4">
                  {/* Cal.com Embed Wrapper */}
                  <div className="w-full h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm relative">
                    <Cal 
                      calLink={calLink} 
                      style={{ width: "100%", height: "100%" }}
                      config={{ layout: 'month_view', hideEventTypeDetails: true, hideBranding: true }}
                    />
                    {/* White overlay mask to hide the "Powered by Cal.com" footer watermark */}
                    <div className="absolute bottom-0 left-0 right-0 h-[45px] bg-white z-10 flex items-center justify-center">
                       {/* Fully blocks the footer from view and blocks clicks to it */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Contractor Queries</h3>
                    <p className="text-sm text-slate-500">Manage and respond to queries regarding the NIT.</p>
                  </div>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 gap-1.5 py-1 px-3">
                    <Brain className="w-4 h-4" /> AI Auto-Draft Enabled
                  </Badge>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="p-6 space-y-6">
                    {activeMeeting.queries?.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-xl">
                        No queries have been submitted yet.
                      </div>
                    ) : (
                      activeMeeting.queries?.map((query: any) => (
                        <Card key={query.id} className={`overflow-hidden border-2 transition-all ${query.status === 'ANSWERED' ? 'border-emerald-100 bg-emerald-50/10' : 'border-amber-100 bg-amber-50/30'}`}>
                          <div className="p-4 border-b bg-white/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-500">{query.contractor?.name?.substring(0,2).toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{query.contractor?.name}</p>
                                <p className="text-xs text-slate-500">Submitted on {new Date(query.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            {query.status === 'ANSWERED' ? (
                              <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Answered
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
                                <AlertCircle className="w-3 h-3" /> Action Required
                              </Badge>
                            )}
                          </div>
                          
                          <div className="p-5 space-y-4">
                            <div>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Query</p>
                              <p className="text-sm text-slate-800 font-medium bg-white p-3 rounded-md border shadow-sm">
                                "{query.question}"
                              </p>
                            </div>

                            {query.status === 'PENDING' ? (
                              <div className="pt-2">
                                <Button 
                                  onClick={() => handleAIResolve(query.id, query.question)}
                                  disabled={resolvingQuery === query.id}
                                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                                >
                                  {resolvingQuery === query.id ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing NIT & Generating Response...</>
                                  ) : (
                                    <><Brain className="w-4 h-4 mr-2" /> Auto-Draft Response with AI</>
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <div className="pt-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Drafted Answer</p>
                                  <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-500 h-5">AI Generated</Badge>
                                </div>
                                <Textarea 
                                  defaultValue={query.aiSuggestedAnswer || ''}
                                  className="text-sm bg-white border-emerald-200 focus-visible:ring-emerald-500"
                                  rows={4}
                                />
                                <div className="flex justify-end mt-3 gap-2">
                                  <Button variant="outline" size="sm">Edit</Button>
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    Approve & Send to Contractor
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
