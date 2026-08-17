import { db } from '../index'
import {
  hangouts,
  type Hangout,
  type NewHangout,
  hangoutActivities,
  type NewHangoutActivity,
  activities,
  memories,
} from '../schema'
import { eq, desc, ne, and } from 'drizzle-orm'

export const hangoutsRepository = {
  async findById(id: string): Promise<Hangout | null> {
    const result = await db.select().from(hangouts).where(eq(hangouts.id, id)).limit(1)
    return result[0] || null
  },

  async create(data: NewHangout): Promise<Hangout> {
    const result = await db.insert(hangouts).values(data).returning()
    return result[0]
  },

  async updateStatus(
    id: string,
    status: Hangout['status']
  ): Promise<Hangout | null> {
    const result = await db
      .update(hangouts)
      .set({ status })
      .where(eq(hangouts.id, id))
      .returning()
    return result[0] || null
  },

  async setConfirmation(
    id: string,
    userId: 'agam' | 'diva',
    confirmed: boolean
  ): Promise<Hangout | null> {
    const updateData =
      userId === 'agam'
        ? { agamConfirmed: confirmed ? 1 : 0 }
        : { divaConfirmed: confirmed ? 1 : 0 }

    const result = await db
      .update(hangouts)
      .set(updateData)
      .where(eq(hangouts.id, id))
      .returning()
    return result[0] || null
  },

  async getUpcomingHangout(): Promise<Hangout | null> {
    const result = await db
      .select()
      .from(hangouts)
      .where(ne(hangouts.status, 'completed'))
      .orderBy(desc(hangouts.createdAt))
      .limit(1)
    return result[0] || null
  },

  async getRecentHangouts(limitCount = 5): Promise<Hangout[]> {
    return db
      .select()
      .from(hangouts)
      .orderBy(desc(hangouts.createdAt))
      .limit(limitCount)
  },

  async saveActivities(
    hangoutId: string,
    userId: string,
    selections: { activityId: string; choice: 'selected' | 'love' | 'like' | 'pass' }[]
  ): Promise<void> {
    // Delete existing selections for this user and hangout
    await db
      .delete(hangoutActivities)
      .where(
        and(
          eq(hangoutActivities.hangoutId, hangoutId),
          eq(hangoutActivities.userId, userId)
        )
      )

    // Insert new selections
    if (selections.length > 0) {
      await db.insert(hangoutActivities).values(
        selections.map((s) => ({
          hangoutId,
          userId,
          activityId: s.activityId,
          choice: s.choice,
        }))
      )
    }
  },

  async getHangoutActivities(hangoutId: string) {
    return db
      .select({
        id: hangoutActivities.id,
        activityId: hangoutActivities.activityId,
        userId: hangoutActivities.userId,
        choice: hangoutActivities.choice,
        activityName: activities.name,
        activityIcon: activities.icon,
        activitySlug: activities.slug,
      })
      .from(hangoutActivities)
      .leftJoin(activities, eq(hangoutActivities.activityId, activities.id))
      .where(eq(hangoutActivities.hangoutId, hangoutId))
  },
}
