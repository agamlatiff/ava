'use server'

import { getSession } from '@/lib/session'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { revalidatePath } from 'next/cache'

export async function saveCreatorActivitiesAction(
  hangoutId: string,
  activityIds: string[]
) {
  const session = await getSession()
  if (!session.isLoggedIn || !session.userId) {
    return { success: false, error: 'Unauthorized.' }
  }

  if (activityIds.length === 0) {
    return { success: false, error: 'Please select at least 1 activity.' }
  }

  try {
    const selections = activityIds.map((actId) => ({
      activityId: actId,
      choice: 'selected' as const,
    }))

    await hangoutsRepository.saveActivities(hangoutId, session.userId, selections)
    await hangoutsRepository.updateStatus(hangoutId, 'activities_pending')
    revalidatePath(`/hangouts/${hangoutId}/activities`)

    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save activities.'
    return { success: false, error: msg }
  }
}

export async function savePartnerReactionsAction(
  hangoutId: string,
  reactions: { activityId: string; choice: 'love' | 'like' | 'pass' }[]
) {
  const session = await getSession()
  if (!session.isLoggedIn || !session.userId) {
    return { success: false, error: 'Unauthorized.' }
  }

  try {
    await hangoutsRepository.saveActivities(hangoutId, session.userId, reactions)
    await hangoutsRepository.updateStatus(hangoutId, 'matched')
    revalidatePath(`/hangouts/${hangoutId}/matches`)

    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save reactions.'
    return { success: false, error: msg }
  }
}
