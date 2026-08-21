import type { Hangout } from '@/db/schema'

/**
 * Returns the active step route for a given hangout based on its current status.
 */
export function getHangoutRoute(hangout: Hangout): string {
  switch (hangout.status) {
    case 'draft':
    case 'activities_pending':
      return `/hangouts/${hangout.id}/activities`
    case 'matched':
      return `/hangouts/${hangout.id}/places`
    case 'places_selected':
      return `/hangouts/${hangout.id}/itinerary`
    case 'confirmed': {
      const isToday =
        new Date(hangout.date).toDateString() === new Date().toDateString()
      return isToday
        ? `/hangouts/${hangout.id}/today`
        : `/hangouts/${hangout.id}/confirm`
    }
    case 'completed':
      return `/hangouts/${hangout.id}/memory`
    default:
      return `/hangouts/${hangout.id}/itinerary`
  }
}
