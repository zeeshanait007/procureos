import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { meetingId, contractorId, question } = body;

    if (!meetingId || !contractorId || !question) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const query = await prisma.preBidQuery.create({
      data: {
        meetingId,
        contractorId,
        question,
        status: "PENDING"
      }
    });

    return NextResponse.json(query);
  } catch (error) {
    console.error("Error creating pre-bid query:", error);
    return NextResponse.json({ error: "Failed to create pre-bid query" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, aiSuggestedAnswer, finalAnswer, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const query = await prisma.preBidQuery.update({
      where: { id },
      data: {
        aiSuggestedAnswer,
        finalAnswer,
        status
      }
    });

    return NextResponse.json(query);
  } catch (error) {
    console.error("Error updating pre-bid query:", error);
    return NextResponse.json({ error: "Failed to update pre-bid query" }, { status: 500 });
  }
}
