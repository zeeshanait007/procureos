import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { applicationId, status, evalComments, evalScore } = await request.json()

    if (!applicationId || !status) {
      return NextResponse.json({ error: 'applicationId and status are required' }, { status: 400 })
    }

    const updated = await prisma.preQualificationApplication.update({
      where: { id: applicationId },
      data: {
        status,
        evalComments,
        evalScore
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating PQ application:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
