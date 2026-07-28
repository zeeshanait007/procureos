import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, roleId } = await req.json();

    if (!name || !email || !roleId) {
      return NextResponse.json({ error: "Name, email, and role are required" }, { status: 400 });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Get default org (since we seeded "Acme Corporation")
    const org = await prisma.organisation.findFirst();
    if (!org) {
      return NextResponse.json({ error: "System not initialized properly" }, { status: 500 });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        roleId,
        orgId: org.id
      }
    });

    const response = NextResponse.json({ success: true, user: newUser });
    
    // Set cookie to auto-login
    response.cookies.set({
      name: "mock_user_id",
      value: newUser.id,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
