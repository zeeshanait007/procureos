import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, XCircle, FileEdit, Clock, ShieldAlert, Loader2 } from "lucide-react"

interface GateLayoutProps {
  gate: any
  currentUser: any
  title: string
  description: string
  children: React.ReactNode
  aiPanel?: React.ReactNode
  onApprove: (comments: string) => void
  onReject: (comments: string) => void
  onRequestChanges: (comments: string) => void
  onEditDraft?: () => void
}

import { useState } from "react"
// ...
export function GateLayout({ gate, currentUser, title, description, children, aiPanel, onApprove, onReject, onRequestChanges, onEditDraft }: GateLayoutProps) {
  const [commentText, setCommentText] = useState("")
  const [submittingAction, setSubmittingAction] = useState<'approve' | 'reject' | 'changes' | null>(null)
  const [isReevaluating, setIsReevaluating] = useState(false)
  
  const isLocked = gate.status === 'LOCKED'
  const isPending = gate.status === 'SUBMITTED' || isReevaluating
  const isApproved = gate.status === 'APPROVED'
  const isRejected = gate.status === 'REJECTED'
  const isChangesRequested = gate.status === 'CHANGES_REQUESTED'
  const isSuperAdmin = currentUser?.role?.name === 'Platform Owner'
  const isAuthorized = isSuperAdmin || currentUser?.id === gate.assignedApproverId

  const handleAction = async (action: 'approve' | 'reject' | 'changes') => {
    setSubmittingAction(action)
    const text = commentText.trim() || (action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Changes Requested')
    try {
      if (action === 'approve') await onApprove(text)
      if (action === 'reject') await onReject(text)
      if (action === 'changes') await onRequestChanges(text)
      setIsReevaluating(false)
    } finally {
      setSubmittingAction(null)
    }
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Main Approval Content */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>

        {isLocked && (
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 text-center">
            <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-700">Gate Locked</h3>
            <p className="text-sm text-slate-500">This approval gate is locked until previous dependencies are met.</p>
          </div>
        )}

        {!isLocked && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-8">
            
            {/* Gate specific forms/data */}
            <div className="prose prose-sm max-w-none text-slate-700">
              {children}
            </div>

            {/* Approval Decision Section */}
            <div className="border-t border-slate-100 pt-6 mt-8">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Approval Decision</h3>
              
              {isApproved ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-emerald-900">Approved</h4>
                    <p className="text-sm text-emerald-700 mt-1">{gate.comments}</p>
                    <p className="text-xs text-emerald-600/70 mt-2">Decision on {new Date(gate.decisionDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : isRejected && !isReevaluating ? (
                <div className="space-y-4">
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex gap-4">
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-rose-900">Rejected</h4>
                      <p className="text-sm text-rose-700 mt-1">{gate.comments}</p>
                      <p className="text-xs text-rose-600/70 mt-2">Decision on {new Date(gate.decisionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsReevaluating(true)}>Re-evaluate Decision</Button>
                    {onEditDraft && <Button variant="secondary" onClick={onEditDraft}>Edit Draft Data</Button>}
                  </div>
                </div>
              ) : isChangesRequested && !isReevaluating ? (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-4">
                    <FileEdit className="w-6 h-6 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-900">Changes Requested</h4>
                      <p className="text-sm text-amber-700 mt-1">{gate.comments}</p>
                      <p className="text-xs text-amber-600/70 mt-2">Decision on {new Date(gate.decisionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsReevaluating(true)}>Re-evaluate Decision</Button>
                    {onEditDraft && <Button variant="secondary" onClick={onEditDraft}>Edit Draft Data</Button>}
                  </div>
                </div>
              ) : isPending ? (
                <div className="space-y-4">
                  {isAuthorized ? (
                    <>
                      <Textarea 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Enter your comments or justification here..." 
                        className="bg-slate-50" 
                        disabled={submittingAction !== null}
                      />
                      <div className="flex items-center gap-3">
                        <Button disabled={submittingAction !== null} onClick={() => handleAction('approve')} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                          {submittingAction === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve
                        </Button>
                        <Button disabled={submittingAction !== null} onClick={() => handleAction('changes')} variant="outline" className="text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 gap-2">
                          {submittingAction === 'changes' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileEdit className="w-4 h-4" />} Request Changes
                        </Button>
                        <Button disabled={submittingAction !== null} onClick={() => handleAction('reject')} variant="ghost" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-2">
                          {submittingAction === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Reject
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-700">Read-Only View</h4>
                        <p className="text-sm text-slate-500 mt-1">You do not have authorization to approve this gate. This gate is assigned to the <strong>{gate.approverRole}</strong>.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic">This gate is currently in {gate.status} state.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Optional split panel for AI or specific requirements (e.g. Tech Spec split view) */}
      {aiPanel && (
        <div className="w-80 shrink-0">
          {aiPanel}
        </div>
      )}
    </div>
  )
}
