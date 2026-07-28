import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle2, AlertTriangle, Lock } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function ApprovalCenterPage() {
  const user = await getCurrentUser()
  if (!user) {
    return <div className="p-12 text-center text-slate-500">Please select a role to view the Approval Center.</div>
  }

  // Fetch pending gates assigned to current user
  const pendingMyApproval = await prisma.approvalGate.findMany({
    where: { assignedApproverId: user.id, status: 'SUBMITTED' },
    include: { case: true }
  })

  // Fetch gates currently awaiting other approvals (where the case is active, and a gate is SUBMITTED but not this user)
  const awaitingOthers = await prisma.approvalGate.findMany({
    where: { assignedApproverId: { not: user.id }, status: 'SUBMITTED' },
    include: { case: true, assignedApprover: true }
  })

  // Fetch my recently approved
  const myApproved = await prisma.approvalGate.findMany({
    where: { assignedApproverId: user.id, status: 'APPROVED' },
    orderBy: { decisionDate: 'desc' },
    take: 5,
    include: { case: true }
  })

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/50">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Approval Center</h1>
          <p className="text-slate-500 mt-1">Manage procurement governance and compliance gates.</p>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm border-indigo-100 bg-indigo-50/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Pending My Approval</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{pendingMyApproval.length}</p>
                </div>
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Others</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{awaitingOthers.length}</p>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-emerald-100 bg-emerald-50/30">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">My Approved</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{myApproved.length}</p>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-rose-100 bg-rose-50/30">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Bottlenecks</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
                </div>
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Required List */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Action Required</h2>
          {pendingMyApproval.length === 0 ? (
            <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center bg-white">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">You're all caught up!</p>
              <p className="text-sm text-slate-400 mt-1">No pending approvals require your attention.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingMyApproval.map(gate => (
                <div key={gate.id} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">{gate.gateName}</Badge>
                      <span className="text-sm font-medium text-slate-500">Submitted {gate.submittedDate?.toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{gate.case.title}</h3>
                    <p className="text-sm text-slate-500">Value: ₹{(gate.case.estimatedValue! / 10000000).toFixed(2)} Cr</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href={`/cases/${gate.caseId}?gate=${gate.gateType}`}>
                      <Button className="bg-indigo-600 hover:bg-indigo-700">Review & Approve</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
