import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Phase 3 Approval Gates Scenario...')

  // Clear existing
  await prisma.auditEvent.deleteMany()
  await prisma.document.deleteMany()
  await prisma.approvalGate.deleteMany()
  await prisma.procurementCase.deleteMany()
  await prisma.approvalMatrix.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  await prisma.organisation.deleteMany()

  // 1. Organisation
  const org = await prisma.organisation.create({
    data: { name: 'Acme Corporation' }
  })

  // 2. Roles
  const rBusinessHead = await prisma.role.create({ data: { name: 'Business Head', description: 'Initiates and approves business need' } })
  const rFinanceAuth = await prisma.role.create({ data: { name: 'Finance Authority', description: 'Approves budget and cost' } })
  const rProcHead = await prisma.role.create({ data: { name: 'Procurement Head', description: 'Approves procurement strategy' } })
  const rCIO = await prisma.role.create({ data: { name: 'CIO / Technical Committee', description: 'Approves technical specifications' } })
  const rCompetentAuth = await prisma.role.create({ data: { name: 'Competent Authority', description: 'Final approving authority for NIT' } })

  // 3. Users
  const uBusiness = await prisma.user.create({ data: { name: 'Alice (Business Head)', email: 'alice@acme.com', roleId: rBusinessHead.id, orgId: org.id } })
  const uFinance = await prisma.user.create({ data: { name: 'Bob (Finance)', email: 'bob@acme.com', roleId: rFinanceAuth.id, orgId: org.id } })
  const uProcure = await prisma.user.create({ data: { name: 'Charlie (CPO)', email: 'charlie@acme.com', roleId: rProcHead.id, orgId: org.id } })
  const uCIO = await prisma.user.create({ data: { name: 'Diana (CIO)', email: 'diana@acme.com', roleId: rCIO.id, orgId: org.id } })
  const uAuthority = await prisma.user.create({ data: { name: 'Eve (Competent Authority)', email: 'eve@acme.com', roleId: rCompetentAuth.id, orgId: org.id } })

  // 4. Matrix Rules (Simple for Demo)
  await prisma.approvalMatrix.create({ data: { gateType: 'ADMINISTRATIVE', approverRoleId: rBusinessHead.id } })
  await prisma.approvalMatrix.create({ data: { gateType: 'BUDGET', approverRoleId: rFinanceAuth.id } })
  await prisma.approvalMatrix.create({ data: { gateType: 'STRATEGY', approverRoleId: rProcHead.id } })
  await prisma.approvalMatrix.create({ data: { gateType: 'TECH_SPEC', approverRoleId: rCIO.id } })
  await prisma.approvalMatrix.create({ data: { gateType: 'COST_ESTIMATE', approverRoleId: rFinanceAuth.id } })
  await prisma.approvalMatrix.create({ data: { gateType: 'FINAL_NIT', approverRoleId: rCompetentAuth.id } })

  // 5. Demo Procurement Case
  const initialWorkspaceData = {
    objective: "Implement an AI-Based Predictive Maintenance Platform for critical industrial equipment to reduce downtime by 30%.",
    marketData: { marketPredictionCr: 41.5, vendorFunnel: { totalIdentified: 15, eligibleVendors: 6 } },
    tenderDraft: {
      tenderTitle: "AI-Based Predictive Maintenance Platform for Critical Industrial Equipment",
      tenderReference: "NIT-2026-AI-PM-001",
      biddingMethod: "Two-Bid System",
      scopeOfWork: "The scope of work includes the design, development, supply, installation, testing, and commissioning of an AI-based Predictive Maintenance platform.",
      keyDeliverables: ["AI Engine", "Edge Gateways", "24/7 Support", "Dashboard"],
      preQualificationCriteria: [
        { title: "Financial Turnover", description: "Average annual turnover of at least $2M in the last 3 financial years." },
        { title: "Prior Experience", description: "Successful completion of at least 2 similar predictive maintenance projects in the last 5 years." }
      ],
      boqEstimates: [
        { id: 1, description: "AI Platform License (Annual)", unit: "Lot", quantity: 1, estimatedRate: 15000000 },
        { id: 2, description: "Edge Compute Hardware", unit: "Nos", quantity: 50, estimatedRate: 200000 },
        { id: 3, description: "Integration & Implementation Services", unit: "Lot", quantity: 1, estimatedRate: 10000000 }
      ]
    }
  }

  const pCase = await prisma.procurementCase.create({
    data: {
      title: 'AI-Based Predictive Maintenance Platform for Critical Industrial Equipment',
      description: 'Acquisition of an AI platform to predict machinery failure.',
      estimatedValue: 50000000, // $5 million -> approx Rs 41.5 Cr
      durationMonths: 24,
      procurementMethod: 'Open e-Tender',
      bidSystem: 'Two-Bid System',
      evaluationMethod: 'Technical + Financial',
      status: 'PENDING_APPROVAL',
      workspaceData: JSON.stringify(initialWorkspaceData)
    }
  })

  // 6. Setup Approval Gates (Requested Scenario)
  
  // Gate 1: Admin (Approved)
  const g1 = await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'ADMINISTRATIVE', gateName: 'Administrative Approval', sequence: 1,
      status: 'APPROVED', assignedApproverId: uBusiness.id, approverRole: 'Business Head',
      submittedById: uBusiness.id, submittedDate: new Date(Date.now() - 86400000 * 2), decisionDate: new Date(Date.now() - 86400000 * 1.5),
      comments: 'Project approved for strategic alignment with Digital Transformation 2026.'
    }
  })

  // Gate 2: Budget (Approved)
  const g2 = await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'BUDGET', gateName: 'Budget / Financial Approval', sequence: 2,
      status: 'APPROVED', assignedApproverId: uFinance.id, approverRole: 'Finance Authority',
      submittedById: uBusiness.id, submittedDate: new Date(Date.now() - 86400000 * 1.5), decisionDate: new Date(Date.now() - 86400000 * 1.2),
      comments: 'Budget of $5M CapEx approved under FY26 IT Head.'
    }
  })

  // Gate 3: Strategy (Pending)
  const g3 = await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'STRATEGY', gateName: 'Procurement Strategy Approval', sequence: 3,
      status: 'SUBMITTED', assignedApproverId: uProcure.id, approverRole: 'Procurement Head',
      submittedById: uBusiness.id, submittedDate: new Date(Date.now() - 86400000 * 1)
    }
  })

  // Gate 4: Tech Spec (Locked)
  await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'TECH_SPEC', gateName: 'Technical Specification Approval', sequence: 4,
      status: 'LOCKED', assignedApproverId: uCIO.id, approverRole: 'CIO / Technical Committee'
    }
  })

  // Gate 5: Cost Estimate (Locked)
  await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'COST_ESTIMATE', gateName: 'Cost Estimate Approval', sequence: 5,
      status: 'LOCKED', assignedApproverId: uFinance.id, approverRole: 'Finance Authority'
    }
  })

  // Gate 6: Final NIT (Locked)
  await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'FINAL_NIT', gateName: 'Final Tender / NIT Approval', sequence: 6,
      status: 'LOCKED', assignedApproverId: uAuthority.id, approverRole: 'Competent Authority'
    }
  })

  // 7. Audit Events
  await prisma.auditEvent.createMany({
    data: [
      { caseId: pCase.id, userId: uBusiness.id, gateId: g1.id, action: 'SUBMITTED', comment: 'Initiated business case for AI platform' },
      { caseId: pCase.id, userId: uBusiness.id, gateId: g1.id, action: 'APPROVED', comment: 'Strategic requirement' },
      { caseId: pCase.id, userId: uBusiness.id, gateId: g2.id, action: 'SUBMITTED', comment: 'Requested financial clearance' },
      { caseId: pCase.id, userId: uFinance.id, gateId: g2.id, action: 'APPROVED', comment: 'Budget cleared' },
      { caseId: pCase.id, userId: uBusiness.id, gateId: g3.id, action: 'SUBMITTED', comment: 'Strategy proposed: Open e-Tender' }
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
