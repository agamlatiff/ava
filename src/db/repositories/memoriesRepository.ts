import { db } from '../index'
import { memories, type Memory, type NewMemory, hangouts } from '../schema'
import { eq, desc } from 'drizzle-orm'

export const memoriesRepository = {
  async create(data: NewMemory): Promise<Memory> {
    const result = await db.insert(memories).values(data).returning()
    return result[0]
  },

  async getByHangoutId(hangoutId: string): Promise<Memory | null> {
    const result = await db
      .select()
      .from(memories)
      .where(eq(memories.hangoutId, hangoutId))
      .limit(1)
    return result[0] || null
  },

  async getAllWithHangouts() {
    return db
      .select({
        id: memories.id,
        hangoutId: memories.hangoutId,
        note: memories.note,
        rating: memories.rating,
        createdAt: memories.createdAt,
        hangoutDate: hangouts.date,
        hangoutArea: hangouts.area,
        hangoutStartTime: hangouts.startTime,
        hangoutEndTime: hangouts.endTime,
      })
      .from(memories)
      .leftJoin(hangouts, eq(memories.hangoutId, hangouts.id))
      .orderBy(desc(memories.createdAt))
  },
}
