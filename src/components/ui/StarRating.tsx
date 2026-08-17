import styles from './UIComponents.module.css'

interface StarRatingProps {
  rating: number // 1 to 5
}

export function StarRating({ rating }: StarRatingProps) {
  return (
    <div className={styles.starRow} aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${star <= rating ? styles.starFilled : ''}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  )
}
