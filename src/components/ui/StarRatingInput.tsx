'use client'

import { StarIcon } from './OceanIcons'
import styles from './UIComponents.module.css'

interface StarRatingInputProps {
  rating: number
  hoveredStar: number
  onHover: (value: number) => void
  onClick: (value: number) => void
}

export function StarRatingInput({
  rating,
  hoveredStar,
  onHover,
  onClick,
}: StarRatingInputProps) {
  const displayValue = hoveredStar || rating

  return (
    <div
      className={styles.starRow}
      style={{ gap: '8px', cursor: 'pointer' }}
      onMouseLeave={() => onHover(0)}
      role="radiogroup"
      aria-label="Rate this hangout"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.star} ${star <= displayValue ? styles.starFilled : ''}`}
          style={{
            transition: 'transform 150ms ease, color 150ms ease',
            transform: star <= displayValue ? 'scale(1.15)' : 'scale(1)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={() => onHover(star)}
          onClick={() => onClick(star)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          aria-checked={rating === star}
          role="radio"
        >
          <StarIcon
            size={28}
            color={star <= displayValue ? 'var(--warm-gold)' : 'rgba(255,255,255,0.25)'}
            filled={star <= displayValue}
          />
        </button>
      ))}
    </div>
  )
}
