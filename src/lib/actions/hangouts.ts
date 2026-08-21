'use server'

import { getSession } from '@/lib/session'
import { hangoutService, type CreateHangoutInput } from '@/services/hangoutService'

export async function createHangoutAction(input: CreateHangoutInput) {
  const session = await getSession()

  if (!session.isLoggedIn || !session.userId) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  try {
    const hangout = await hangoutService.create(session.userId, input)
    return { success: true, hangoutId: hangout.id }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create plan.'
    return {
      success: false,
      error: msg,
    }
  }
}

