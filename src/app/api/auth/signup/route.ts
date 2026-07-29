import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, roleId } = await req.json();

    if (!name || !email || !password || !roleId) {
      return NextResponse.json({ error: "Name, email, password, and role are required" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. Create the user record in Prisma
    let org = await prisma.organisation.findFirst();
    if (!org) {
      // Auto-provision default organisation and roles for the first user
      org = await prisma.organisation.create({
        data: { name: 'Acme Corporation' }
      });
      
      // Auto-provision the requested role so it exists
      await prisma.role.create({
        data: { id: roleId, name: 'Default Role', description: 'Auto-provisioned role' }
      });
    }

    const newUser = await prisma.user.create({
      data: {
        id: authData.user?.id, // Use Supabase Auth ID
        name,
        email,
        roleId,
        orgId: org.id
      }
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
