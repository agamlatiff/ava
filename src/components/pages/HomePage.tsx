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
  { id: 'coffee', label: 'Coffee', icon: <CoffeeIcon size={22} color="#80DEEA" /> },
  { id: 'food', label: 'Food', icon: <FoodIcon size={22} color="#FF8A65" /> },
  { id: 'games', label: 'Games', icon: <GamesIcon size={22} color="#BA68C8" /> },
  { id: 'walk', label: 'Walk', icon: <WalkIcon size={22} color="#4DD0E1" /> },
  { id: 'movie', label: 'Movie', icon: <MovieIcon size={22} color="#FFB74D" /> },
  { id: 'study', label: 'Study', icon: <StudyIcon size={22} color="#81C784" /> },
]

export function HomePage({
  userName,
  upcomingHangout,
  recentHangouts,
}: HomePageProps) {
  const { greeting, hangoutState } = useHomeData(userName, upcomingHangout)
  const partnerName = userName.toLowerCase() === 'diva' ? 'Agam' : 'Diva'

  return (
    <div className={styles.worldContainer}>
      {/* ── Sanctuary Header ── */}
      <header className={styles.sanctuaryHeader}>
        <div className={styles.greetingBlock}>
          <h1 className={styles.greetingTitle}>
            {greeting}
          </h1>
          <p className={styles.greetingSub}>
            Ready for our next adventure together?
          </p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.iconAuraBtn} aria-label="Notifications" title="Notifications">
            <BellIcon size={18} color="var(--text-secondary)" />
          </button>
          <div className={styles.coupleBadge}>
            <div className={styles.coupleAvatar}>
              <FishOutlineIcon size={16} color="#FFFFFF" />
            </div>
            <ChevronDownIcon size={13} color="var(--text-muted)" />
          </div>
        </div>
      </header>

      {/* ── Fluid 2-Column Story Layout ── */}
      <div className={styles.storyGrid}>
        {/* ════════════ MAIN JOURNEY COLUMN (Left) ════════════ */}
        <div className={styles.journeyColumn}>
          {/* 1. Primary Focal Point: The Next Adventure Invitation */}
          <section aria-label="Next Adventure" className={styles.heroSection}>
            {upcomingHangout ? (
              <div className={styles.invitationCard}>
                <div className={styles.invitationTopRow}>
                  <span className={styles.sectionKicker}>Next Destination</span>
                  <span
                    className={`${styles.softStatusBadge} ${
                      hangoutState === 'today' ? styles.statusToday : ''
                    }`}
                  >
                    {hangoutState === 'today'
                      ? 'TODAY'
                      : upcomingHangout.status.replace('_', ' ')}
                  </span>
                </div>

                <h2 className={styles.destinationHeading}>{upcomingHangout.area}</h2>

                <div className={styles.destinationMeta}>
                  <div className={styles.metaPill}>
                    <CalendarIcon size={15} color="var(--accent-cyan)" />
                    <span>{upcomingHangout.date}</span>
                  </div>
                  <div className={styles.metaPill}>
                    <ClockIcon size={15} color="var(--accent-cyan)" />
                    <span className="text-time">
                      {upcomingHangout.startTime} – {upcomingHangout.endTime}
                    </span>
                  </div>
                  <div className={styles.metaPill}>
                    <MapPinIcon size={15} color="var(--accent-cyan)" />
                    <span>{upcomingHangout.area}</span>
                  </div>
                </div>

                <div className={styles.invitationActionRow}>
                  <Link
                    href={getHangoutRoute(upcomingHangout)}
                    className={styles.openPlanButton}
                  >
                    Open Our Plan <ArrowRightIcon size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.invitationEmpty}>
                <div className={styles.emptyGlowIcon}>
                  <SparklesIcon size={26} color="var(--accent-cyan)" />
                </div>
                <div className={styles.emptyTextContent}>
                  <h2 className={styles.destinationHeading} style={{ fontSize: '1.35rem' }}>
                    No active adventure yet
                  </h2>
                  <p className={styles.emptySubtext}>
                    Pick a day, choose places you both love, and start planning.
                  </p>
                </div>
                <Link href="/hangouts/new" className={styles.openPlanButton}>
                  <PlusIcon size={16} /> Plan Something Together
                </Link>
              </div>
            )}
          </section>

          {/* 2. Interactive Choice Bubbles: Quick Plan */}
          <section aria-label="What shall we do?" className={styles.activitiesSection}>
            <div className={styles.sectionHeaderLine}>
              <h2 className={styles.organicHeading}>Where shall we wander?</h2>
              <span className={styles.headingSub}>Choose an activity to start</span>
            </div>

            <div className={styles.choiceBubblesContainer}>
              {ACTIVITIES.map((act) => (
                <Link
                  key={act.id}
                  href={`/hangouts/new?activity=${act.id}`}
                  className={styles.choiceBubble}
                >
                  <div className={styles.bubbleIconGlow}>
                    {act.icon}
                  </div>
                  <span className={styles.bubbleLabel}>{act.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* 3. Explore Places Floating Ribbon */}
          <section aria-label="Explore places">
            <Link href="/hangouts/new" className={styles.exploreRibbon}>
              <div className={styles.ribbonLeft}>
                <div className={styles.ribbonIcon}>
                  <SparklesIcon size={20} color="var(--accent-cyan)" />
                </div>
                <div>
                  <h3 className={styles.ribbonTitle}>Discover new spots together</h3>
                  <p className={styles.ribbonSub}>Find cozy cafes, hidden trails &amp; romantic dinners</p>
                </div>
              </div>
              <div className={styles.ribbonArrow} aria-hidden="true">
                <ArrowRightIcon size={16} color="#FFFFFF" />
              </div>
            </Link>
          </section>

          {/* 4. Memories & Past Adventures */}
          <section aria-label="Recent Adventures" className={styles.recentSection}>
            <div className={styles.recentTitleRow}>
              <h2 className={styles.organicHeading} style={{ margin: 0 }}>Recent Adventures</h2>
              <Link href="/memories" className={styles.viewMemoriesLink}>
                All Memories <ArrowRightIcon size={13} />
              </Link>
            </div>

            <div className={styles.recentAdventuresList}>
              {recentHangouts.length > 0 ? (
                recentHangouts.slice(0, 3).map((h, i) => (
                  <div key={h.id} className={styles.adventureItem}>
                    <div className={styles.adventureMain}>
                      <span className={styles.adventureNum}>
                        #{String(recentHangouts.length - i).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className={styles.adventureLocation}>{h.area}</h4>
                        <p className={styles.adventureDateText}>{h.date}</p>
                      </div>
                    </div>
                    <span className={styles.completedPill}>
                      {h.status === 'completed' ? 'Completed' : 'Saved'}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className={styles.adventureItem}>
                    <div className={styles.adventureMain}>
                      <span className={styles.adventureNum}>#03</span>
                      <div>
                        <h4 className={styles.adventureLocation}>Coffee &amp; Walk</h4>
                        <p className={styles.adventureDateText}>15 Aug 2026</p>
                      </div>
                    </div>
                    <span className={styles.completedPill}>Completed</span>
                  </div>
                  <div className={styles.adventureItem}>
                    <div className={styles.adventureMain}>
                      <span className={styles.adventureNum}>#02</span>
                      <div>
                        <h4 className={styles.adventureLocation}>Movie Night</h4>
                        <p className={styles.adventureDateText}>8 Aug 2026</p>
                      </div>
                    </div>
                    <span className={styles.completedPill}>Completed</span>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* ════════════ SANCTUARY SIDEBAR (Right) ════════════ */}
        <aside className={styles.sanctuaryColumn}>
          {/* 1. Couple Connection & Status */}
          <div className={styles.organicPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelKicker}>Connection</span>
              <span className={styles.onlinePulse} />
            </div>
            <div className={styles.partnerCreatureWrapper}>
              <div className={styles.jellyfishAura}>
                <JellyfishIcon size={44} color="#F48FB1" />
              </div>
            </div>
            <div className={styles.partnerStatusBlock}>
              <h3 className={styles.partnerStatusTitle}>
                {upcomingHangout ? `Waiting for ${partnerName}` : `${userName} & ${partnerName}`}
              </h3>
              <p className={styles.partnerStatusSub}>
                {upcomingHangout
                  ? `${partnerName} is reviewing your choices.`
                  : 'Connected in your private world.'}
              </p>
            </div>
            {upcomingHangout ? (
              <button
                type="button"
                className={styles.gentleActionBtn}
                onClick={() => alert(`Nudge sent to ${partnerName}!`)}
              >
                Send Gentle Nudge <SendIcon size={13} />
              </button>
            ) : (
              <Link href="/hangouts/new" className={styles.gentleActionBtn}>
                Plan Together <ArrowRightIcon size={13} />
              </Link>
            )}
          </div>

          {/* 2. Ava's Thought for Today */}
          <div className={styles.organicPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelKicker}>Daily Thought</span>
              <div className={styles.mascotBadge}>
                <FishOutlineIcon size={16} color="#FFD54F" />
              </div>
            </div>
            <p className={styles.thoughtQuote}>
              &ldquo;Try a sunset walk after coffee. The cool evening breeze will be wonderful.&rdquo;
            </p>
            <div className={styles.thoughtPaging} aria-hidden="true">
              <span className={`${styles.thoughtDot} ${styles.thoughtDotActive}`} />
              <span className={styles.thoughtDot} />
              <span className={styles.thoughtDot} />
            </div>
          </div>

          {/* 3. Outdoor Atmosphere */}
          <div className={styles.organicPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelKicker}>Atmosphere</span>
            </div>
            <div className={styles.weatherHero}>
              <SunCloudIcon size={34} color="#FFD54F" />
              <div>
                <span className={styles.weatherDegrees}>31°C</span>
                <p className={styles.weatherSummary}>Partly sunny &amp; gentle breeze</p>
              </div>
            </div>

            <div className={styles.weatherPillsRow}>
              <span className={styles.tinyStat}>
                <RainIcon size={13} color="var(--accent-cyan)" /> 20%
              </span>
              <span className={styles.tinyStat}>
                <WindIcon size={13} color="var(--accent-cyan)" /> 12 km/h
              </span>
              <span className={styles.tinyStat}>
                <DropletIcon size={13} color="var(--accent-cyan)" /> 65%
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
