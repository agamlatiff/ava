'use client'

import { useMemoryForm } from '@/hooks/useMemoryForm'
import { StarRatingInput } from '@/components/ui/StarRatingInput'
import type { Hangout } from '@/db/schema'

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
    <div style={{ maxWidth: '540px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
        <h1 className="text-display" style={{ fontSize: '2.25rem' }}>
          Save This Memory 🐚
        </h1>
        <p className="text-body-sm text-secondary">
          {hangout.date} · {hangout.area}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* ── Star Rating ── */}
        <div className="glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
          <p className="text-body" style={{ fontWeight: 600 }}>How was it?</p>
          <StarRatingInput
            rating={rating}
            hoveredStar={hoveredStar}
            onHover={setHoveredStar}
            onClick={handleStarClick}
          />
          <p className="text-caption text-muted">
            {rating === 0
              ? 'Tap a star'
              : rating <= 2
              ? 'Better luck next time!'
              : rating <= 3
              ? 'Pretty good!'
              : rating <= 4
              ? 'Amazing time! ✨'
              : 'LEGENDARY! 🌟'}
          </p>
        </div>

        {/* ── Note ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label
            htmlFor="memory-note"
            className="text-caption"
            style={{ fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            💭 What was your favorite part? (optional)
          </label>
          <textarea
            id="memory-note"
            className="input-field"
            placeholder="That sunset walk was incredible..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            style={{ minHeight: '100px', resize: 'vertical' }}
          />
          <span className="text-caption text-muted" style={{ alignSelf: 'flex-end' }}>
            {note.length}/500
          </span>
        </div>

        {errorMsg && (
          <p style={{ color: 'var(--error)', fontSize: 'var(--text-body-sm)', textAlign: 'center' }}>
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Memory 🐚'}
        </button>
      </form>
    </div>
  )
}
