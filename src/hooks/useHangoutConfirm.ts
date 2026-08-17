'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { confirmHangoutAction } from '@/lib/actions/confirm'

export function useHangoutConfirm(
  hangoutId: string,
  currentUserId: string,
  agamConfirmed: boolean,
  divaConfirmed: boolean
) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isCurrentUserConfirmed =
    currentUserId.toLowerCase() === 'agam' ? agamConfirmed : divaConfirmed

  const isBothConfirmed = agamConfirmed && divaConfirmed

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await confirmHangoutAction(hangoutId, true)
      if (res.success) {
        router.refresh()
      } else {
        setErrorMsg(res.error || 'Failed to confirm.')
        setIsSubmitting(false)
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return {
    isCurrentUserConfirmed,
    isBothConfirmed,
    handleConfirm,
    isSubmitting,
    errorMsg,
  }
}
