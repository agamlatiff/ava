'use client'

import { useState } from 'react'
import type { TimePeriod } from '@/hooks/useAdventurePlanner'
import {
  MorningSunIcon,
  SunIcon,
  SunsetIcon,
  MoonIcon,
  ClockIcon,
} from '@/components/ui/OceanIcons'
import styles from '../AdventurePlanner.module.css'

interface StepTimePeriodProps {
  timePeriod: TimePeriod
  customStartTime: string
  onSelectPeriod: (period: TimePeriod) => void
  onChangeCustomTime: (time: string) => void
}

const PERIODS: {
  id: TimePeriod
  title: string
  vibe: string
  approx: string
  icon: React.ReactNode
}[] = [
  {
    id: 'morning',
    title: 'Morning',
    vibe: 'Brunch, fresh coffee & morning light',
    approx: 'Around 09:30',
    icon: <MorningSunIcon size={26} color="#FFD54F" />,
  },
  {
    id: 'afternoon',
    title: 'Afternoon',
    vibe: 'Cozy cafes, games & strolls',
    approx: 'Around 14:00',
    icon: <SunIcon size={26} color="#FFB74D" />,
  },
  {
    id: 'evening',
    title: 'Evening',
    vibe: 'Sunset, dinner & evening breeze',
    approx: 'Around 17:00',
    icon: <SunsetIcon size={26} color="#FF7043" />,
  },
  {
    id: 'night',
    title: 'Night Out',
    vibe: 'Drinks, night walks & late dessert',
    approx: 'Around 19:30',
    icon: <MoonIcon size={26} color="#B39DDB" />,
  },
]

export function StepTimePeriod({
  timePeriod,
  customStartTime,
  onSelectPeriod,
  onChangeCustomTime,
}: StepTimePeriodProps) {
  const [showExact, setShowExact] = useState(timePeriod === 'custom')

  const handleCustomToggle = () => {
    setShowExact(true)
    onSelectPeriod('custom')
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeaderGroup}>
        <span className={styles.stepKicker}>Step 3 · Time Period</span>
        <h2 className={styles.stepTitle}>What time feels right?</h2>
        <p className={styles.stepDescription}>
          No need to calculate exact minutes. Pick the vibe that fits your day.
        </p>
      </div>

      <div className={styles.timePeriodGrid} role="radiogroup" aria-label="Time period choices">
        {PERIODS.map((p) => {
          const isSelected = timePeriod === p.id
          return (
            <button
              key={p.id}
              type="button"
              className={`${styles.timePeriodCard} ${
                isSelected ? styles.timePeriodCardSelected : ''
              }`}
              onClick={() => {
                setShowExact(false)
                onSelectPeriod(p.id)
              }}
              role="radio"
              aria-checked={isSelected}
            >
              <div className={styles.periodIconWrapper}>{p.icon}</div>
              <div className={styles.periodTextGroup}>
                <div className={styles.periodTitleRow}>
                  <span className={styles.periodTitle}>{p.title}</span>
                  <span className={styles.periodApprox}>{p.approx}</span>
                </div>
                <span className={styles.periodVibe}>{p.vibe}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Optional Exact Time Disclosure ── */}
      <div className={styles.customDateDisclosure}>
        {!showExact ? (
          <button
            type="button"
            className={styles.textDisclosureBtn}
            onClick={handleCustomToggle}
          >
            <ClockIcon size={16} color="var(--accent-cyan)" /> Need an exact start time?
          </button>
        ) : (
          <div className={styles.customDateInputBox}>
            <label htmlFor="exact-time-input" className={styles.fieldSubLabel}>
              Exact start time:
            </label>
            <input
              id="exact-time-input"
              type="time"
              className="input-field text-time"
              value={customStartTime}
              onChange={(e) => onChangeCustomTime(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
