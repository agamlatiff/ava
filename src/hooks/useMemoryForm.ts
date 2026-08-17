'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveMemoryAction } from '@/lib/actions/memory'

export function useMemoryForm(hangoutId: string) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleStarClick = (starValue: number) => {
    setRating(starValue)
    setErrorMsg('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setErrorMsg('Please give a star rating.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await saveMemoryAction(hangoutId, rating, note || undefined)
      if (res.success) {
        router.push('/memories')
      } else {
        setErrorMsg(res.error || 'Failed to save memory.')
        setIsSubmitting(false)
      }
    } catch {
      setErrorMsg('Something went wrong.')
      setIsSubmitting(false)
    }
  }

  return {
    rating,
    hoveredStar,
    setHoveredStar,
    note,
    setNote,
    isSubmitting,
    errorMsg,
    handleStarClick,
    handleSubmit,
  }
}
