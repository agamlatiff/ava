'use server'

import { getSession } from '@/lib/session'
import { hangoutService, type CreateHangoutInput } from '@/services/hangoutService'
import { redirect } from 'next/navigation'

export async function createHangoutAction(input: CreateHangoutInput) {
  const session = await getSession()

  if (!session.isLoggedIn || !session.userId) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  try {
    const hangout = await hangoutService.create(session.userId, input)
    return { success: true, hangoutId: hangout.id }
  } catch (err: any) {
    return {
      success: false,
      error: err.errors?.[0]?.message || err.message || 'Failed to create plan.',
    }
  }
}
