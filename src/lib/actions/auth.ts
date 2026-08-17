'use server'

import { getSession } from '@/lib/session'
import { authService } from '@/services/authService'
import { redirect } from 'next/navigation'

export async function loginAction(secret: string) {
  if (!secret || typeof secret !== 'string') {
    return { success: false, error: 'Secret is required.' }
  }

  const user = await authService.authenticateBySecret(secret)
  if (!user) {
    return { success: false, error: 'Invalid secret. Try again.' }
  }

  const session = await getSession()
  session.userId = user.id
  session.name = user.name
  session.isLoggedIn = true
  await session.save()

  return { success: true, user: { id: user.id, name: user.name } }
}

export async function logoutAction() {
  const session = await getSession()
  session.destroy()
  redirect('/')
}
