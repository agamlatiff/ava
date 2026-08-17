'use client'

import { useHangoutConfirm } from '@/hooks/useHangoutConfirm'
import type { Hangout } from '@/db/schema'
import Link from 'next/link'

interface ConfirmPageProps {
  hangout: Hangout
  currentUserId: string
}

export function ConfirmPage({ hangout, currentUserId }: ConfirmPageProps) {
  const agamConfirmed = hangout.agamConfirmed === 1
  const divaConfirmed = hangout.divaConfirmed === 1

  const {
    isCurrentUserConfirmed,
    isBothConfirmed,
    handleConfirm,
    isSubmitting,
    errorMsg,
  } = useHangoutConfirm(
    hangout.id,
    currentUserId,
    agamConfirmed,
    divaConfirmed
  )

  return (
    <div style={{ maxWidth: '540px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
        <h1 className="text-display" style={{ fontSize: '2.5rem' }}>
          {isBothConfirmed ? "IT'S ON! 🎉" : 'Confirm Hangout 🌊'}
        </h1>
        <p className="text-body-sm text-secondary">
          {isBothConfirmed
            ? `See you ${hangout.date}! Get ready for our adventure.`
            : 'Both of you must confirm to lock in the plan.'}
        </p>
      </div>

      <div className="glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* ── Agam Status ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🐠</span>
            <span className="text-body" style={{ fontWeight: 600 }}>Agam</span>
          </div>

          <span
            className="text-caption"
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: agamConfirmed ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 183, 77, 0.2)',
              color: agamConfirmed ? '#81C784' : '#FFB74D',
              fontWeight: 600,
            }}
          >
            {agamConfirmed ? '✓ Confirmed ✨' : 'Waiting... 🐢'}
          </span>
        </div>

        {/* ── Diva Status ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🐙</span>
            <span className="text-body" style={{ fontWeight: 600 }}>Diva</span>
          </div>

          <span
            className="text-caption"
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: divaConfirmed ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 183, 77, 0.2)',
              color: divaConfirmed ? '#81C784' : '#FFB74D',
              fontWeight: 600,
            }}
          >
            {divaConfirmed ? '✓ Confirmed ✨' : 'Waiting... 🐢'}
          </span>
        </div>
      </div>

      {errorMsg && (
        <p style={{ color: 'var(--error)', fontSize: 'var(--text-body-sm)', textAlign: 'center' }}>
          {errorMsg}
        </p>
      )}

      {/* ── Action Buttons ── */}
      {isBothConfirmed ? (
        <Link href="/home" className="btn-primary w-full text-center">
          Back to Home 🏠
        </Link>
      ) : !isCurrentUserConfirmed ? (
        <button
          type="button"
          className="btn-primary w-full"
          disabled={isSubmitting}
          onClick={handleConfirm}
        >
          {isSubmitting ? 'Confirming...' : "✓ I'm In!"}
        </button>
      ) : (
        <div className="glass-card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          <p className="text-body-sm text-secondary">
            You confirmed! Waiting for partner to confirm... 🐢
          </p>
        </div>
      )}
    </div>
  )
}
