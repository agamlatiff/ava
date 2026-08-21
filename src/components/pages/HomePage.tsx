'use client'

import Link from 'next/link'
import { useHomeData } from '@/hooks/useHomeData'
import { getHangoutRoute } from '@/lib/routes'
import {
  CoffeeIcon,
  FoodIcon,
  GamesIcon,
  WalkIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlusIcon,
} from '@/components/ui/OceanIcons'

import type { Hangout } from '@/db/schema'
import styles from './HomePage.module.css'

interface HomePageProps {
  userName: string
  upcomingHangout: Hangout | null
  recentHangouts: Hangout[]
}

const QUICK_ACTIVITIES = [
  { id: 'coffee', label: 'Coffee', icon: <CoffeeIcon size={26} color="var(--accent-cyan)" /> },
  { id: 'food', label: 'Food', icon: <FoodIcon size={26} color="var(--accent-cyan)" /> },
  { id: 'games', label: 'Games', icon: <GamesIcon size={26} color="var(--accent-cyan)" /> },
  { id: 'walk', label: 'Walk', icon: <WalkIcon size={26} color="var(--accent-cyan)" /> },
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
          Ready for our next adventure?
        </p>
      </section>

      {/* ── Next Hangout Card ── */}
      <section aria-label="Upcoming Hangout">
        <div className={`glass-card-strong ${styles.nextCard}`}>
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
                    ? 'TODAY!'
                    : upcomingHangout.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <CalendarIcon size={18} color="var(--accent-cyan)" />
                  <span>{upcomingHangout.date}</span>
                </div>
                <div className={styles.detailItem}>
                  <ClockIcon size={18} color="var(--accent-cyan)" />
                  <span className="text-time">
                    {upcomingHangout.startTime} – {upcomingHangout.endTime}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <MapPinIcon size={18} color="var(--accent-cyan)" />
                  <span>{upcomingHangout.area}</span>
                </div>
              </div>

              <Link
                href={getHangoutRoute(upcomingHangout)}
                className="btn-primary w-full"
              >
                View Plan <ArrowRightIcon size={18} />
              </Link>
            </>
          ) : (
            <div className={styles.emptyPlan}>
              <div className={styles.emptyIconWrapper}>
                <SparklesIcon size={36} color="var(--accent-cyan)" />
              </div>
              <h2 className="text-h3">No plans yet</h2>
              <p className="text-body-sm text-secondary">
                Let&apos;s fix that! Plan something special together.
              </p>
              <Link href="/hangouts/new" className="btn-primary">
                <PlusIcon size={18} /> Plan Something
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
              <div className={styles.chipIcon} aria-hidden="true">
                {act.icon}
              </div>
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
            <ArrowRightIcon size={18} />
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
