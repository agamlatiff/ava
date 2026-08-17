import { db } from '../index'
import {
  itineraryItems,
  type ItineraryItem,
  type NewItineraryItem,
  places,
  activities,
} from '../schema'
import { eq, asc } from 'drizzle-orm'

export const itineraryRepository = {
  async getByHangoutId(hangoutId: string) {
    return db
      .select({
        id: itineraryItems.id,
        hangoutId: itineraryItems.hangoutId,
        placeId: itineraryItems.placeId,
        activityId: itineraryItems.activityId,
        startTime: itineraryItems.startTime,
        endTime: itineraryItems.endTime,
        order: itineraryItems.order,
        status: itineraryItems.status,
        placeName: places.name,
        placeArea: places.area,
        placeDistance: places.distanceKm,
        placePriceMin: places.priceMin,
        placePriceMax: places.priceMax,
        placeRating: places.rating,
        placeDescription: places.description,
        activityName: activities.name,
        activityIcon: activities.icon,
      })
      .from(itineraryItems)
      .leftJoin(places, eq(itineraryItems.placeId, places.id))
      .leftJoin(activities, eq(itineraryItems.activityId, activities.id))
      .where(eq(itineraryItems.hangoutId, hangoutId))
      .orderBy(asc(itineraryItems.order))
  },

  async createMany(items: NewItineraryItem[]): Promise<void> {
    if (items.length === 0) return
    await db.insert(itineraryItems).values(items)
  },

  async clearByHangoutId(hangoutId: string): Promise<void> {
    await db
      .delete(itineraryItems)
      .where(eq(itineraryItems.hangoutId, hangoutId))
  },

  async updateItemStatus(
    itemId: string,
    status: 'upcoming' | 'in_progress' | 'completed'
  ): Promise<void> {
    await db
      .update(itineraryItems)
      .set({ status })
      .where(eq(itineraryItems.id, itemId))
  },
}
