'use client'

import { useCreateHangout } from '@/hooks/useCreateHangout'
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@/components/ui/OceanIcons'
import styles from './CreateHangoutPage.module.css'

interface CreateHangoutPageProps {
  initialActivity?: string
}

export function CreateHangoutPage({ initialActivity }: CreateHangoutPageProps = {}) {
  const {
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    area,
    setArea,
    budgetDisplay,
    handleBudgetChange,
    notes,
    setNotes,
    duration,
    isSubmitting,
    errorMsg,
    handleSubmit,
  } = useCreateHangout(initialActivity)

  return (
    <div className={styles.createRoot}>
      <h1 className={styles.headerTitle}>
        <SparklesIcon size={26} color="var(--accent-cyan)" /> New Hangout
      </h1>

      <form onSubmit={handleSubmit} className={styles.createForm} noValidate>
        <div className={`glass-card-strong ${styles.formCard}`}>
          {/* ── Date Field ── */}
          <div className={styles.fieldGroup}>
            <label htmlFor="date-input" className={styles.fieldLabel}>
              <CalendarIcon size={16} color="var(--accent-cyan)" /> When?
            </label>
            <input
              id="date-input"
              type="date"
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* ── Time & Duration ── */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              <ClockIcon size={16} color="var(--accent-cyan)" /> Time Range
            </label>
            <div className={styles.timeRow}>
              <div>
                <input
                  id="start-time-input"
                  type="time"
                  className="input-field text-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  aria-label="Start time"
                  required
                />
              </div>
              <div>
                <input
                  id="end-time-input"
                  type="time"
                  className="input-field text-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  aria-label="End time"
                  required
                />
              </div>
            </div>
            {duration && (
              <span className={styles.durationBadge}>
                <ClockIcon size={14} color="var(--accent-cyan)" /> {duration}
              </span>
            )}
          </div>

          {/* ── Area / Location ── */}
          <div className={styles.fieldGroup}>
            <label htmlFor="area-input" className={styles.fieldLabel}>
              <MapPinIcon size={16} color="var(--accent-cyan)" /> Where?
            </label>
            <input
              id="area-input"
              type="text"
              className="input-field"
              placeholder="e.g. Around campus, Central Park, Coastline..."
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          {/* ── Budget ── */}
          <div className={styles.fieldGroup}>
            <label htmlFor="budget-input" className={styles.fieldLabel}>
              Budget (optional)
            </label>
            <div className={styles.budgetPrefixWrapper}>
              <span className={styles.budgetPrefix}>Rp</span>
              <input
                id="budget-input"
                type="text"
                className={`input-field ${styles.budgetInput}`}
                placeholder="100.000"
                value={budgetDisplay}
                onChange={handleBudgetChange}
              />
            </div>
          </div>

          {/* ── Notes ── */}
          <div className={styles.fieldGroup}>
            <label htmlFor="notes-input" className={styles.fieldLabel}>
              Notes (optional)
            </label>
            <textarea
              id="notes-input"
              className={`input-field ${styles.textareaField}`}
              placeholder="Any specific requests or ideas?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
            />
          </div>

          {errorMsg && <p className={styles.errorBanner}>{errorMsg}</p>}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating plan...' : 'Continue'} <ArrowRightIcon size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}
