'use client'

import { useState } from 'react'
import { markActivityCompleteAction } from '@/lib/actions/today'
import { useRouter } from 'next/navigation'
import type { TimelineStop } from '@/components/ui/Timeline'

export function useHangoutDay(hangoutId: string, stops: TimelineStop[]) {
  const router = useRouter()
  const [isMarking, setIsMarking] = useState<string | null>(null)

  const completedCount = stops.filter((s) => s.status === 'completed').length
  const totalCount = stops.length
  const allComplete = completedCount === totalCount && totalCount > 0

  const handleMarkComplete = async (stopId: string) => {
    setIsMarking(stopId)
    try {
      const res = await markActivityCompleteAction(hangoutId, stopId)
      if (res.success) {
        router.refresh()
      }
    } finally {
      setIsMarking(null)
    }
  }

  return {
    completedCount,
    totalCount,
    allComplete,
    isMarking,
    handleMarkComplete,
  }
}
