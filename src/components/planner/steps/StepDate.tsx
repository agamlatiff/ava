'use client'

import { useState } from 'react'
import type { DatePreset } from '@/hooks/useAdventurePlanner'
import { CalendarIcon } from '@/components/ui/OceanIcons'
import styles from '../AdventurePlanner.module.css'

interface StepDateProps {
  datePreset: DatePreset
  customDate: string
  derivedDateDisplay: string
  onSelectPreset: (preset: DatePreset) => void
  onChangeCustomDate: (date: string) => void
}

export function StepDate({
  datePreset,
  customDate,
  derivedDateDisplay,
  onSelectPreset,
  onChangeCustomDate,
}: StepDateProps) {
  const [showCalendar, setShowCalendar] = useState(datePreset === 'custom')

  const PRESETS: { id: DatePreset; label: string; sub: string }[] = [
    { id: 'today', label: 'Today', sub: 'Spontaneous adventure' },
    { id: 'tomorrow', label: 'Tomorrow', sub: 'Quick day-ahead plan' },
    { id: 'this_weekend', label: 'This Weekend', sub: 'Upcoming Saturday' },
    { id: 'next_week', label: 'Next Week', sub: 'Looking forward' },
  ]

  const handleCustomToggle = () => {
    setShowCalendar(true)
    onSelectPreset('custom')
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeaderGroup}>
        <span className={styles.stepKicker}>Step 2 · Date</span>
        <h2 className={styles.stepTitle}>When should we go?</h2>
        <p className={styles.stepDescription}>
          Pick a natural day. You can easily adjust this anytime.
        </p>
      </div>

      <div className={styles.datePresetsGrid} role="radiogroup" aria-label="Date choices">
        {PRESETS.map((p) => {
          const isSelected = datePreset === p.id
          return (
            <button
              key={p.id}
              type="button"
              className={`${styles.presetOptionCard} ${
                isSelected ? styles.presetOptionCardSelected : ''
              }`}
              onClick={() => {
                setShowCalendar(false)
                onSelectPreset(p.id)
              }}
              role="radio"
              aria-checked={isSelected}
            >
              <div className={styles.presetRadioIndicator}>
                {isSelected && <div className={styles.radioInnerGlow} />}
              </div>
              <div className={styles.presetTextGroup}>
                <span className={styles.presetTitle}>{p.label}</span>
                <span className={styles.presetSub}>{p.sub}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Custom Date Disclosure ── */}
      <div className={styles.customDateDisclosure}>
        {!showCalendar ? (
          <button
            type="button"
            className={styles.textDisclosureBtn}
            onClick={handleCustomToggle}
          >
            <CalendarIcon size={16} color="var(--accent-cyan)" /> Pick a specific calendar date
          </button>
        ) : (
          <div className={styles.customDateInputBox}>
            <label htmlFor="custom-date-field" className={styles.fieldSubLabel}>
              Choose specific date:
            </label>
            <input
              id="custom-date-field"
              type="date"
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
              value={customDate}
              onChange={(e) => onChangeCustomDate(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* ── Current Selected Date Indicator ── */}
      <div className={styles.selectedBadgeRow}>
        <span className={styles.selectedBadge}>
          <CalendarIcon size={14} color="var(--accent-cyan)" /> {derivedDateDisplay}
        </span>
      </div>
    </div>
  )
}
