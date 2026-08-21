'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createHangoutAction } from '@/lib/actions/hangouts'

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night' | 'custom'
export type DurationOption = 'quick' | 'chill' | 'long' | 'custom'
export type DatePreset = 'today' | 'tomorrow' | 'this_weekend' | 'next_week' | 'custom'
export type LocationPreset = 'not_decided' | 'campus' | 'downtown' | 'beach' | 'custom'

// Helper: Format Date to YYYY-MM-DD
function formatDateISO(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper: Get next Saturday
function getNextSaturday(): Date {
  const d = new Date()
  const day = d.getDay()
  const diff = (6 - day + 7) % 7 || 7 // Next Saturday
  d.setDate(d.getDate() + diff)
  return d
}

// Helper: Get next Friday
function getNextFriday(): Date {
  const d = new Date()
  const day = d.getDay()
  const diff = (5 - day + 7) % 7 || 7
  d.setDate(d.getDate() + diff)
  return d
}

export function useAdventurePlanner(initialActivity?: string) {
  const router = useRouter()

  // ── 1. Step & State Definition ──
  const [step, setStep] = useState(1) // 1: Activity, 2: When, 3: Location, 4: Preview
  const [activityIds, setActivityIds] = useState<string[]>(
    initialActivity ? [initialActivity] : []
  )

  const [datePreset, setDatePreset] = useState<DatePreset>('this_weekend')
  const [customDate, setCustomDate] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return formatDateISO(d)
  })

  const [timePeriod, setTimePeriod] = useState<TimePeriod>('evening')
  const [customStartTime, setCustomStartTime] = useState('17:00')

  const [duration, setDuration] = useState<DurationOption>('chill')
  const [customDurationMinutes, setCustomDurationMinutes] = useState(150)

  const [locationPreset, setLocationPreset] = useState<LocationPreset>('campus')
  const [customLocation, setCustomLocation] = useState('')

  const [budgetDisplay, setBudgetDisplay] = useState('')
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // ── 2. Toggle Activity Selection ──
  const toggleActivity = useCallback((id: string) => {
    setActivityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  // ── 3. Derived Values for the System ──

  // Computed Target Date String (YYYY-MM-DD)
  const derivedDate = useMemo<string>(() => {
    const today = new Date()
    switch (datePreset) {
      case 'today':
        return formatDateISO(today)
      case 'tomorrow': {
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)
        return formatDateISO(tomorrow)
      }
      case 'this_weekend':
        return formatDateISO(getNextSaturday())
      case 'next_week':
        return formatDateISO(getNextFriday())
      case 'custom':
        return customDate || formatDateISO(today)
      default:
        return formatDateISO(today)
    }
  }, [datePreset, customDate])

  // Friendly display label for Date
  const derivedDateDisplay = useMemo<string>(() => {
    const parts = derivedDate.split('-').map(Number)
    const d = new Date(parts[0], parts[1] - 1, parts[2])
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }, [derivedDate])

  // Computed Start Time ('HH:MM')
  const derivedStartTime = useMemo<string>(() => {
    if (timePeriod === 'custom') return customStartTime || '17:00'
    switch (timePeriod) {
      case 'morning':
        return '09:30'
      case 'afternoon':
        return '14:00'
      case 'evening':
        return '17:00'
      case 'night':
        return '19:30'
      default:
        return '17:00'
    }
  }, [timePeriod, customStartTime])

  // Computed Duration (Minutes)
  const derivedDurationMinutes = useMemo<number>(() => {
    if (duration === 'custom') return customDurationMinutes || 150
    switch (duration) {
      case 'quick':
        return 60 // 1 hour
      case 'chill':
        return 150 // 2.5 hours
      case 'long':
        return 240 // 4 hours
      default:
        return 150
    }
  }, [duration, customDurationMinutes])

  // Computed End Time ('HH:MM')
  const derivedEndTime = useMemo<string>(() => {
    const [startH, startM] = derivedStartTime.split(':').map(Number)
    const totalStartMins = startH * 60 + startM
    const totalEndMins = (totalStartMins + derivedDurationMinutes) % (24 * 60)

    const endH = String(Math.floor(totalEndMins / 60)).padStart(2, '0')
    const endM = String(totalEndMins % 60).padStart(2, '0')
    return `${endH}:${endM}`
  }, [derivedStartTime, derivedDurationMinutes])

  // Computed Area String
  const derivedArea = useMemo<string>(() => {
    if (locationPreset === 'custom') {
      return customLocation.trim() || 'Somewhere special'
    }
    switch (locationPreset) {
      case 'not_decided':
        return 'To be decided together'
      case 'campus':
        return 'Around Campus & University'
      case 'downtown':
        return 'Downtown / Central District'
      case 'beach':
        return 'Beachside & Coastal Walk'
      default:
        return 'Around Campus & University'
    }
  }, [locationPreset, customLocation])

  // Friendly duration display
  const durationLabel = useMemo<string>(() => {
    const hours = Math.floor(derivedDurationMinutes / 60)
    const mins = derivedDurationMinutes % 60
    if (mins === 0) return `About ${hours} ${hours === 1 ? 'hour' : 'hours'}`
    return `About ${hours}h ${mins}m`
  }, [derivedDurationMinutes])

  // Friendly time period label
  const timePeriodLabel = useMemo<string>(() => {
    switch (timePeriod) {
      case 'morning':
        return 'Morning (09:30)'
      case 'afternoon':
        return 'Afternoon (14:00)'
      case 'evening':
        return 'Around Evening (17:00)'
      case 'night':
        return 'Night Out (19:30)'
      case 'custom':
        return `Custom (${derivedStartTime})`
      default:
        return 'Evening'
    }
  }, [timePeriod, derivedStartTime])

  // ── 4. Navigation Handlers ──
  const goNext = () => {
    setErrorMsg('')
    if (step === 1 && activityIds.length === 0) {
      setErrorMsg('Please pick at least one activity to begin.')
      return
    }
    if (step < 4) {
      setStep((prev) => prev + 1)
    }
  }

  const goBack = () => {
    setErrorMsg('')
    if (step > 1) {
      setStep((prev) => prev - 1)
    } else {
      router.push('/home')
    }
  }

  // ── 5. Budget Input Handler ──
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

  // ── 6. Final Submission to Backend ──
  const handleCreateAdventure = async () => {
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await createHangoutAction({
        date: derivedDate,
        startTime: derivedStartTime,
        endTime: derivedEndTime,
        area: derivedArea,
        budget: rawBudgetNumber,
        notes: notes.trim() || undefined,
      })

      if (res.success && res.hangoutId) {
        // Forward selected activities as query params for preselection
        const primaryActivity = activityIds[0]
        const nextUrl = primaryActivity
          ? `/hangouts/${res.hangoutId}/activities?preselect=${encodeURIComponent(primaryActivity)}`
          : `/hangouts/${res.hangoutId}/activities`
        router.push(nextUrl)
      } else {
        setErrorMsg(res.error || 'Failed to start adventure. Please try again.')
        setIsSubmitting(false)
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return {
    step,
    setStep,
    activityIds,
    toggleActivity,
    datePreset,
    setDatePreset,
    customDate,
    setCustomDate,
    timePeriod,
    setTimePeriod,
    customStartTime,
    setCustomStartTime,
    duration,
    setDuration,
    customDurationMinutes,
    setCustomDurationMinutes,
    locationPreset,
    setLocationPreset,
    customLocation,
    setCustomLocation,
    budgetDisplay,
    handleBudgetChange,
    notes,
    setNotes,
    derivedDate,
    derivedDateDisplay,
    derivedStartTime,
    derivedEndTime,
    derivedArea,
    derivedDurationMinutes,
    durationLabel,
    timePeriodLabel,
    isSubmitting,
    errorMsg,
    goNext,
    goBack,
    handleCreateAdventure,
  }
}
