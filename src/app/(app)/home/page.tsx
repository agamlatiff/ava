import type { Metadata } from 'next'
import { getSession } from '@/lib/session'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { HomePage } from '@/components/pages/HomePage'
import type { Hangout } from '@/db/schema'

export const metadata: Metadata = {
  title: "Let's Go — Home",
  description: "Your upcoming adventure plans and memories.",
}

export default async function Page() {
  const session = await getSession()
  const userName = session.name || 'Friend'

  let upcomingHangout: Hangout | null = null
  let recentHangouts: Hangout[] = []

  try {
    upcomingHangout = await hangoutsRepository.getUpcomingHangout()
    recentHangouts = await hangoutsRepository.getRecentHangouts(3)
  } catch (err) {
    console.warn('DB queries in Home Page failed, using fallback empty state:', err)
  }

  return (
    <HomePage
      userName={userName}
      upcomingHangout={upcomingHangout}
      recentHangouts={recentHangouts}
    />
  )
}
