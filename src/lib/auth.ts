import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { createClient } from '@/utils/supabase/server'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { role: true, organisation: true }
  })

  return dbUser
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: { role: true, organisation: true }
  })
}
