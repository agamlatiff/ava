'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useActivitySelect } from '@/hooks/useActivitySelect'
import { useResponderReactions } from '@/hooks/useResponderReactions'
import { ActivityChip } from '@/components/ui/ActivityChip'
import type { Activity, Hangout } from '@/db/schema'
import Link from 'next/link'

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
      <div style={{ maxWidth: '580px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: '3rem' }}>🎉</span>
          <h1 className="text-h2">Both Choices Submitted!</h1>
          <p className="text-body-sm text-secondary">
            Preferences have been shared. Let&apos;s see what matched!
          </p>
          <Link href={`/hangouts/${hangout.id}/matches`} className="btn-primary">
            See Matches →
          </Link>
        </div>
      </div>
    )
  }

  // ── CREATOR WAITING VIEW (Already submitted, waiting for partner) ──
  if (isCreator && !isEditing && creatorSelected.length > 0) {
    const partnerName = hangout.createdBy.toLowerCase() === 'agam' ? 'Diva' : 'Agam'
    return (
      <div style={{ maxWidth: '580px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: '3rem' }}>📨</span>
          <h1 className="text-h2">Activities Sent!</h1>
          <p className="text-body-sm text-secondary">
            You picked {creatorSelected.length} activities. Waiting for {partnerName} to react and choose favorites! 🐢
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBlock: 'var(--space-3)' }}>
            {allActivities
              .filter((a) => creatorSelected.includes(a.id))
              .map((a) => (
                <span
                  key={a.id}
                  className="text-caption"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255,255,255,0.12)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                  }}
                >
                  <span>{a.icon}</span>
                  <span>{a.name}</span>
                </span>
              ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: 'var(--space-2)' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setIsEditing(true)}
            >
              Change Picks ✏️
            </button>
            <Link href="/home" className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>
              Back to Home 🏠
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
      <div style={{ maxWidth: '580px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h1 className="text-h2">Choose Activities 🐠</h1>
          <p className="text-body-sm text-secondary">
            Pick activities you&apos;d love to do. {partnerName} will choose favorites!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          {allActivities.map((act) => (
            <ActivityChip
              key={act.id}
              id={act.id}
              name={act.name}
              icon={act.icon}
              isSelected={creatorHook.selectedIds.includes(act.id)}
              onToggleSelect={creatorHook.handleToggle}
              mode="select"
            />
          ))}
        </div>

        {creatorHook.errorMsg && (
          <p style={{ color: 'var(--error)', fontSize: 'var(--text-body-sm)' }}>
            {creatorHook.errorMsg}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-caption text-muted">
            {creatorHook.count} selected
          </span>

          <button
            type="button"
            className="btn-primary"
            disabled={creatorHook.count === 0 || creatorHook.isSubmitting}
            onClick={handleCreatorSubmit}
          >
            {creatorHook.isSubmitting ? 'Sending...' : `Send to ${partnerName} 📨`}
          </button>
        </div>
      </div>
    )
  }

  // ── RESPONDER VIEW (Partner) ──
  return (
    <div style={{ maxWidth: '580px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <h1 className="text-h2">{hangout.createdBy.toUpperCase()}&apos;S PLAN 🐙</h1>
        <p className="text-body-sm text-secondary">
          {hangout.date} · {hangout.startTime}–{hangout.endTime} · {hangout.area}
        </p>
        <p className="text-caption text-muted" style={{ marginTop: 'var(--space-1)' }}>
          React to each activity with ❤️ Love, 👍 Like, or 👎 Pass.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        {candidateActivities.map((act) => (
          <ActivityChip
            key={act.id}
            id={act.id}
            name={act.name}
            icon={act.icon}
            reaction={responderHook.reactions[act.id]}
            onReact={responderHook.handleReact}
            mode="react"
          />
        ))}
      </div>

      {responderHook.errorMsg && (
        <p style={{ color: 'var(--error)', fontSize: 'var(--text-body-sm)' }}>
          {responderHook.errorMsg}
        </p>
      )}

      <button
        type="button"
        className="btn-primary w-full"
        disabled={responderHook.isSubmitting}
        onClick={responderHook.handleSubmit}
      >
        {responderHook.isSubmitting ? 'Submitting...' : 'Submit Choices 🐚'}
      </button>
    </div>
  )
}
