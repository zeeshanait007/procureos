import { cookies } from 'next/headers'
import { prisma } from './prisma'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('mock_user_id')?.value

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true, organisation: true }
  })

  return user
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: { role: true, organisation: true }
  })
}
