import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const caseData = await prisma.procurementCase.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(caseData);
  } catch (error) {
    console.error("Failed to fetch case:", error);
    return NextResponse.json({ error: "Failed to fetch case" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { title, workspaceData } = await req.json();

    const existingCase = await prisma.procurementCase.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!existingCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const updatedCase = await prisma.procurementCase.update({
      where: { id: resolvedParams.id },
      data: {
        ...(title && { title }),
        ...(workspaceData && { workspaceData }),
      },
    });

    // Handle Stage History tracking
    // Omit event logging for now

    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error("Failed to update case:", error);
    return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    await prisma.procurementCase.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete case:", error);
    return NextResponse.json({ error: "Failed to delete case" }, { status: 500 });
  }
}
