import { db } from '../index'
import { activities, type Activity, type NewActivity } from '../schema'
import { eq } from 'drizzle-orm'

export const activitiesRepository = {
  async getAll(): Promise<Activity[]> {
    return db.select().from(activities)
  },

  async findById(id: string): Promise<Activity | null> {
    const result = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id))
      .limit(1)
    return result[0] || null
  },

  async seed(data: NewActivity[]): Promise<void> {
    for (const item of data) {
      await db.insert(activities).values(item).onConflictDoNothing()
    }
  },
}
