'use client'

import { useMemoryForm } from '@/hooks/useMemoryForm'
import { StarRatingInput } from '@/components/ui/StarRatingInput'
import { SparklesIcon } from '@/components/ui/OceanIcons'
import type { Hangout } from '@/db/schema'
import styles from './SaveMemoryPage.module.css'

interface SaveMemoryPageProps {
  hangout: Hangout
}

export function SaveMemoryPage({ hangout }: SaveMemoryPageProps) {
  const {
    rating,
    hoveredStar,
    setHoveredStar,
    note,
    setNote,
    isSubmitting,
    errorMsg,
    handleStarClick,
    handleSubmit,
  } = useMemoryForm(hangout.id)

  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Save This Memory</h1>
        <p className={`text-body-sm ${styles.subtitle}`}>
          {hangout.date} · {hangout.area}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ── Star Rating ── */}
        <div className={`glass-card-strong ${styles.ratingCard}`}>
          <p className={styles.ratingLabel}>How was our adventure?</p>
          <StarRatingInput
            rating={rating}
            hoveredStar={hoveredStar}
            onHover={setHoveredStar}
            onClick={handleStarClick}
          />
          <p className={styles.ratingDescription}>
            {rating === 0
              ? 'Tap a star to rate'
              : rating <= 2
              ? 'Better luck next time!'
              : rating <= 3
              ? 'Pretty good time!'
              : rating <= 4
              ? 'Amazing adventure!'
              : 'LEGENDARY MOMENT! ✨'}
          </p>
        </div>

        {/* ── Note ── */}
        <div className={styles.noteGroup}>
          <label htmlFor="memory-note" className={styles.fieldLabel}>
            What was your favorite part? (optional)
          </label>
          <textarea
            id="memory-note"
            className={`input-field ${styles.textareaField}`}
            placeholder="That sunset view and the coffee talk was unforgettable..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
          />
          <span className={styles.charCount}>
            {note.length}/500
          </span>
        </div>

        {errorMsg && (
          <p className={styles.errorMessage}>
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={rating === 0 || isSubmitting}
        >
          <SparklesIcon size={18} /> {isSubmitting ? 'Saving Memory...' : 'Save Memory'}
        </button>
      </form>
    </div>
  )
}
