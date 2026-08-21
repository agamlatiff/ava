'use client'

import Link from 'next/link'
import { useHomeData } from '@/hooks/useHomeData'
import { getHangoutRoute } from '@/lib/routes'
import {
  CoffeeIcon,
  FoodIcon,
  GamesIcon,
  WalkIcon,
  MovieIcon,
  ExploreIcon,
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
  { id: 'coffee', label: 'Coffee', icon: <CoffeeIcon size={20} color="var(--accent-cyan)" /> },
  { id: 'food', label: 'Food', icon: <FoodIcon size={20} color="var(--accent-cyan)" /> },
  { id: 'games', label: 'Games', icon: <GamesIcon size={20} color="var(--accent-cyan)" /> },
  { id: 'walk', label: 'Walk', icon: <WalkIcon size={20} color="var(--accent-cyan)" /> },
  { id: 'movie', label: 'Movie', icon: <MovieIcon size={20} color="var(--accent-cyan)" /> },
  { id: 'explore', label: 'Explore', icon: <ExploreIcon size={20} color="var(--accent-cyan)" /> },
]

export function HomePage({
  userName,
  upcomingHangout,
  recentHangouts,
}: HomePageProps) {
  const { greeting, hangoutState } = useHomeData(userName, upcomingHangout)

  return (
    <div className={styles.container}>
      {/* ── Header Greeting ── */}
      <header className={styles.header}>
        <div className={styles.greetingGroup}>
          <h1 className={styles.greetingTitle}>{greeting}</h1>
          <p className={styles.greetingSubtitle}>
            {upcomingHangout ? "Here is your upcoming plan together." : "What would you like to explore next?"}
          </p>
        </div>
      </header>

      {/* ── PRIMARY HIERARCHY: Next Hangout / Active Plan ── */}
      <section className={styles.primarySection} aria-label="Upcoming Hangout">
        {upcomingHangout ? (
          <div className={styles.heroPlanCard}>
            <div className={styles.planCardHeader}>
              <div className={styles.statusGroup}>
                <span
                  className={`${styles.statusBadge} ${
                    hangoutState === 'today' ? styles.statusBadgeToday : ''
                  }`}
                >
                  {hangoutState === 'today'
                    ? 'TODAY'
                    : upcomingHangout.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <span className={styles.planDateText}>
                <CalendarIcon size={16} color="var(--accent-cyan)" />
                {upcomingHangout.date}
              </span>
            </div>

            <div className={styles.planDestinationGroup}>
              <h2 className={styles.destinationTitle}>{upcomingHangout.area}</h2>
              <div className={styles.planMetaRow}>
                <span className={styles.metaItem}>
                  <ClockIcon size={16} color="var(--text-muted)" />
                  <span className="text-time">
                    {upcomingHangout.startTime} – {upcomingHangout.endTime}
                  </span>
                </span>
                <span className={styles.metaItem}>
                  <MapPinIcon size={16} color="var(--text-muted)" />
                  <span>{upcomingHangout.area}</span>
                </span>
              </div>
            </div>

            <div className={styles.planActionRow}>
              <Link
                href={getHangoutRoute(upcomingHangout)}
                className="btn-primary"
              >
                View Plan <ArrowRightIcon size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.heroEmptyState}>
            <div className={styles.emptyContent}>
              <div className={styles.emptyIcon}>
                <SparklesIcon size={28} color="var(--accent-cyan)" />
              </div>
              <div className={styles.emptyTextGroup}>
                <h2 className={styles.emptyTitle}>No active plans</h2>
                <p className={styles.emptySubtitle}>
                  Ready for a new adventure together? Plan a date, pick places, and make memories.
                </p>
              </div>
            </div>
            <Link href="/hangouts/new" className="btn-primary">
              <PlusIcon size={18} /> Plan Hangout
            </Link>
          </div>
        )}
      </section>

      {/* ── SECONDARY HIERARCHY: Quick Activities ── */}
      <section className={styles.secondarySection} aria-label="Quick Activities">
        <h2 className={styles.sectionHeading}>Quick Plan</h2>
        <div className={styles.activityGrid}>
          {QUICK_ACTIVITIES.map((act) => (
            <Link
              key={act.id}
              href={`/hangouts/new?activity=${act.id}`}
              className={styles.activityPill}
            >
              <span className={styles.pillIcon}>{act.icon}</span>
              <span className={styles.pillLabel}>{act.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TERTIARY HIERARCHY: Recent Adventures ── */}
      {recentHangouts.length > 0 && (
        <section className={styles.tertiarySection} aria-label="Recent Adventures">
          <div className={styles.recentHeader}>
            <h2 className={styles.sectionHeading}>Recent Adventures</h2>
            <Link href="/memories" className={styles.viewAllLink}>
              View All <ArrowRightIcon size={14} />
            </Link>
          </div>

          <div className={styles.recentList}>
            {recentHangouts.map((h, i) => (
              <div key={h.id} className={styles.recentRow}>
                <div className={styles.recentMain}>
                  <span className={styles.recentIndex}>
                    #{String(recentHangouts.length - i).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className={styles.recentArea}>{h.area}</h3>
                    <p className={styles.recentDate}>{h.date}</p>
                  </div>
                </div>
                <span className={styles.recentStatus}>
                  {h.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
