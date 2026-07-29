import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const caseId = searchParams.get('caseId')

  try {
    const whereClause = caseId ? { caseId } : {};

    let applications = await prisma.preQualificationApplication.findMany({
      where: whereClause,
      include: { contractor: true, case: true },
      orderBy: { createdAt: 'desc' }
    })
    
    // Auto-seed for demo purposes if no applications exist for this specific case
    if (applications.length === 0 && caseId) {
      const contractors = await prisma.contractor.findMany({ take: 3 });
      
      if (contractors.length > 0) {
        await prisma.preQualificationApplication.createMany({
          data: [
            {
              caseId,
              contractorId: contractors[0].id,
              status: 'PENDING',
              orgStructureData: JSON.stringify({ employees: 450, subsidiaries: 3, coreCompetency: 'Industrial IoT & AI' }),
              financialStabilityData: JSON.stringify({ annualTurnoverM: 4.5, yearsInBusiness: 8, creditRating: 'A+' })
            },
            {
              caseId,
              contractorId: contractors[1]?.id || contractors[0].id,
              status: 'PENDING',
              orgStructureData: JSON.stringify({ employees: 1200, subsidiaries: 12, coreCompetency: 'Enterprise Software Solutions' }),
              financialStabilityData: JSON.stringify({ annualTurnoverM: 1.2, yearsInBusiness: 15, creditRating: 'BBB' })
            },
            {
              caseId,
              contractorId: contractors[2]?.id || contractors[0].id,
              status: 'PENDING',
              orgStructureData: JSON.stringify({ employees: 85, subsidiaries: 0, coreCompetency: 'Predictive Analytics' }),
              financialStabilityData: JSON.stringify({ annualTurnoverM: 2.1, yearsInBusiness: 6, creditRating: 'A' })
            }
          ]
        });

        // Re-fetch after seeding
        applications = await prisma.preQualificationApplication.findMany({
          where: { caseId },
          include: { contractor: true, case: true },
          orderBy: { createdAt: 'desc' }
        });
      }
    }
    
    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching PQ applications:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
