import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');

    if (caseId) {
      const meetings = await prisma.preBidMeeting.findMany({
        where: { caseId },
        include: {
          case: true,
          queries: {
            include: {
              contractor: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(meetings);
    } else {
      const meetings = await prisma.preBidMeeting.findMany({
        include: {
          case: true,
          queries: {
            include: {
              contractor: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(meetings);
    }
  } catch (error) {
    console.error("Error fetching pre-bid meetings:", error);
    return NextResponse.json({ error: "Failed to fetch pre-bid meetings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caseId, scheduledDate, agenda, meetingLink } = body;

    if (!caseId || !scheduledDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const meeting = await prisma.preBidMeeting.create({
      data: {
        caseId,
        scheduledDate: new Date(scheduledDate),
        agenda,
        meetingLink,
        status: "SCHEDULED"
      }
    });

    return NextResponse.json(meeting);
  } catch (error) {
    console.error("Error creating pre-bid meeting:", error);
    return NextResponse.json({ error: "Failed to create pre-bid meeting" }, { status: 500 });
  }
}
