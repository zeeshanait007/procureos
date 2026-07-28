'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function processApprovalDecision(gateId: string, decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED', comments: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const gate = await prisma.approvalGate.findUnique({ where: { id: gateId }, include: { case: true } })
  if (!gate) throw new Error("Gate not found")

  // Update the current gate
  await prisma.approvalGate.update({
    where: { id: gateId },
    data: {
      status: decision,
      comments,
      decisionDate: new Date(),
    }
  })

  // Create Audit Event
  await prisma.auditEvent.create({
    data: {
      caseId: gate.caseId,
      userId: user.id,
      gateId: gate.id,
      action: decision,
      comment: comments
    }
  })

  // Sequential Logic: If approved, unlock the next gate
  if (decision === 'APPROVED') {
    const nextGate = await prisma.approvalGate.findFirst({
      where: { caseId: gate.caseId, sequence: gate.sequence + 1 }
    })
    
    if (nextGate && nextGate.status === 'LOCKED') {
      await prisma.approvalGate.update({
        where: { id: nextGate.id },
        data: { status: 'SUBMITTED', submittedDate: new Date() }
      })
      
      await prisma.auditEvent.create({
        data: {
          caseId: gate.caseId,
          userId: user.id, // System transition triggered by this user
          gateId: nextGate.id,
          action: 'SUBMITTED',
          comment: 'Automatically submitted for approval following previous gate clearance.'
        }
      })
    }
  }

  revalidatePath(`/cases/${gate.caseId}`)
  revalidatePath(`/approvals`)
  return { success: true }
}
