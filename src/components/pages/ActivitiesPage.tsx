'use client'

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
}

export function ActivitiesPage({
  hangout,
  allActivities,
  currentUserId,
  existingChoices,
}: ActivitiesPageProps) {
  const isCreator = hangout.createdBy.toLowerCase() === currentUserId.toLowerCase()

  // ── Creator View Logic ──
  const creatorSelected = existingChoices
    .filter((c) => c.userId === hangout.createdBy && c.choice === 'selected')
    .map((c) => c.activityId)

  const creatorHook = useActivitySelect(hangout.id, creatorSelected)

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

  // ── CREATOR VIEW ──
  if (isCreator) {
    return (
      <div style={{ maxWidth: '580px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h1 className="text-h2">Choose Activities 🐠</h1>
          <p className="text-body-sm text-secondary">
            Pick activities you&apos;d love to do. Diva will choose her favorites!
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
            onClick={creatorHook.handleSubmit}
          >
            {creatorHook.isSubmitting ? 'Sending...' : 'Send to Partner 📨'}
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
