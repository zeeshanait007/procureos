const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cases = await prisma.procurementCase.findMany();
  const contractors = await prisma.contractor.findMany();
  
  if (cases.length > 0 && contractors.length > 0) {
    const existingMeeting = await prisma.preBidMeeting.findFirst({
      where: { caseId: cases[0].id }
    });
    
    if (!existingMeeting) {
      const meeting = await prisma.preBidMeeting.create({
        data: {
          caseId: cases[0].id,
          scheduledDate: new Date(),
          agenda: "Discussion on Technical Specifications",
          meetingLink: "https://meet.google.com/xyz-abc-def",
          status: "SCHEDULED"
        }
      });
      
      await prisma.preBidQuery.create({
        data: {
          meetingId: meeting.id,
          contractorId: contractors[0].id,
          question: "Can you confirm if standard commercial grade components are acceptable for the SCADA upgrade, or do they strictly need to be industrial heavy-duty?",
          status: "PENDING"
        }
      });
      console.log("Seeded Pre-Bid Meeting & Query");
    } else {
      console.log("Already seeded");
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
