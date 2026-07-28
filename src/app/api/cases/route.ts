import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cases = await prisma.procurementCase.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(cases);
  } catch (error) {
    console.error("Failed to fetch cases:", error);
    return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, workspaceData } = await req.json();

    const newCase = await prisma.procurementCase.create({
      data: {
        title: title || "Untitled Case",
        status: "DRAFT",
        workspaceData: workspaceData || "{}",
      },
    });

    const gatesToCreate = [
      { type: 'ADMINISTRATIVE', name: 'Administrative Approval', seq: 1 },
      { type: 'BUDGET', name: 'Budget / Financial Approval', seq: 2 },
      { type: 'STRATEGY', name: 'Procurement Strategy Approval', seq: 3 },
      { type: 'TECH_SPEC', name: 'Technical Specification Approval', seq: 4 },
      { type: 'COST_ESTIMATE', name: 'Cost Estimate Approval', seq: 5 },
      { type: 'FINAL_NIT', name: 'Final Tender / NIT Approval', seq: 6 },
    ];

    const matrix = await prisma.approvalMatrix.findMany({
      include: {
        role: {
          include: { users: { take: 1 } }
        }
      }
    });

    for (const g of gatesToCreate) {
      const mRule = matrix.find(m => m.gateType === g.type);
      const approverUser = mRule?.role?.users?.[0];
      
      await prisma.approvalGate.create({
        data: {
          caseId: newCase.id,
          gateType: g.type,
          gateName: g.name,
          sequence: g.seq,
          status: g.seq === 1 ? 'SUBMITTED' : 'LOCKED',
          assignedApproverId: approverUser?.id || null,
          approverRole: mRule?.role?.name || 'Unknown Role',
        }
      });
    }

    return NextResponse.json(newCase);
  } catch (error) {
    console.error("Failed to create case:", error);
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
  }
}
