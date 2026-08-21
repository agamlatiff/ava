'use client'

import styles from './UIComponents.module.css'
import { getActivityIcon, HeartIcon, ThumbsUpIcon, PassIcon, CheckCircleIcon } from './OceanIcons'


interface ActivityChipProps {
  id: string
  name: string
  icon?: string
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
  reaction?: 'love' | 'like' | 'pass'
  onReact?: (id: string, choice: 'love' | 'like' | 'pass') => void
  mode?: 'select' | 'react' | 'display'
}

export function ActivityChip({
  id,
  name,
  isSelected = false,
  onToggleSelect,
  reaction,
  onReact,
  mode = 'select',
}: ActivityChipProps) {


  const iconElement = getActivityIcon(id, 32, isSelected ? '#80DEEA' : '#B0D4F1')

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
            <CheckCircleIcon size={14} color="#0D47A1" />
          </span>
        )}

        <div style={{ padding: '8px', color: isSelected ? 'var(--accent-cyan)' : 'var(--accent-light)' }} aria-hidden="true">
          {iconElement}
        </div>
        <span className="text-body" style={{ fontWeight: 600, color: isSelected ? '#FFFFFF' : 'var(--text-secondary)' }}>
          {name}
        </span>
      </div>
    )
  }

  if (mode === 'react') {
    return (
      <div className={styles.chip} style={{ cursor: 'default' }}>
        <div style={{ padding: '8px', color: 'var(--accent-cyan)' }} aria-hidden="true">
          {iconElement}
        </div>
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
            <HeartIcon size={18} color={reaction === 'love' ? '#FF6B6B' : 'var(--warm-coral)'} filled={reaction === 'love'} />
          </button>
          <button
            type="button"
            className={`${styles.reactionBtn} ${
              reaction === 'like' ? styles.reactionActiveLike : ''
            }`}
            onClick={() => onReact?.(id, 'like')}
            aria-label="Like this activity"
          >
            <ThumbsUpIcon size={18} color={reaction === 'like' ? '#00BCD4' : 'var(--accent-teal)'} filled={reaction === 'like'} />
          </button>
          <button
            type="button"
            className={`${styles.reactionBtn} ${
              reaction === 'pass' ? styles.reactionActivePass : ''
            }`}
            onClick={() => onReact?.(id, 'pass')}
            aria-label="Pass on this activity"
          >
            <PassIcon size={18} color={reaction === 'pass' ? '#EF5350' : 'var(--text-muted)'} />
          </button>
        </div>
      </div>
    )
  }

  // mode === 'display'
  return (
    <div className={styles.chip} style={{ cursor: 'default', padding: '12px 18px', flexDirection: 'row', gap: '10px' }}>
      <div style={{ color: 'var(--accent-cyan)' }} aria-hidden="true">
        {getActivityIcon(id, 22, 'var(--accent-cyan)')}
      </div>
      <span className="text-body-sm" style={{ fontWeight: 600 }}>
        {name}
      </span>
    </div>
  )
}

