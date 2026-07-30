import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding SAIL-Specific Scenario...')

  await prisma.auditEvent.deleteMany()
  await prisma.document.deleteMany()
  await prisma.preBidQuery.deleteMany()
  await prisma.preBidMeeting.deleteMany()
  await prisma.approvalGate.deleteMany()
  await prisma.preQualificationApplication.deleteMany()
  await prisma.contractor.deleteMany()
  await prisma.procurementCase.deleteMany()
  await prisma.approvalMatrix.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  await prisma.organisation.deleteMany()

  // 1. Organisation
  const org = await prisma.organisation.create({
    data: { name: 'Steel Authority of India Limited (SAIL)' }
  })

  // 2. Roles
  const rPlantHead = await prisma.role.create({ data: { name: 'Plant Head (Bokaro)', description: 'Initiates and approves business need' } })
  const rFinanceAuth = await prisma.role.create({ data: { name: 'CFO (Corporate)', description: 'Approves budget and cost' } })
  const rProcHead = await prisma.role.create({ data: { name: 'Chief Materials Manager', description: 'Approves procurement strategy' } })
  const rTechnical = await prisma.role.create({ data: { name: 'Technical Committee (Metallurgy)', description: 'Approves technical specifications' } })
  const rCompetentAuth = await prisma.role.create({ data: { name: 'Executive Director (ED)', description: 'Final approving authority for NIT' } })
  const rPlatformOwner = await prisma.role.create({ data: { name: 'Platform Owner', description: 'System Administrator with full access' } })

  // 3. Users
  const uPlantHead = await prisma.user.create({ data: { name: 'Rahul Sharma (Plant Head)', email: 'rahul.s@sail.co.in', roleId: rPlantHead.id, orgId: org.id } })
  const uFinance = await prisma.user.create({ data: { name: 'Sanjay Gupta (CFO)', email: 'sanjay.g@sail.co.in', roleId: rFinanceAuth.id, orgId: org.id } })
  const uProcure = await prisma.user.create({ data: { name: 'Rajesh Kumar (CMM)', email: 'rajesh.k@sail.co.in', roleId: rProcHead.id, orgId: org.id } })
  const uTechnical = await prisma.user.create({ data: { name: 'Dr. A. K. Singh (Tech)', email: 'ak.singh@sail.co.in', roleId: rTechnical.id, orgId: org.id } })
  const uAuthority = await prisma.user.create({ data: { name: 'Vikram Das (ED)', email: 'vikram.d@sail.co.in', roleId: rCompetentAuth.id, orgId: org.id } })
  const uAdmin = await prisma.user.create({ data: { name: 'Admin (Platform Owner)', email: 'admin@sail.co.in', roleId: rPlatformOwner.id, orgId: org.id } })

  // 4. Matrix Rules
  await prisma.approvalMatrix.create({ data: { gateType: 'ADMINISTRATIVE', approverRoleId: rPlantHead.id } })
  await prisma.approvalMatrix.create({ data: { gateType: 'BUDGET', approverRoleId: rFinanceAuth.id } })
  await prisma.approvalMatrix.create({ data: { gateType: 'STRATEGY', approverRoleId: rProcHead.id } })
  await prisma.approvalMatrix.create({ data: { gateType: 'TECH_SPEC', approverRoleId: rTechnical.id } })
  await prisma.approvalMatrix.create({ data: { gateType: 'COST_ESTIMATE', approverRoleId: rFinanceAuth.id } })
  await prisma.approvalMatrix.create({ data: { gateType: 'FINAL_NIT', approverRoleId: rCompetentAuth.id } })

  // 5. Demo Procurement Case (SAIL specific)
  const initialWorkspaceData = {
    objective: "Procurement of AI-Optimized Blast Furnace Refractory Spares and Automated Slag Monitoring System to prevent capital lockup and accurately fix commodity prices.",
    marketData: { marketPredictionCr: 212.5, vendorFunnel: { totalIdentified: 24, eligibleVendors: 5 } },
    tenderDraft: {
      tenderTitle: "Supply of Critical Blast Furnace Spares & Slag Optimization Sensors",
      tenderReference: "SAIL-BOK-2026-BF5-001",
      biddingMethod: "Global e-Tender (Two-Bid System)",
      scopeOfWork: "Supply and installation of telemetry-enabled refractory bricks, blast furnace slag flow sensors, and integration with SAP-ERP to dynamically manage dead stock inventory limits.",
      keyDeliverables: ["Refractory Spares (High-Alumina)", "Slag Flow Sensors", "SAP-ERP Integration Module", "Price-Fixation Algorithm Maintenance"],
      preQualificationCriteria: [
        { title: "Financial Turnover", description: "Average annual turnover of at least ₹500 Crore in the last 3 financial years." },
        { title: "Prior Experience", description: "Successful completion of at least 3 heavy-metallurgy AI implementations for steel plants > 2MTPA capacity." }
      ],
      boqEstimates: [
        { id: 1, description: "Telemetry-Enabled Refractory Bricks", unit: "Tons", quantity: 5000, estimatedRate: 250000 },
        { id: 2, description: "Blast Furnace Slag Flow Sensors", unit: "Nos", quantity: 15, estimatedRate: 15000000 },
        { id: 3, description: "SAP-ERP Inventory Integration & ML Implementation", unit: "Lot", quantity: 1, estimatedRate: 85000000 }
      ]
    }
  }

  const pCase = await prisma.procurementCase.create({
    data: {
      title: 'Critical Blast Furnace Spares & Slag Optimization Implementation',
      description: 'Strategic procurement to replace manual SOWs and fix blast furnace slag price estimation failures.',
      estimatedValue: 2125000000, // ₹212.5 Crore
      durationMonths: 36,
      procurementMethod: 'Global e-Tender',
      bidSystem: 'Two-Bid System',
      evaluationMethod: 'Technical + Financial',
      status: 'PENDING_APPROVAL',
      workspaceData: JSON.stringify(initialWorkspaceData)
    }
  })

  // 6. Setup Approval Gates (SAIL Scenario)
  
  // Gate 1: Admin (Approved)
  const g1 = await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'ADMINISTRATIVE', gateName: 'Administrative Approval (Plant Head)', sequence: 1,
      status: 'APPROVED', assignedApproverId: uPlantHead.id, approverRole: 'Plant Head (Bokaro)',
      submittedById: uPlantHead.id, submittedDate: new Date(Date.now() - 86400000 * 5), decisionDate: new Date(Date.now() - 86400000 * 4),
      comments: 'Approved to prevent further capital lockup in dead stock. Proceed immediately.'
    }
  })

  // Gate 2: Budget (Approved)
  const g2 = await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'BUDGET', gateName: 'Financial Concurrence (CFO)', sequence: 2,
      status: 'APPROVED', assignedApproverId: uFinance.id, approverRole: 'CFO (Corporate)',
      submittedById: uPlantHead.id, submittedDate: new Date(Date.now() - 86400000 * 4), decisionDate: new Date(Date.now() - 86400000 * 3),
      comments: 'Budget of ₹212.5 Cr approved under FY26 Modernization CapEx.'
    }
  })

  // Gate 3: Strategy (Pending)
  const g3 = await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'STRATEGY', gateName: 'Procurement Strategy (CMM)', sequence: 3,
      status: 'SUBMITTED', assignedApproverId: uProcure.id, approverRole: 'Chief Materials Manager',
      submittedById: uPlantHead.id, submittedDate: new Date(Date.now() - 86400000 * 1)
    }
  })

  // Gate 4: Tech Spec (Locked)
  await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'TECH_SPEC', gateName: 'Technical Specification Approval', sequence: 4,
      status: 'LOCKED', assignedApproverId: uTechnical.id, approverRole: 'Technical Committee (Metallurgy)'
    }
  })

  // Gate 5: Cost Estimate (Locked)
  await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'COST_ESTIMATE', gateName: 'Cost Estimate Validation', sequence: 5,
      status: 'LOCKED', assignedApproverId: uFinance.id, approverRole: 'CFO (Corporate)'
    }
  })

  // Gate 6: Final NIT (Locked)
  await prisma.approvalGate.create({
    data: {
      caseId: pCase.id, gateType: 'FINAL_NIT', gateName: 'Final NIT Authorization (ED)', sequence: 6,
      status: 'LOCKED', assignedApproverId: uAuthority.id, approverRole: 'Executive Director (ED)'
    }
  })

  // 7. Audit Events
  await prisma.auditEvent.createMany({
    data: [
      { caseId: pCase.id, userId: uPlantHead.id, gateId: g1.id, action: 'SUBMITTED', comment: 'Initiated PR due to critical inventory alerts.' },
      { caseId: pCase.id, userId: uPlantHead.id, gateId: g1.id, action: 'APPROVED', comment: 'Strategic requirement aligned with audit findings.' },
      { caseId: pCase.id, userId: uPlantHead.id, gateId: g2.id, action: 'SUBMITTED', comment: 'Requested financial clearance for ₹212 Cr.' },
      { caseId: pCase.id, userId: uFinance.id, gateId: g2.id, action: 'APPROVED', comment: 'Budget cleared to mitigate future pricing losses.' },
      { caseId: pCase.id, userId: uPlantHead.id, gateId: g3.id, action: 'SUBMITTED', comment: 'Strategy proposed: Global e-Tender' }
    ]
  })

  // 8. Pre-Qualification Contractors & Applications
  const c1 = await prisma.contractor.create({ data: { name: 'L&T Heavy Engineering', registrationNo: 'LT-9921-X', contactEmail: 'bids@larsentoubro.com', country: 'India' } })
  const c2 = await prisma.contractor.create({ data: { name: 'Siemens Industrial Systems', registrationNo: 'SM-1100-A', contactEmail: 'sales@siemens.de', country: 'Germany' } })
  const c3 = await prisma.contractor.create({ data: { name: 'Tata Consultancy Services (IoT Div)', registrationNo: 'TCS-4432-B', contactEmail: 'tenders.iot@tcs.com', country: 'India' } })

  await prisma.preQualificationApplication.createMany({
    data: [
      {
        caseId: pCase.id,
        contractorId: c1.id,
        status: 'PENDING',
        orgStructureData: JSON.stringify({ employees: 45000, subsidiaries: 8, coreCompetency: 'Metallurgy Equipment & Procurement' }),
        financialStabilityData: JSON.stringify({ annualTurnoverM: 8000, yearsInBusiness: 80, creditRating: 'AAA' })
      },
      {
        caseId: pCase.id,
        contractorId: c2.id,
        status: 'PENDING',
        orgStructureData: JSON.stringify({ employees: 120000, subsidiaries: 120, coreCompetency: 'Industrial Automation & Sensors' }),
        financialStabilityData: JSON.stringify({ annualTurnoverM: 120, yearsInBusiness: 15, creditRating: 'BBB' }) // Failed turnover check for ₹500 Cr
      },
      {
        caseId: pCase.id,
        contractorId: c3.id,
        status: 'PENDING',
        orgStructureData: JSON.stringify({ employees: 600000, subsidiaries: 10, coreCompetency: 'SAP Integration & Telemetry' }),
        financialStabilityData: JSON.stringify({ annualTurnoverM: 25000, yearsInBusiness: 55, creditRating: 'AAA' })
      }
    ]
  })

  console.log('Database seeded successfully with SAIL scenario!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
