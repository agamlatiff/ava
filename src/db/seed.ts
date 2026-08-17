import { db } from './index'
import { users, activities, places } from './schema'
import crypto from 'crypto'

export function hashSecret(secret: string): string {
  return crypto.createHash('sha256').update(secret.trim().toLowerCase()).digest('hex')
}

export async function seed() {
  console.log('🌱 Seeding database...')

  // 1. Seed Users (Agam & Diva)
  const usersData = [
    {
      id: 'agam',
      name: 'Agam',
      secretHash: hashSecret('agam-secret'),
    },
    {
      id: 'diva',
      name: 'Diva',
      secretHash: hashSecret('diva-secret'),
    },
  ]

  for (const u of usersData) {
    await db.insert(users).values(u).onConflictDoNothing()
  }

  // 2. Seed Activities Catalog
  const activitiesData = [
    { id: 'coffee', name: 'Coffee', icon: '☕', slug: 'coffee' },
    { id: 'food', name: 'Food', icon: '🍜', slug: 'food' },
    { id: 'games', name: 'Games', icon: '🎮', slug: 'games' },
    { id: 'movie', name: 'Movie', icon: '🎬', slug: 'movie' },
    { id: 'walk', name: 'Walk', icon: '🚶', slug: 'walk' },
    { id: 'study', name: 'Study', icon: '📚', slug: 'study' },
    { id: 'explore', name: 'Explore', icon: '🛍️', slug: 'explore' },
    { id: 'dessert', name: 'Dessert', icon: '🍰', slug: 'dessert' },
  ]

  for (const a of activitiesData) {
    await db.insert(activities).values(a).onConflictDoNothing()
  }

  // 3. Seed Mock Places
  const placesData = [
    {
      name: 'Ocean Brew Cafe',
      category: 'coffee',
      area: 'Around Campus',
      distanceKm: '800m',
      priceMin: 25000,
      priceMax: 50000,
      rating: '4.8',
      description: 'Cozy coastal vibe coffee with ocean view',
    },
    {
      name: 'Coral Coffee Roasters',
      category: 'coffee',
      area: 'Around Campus',
      distanceKm: '1.2km',
      priceMin: 30000,
      priceMax: 60000,
      rating: '4.9',
      description: 'Specialty pour-over and artisan pastries',
    },
    {
      name: 'Blue Whale Arcade',
      category: 'games',
      area: 'Around Campus',
      distanceKm: '1.5km',
      priceMin: 50000,
      priceMax: 100000,
      rating: '4.7',
      description: 'Retro arcade games & co-op console lounge',
    },
    {
      name: 'Sea Bites Ramen & Grill',
      category: 'food',
      area: 'Around Campus',
      distanceKm: '1.0km',
      priceMin: 35000,
      priceMax: 75000,
      rating: '4.8',
      description: 'Warm noodles, fresh seafood & comfort meals',
    },
    {
      name: 'Sunset Marine Promenade',
      category: 'walk',
      area: 'Coastline',
      distanceKm: '2.0km',
      priceMin: 0,
      priceMax: 0,
      rating: '5.0',
      description: 'Scenic sunset boardwalk with fresh sea breeze',
    },
    {
      name: 'Sweet Pearl Patisserie',
      category: 'dessert',
      area: 'Around Campus',
      distanceKm: '900m',
      priceMin: 25000,
      priceMax: 55000,
      rating: '4.9',
      description: 'Handcrafted gelato and warm ocean-themed pastries',
    },
  ]

  for (const p of placesData) {
    await db.insert(places).values(p).onConflictDoNothing()
  }

  console.log('✅ Seeding complete!')
}
