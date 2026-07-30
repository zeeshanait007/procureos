import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const c = await prisma.procurementCase.findFirst();
  if (!c) {
    console.log("No procurement case found");
    return;
  }

  let contractor = await prisma.contractor.findFirst();
  if (!contractor) {
    contractor = await prisma.contractor.create({
      data: {
        name: "L&T Heavy Engineering",
        contactEmail: "contact@lntecc.com",
        registrationId: "LNT-10293",
      }
    });
  }
  
  let contractor2 = await prisma.contractor.findFirst({ skip: 1 });
  if (!contractor2) {
    contractor2 = await prisma.contractor.create({
      data: {
        name: "Siemens India Ltd.",
        contactEmail: "bids@siemens.co.in",
        registrationId: "SIE-9482",
      }
    });
  }

  // Create or update the PreBidMeeting
  const meeting = await prisma.preBidMeeting.upsert({
    where: { caseId: c.id },
    update: {},
    create: {
      caseId: c.id,
      scheduledDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      meetingLink: "cal.com/peer/meet",
      agenda: "Discuss technical specifications for the telemetry-enabled refractory bricks and commercial terms.",
      status: "SCHEDULED"
    }
  });

  // Check queries
  const q1 = await prisma.preBidQuery.findFirst({ where: { meetingId: meeting.id } });
  if (!q1) {
    await prisma.preBidQuery.create({
      data: {
        meetingId: meeting.id,
        contractorId: contractor.id,
        question: "Is it required to have ISO 9001:2015 certification specifically for heavy-duty refractory manufacturing, or is a general ISO certification acceptable?",
        status: "PENDING"
      }
    });
    
    await prisma.preBidQuery.create({
      data: {
        meetingId: meeting.id,
        contractorId: contractor2.id,
        question: "Can we use an equivalent grade of refractory brick as long as the telemetry sensors match your specifications?",
        status: "PENDING"
      }
    });
  }
  console.log("Pre-bid meeting and queries seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
