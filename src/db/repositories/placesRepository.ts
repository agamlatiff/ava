import { db } from '../index'
import { places, type Place, type NewPlace } from '../schema'
import { eq } from 'drizzle-orm'

export const placesRepository = {
  async getAll(): Promise<Place[]> {
    return db.select().from(places)
  },

  async getByCategory(category: string): Promise<Place[]> {
    return db.select().from(places).where(eq(places.category, category))
  },

  async findById(id: string): Promise<Place | null> {
    const result = await db.select().from(places).where(eq(places.id, id)).limit(1)
    return result[0] || null
  },

  async create(data: NewPlace): Promise<Place> {
    const result = await db.insert(places).values(data).returning()
    return result[0]
  },
}
