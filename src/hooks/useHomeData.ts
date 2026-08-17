'use client'

import { useMemo } from 'react'
import type { Hangout } from '@/db/schema'

export function useHomeData(userName: string, upcomingHangout: Hangout | null) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return `Good morning, ${userName} 👋`
    if (hour < 18) return `Good afternoon, ${userName} ☀️`
    return `Good evening, ${userName} 🌙`
  }, [userName])

  const hangoutState = useMemo(() => {
    if (!upcomingHangout) return 'none'

    const isToday =
      new Date(upcomingHangout.date).toDateString() ===
      new Date().toDateString()

    if (upcomingHangout.status === 'confirmed') {
      return isToday ? 'today' : 'confirmed'
    }

    if (upcomingHangout.status === 'completed') {
      return 'completed'
    }

    return 'pending'
  }, [upcomingHangout])

  return {
    greeting,
    hangoutState,
  }
}
