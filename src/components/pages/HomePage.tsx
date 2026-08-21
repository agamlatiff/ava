'use client'

import Link from 'next/link'
import { useHomeData } from '@/hooks/useHomeData'
import { getHangoutRoute } from '@/lib/routes'
import type { Hangout } from '@/db/schema'
import styles from './HomePage.module.css'

interface HomePageProps {
  userName: string
  upcomingHangout: Hangout | null
  recentHangouts: Hangout[]
}

const QUICK_ACTIVITIES = [
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'food', label: 'Food', icon: '🍜' },
  { id: 'games', label: 'Games', icon: '🎮' },
  { id: 'walk', label: 'Walk', icon: '🚶' },
]

export function HomePage({
  userName,
  upcomingHangout,
  recentHangouts,
}: HomePageProps) {
  const { greeting, hangoutState } = useHomeData(userName, upcomingHangout)

  return (
    <div className={styles.homeRoot}>
      {/* ── Greeting Header ── */}
      <section className={styles.greetingSection}>
        <h1 className={styles.greetingTitle}>{greeting}</h1>
        <p className={`text-body-sm ${styles.greetingSub}`}>
          Ready for our next adventure? 🌊
        </p>
      </section>

      {/* ── Next Hangout Card ── */}
      <section aria-label="Upcoming Hangout">
        <div className={`glass-card ${styles.nextCard}`}>
          {upcomingHangout ? (
            <>
              <div className={styles.cardHeader}>
                <h2 className="text-h3">Next Hangout</h2>
                <span
                  className={`${styles.cardBadge} ${
                    hangoutState === 'today' ? styles.cardBadgeToday : ''
                  }`}
                >
                  {hangoutState === 'today'
                    ? 'TODAY! 🎉'
                    : upcomingHangout.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span aria-hidden="true">🗓️</span>
                  <span>{upcomingHangout.date}</span>
                </div>
                <div className={styles.detailItem}>
                  <span aria-hidden="true">⏰</span>
                  <span className="text-time">
                    {upcomingHangout.startTime} – {upcomingHangout.endTime}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span aria-hidden="true">📍</span>
                  <span>{upcomingHangout.area}</span>
                </div>
              </div>

              <Link
                href={getHangoutRoute(upcomingHangout)}
                className="btn-primary w-full"
              >
                View Plan →
              </Link>
            </>
          ) : (
            <div className={styles.emptyPlan}>
              <span style={{ fontSize: '2.5rem' }} aria-hidden="true">
                🐠
              </span>
              <h2 className="text-h3">No plans yet</h2>
              <p className="text-body-sm text-secondary">
                Let&apos;s fix that! Plan something special together.
              </p>
              <Link href="/hangouts/new" className="btn-primary">
                + Plan Something
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Quick Plan ── */}
      <section aria-label="Quick Plan">
        <h2 className={styles.sectionTitle}>Quick Plan</h2>
        <div className={styles.quickPlanGrid}>
          {QUICK_ACTIVITIES.map((act) => (
            <Link
              key={act.id}
              href={`/hangouts/new?activity=${act.id}`}
              className={styles.quickChip}
            >
              <span className={styles.chipIcon} aria-hidden="true">
                {act.icon}
              </span>
              <span className={styles.chipLabel}>{act.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Explore Places ── */}
      <section aria-label="Explore">
        <Link href="/hangouts/new" className={styles.exploreCard}>
          <div>
            <h2 className="text-h3">Explore</h2>
            <p className="text-body-sm text-muted">Find interesting places around you</p>
          </div>
          <span className={styles.exploreArrow} aria-hidden="true">
            →
          </span>
        </Link>
      </section>

      {/* ── Recent Adventures ── */}
      {recentHangouts.length > 0 && (
        <section aria-label="Recent Adventures">
          <h2 className={styles.sectionTitle}>Recent Adventures</h2>
          <div className={styles.recentList}>
            {recentHangouts.map((h, i) => (
              <div key={h.id} className={styles.recentItem}>
                <div>
                  <p className="text-body" style={{ fontWeight: 600 }}>
                    Adventure #{recentHangouts.length - i}
                  </p>
                  <p className="text-caption text-muted">{h.date}</p>
                </div>
                <span className="text-caption text-secondary">{h.area}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
