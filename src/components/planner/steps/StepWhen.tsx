'use client'

import { useState } from 'react'
import type { DatePreset, TimePeriod, DurationOption } from '@/hooks/useAdventurePlanner'
import {
  ClockIcon,
  MorningSunIcon,
  SunIcon,
  SunsetIcon,
  MoonIcon,
} from '@/components/ui/OceanIcons'
import styles from '../AdventurePlanner.module.css'

interface StepWhenProps {
  // Date props
  datePreset: DatePreset
  customDate: string
  onSelectDatePreset: (preset: DatePreset) => void
  onChangeCustomDate: (date: string) => void

  // Time Period props
  timePeriod: TimePeriod
  customStartTime: string
  onSelectTimePeriod: (period: TimePeriod) => void
  onChangeCustomStartTime: (time: string) => void

  // Duration props
  duration: DurationOption
  onSelectDuration: (duration: DurationOption) => void
}

export function StepWhen({
  datePreset,
  customDate,
  onSelectDatePreset,
  onChangeCustomDate,
  timePeriod,
  customStartTime,
  onSelectTimePeriod,
  onChangeCustomStartTime,
  duration,
  onSelectDuration,
}: StepWhenProps) {
  const [showExactDate, setShowExactDate] = useState(datePreset === 'custom')
  const [showExactTime, setShowExactTime] = useState(timePeriod === 'custom')

  const DATE_PRESETS: { id: DatePreset; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'this_weekend', label: 'This Weekend' },
    { id: 'next_week', label: 'Next Week' },
  ]

  const TIME_PERIODS: {
    id: TimePeriod
    title: string
    vibe: string
    approx: string
    icon: React.ReactNode
  }[] = [
    { id: 'morning', title: 'Morning', vibe: 'Brunch & fresh coffee', approx: '9:30 AM', icon: <MorningSunIcon size={24} color="#FFD54F" /> },
    { id: 'afternoon', title: 'Afternoon', vibe: 'Games & strolls', approx: '2:00 PM', icon: <SunIcon size={24} color="#FFB74D" /> },
    { id: 'evening', title: 'Evening', vibe: 'Sunset & dinner', approx: '5:00 PM', icon: <SunsetIcon size={24} color="#FF7043" /> },
    { id: 'night', title: 'Night Out', vibe: 'Late drinks', approx: '7:30 PM', icon: <MoonIcon size={24} color="#B39DDB" /> },
  ]

  const DURATIONS: {
    id: DurationOption
    title: string
    desc: string
    approx: string
  }[] = [
    { id: 'quick', title: 'Quick', desc: 'A brief catch-up', approx: '~1 hr' },
    { id: 'chill', title: 'Chill', desc: 'No rush, taking our time', approx: '~2.5 hrs' },
    { id: 'long', title: 'Long', desc: 'Making a whole day of it', approx: '4+ hrs' },
  ]

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeaderGroup}>
        <span className={styles.stepKicker}>Step 2 · When</span>
        <h2 className={styles.stepTitle}>When should we go?</h2>
        <p className={styles.stepDescription}>
          Pick a natural time. We can adjust the exact minutes later if needed.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* --- 1. DATE PREFERENCES --- */}
        <div>
          <h3 className={styles.organicHeading} style={{ fontSize: '1rem', marginBottom: '12px' }}>Day</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DATE_PRESETS.map((p) => {
              const isSelected = datePreset === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setShowExactDate(false)
                    onSelectDatePreset(p.id)
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: isSelected ? 'rgba(77, 208, 225, 0.4)' : 'rgba(255, 255, 255, 0.15)',
                    background: isSelected ? 'rgba(0, 188, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {p.label}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => {
                setShowExactDate(true)
                onSelectDatePreset('custom')
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: datePreset === 'custom' ? 'rgba(77, 208, 225, 0.4)' : 'rgba(255, 255, 255, 0.15)',
                background: datePreset === 'custom' ? 'rgba(0, 188, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                color: datePreset === 'custom' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: datePreset === 'custom' ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Pick date...
            </button>
          </div>
          {showExactDate && (
            <div style={{ marginTop: '12px' }}>
              <input
                type="date"
                value={customDate}
                onChange={(e) => onChangeCustomDate(e.target.value)}
                className={styles.inputField}
              />
            </div>
          )}
        </div>

        {/* --- 2. TIME WINDOW --- */}
        <div>
          <h3 className={styles.organicHeading} style={{ fontSize: '1rem', marginBottom: '12px' }}>Time Window</h3>
          <div className={styles.timePeriodGrid} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {TIME_PERIODS.map((p) => {
              const isSelected = timePeriod === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.timePeriodCard} ${isSelected ? styles.timePeriodCardSelected : ''}`}
                  onClick={() => {
                    setShowExactTime(false)
                    onSelectTimePeriod(p.id)
                  }}
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
        </div>

        {/* --- 3. DURATION --- */}
        <div>
          <h3 className={styles.organicHeading} style={{ fontSize: '1rem', marginBottom: '12px' }}>Duration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {DURATIONS.map((d) => {
              const isSelected = duration === d.id
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onSelectDuration(d.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '12px',
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: isSelected ? 'rgba(77, 208, 225, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'linear-gradient(135deg, rgba(2, 136, 209, 0.3) 0%, rgba(0, 188, 212, 0.22) 100%)' : 'rgba(255, 255, 255, 0.04)',
                    boxShadow: isSelected ? '0 4px 18px rgba(0, 188, 212, 0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600, color: '#FFF' }}>
                    {d.title}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>{d.approx}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* --- 4. ADVANCED EXACT TIME (Optional) --- */}
        <div style={{ marginTop: '8px' }}>
          <button
            type="button"
            onClick={() => {
              if (timePeriod !== 'custom') {
                setShowExactTime(true)
                onSelectTimePeriod('custom')
              } else {
                setShowExactTime(false)
                onSelectTimePeriod('evening') // reset to default if they close it
              }
            }}
            className={styles.extrasToggleBtn}
          >
            <ClockIcon size={14} /> 
            {showExactTime ? 'Hide exact time' : 'Adjust exact time'}
          </button>
          
          {showExactTime && (
            <div className={styles.extrasContentBox} style={{ marginTop: '12px' }}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Exact Start Time</label>
                <input
                  type="time"
                  value={customStartTime}
                  onChange={(e) => onChangeCustomStartTime(e.target.value)}
                  className={styles.inputField}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
