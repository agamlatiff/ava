import type { NewItineraryItem } from '@/db/schema'

export interface PlaceSelectionInput {
  activityId: string
  placeId: string
}

function addMinutes(timeStr: string, minutesToAdd: number): string {
  const [h, m] = timeStr.split(':').map(Number)
  const totalM = h * 60 + m + minutesToAdd
  const newH = Math.floor((totalM % (24 * 60)) / 60)
  const newM = totalM % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}

export const itineraryService = {
  buildItineraryPlan(
    hangoutId: string,
    startTime: string,
    endTime: string,
    selections: PlaceSelectionInput[]
  ): NewItineraryItem[] {
    if (selections.length === 0) return []

    // Allocate ~60-90 minutes per activity with 15m travel interval
    const durationPerStop = 75 // 1 hour 15 mins
    const travelGap = 15 // 15 mins

    let currentStart = startTime

    return selections.map((sel, idx) => {
      const stopEnd = addMinutes(currentStart, durationPerStop)
      const item: NewItineraryItem = {
        hangoutId,
        placeId: sel.placeId,
        activityId: sel.activityId,
        startTime: currentStart,
        endTime: stopEnd,
        order: idx + 1,
        status: 'upcoming',
      }

      // Next stop starts after travel gap
      currentStart = addMinutes(stopEnd, travelGap)
      return item
    })
  },
}
