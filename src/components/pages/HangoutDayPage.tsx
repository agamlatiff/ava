'use client'

import { useHangoutDay } from '@/hooks/useHangoutDay'
import { Timeline, type TimelineStop } from '@/components/ui/Timeline'
import { SparklesIcon, ArrowRightIcon } from '@/components/ui/OceanIcons'
import type { Hangout } from '@/db/schema'
import Link from 'next/link'
import styles from './HangoutDayPage.module.css'

interface HangoutDayPageProps {
  hangout: Hangout
  stops: TimelineStop[]
}

export function HangoutDayPage({ hangout, stops }: HangoutDayPageProps) {
  const {
    completedCount,
    totalCount,
    allComplete,
    handleMarkComplete,
  } = useHangoutDay(hangout.id, stops)

  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <div className={styles.headerSection}>
        <div>
          <h1 className={styles.title}>
            {allComplete ? 'Adventure Complete!' : "Today's Adventure"}
          </h1>
          <p className={`text-body-sm ${styles.subtitle}`}>
            {hangout.date} · {hangout.area}
          </p>
        </div>

        <span
          className={`${styles.progressBadge} ${
            allComplete ? styles.badgeDone : styles.badgeActive
          }`}
        >
          {completedCount}/{totalCount} Done
        </span>
      </div>

      {/* ── Progress Bar ── */}
      <div className={styles.progressBarTrack}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Interactive Timeline ── */}
      <Timeline
        stops={stops}
        interactive={!allComplete}
        onMarkComplete={handleMarkComplete}
      />

      {/* ── All Complete CTA ── */}
      {allComplete && (
        <Link
          href={`/hangouts/${hangout.id}/memory`}
          className="btn-primary w-full"
          style={{ textAlign: 'center' }}
        >
          <SparklesIcon size={18} /> Save This Memory <ArrowRightIcon size={18} />
        </Link>
      )}
    </div>
  )
}
