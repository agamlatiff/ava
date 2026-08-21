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
  StudyIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlusIcon,
  BellIcon,
  FishOutlineIcon,
  ChevronDownIcon,
  JellyfishIcon,
  SunCloudIcon,
  RainIcon,
  WindIcon,
  DropletIcon,
  SendIcon,
} from '@/components/ui/OceanIcons'
import type { Hangout } from '@/db/schema'
import styles from './HomePage.module.css'

interface HomePageProps {
  userName: string
  upcomingHangout: Hangout | null
  recentHangouts: Hangout[]
}

const ACTIVITIES = [
  { id: 'coffee', label: 'Coffee', icon: <CoffeeIcon size={28} color="#80DEEA" /> },
  { id: 'food', label: 'Food', icon: <FoodIcon size={28} color="#FF8A65" /> },
  { id: 'games', label: 'Games', icon: <GamesIcon size={28} color="#BA68C8" /> },
  { id: 'walk', label: 'Walk', icon: <WalkIcon size={28} color="#4DD0E1" /> },
  { id: 'movie', label: 'Movie', icon: <MovieIcon size={28} color="#FFB74D" /> },
  { id: 'study', label: 'Study', icon: <StudyIcon size={28} color="#81C784" /> },
]

export function HomePage({
  userName,
  upcomingHangout,
  recentHangouts,
}: HomePageProps) {
  const { greeting, hangoutState } = useHomeData(userName, upcomingHangout)
  const partnerName = userName.toLowerCase() === 'diva' ? 'Agam' : 'Diva'

  return (
    <div className={styles.dashboardContainer}>
      {/* ── Top Header Greeting & Utility Actions ── */}
      <header className={styles.topHeader}>
        <div className={styles.greetingGroup}>
          <h1 className={styles.greetingTitle}>
            {greeting}
          </h1>
          <p className={styles.greetingSub}>
            Ready for our next adventure?
          </p>
        </div>


        <div className={styles.headerUtilities}>
          <button className={styles.iconCircleBtn} aria-label="Notifications" title="Notifications">
            <BellIcon size={18} color="var(--text-secondary)" />
          </button>
          <div className={styles.userBadgeBtn}>
            <div className={styles.userBadgeAvatar}>
              <FishOutlineIcon size={18} color="#FFFFFF" />
            </div>
            <ChevronDownIcon size={14} color="var(--text-muted)" />
          </div>
        </div>
      </header>

      {/* ── 2-Column Responsive Dashboard Layout ── */}
      <div className={styles.dashboardGrid}>
        {/* ════════════ LEFT COLUMN: Primary Content ════════════ */}
        <div className={styles.primaryColumn}>
          {/* 1. Next Hangout Hero Card */}
          <section aria-label="Next Hangout">
            {upcomingHangout ? (
              <div className={styles.nextHangoutCard}>
                <div className={styles.planCardHeader}>
                  <h2 className={styles.cardHeading}>Next Hangout</h2>
                  <span
                    className={`${styles.statusPill} ${
                      hangoutState === 'today' ? styles.statusPillToday : ''
                    }`}
                  >
                    {hangoutState === 'today'
                      ? 'TODAY'
                      : upcomingHangout.status.replace('_', ' ')}
                  </span>
                </div>

                <div className={styles.planDetailsList}>
                  <div className={styles.detailRow}>
                    <CalendarIcon size={16} color="var(--accent-cyan)" />
                    <span>{upcomingHangout.date}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <ClockIcon size={16} color="var(--accent-cyan)" />
                    <span className="text-time">
                      {upcomingHangout.startTime} – {upcomingHangout.endTime}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <MapPinIcon size={16} color="var(--accent-cyan)" />
                    <span>{upcomingHangout.area}</span>
                  </div>
                </div>

                <div className={styles.cardActionRow}>
                  <Link
                    href={getHangoutRoute(upcomingHangout)}
                    className={styles.viewPlanBtn}
                  >
                    View Plan <ArrowRightIcon size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.emptyHangoutCard}>
                <div className={styles.emptyHeaderGroup}>
                  <div className={styles.emptyIconBadge}>
                    <SparklesIcon size={24} color="var(--accent-cyan)" />
                  </div>
                  <div>
                    <h2 className={styles.cardHeading}>No active plans</h2>
                    <p className={styles.emptyText}>
                      Ready to plan your next hangout together?
                    </p>
                  </div>
                </div>
                <Link href="/hangouts/new" className={styles.viewPlanBtn}>
                  <PlusIcon size={16} /> Plan Something
                </Link>
              </div>
            )}
          </section>

          {/* 2. "What shall we do?" Activity Tiles */}
          <section aria-label="Activities">
            <h2 className={styles.sectionTitle}>What shall we do?</h2>
            <div className={styles.activityGrid}>
              {ACTIVITIES.map((act) => (
                <Link
                  key={act.id}
                  href={`/hangouts/new?activity=${act.id}`}
                  className={styles.activityTile}
                >
                  <div className={styles.activityIconWrapper}>
                    {act.icon}
                  </div>
                  <span className={styles.activityLabel}>{act.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* 3. "Explore new places" Banner */}
          <section aria-label="Explore places">
            <Link href="/hangouts/new" className={styles.exploreBanner}>
              <div>
                <h2 className={styles.exploreTitle}>Explore new places</h2>
                <p className={styles.exploreSub}>Find interesting places around you</p>
              </div>
              <div className={styles.exploreArrowBtn} aria-hidden="true">
                <ArrowRightIcon size={18} color="#FFFFFF" />
              </div>
            </Link>
          </section>

          {/* 4. Recent Adventures Cards */}
          <section aria-label="Recent Adventures">
            <div className={styles.recentHeaderRow}>
              <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Recent Adventures</h2>
              <Link href="/memories" className={styles.seeAllLink}>
                See all <ArrowRightIcon size={14} />
              </Link>
            </div>

            <div className={styles.recentCardsGrid}>
              {recentHangouts.length > 0 ? (
                recentHangouts.slice(0, 3).map((h, i) => (
                  <div key={h.id} className={styles.adventureCard}>
                    <span className={styles.adventureIndex}>
                      #{String(recentHangouts.length - i).padStart(3, '0')}
                    </span>
                    <h3 className={styles.adventureName}>{h.area}</h3>
                    <div className={styles.adventureFooter}>
                      <span className={styles.adventureDate}>{h.date}</span>
                      <span className={styles.adventureStatus}>
                        {h.status === 'completed' ? 'Completed' : 'Saved'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className={styles.adventureCard}>
                    <span className={styles.adventureIndex}>#003</span>
                    <h3 className={styles.adventureName}>Coffee &amp; Walk</h3>
                    <div className={styles.adventureFooter}>
                      <span className={styles.adventureDate}>15 Aug 2026</span>
                      <span className={styles.adventureStatus}>Completed</span>
                    </div>
                  </div>
                  <div className={styles.adventureCard}>
                    <span className={styles.adventureIndex}>#002</span>
                    <h3 className={styles.adventureName}>Movie Night</h3>
                    <div className={styles.adventureFooter}>
                      <span className={styles.adventureDate}>8 Aug 2026</span>
                      <span className={styles.adventureStatus}>Completed</span>
                    </div>
                  </div>
                  <div className={styles.adventureCard}>
                    <span className={styles.adventureIndex}>#001</span>
                    <h3 className={styles.adventureName}>Food Hunt</h3>
                    <div className={styles.adventureFooter}>
                      <span className={styles.adventureDate}>1 Aug 2026</span>
                      <span className={styles.adventureStatus}>Completed</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* ════════════ RIGHT COLUMN: Secondary Widgets ════════════ */}
        <aside className={styles.secondaryColumn}>
          {/* 1. Planning Status Widget */}
          <div className={styles.widgetCard}>
            <h3 className={styles.widgetHeading}>Planning Status</h3>
            <div className={styles.planningCreatureBox}>
              <div className={styles.creatureGlow}>
                <JellyfishIcon size={46} color="#F48FB1" />
              </div>
            </div>
            <div className={styles.planningTextBox}>
              <h4 className={styles.planningTitle}>
                {upcomingHangout ? `Waiting for ${partnerName}` : 'No active plan'}
              </h4>
              <p className={styles.planningSub}>
                {upcomingHangout
                  ? `${partnerName} hasn't responded yet.`
                  : 'Start by choosing a date & time.'}
              </p>
            </div>
            {upcomingHangout ? (
              <button
                type="button"
                className={styles.reminderBtn}
                onClick={() => alert(`Reminder sent to ${partnerName}!`)}
              >
                Send Reminder <SendIcon size={14} />
              </button>
            ) : (
              <Link href="/hangouts/new" className={styles.reminderBtn}>
                Plan Together <ArrowRightIcon size={14} />
              </Link>
            )}
          </div>

          {/* 2. Tips from Ava Widget */}
          <div className={styles.widgetCard}>
            <div className={styles.tipHeader}>
              <h3 className={styles.widgetHeading} style={{ margin: 0 }}>Tips from Ava</h3>
              <div className={styles.tipFishBadge}>
                <FishOutlineIcon size={18} color="#FFD54F" />
              </div>
            </div>
            <p className={styles.tipBody}>
              Try a sunset walk after coffee. The weather will be perfect!
            </p>
            <div className={styles.carouselDots} aria-hidden="true">
              <span className={`${styles.dot} ${styles.dotActive}`} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>

          {/* 3. Today's Weather Widget */}
          <div className={styles.widgetCard}>
            <h3 className={styles.widgetHeading}>Today&apos;s Weather</h3>
            <div className={styles.weatherMain}>
              <SunCloudIcon size={38} color="#FFD54F" />
              <div>
                <span className={styles.weatherTemp}>31°C</span>
                <p className={styles.weatherCondition}>Partly sunny</p>
              </div>
            </div>

            <div className={styles.weatherStatsRow}>
              <div className={styles.weatherStatItem}>
                <RainIcon size={15} color="var(--accent-cyan)" />
                <span>20%</span>
              </div>
              <div className={styles.weatherStatItem}>
                <WindIcon size={15} color="var(--accent-cyan)" />
                <span>12 km/h</span>
              </div>
              <div className={styles.weatherStatItem}>
                <DropletIcon size={15} color="var(--accent-cyan)" />
                <span>65%</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
