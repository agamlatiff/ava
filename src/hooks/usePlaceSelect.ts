'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { savePlaceSelectionsAction } from '@/lib/actions/places'

export function usePlaceSelect(hangoutId: string, matchedActivityIds: string[]) {
  const router = useRouter()
  // Map of activityId -> selected placeId
  const [selectedPlaces, setSelectedPlaces] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSelectPlace = (activityId: string, placeId: string) => {
    setSelectedPlaces((prev) => ({
      ...prev,
      [activityId]: placeId,
    }))
    setErrorMsg('')
  }

  const handleSubmit = async () => {
    const unselected = matchedActivityIds.filter((actId) => !selectedPlaces[actId])
    if (unselected.length > 0) {
      setErrorMsg('Please select a place for each matched activity.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const payload = Object.entries(selectedPlaces).map(([activityId, placeId]) => ({
        activityId,
        placeId,
      }))

      const res = await savePlaceSelectionsAction(hangoutId, payload)
      if (res.success) {
        router.push(`/hangouts/${hangoutId}/itinerary`)
      } else {
        setErrorMsg(res.error || 'Failed to save places.')
        setIsSubmitting(false)
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return {
    selectedPlaces,
    handleSelectPlace,
    handleSubmit,
    isSubmitting,
    errorMsg,
  }
}
