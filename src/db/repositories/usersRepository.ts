import { db } from '../index'
import { users, type User, type NewUser } from '../schema'
import { eq } from 'drizzle-orm'

export const usersRepository = {
  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
    return result[0] || null
  },

  async findBySecretHash(secretHash: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.secretHash, secretHash))
      .limit(1)
    return result[0] || null
  },

  async create(user: NewUser): Promise<User> {
    const result = await db.insert(users).values(user).returning()
    return result[0]
  },

  async getAll(): Promise<User[]> {
    return db.select().from(users)
  },
}
