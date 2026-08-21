'use client'

import Link from 'next/link'
import type { MatchResult } from '@/services/matchingService'
import { getActivityIcon, SparklesIcon, HeartIcon, ThumbsUpIcon, ArrowRightIcon } from '@/components/ui/OceanIcons'
import styles from './MatchResultsPage.module.css'

interface MatchResultsPageProps {
  hangoutId: string
  matches: MatchResult
}

export function MatchResultsPage({ hangoutId, matches }: MatchResultsPageProps) {
  const hasMatches = matches.matchedActivities.length > 0

  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          {hasMatches ? 'Match Found!' : 'No Direct Matches'}
        </h1>
        <p className={`text-body-sm ${styles.subtitle}`}>
          {hasMatches
            ? 'Both of you said YES to these activities!'
            : 'You picked different things — pick one together or try again!'}
        </p>
      </div>

      {/* ── Matched Activities ── */}
      {hasMatches && (
        <section className={styles.matchesList}>
          {matches.matchedActivities.map((m) => (
            <div key={m.activityId} className={styles.matchCard}>
              <div className={styles.matchContent}>
                <div className={styles.iconWrapper}>
                  {getActivityIcon(m.activityId, 28, 'var(--accent-cyan)')}
                </div>
                <div>
                  <h2 className={styles.matchName}>{m.name}</h2>
                  <p className={styles.matchSubtitle}>
                    {m.responderChoice === 'love' ? (
                      <>
                        <HeartIcon size={14} color="var(--warm-coral)" filled /> Loved by Partner
                      </>
                    ) : (
                      <>
                        <ThumbsUpIcon size={14} color="var(--accent-teal)" filled /> Liked by Partner
                      </>
                    )}
                  </p>
                </div>
              </div>

              <SparklesIcon size={24} color="var(--accent-cyan)" />
            </div>
          ))}

          <Link
            href={`/hangouts/${hangoutId}/places`}
            className="btn-primary w-full"
            style={{ marginTop: 'var(--space-4)' }}
          >
            Build the Plan <ArrowRightIcon size={18} />
          </Link>
        </section>
      )}

      {/* ── Unmatched Section ── */}
      {matches.unmatchedActivities.length > 0 && (
        <section className={styles.unmatchedSection}>
          <hr className={styles.divider} />
          <h3 className={styles.unmatchedTitle}>OTHER PROPOSALS (NO MATCH)</h3>
          <div className={styles.unmatchedList}>
            {matches.unmatchedActivities.map((u) => (
              <div key={u.activityId} className={styles.unmatchedItem}>
                {getActivityIcon(u.activityId, 16, 'var(--text-muted)')}
                <span className="text-caption">{u.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {!hasMatches && (
        <Link
          href={`/hangouts/${hangoutId}/activities`}
          className="btn-secondary w-full"
        >
          ← Adjust Activities
        </Link>
      )}
    </div>
  )
}
