'use client'

import { usePlaceSelect } from '@/hooks/usePlaceSelect'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { getActivityIcon, ArrowRightIcon } from '@/components/ui/OceanIcons'
import type { Place } from '@/db/schema'
import styles from './PlacesPage.module.css'

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
    <div className={styles.root}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Choose Places</h1>
        <p className={`text-body-sm ${styles.subtitle}`}>
          Pick your favorite spot for each matched activity.
        </p>
      </div>

      <div className={styles.categoryGroup}>
        {matchedCategories.map((cat) => (
          <section key={cat.activityId} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>
              <span className={styles.categoryIcon}>
                {getActivityIcon(cat.activityId, 22, 'var(--accent-cyan)')}
              </span>
              <span>{cat.activityName}</span>
            </h2>

            <div className={styles.placesList}>
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
        <p className={styles.errorMessage}>
          {errorMsg}
        </p>
      )}

      <button
        type="button"
        className="btn-primary w-full"
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Building Itinerary...' : 'Build Itinerary'} <ArrowRightIcon size={18} />
      </button>
    </div>
  )
}
