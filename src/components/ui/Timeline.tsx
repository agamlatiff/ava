'use client'

import styles from './UIComponents.module.css'

export interface TimelineStop {
  id: string
  startTime: string
  endTime: string
  activityIcon: string
  activityName: string
  placeName?: string | null
  placeArea?: string | null
  placeDistance?: string | null
  placeDescription?: string | null
  status?: 'upcoming' | 'in_progress' | 'completed'
  order: number
}

interface TimelineProps {
  stops: TimelineStop[]
  interactive?: boolean
  onMarkComplete?: (stopId: string) => void
}

export function Timeline({ stops, interactive = false, onMarkComplete }: TimelineProps) {
  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineTrack} aria-hidden="true" />

      {stops.map((stop) => {
        const isCompleted = stop.status === 'completed'
        const isInProgress = stop.status === 'in_progress'

        return (
          <div key={stop.id} className={styles.timelineNode}>
            <div
              className={`${styles.timelineDot} ${
                isCompleted
                  ? styles.timelineDotCompleted
                  : isInProgress
                  ? styles.timelineDotInProgress
                  : ''
              }`}
              aria-hidden="true"
            />

            <div
              className="glass-card"
              style={{
                padding: 'var(--space-4) var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                opacity: isCompleted ? 0.65 : 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span className="text-time" style={{ color: 'var(--accent-cyan)' }}>
                  {stop.startTime} – {stop.endTime}
                </span>

                <span style={{ fontSize: '1.25rem' }}>{stop.activityIcon}</span>
              </div>

              <div>
                <h3 className="text-body" style={{ fontWeight: 700 }}>
                  {stop.placeName || stop.activityName}
                </h3>
                {stop.placeDescription && (
                  <p className="text-caption text-secondary">
                    {stop.placeDescription}
                  </p>
                )}
                {stop.placeDistance && (
                  <span className="text-caption text-muted" style={{ marginTop: '2px', display: 'inline-block' }}>
                    📍 {stop.placeDistance} · {stop.placeArea}
                  </span>
                )}
              </div>

              {interactive && isInProgress && (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '12px', alignSelf: 'flex-start' }}
                  onClick={() => onMarkComplete?.(stop.id)}
                >
                  Mark Complete ✓
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
