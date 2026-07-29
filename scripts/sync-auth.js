require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const prisma = new PrismaClient();

async function main() {
  const email = 'alice@acme.com';
  const password = 'password123';
  
  // 1. Sign up Alice in Supabase Auth
  console.log('Signing up Alice in Supabase...');
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (error && error.message !== 'User already registered') {
    console.error('Auth error:', error);
    return;
  }
  
  // If already registered, we'd need to sign in to get the ID, but let's assume she isn't.
  const authUser = data?.user;
  if (!authUser) {
    console.log('Could not get user from signup (maybe already registered?)');
    return;
  }
  
  console.log('Auth user ID:', authUser.id);
  
  // 2. Update Alice in Prisma with the new ID
  console.log('Updating Prisma record...');
  const existingAlice = await prisma.user.findUnique({ where: { email } });
  
  if (existingAlice) {
     // Prisma doesn't let you update an ID field directly if it's the primary key sometimes,
     // but we can try, or we can just delete and recreate.
     await prisma.user.delete({ where: { email } });
     await prisma.user.create({
       data: {
         ...existingAlice,
         id: authUser.id
       }
     });
     console.log('Successfully synced Alice!');
  } else {
     console.log('Alice not found in Prisma.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
