import { prisma } from "@/lib/prisma";
import { SignupForm } from "./signup-form";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const roles = await prisma.role.findMany({
    orderBy: { name: 'asc' }
  });

  return <SignupForm roles={roles} />;
}
