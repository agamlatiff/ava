'use client'

import styles from './UIComponents.module.css'
import type { Place } from '@/db/schema'

interface PlaceCardProps {
  place: Place
  isSelected?: boolean
  onSelect?: (placeId: string) => void
}

export function PlaceCard({ place, isSelected = false, onSelect }: PlaceCardProps) {
  const priceDisplay =
    place.priceMin === 0 && place.priceMax === 0
      ? 'Free'
      : `Rp ${(place.priceMin / 1000).toFixed(0)}k – ${(place.priceMax / 1000).toFixed(0)}k`

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect?.(place.id)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onSelect?.(place.id)
        }
      }}
      className={`${styles.placeCard} ${isSelected ? styles.placeCardSelected : ''}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 className="text-body" style={{ fontWeight: 700 }}>
            {place.name}
          </h3>
          <span className="text-caption" style={{ color: 'var(--warm-gold)' }}>
            ★ {place.rating}
          </span>
        </div>

        <p className="text-caption text-secondary">{place.description}</p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <span className="text-caption text-muted">📍 {place.distanceKm}</span>
          <span className="text-caption text-muted">💰 {priceDisplay}</span>
        </div>
      </div>

      <div className={`${styles.radioCircle} ${isSelected ? styles.radioSelected : ''}`}>
        {isSelected && <div className={styles.radioInner} />}
      </div>
    </div>
  )
}
