'use client'

import type { DurationOption } from '@/hooks/useAdventurePlanner'
import { ClockIcon, WaveIcon, SparklesIcon } from '@/components/ui/OceanIcons'
import styles from '../AdventurePlanner.module.css'

interface StepDurationProps {
  duration: DurationOption
  derivedStartTime: string
  derivedEndTime: string
  durationLabel: string
  onSelectDuration: (opt: DurationOption) => void
}

const DURATIONS: {
  id: DurationOption
  title: string
  approx: string
  desc: string
  icon: React.ReactNode
}[] = [
  {
    id: 'quick',
    title: 'Quick Catchup',
    approx: '~1 hour',
    desc: 'Grab coffee or a quick bite and head out',
    icon: <SparklesIcon size={24} color="#80DEEA" />,
  },
  {
    id: 'chill',
    title: 'Chill Hangout',
    approx: '~2–3 hours',
    desc: 'Unrushed time for food, conversation & exploring',
    icon: <WaveIcon size={24} color="#4DD0E1" />,
  },
  {
    id: 'long',
    title: 'Long Day Out',
    approx: '~4+ hours',
    desc: 'Full adventure with multiple stops and fun',
    icon: <ClockIcon size={24} color="#FFD54F" />,
  },
]

export function StepDuration({
  duration,
  derivedStartTime,
  derivedEndTime,
  durationLabel,
  onSelectDuration,
}: StepDurationProps) {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeaderGroup}>
        <span className={styles.stepKicker}>Step 4 · Duration</span>
        <h2 className={styles.stepTitle}>How long should we spend?</h2>
        <p className={styles.stepDescription}>
          Give your hangout a natural flow. Ava will shape the itinerary around it.
        </p>
      </div>

      <div className={styles.durationOptionsGrid} role="radiogroup" aria-label="Duration choices">
        {DURATIONS.map((d) => {
          const isSelected = duration === d.id
          return (
            <button
              key={d.id}
              type="button"
              className={`${styles.durationCard} ${
                isSelected ? styles.durationCardSelected : ''
              }`}
              onClick={() => onSelectDuration(d.id)}
              role="radio"
              aria-checked={isSelected}
            >
              <div className={styles.durationIconWrapper}>{d.icon}</div>
              <div className={styles.durationTextGroup}>
                <div className={styles.durationTitleRow}>
                  <span className={styles.durationTitle}>{d.title}</span>
                  <span className={styles.durationApprox}>{d.approx}</span>
                </div>
                <span className={styles.durationDesc}>{d.desc}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Visual Time Range Preview ── */}
      <div className={styles.timeRangePreviewBanner}>
        <ClockIcon size={16} color="var(--accent-cyan)" />
        <span>
          Expected time window:{' '}
          <strong className="text-time">
            {derivedStartTime} – {derivedEndTime}
          </strong>{' '}
          ({durationLabel})
        </span>
      </div>
    </div>
  )
}
