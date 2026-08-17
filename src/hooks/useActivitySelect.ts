'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveCreatorActivitiesAction } from '@/lib/actions/activities'

export function useActivitySelect(hangoutId: string, initialSelected: string[] = []) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
    setErrorMsg('')
  }

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      setErrorMsg('Please choose at least 1 activity.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await saveCreatorActivitiesAction(hangoutId, selectedIds)
      if (res.success) {
        router.push(`/hangouts/${hangoutId}/activities`)
        router.refresh()
      } else {
        setErrorMsg(res.error || 'Failed to save activities.')
        setIsSubmitting(false)
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return {
    selectedIds,
    handleToggle,
    handleSubmit,
    isSubmitting,
    errorMsg,
    count: selectedIds.length,
  }
}
