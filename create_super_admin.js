const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organisation.findFirst();
  
  if (!org) {
    console.log("No organization found!");
    return;
  }

  // Create or find Super Admin role
  let superAdminRole = await prisma.role.findFirst({
    where: { name: 'Platform Owner' }
  });

  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        name: 'Platform Owner',
        description: 'Super administrator with universal access to all gates'
      }
    });
  }

  // Check if admin user exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@acme.com' }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@acme.com',
        roleId: superAdminRole.id,
        orgId: org.id
      }
    });
    console.log('Successfully created admin@acme.com with Platform Owner role!');
  } else {
    console.log('admin@acme.com already exists.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
