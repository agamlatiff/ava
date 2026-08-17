'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { savePartnerReactionsAction } from '@/lib/actions/activities'

export function useResponderReactions(
  hangoutId: string,
  candidateActivityIds: string[]
) {
  const router = useRouter()
  const [reactions, setReactions] = useState<
    Record<string, 'love' | 'like' | 'pass'>
  >({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleReact = (id: string, choice: 'love' | 'like' | 'pass') => {
    setReactions((prev) => ({
      ...prev,
      [id]: choice,
    }))
    setErrorMsg('')
  }

  const handleSubmit = async () => {
    const unvoted = candidateActivityIds.filter((id) => !reactions[id])
    if (unvoted.length > 0) {
      setErrorMsg('Please react to all of the proposed activities.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const payload = Object.entries(reactions).map(([activityId, choice]) => ({
        activityId,
        choice,
      }))

      const res = await savePartnerReactionsAction(hangoutId, payload)
      if (res.success) {
        router.push(`/hangouts/${hangoutId}/matches`)
      } else {
        setErrorMsg(res.error || 'Failed to submit reactions.')
        setIsSubmitting(false)
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return {
    reactions,
    handleReact,
    handleSubmit,
    isSubmitting,
    errorMsg,
  }
}
