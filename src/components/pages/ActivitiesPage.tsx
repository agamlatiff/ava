'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useActivitySelect } from '@/hooks/useActivitySelect'
import { useResponderReactions } from '@/hooks/useResponderReactions'
import { ActivityChip } from '@/components/ui/ActivityChip'
import { SparklesIcon, getActivityIcon, ArrowRightIcon } from '@/components/ui/OceanIcons'
import type { Activity, Hangout } from '@/db/schema'
import Link from 'next/link'
import styles from './ActivitiesPage.module.css'

interface ActivitiesPageProps {
  hangout: Hangout
  allActivities: Activity[]
  currentUserId: string
  existingChoices: {
    activityId: string
    userId: string
    choice: string
  }[]
  preselectedActivity?: string
}

export function ActivitiesPage({
  hangout,
  allActivities,
  currentUserId,
  existingChoices,
  preselectedActivity,
}: ActivitiesPageProps) {
  const router = useRouter()
  const isCreator = hangout.createdBy.toLowerCase() === currentUserId.toLowerCase()

  // ── Creator View Logic ──
  const creatorSelected = existingChoices
    .filter((c) => c.userId === hangout.createdBy && c.choice === 'selected')
    .map((c) => c.activityId)

  const initialSelected =
    creatorSelected.length > 0
      ? creatorSelected
      : preselectedActivity
      ? [preselectedActivity]
      : []

  const [isEditing, setIsEditing] = useState(creatorSelected.length === 0)
  const creatorHook = useActivitySelect(hangout.id, initialSelected)

  // ── Responder View Logic ──
  const candidateActivities = allActivities.filter((act) =>
    creatorSelected.includes(act.id)
  )

  const responderHook = useResponderReactions(
    hangout.id,
    candidateActivities.map((a) => a.id)
  )

  // Has responder already submitted?
  const hasPartnerResponded = existingChoices.some(
    (c) => c.userId !== hangout.createdBy
  )

  // Live auto-polling when waiting for partner's response
  useEffect(() => {
    if (!isCreator || hasPartnerResponded || creatorSelected.length === 0) return

    const interval = setInterval(() => {
      router.refresh()
    }, 5000)

    return () => clearInterval(interval)
  }, [isCreator, hasPartnerResponded, creatorSelected.length, router])

  // If responder has already voted, offer link to Match Results
  if (hasPartnerResponded) {
    return (
      <div className={styles.root}>
        <div className={`glass-card-strong ${styles.statusCard}`}>
          <div className={styles.statusIconWrapper}>
            <SparklesIcon size={32} color="var(--accent-cyan)" />
          </div>
          <h1 className={styles.title}>Both Choices Submitted!</h1>
          <p className={`text-body-sm ${styles.subtitle}`}>
            Preferences have been shared. Let&apos;s see what matched!
          </p>
          <Link href={`/hangouts/${hangout.id}/matches`} className="btn-primary">
            See Matches <ArrowRightIcon size={18} />
          </Link>
        </div>
      </div>
    )
  }

  // ── CREATOR WAITING VIEW (Already submitted, waiting for partner) ──
  if (isCreator && !isEditing && creatorSelected.length > 0) {
    const partnerName = hangout.createdBy.toLowerCase() === 'agam' ? 'Diva' : 'Agam'
    return (
      <div className={styles.root}>
        <div className={`glass-card-strong ${styles.statusCard}`}>
          <div className={styles.statusIconWrapper}>
            <SparklesIcon size={32} color="var(--accent-cyan)" />
          </div>
          <h1 className={styles.title}>Activities Sent!</h1>
          <p className={`text-body-sm ${styles.subtitle}`}>
            You picked {creatorSelected.length} activities. Waiting for {partnerName} to react and choose favorites!
          </p>

          <div className={styles.chipList}>
            {allActivities
              .filter((a) => creatorSelected.includes(a.id))
              .map((a) => (
                <span key={a.id} className={styles.selectedPill}>
                  {getActivityIcon(a.id, 16, 'var(--accent-cyan)')}
                  <span>{a.name}</span>
                </span>
              ))}
          </div>

          <div className={styles.actionRow}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setIsEditing(true)}
            >
              Change Picks
            </button>
            <Link href="/home" className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── CREATOR EDIT/SELECT VIEW ──
  if (isCreator) {
    const partnerName = hangout.createdBy.toLowerCase() === 'agam' ? 'Diva' : 'Agam'
    const handleCreatorSubmit = async () => {
      await creatorHook.handleSubmit()
      setIsEditing(false)
    }
    return (
      <div className={styles.root}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Choose Activities</h1>
          <p className={`text-body-sm ${styles.subtitle}`}>
            Pick activities you&apos;d love to do. {partnerName} will choose favorites!
          </p>
        </div>

        <div className={styles.grid}>
          {allActivities.map((act) => (
            <ActivityChip
              key={act.id}
              id={act.id}
              name={act.name}
              isSelected={creatorHook.selectedIds.includes(act.id)}
              onToggleSelect={creatorHook.handleToggle}
              mode="select"
            />
          ))}
        </div>

        {creatorHook.errorMsg && (
          <p className={styles.errorMessage}>
            {creatorHook.errorMsg}
          </p>
        )}

        <div className={styles.footerRow}>
          <span className="text-caption text-muted">
            {creatorHook.count} selected
          </span>

          <button
            type="button"
            className="btn-primary"
            disabled={creatorHook.count === 0 || creatorHook.isSubmitting}
            onClick={handleCreatorSubmit}
          >
            {creatorHook.isSubmitting ? 'Sending...' : `Send to ${partnerName}`}
          </button>
        </div>
      </div>
    )
  }

  // ── RESPONDER VIEW (Partner) ──
  return (
    <div className={styles.root}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>{hangout.createdBy.toUpperCase()}&apos;S PLAN</h1>
        <p className={`text-body-sm ${styles.subtitle}`}>
          {hangout.date} · {hangout.startTime}–{hangout.endTime} · {hangout.area}
        </p>
        <p className="text-caption text-muted" style={{ marginTop: 'var(--space-1)' }}>
          React to each activity with Love, Like, or Pass.
        </p>
      </div>

      <div className={styles.grid}>
        {candidateActivities.map((act) => (
          <ActivityChip
            key={act.id}
            id={act.id}
            name={act.name}
            reaction={responderHook.reactions[act.id]}
            onReact={responderHook.handleReact}
            mode="react"
          />
        ))}
      </div>

      {responderHook.errorMsg && (
        <p className={styles.errorMessage}>
          {responderHook.errorMsg}
        </p>
      )}

      <button
        type="button"
        className="btn-primary w-full"
        disabled={responderHook.isSubmitting}
        onClick={responderHook.handleSubmit}
      >
        {responderHook.isSubmitting ? 'Submitting...' : 'Submit Choices'}
      </button>
    </div>
  )
}
