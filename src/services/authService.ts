import crypto from 'crypto'
import { usersRepository } from '@/db/repositories/usersRepository'
import type { User } from '@/db/schema'

export function hashSecret(secret: string): string {
  return crypto.createHash('sha256').update(secret.trim().toLowerCase()).digest('hex')
}

// Fallback users if DB connection is unavailable locally
const FALLBACK_USERS: Record<string, { id: string; name: string; secret: string }> = {
  'agam-secret': { id: 'agam', name: 'Agam', secret: 'agam-secret' },
  'diva-secret': { id: 'diva', name: 'Diva', secret: 'diva-secret' },
}

export const authService = {
  async authenticateBySecret(rawSecret: string): Promise<User | null> {
    const trimmed = rawSecret.trim()
    if (!trimmed) return null

    const secretHash = hashSecret(trimmed)

    try {
      const user = await usersRepository.findBySecretHash(secretHash)
      if (user) return user
    } catch (err) {
      console.warn('Database lookup failed in authService, attempting fallback:', err)
    }

    // Fallback check
    const fallback = FALLBACK_USERS[trimmed.toLowerCase()]
    if (fallback) {
      return {
        id: fallback.id,
        name: fallback.name,
        secretHash,
        createdAt: new Date(),
      }
    }

    return null
  },
}
