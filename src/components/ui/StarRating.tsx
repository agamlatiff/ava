import { StarIcon } from './OceanIcons'
import styles from './UIComponents.module.css'

interface StarRatingProps {
  rating: number // 1 to 5
}

export function StarRating({ rating }: StarRatingProps) {
  return (
    <div className={styles.starRow} aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={styles.star} aria-hidden="true">
          <StarIcon
            size={18}
            color={star <= rating ? 'var(--warm-gold)' : 'rgba(255,255,255,0.2)'}
            filled={star <= rating}
          />
        </span>
      ))}
    </div>
  )
}
