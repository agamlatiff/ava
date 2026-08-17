'use client'

import styles from './UIComponents.module.css'

interface ActivityChipProps {
  id: string
  name: string
  icon: string
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
  reaction?: 'love' | 'like' | 'pass'
  onReact?: (id: string, choice: 'love' | 'like' | 'pass') => void
  mode?: 'select' | 'react' | 'display'
}

export function ActivityChip({
  id,
  name,
  icon,
  isSelected = false,
  onToggleSelect,
  reaction,
  onReact,
  mode = 'select',
}: ActivityChipProps) {
  if (mode === 'select') {
    return (
      <div
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={0}
        onClick={() => onToggleSelect?.(id)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            onToggleSelect?.(id)
          }
        }}
        className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
      >
        {isSelected && (
          <span className={styles.badgeCheck} aria-hidden="true">
            ✓
          </span>
        )}
        <span style={{ fontSize: '2.25rem' }} aria-hidden="true">
          {icon}
        </span>
        <span className="text-body" style={{ fontWeight: 600 }}>
          {name}
        </span>
      </div>
    )
  }

  if (mode === 'react') {
    return (
      <div className={styles.chip} style={{ cursor: 'default' }}>
        <span style={{ fontSize: '2.25rem' }} aria-hidden="true">
          {icon}
        </span>
        <span className="text-body" style={{ fontWeight: 600 }}>
          {name}
        </span>

        <div className={styles.reactionGroup}>
          <button
            type="button"
            className={`${styles.reactionBtn} ${
              reaction === 'love' ? styles.reactionActiveLove : ''
            }`}
            onClick={() => onReact?.(id, 'love')}
            aria-label="Love this activity"
          >
            ❤️
          </button>
          <button
            type="button"
            className={`${styles.reactionBtn} ${
              reaction === 'like' ? styles.reactionActiveLike : ''
            }`}
            onClick={() => onReact?.(id, 'like')}
            aria-label="Like this activity"
          >
            👍
          </button>
          <button
            type="button"
            className={`${styles.reactionBtn} ${
              reaction === 'pass' ? styles.reactionActivePass : ''
            }`}
            onClick={() => onReact?.(id, 'pass')}
            aria-label="Pass on this activity"
          >
            👎
          </button>
        </div>
      </div>
    )
  }

  // mode === 'display'
  return (
    <div className={styles.chip} style={{ cursor: 'default', padding: '12px 16px' }}>
      <span style={{ fontSize: '1.75rem' }} aria-hidden="true">
        {icon}
      </span>
      <span className="text-body-sm" style={{ fontWeight: 600 }}>
        {name}
      </span>
    </div>
  )
}
