'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createHangoutAction } from '@/lib/actions/hangouts'

export function useCreateHangout(initialActivity?: string) {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('16:00')
  const [endTime, setEndTime] = useState('20:00')
  const [area, setArea] = useState('')
  const [budgetDisplay, setBudgetDisplay] = useState('')
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Calculate duration automatically from time range
  const duration = useMemo(() => {
    if (!startTime || !endTime) return ''
    const [startH, startM] = startTime.split(':').map(Number)
    const [endH, endM] = endTime.split(':').map(Number)

    let diffMin = endH * 60 + endM - (startH * 60 + startM)
    if (diffMin < 0) diffMin += 24 * 60 // crosses midnight

    const hours = Math.floor(diffMin / 60)
    const mins = diffMin % 60

    if (hours === 0) return `~${mins} mins`
    if (mins === 0) return `~${hours} hours`
    return `~${hours}h ${mins}m`
  }, [startTime, endTime])

  // Handle budget input with Indonesian thousand separators (dot formatting)
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '')
    if (!rawVal) {
      setBudgetDisplay('')
      return
    }
    const num = parseInt(rawVal, 10)
    setBudgetDisplay(new Intl.NumberFormat('id-ID').format(num))
  }

  const rawBudgetNumber = useMemo(() => {
    if (!budgetDisplay) return null
    return parseInt(budgetDisplay.replace(/\./g, ''), 10)
  }, [budgetDisplay])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !startTime || !endTime || !area.trim()) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await createHangoutAction({
        date,
        startTime,
        endTime,
        area: area.trim(),
        budget: rawBudgetNumber,
        notes: notes.trim() || undefined,
      })

      if (res.success && res.hangoutId) {
        const nextUrl = initialActivity
          ? `/hangouts/${res.hangoutId}/activities?preselect=${encodeURIComponent(initialActivity)}`
          : `/hangouts/${res.hangoutId}/activities`
        router.push(nextUrl)
      } else {
        setErrorMsg(res.error || 'Failed to create plan. Please try again.')
        setIsSubmitting(false)
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return {
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    area,
    setArea,
    budgetDisplay,
    handleBudgetChange,
    notes,
    setNotes,
    duration,
    isSubmitting,
    errorMsg,
    handleSubmit,
  }
}
