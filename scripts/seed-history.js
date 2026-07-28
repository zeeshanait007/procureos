const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cases = await prisma.procurementCase.findMany();
  
  if (cases.length === 0) {
    console.log("No cases found to seed.");
    return;
  }

  const DAY_MS = 1000 * 60 * 60 * 24;

  for (const pc of cases) {
    // Check if this case already has history
    const existing = await prisma.stageHistory.findMany({ where: { caseId: pc.id } });
    if (existing.length > 0) continue;

    console.log(`Seeding history for case ${pc.id}...`);
    
    // Admin (Requirement Intelligence) -> Tech Eval (Market) -> Finance (Assembly) -> Legal (Compliance)
    // We'll generate random days for each stage.
    
    let currentEnteredAt = new Date(pc.createdAt).getTime() - (20 * DAY_MS); // Start 20 days ago
    
    const stages = [
      { name: 'REQUIREMENT_INTELLIGENCE', delay: 1 + Math.random() * 2 },
      { name: 'MARKET_BENCHMARKING', delay: 2 + Math.random() * 3 },
      { name: 'AI_TENDER_ASSEMBLY', delay: 3 + Math.random() * 4 },
      { name: 'COMPLIANCE_REVIEW', delay: 5 + Math.random() * 4 },
    ];

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const durationMs = stage.delay * DAY_MS;
      const exitedAt = currentEnteredAt + durationMs;
      
      // Stop creating history if we reached the current stage
      if (stage.name === pc.currentStage) {
        await prisma.stageHistory.create({
          data: {
            caseId: pc.id,
            stage: stage.name,
            enteredAt: new Date(currentEnteredAt),
            // current stage is not exited yet
          }
        });
        break; // Reached current stage, stop seeding past this
      } else {
        await prisma.stageHistory.create({
          data: {
            caseId: pc.id,
            stage: stage.name,
            enteredAt: new Date(currentEnteredAt),
            exitedAt: new Date(exitedAt),
            durationMs: durationMs
          }
        });
        currentEnteredAt = exitedAt;
      }
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
