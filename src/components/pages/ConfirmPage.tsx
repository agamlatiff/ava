'use client'

import { useHangoutConfirm } from '@/hooks/useHangoutConfirm'
import { CheckCircleIcon } from '@/components/ui/OceanIcons'
import type { Hangout } from '@/db/schema'
import Link from 'next/link'
import styles from './ConfirmPage.module.css'

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
    <div className={styles.root}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          {isBothConfirmed ? "IT'S ON!" : 'Confirm Hangout'}
        </h1>
        <p className={`text-body-sm ${styles.subtitle}`}>
          {isBothConfirmed
            ? `See you ${hangout.date}! Get ready for our adventure.`
            : 'Both of you must confirm to lock in the plan.'}
        </p>
      </div>

      <div className={`glass-card-strong ${styles.statusCard}`}>
        {/* ── Agam Status ── */}
        <div className={styles.userRow}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>A</div>
            <span className={styles.userName}>Agam</span>
          </div>

          <span
            className={`${styles.statusPill} ${
              agamConfirmed ? styles.statusPillConfirmed : styles.statusPillWaiting
            }`}
          >
            {agamConfirmed ? '✓ Confirmed' : 'Waiting...'}
          </span>
        </div>

        {/* ── Diva Status ── */}
        <div className={styles.userRow}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar} style={{ background: 'linear-gradient(135deg, var(--warm-coral), var(--warm-pink))' }}>
              D
            </div>
            <span className={styles.userName}>Diva</span>
          </div>

          <span
            className={`${styles.statusPill} ${
              divaConfirmed ? styles.statusPillConfirmed : styles.statusPillWaiting
            }`}
          >
            {divaConfirmed ? '✓ Confirmed' : 'Waiting...'}
          </span>
        </div>
      </div>

      {errorMsg && (
        <p className={styles.errorMessage}>
          {errorMsg}
        </p>
      )}

      {/* ── Action Buttons ── */}
      {isBothConfirmed ? (
        <Link href="/home" className="btn-primary w-full text-center">
          Back to Home
        </Link>
      ) : !isCurrentUserConfirmed ? (
        <button
          type="button"
          className="btn-primary w-full"
          disabled={isSubmitting}
          onClick={handleConfirm}
        >
          <CheckCircleIcon size={18} />
          {isSubmitting ? 'Confirming...' : "I'm In!"}
        </button>
      ) : (
        <div className={`glass-card ${styles.waitingBox}`}>
          <p className="text-body-sm text-secondary">
            You confirmed! Waiting for partner to confirm...
          </p>
        </div>
      )}
    </div>
  )
}
