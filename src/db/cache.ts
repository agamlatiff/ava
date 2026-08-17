import { unstable_cache } from 'next/cache'
import { activitiesRepository } from './repositories/activitiesRepository'
import { hangoutsRepository } from './repositories/hangoutsRepository'
import { placesRepository } from './repositories/placesRepository'

/* ── Static Activities Catalog Cache ──────────────────────── */
export const getCachedActivities = unstable_cache(
  async () => {
    return activitiesRepository.getAll()
  },
  ['activities-catalog-cache'],
  {
    revalidate: 86400, // 24 hours
    tags: ['activities'],
  }
)

/* ── Places Catalog Cache ─────────────────────────────────── */
export const getCachedPlacesByCategory = (category: string) =>
  unstable_cache(
    async () => {
      return placesRepository.getByCategory(category)
    },
    [`places-category-${category}`],
    {
      revalidate: 86400, // 24 hours
      tags: [`places-${category}`, 'places'],
    }
  )()

/* ── Hangout Plan Cache (Short TTL) ────────────────────────── */
export const getCachedHangout = (hangoutId: string) =>
  unstable_cache(
    async () => {
      return hangoutsRepository.findById(hangoutId)
    },
    [`hangout-plan-${hangoutId}`],
    {
      revalidate: 10,
      tags: [`hangout-${hangoutId}`, 'hangouts'],
    }
  )()
