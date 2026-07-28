'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAsUser(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set('mock_user_id', userId, { path: '/' })
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('mock_user_id')
  redirect('/')
}
