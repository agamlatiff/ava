'use client'

import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowRightIcon,
  getActivityIcon,
} from '@/components/ui/OceanIcons'
import styles from '../AdventurePlanner.module.css'

interface StepPreviewProps {
  activityIds: string[]
  derivedDateDisplay: string
  timePeriodLabel: string
  derivedStartTime: string
  derivedEndTime: string
  durationLabel: string
  derivedArea: string
  budgetDisplay?: string
  notes?: string
  isSubmitting: boolean
  errorMsg?: string
  onConfirm: () => void
  onEditStep: (step: number) => void
}

export function StepPreview({
  activityIds,
  derivedDateDisplay,
  timePeriodLabel,
  derivedStartTime,
  derivedEndTime,
  durationLabel,
  derivedArea,
  budgetDisplay,
  notes,
  isSubmitting,
  errorMsg,
  onConfirm,
  onEditStep,
}: StepPreviewProps) {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeaderGroup}>
        <span className={styles.stepKicker}>Step 6 · Preview</span>
        <h2 className={styles.stepTitle}>Ready to start our adventure?</h2>
        <p className={styles.stepDescription}>
          Here is our plan snapshot. Your partner will receive it right away to choose their favorites!
        </p>
      </div>

      {/* ── Summary Card ── */}
      <div className={styles.previewSummaryCard}>
        <div className={styles.previewCardHeader}>
          <span className={styles.previewKicker}>Adventure Snapshot</span>
          <button
            type="button"
            className={styles.changePicksBtn}
            onClick={() => onEditStep(1)}
          >
            Edit choices
          </button>
        </div>

        <div className={styles.previewMainInfo}>
          <div className={styles.previewRow}>
            <div className={styles.previewIconWrapper}>
              <CalendarIcon size={18} color="var(--accent-cyan)" />
            </div>
            <div className={styles.previewTextCol}>
              <span className={styles.previewLabel}>When</span>
              <strong className={styles.previewValue}>{derivedDateDisplay}</strong>
            </div>
          </div>

          <div className={styles.previewRow}>
            <div className={styles.previewIconWrapper}>
              <ClockIcon size={18} color="var(--accent-cyan)" />
            </div>
            <div className={styles.previewTextCol}>
              <span className={styles.previewLabel}>Time &amp; Duration</span>
              <strong className={styles.previewValue}>
                {timePeriodLabel} · {durationLabel} ({derivedStartTime} – {derivedEndTime})
              </strong>
            </div>
          </div>

          <div className={styles.previewRow}>
            <div className={styles.previewIconWrapper}>
              <MapPinIcon size={18} color="var(--accent-cyan)" />
            </div>
            <div className={styles.previewTextCol}>
              <span className={styles.previewLabel}>Destination Area</span>
              <strong className={styles.previewValue}>{derivedArea}</strong>
            </div>
          </div>
        </div>

        {/* ── Activities List ── */}
        <div className={styles.previewActivitiesSection}>
          <span className={styles.previewLabel}>Planned Activities</span>
          <div className={styles.previewChipsRow}>
            {activityIds.map((id) => (
              <span key={id} className={styles.previewActivityPill}>
                {getActivityIcon(id, 16, 'var(--accent-cyan)')}
                <span style={{ textTransform: 'capitalize' }}>{id}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Optional Extras if any ── */}
        {(budgetDisplay || notes) && (
          <div className={styles.previewExtrasSection}>
            {budgetDisplay && (
              <div className={styles.extraItem}>
                <span className={styles.previewLabel}>Budget:</span>
                <span className={styles.previewValue}>Rp {budgetDisplay}</span>
              </div>
            )}
            {notes && (
              <div className={styles.extraItem}>
                <span className={styles.previewLabel}>Note:</span>
                <p className={styles.previewNotesText}>&ldquo;{notes}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {errorMsg && <p className={styles.errorBanner}>{errorMsg}</p>}

        <button
          type="button"
          className={styles.confirmActionButton}
          disabled={isSubmitting}
          onClick={onConfirm}
        >
          {isSubmitting ? (
            'Creating Adventure...'
          ) : (
            <>
              <SparklesIcon size={18} /> Looks Great — Let&apos;s Go! <ArrowRightIcon size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
