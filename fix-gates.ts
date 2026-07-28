import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const cases = await prisma.procurementCase.findMany({
    include: { approvalGates: true }
  })
  
  const matrix = await prisma.approvalMatrix.findMany({
    include: { role: { include: { users: { take: 1 } } } }
  })

  let count = 0
  for (const c of cases) {
    if (c.approvalGates.length === 0) {
      console.log(`Fixing case ${c.id}...`)
      const gatesToCreate = [
        { type: 'ADMINISTRATIVE', name: 'Administrative Approval', seq: 1 },
        { type: 'BUDGET', name: 'Budget / Financial Approval', seq: 2 },
        { type: 'STRATEGY', name: 'Procurement Strategy Approval', seq: 3 },
        { type: 'TECH_SPEC', name: 'Technical Specification Approval', seq: 4 },
        { type: 'COST_ESTIMATE', name: 'Cost Estimate Approval', seq: 5 },
        { type: 'FINAL_NIT', name: 'Final Tender / NIT Approval', seq: 6 },
      ];

      for (const g of gatesToCreate) {
        const mRule = matrix.find(m => m.gateType === g.type);
        const approverUser = mRule?.role?.users?.[0];
        
        await prisma.approvalGate.create({
          data: {
            caseId: c.id,
            gateType: g.type,
            gateName: g.name,
            sequence: g.seq,
            status: g.seq === 1 ? 'SUBMITTED' : 'LOCKED',
            assignedApproverId: approverUser?.id || null,
            approverRole: mRule?.role?.name || 'Unknown Role',
          }
        });
      }
      count++
    }
  }
  console.log(`Fixed ${count} cases.`)
}
main().catch(console.error).finally(() => prisma.$disconnect())
