'use client'

import { usePlaceSelect } from '@/hooks/usePlaceSelect'
import { PlaceCard } from '@/components/ui/PlaceCard'
import type { Place } from '@/db/schema'

interface PlacesPageProps {
  hangoutId: string
  matchedCategories: {
    activityId: string
    activityName: string
    activityIcon: string
    places: Place[]
  }[]
}

export function PlacesPage({ hangoutId, matchedCategories }: PlacesPageProps) {
  const matchedActivityIds = matchedCategories.map((c) => c.activityId)
  const {
    selectedPlaces,
    handleSelectPlace,
    handleSubmit,
    isSubmitting,
    errorMsg,
  } = usePlaceSelect(hangoutId, matchedActivityIds)

  return (
    <div style={{ maxWidth: '580px', marginInline: 'auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <h1 className="text-h2">Choose Places 📍</h1>
        <p className="text-body-sm text-secondary">
          Pick your favorite spot for each matched activity.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {matchedCategories.map((cat) => (
          <section key={cat.activityId} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h2 className="text-h3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{cat.activityIcon}</span>
              <span>{cat.activityName}</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {cat.places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isSelected={selectedPlaces[cat.activityId] === place.id}
                  onSelect={(placeId) => handleSelectPlace(cat.activityId, placeId)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {errorMsg && (
        <p style={{ color: 'var(--error)', fontSize: 'var(--text-body-sm)' }}>
          {errorMsg}
        </p>
      )}

      <button
        type="button"
        className="btn-primary w-full"
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Building Itinerary...' : 'Build Itinerary 📋'}
      </button>
    </div>
  )
}
