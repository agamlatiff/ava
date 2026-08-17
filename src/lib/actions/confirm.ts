'use server'

import { getSession } from '@/lib/session'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { revalidatePath } from 'next/cache'

export async function confirmHangoutAction(hangoutId: string, confirmed: boolean) {
  const session = await getSession()
  if (!session.isLoggedIn || !session.userId) {
    return { success: false, error: 'Unauthorized.' }
  }

  const userId = session.userId.toLowerCase()
  if (userId !== 'agam' && userId !== 'diva') {
    return { success: false, error: 'Only authorized users can confirm.' }
  }

  try {
    const updated = await hangoutsRepository.setConfirmation(
      hangoutId,
      userId as 'agam' | 'diva',
      confirmed
    )

    if (updated) {
      if (updated.agamConfirmed === 1 && updated.divaConfirmed === 1) {
        await hangoutsRepository.updateStatus(hangoutId, 'confirmed')
      }
      revalidatePath(`/hangouts/${hangoutId}/confirm`)
      revalidatePath('/home')
    }

    return { success: true, updated }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update confirmation.' }
  }
}
