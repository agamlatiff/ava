import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core'

/* ── Users ────────────────────────────────────────────────── */
export const users = pgTable('users', {
  id: text('id').primaryKey(), // 'agam' | 'diva'
  name: text('name').notNull(),
  secretHash: text('secret_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

/* ── Activities Catalog ───────────────────────────────────── */
export const activities = pgTable('activities', {
  id: text('id').primaryKey(), // 'coffee', 'food', 'games', etc.
  name: text('name').notNull(),
  icon: text('icon').notNull(), // emoji or icon name
  slug: text('slug').notNull().unique(),
})

export type Activity = typeof activities.$inferSelect
export type NewActivity = typeof activities.$inferInsert

/* ── Hangouts ─────────────────────────────────────────────── */
export const hangouts = pgTable('hangouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // e.g. '2026-08-22' or 'Saturday, 22 Aug'
  startTime: text('start_time').notNull(), // '16:00'
  endTime: text('end_time').notNull(), // '20:00'
  area: text('area').notNull(),
  budget: integer('budget'), // e.g. 100000
  notes: text('notes'),
  status: text('status', {
    enum: [
      'draft',
      'activities_pending',
      'matched',
      'places_selected',
      'confirmed',
      'completed',
      'cancelled',
    ],
  })
    .default('activities_pending')
    .notNull(),
  agamConfirmed: integer('agam_confirmed').default(0).notNull(), // 0 or 1
  divaConfirmed: integer('diva_confirmed').default(0).notNull(), // 0 or 1
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Hangout = typeof hangouts.$inferSelect
export type NewHangout = typeof hangouts.$inferInsert

/* ── Hangout Activity Selections & Reactions ──────────────── */
export const hangoutActivities = pgTable('hangout_activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  hangoutId: uuid('hangout_id')
    .notNull()
    .references(() => hangouts.id, { onDelete: 'cascade' }),
  activityId: text('activity_id')
    .notNull()
    .references(() => activities.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  choice: text('choice', {
    enum: ['selected', 'love', 'like', 'pass'],
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type HangoutActivity = typeof hangoutActivities.$inferSelect
export type NewHangoutActivity = typeof hangoutActivities.$inferInsert

/* ── Places ───────────────────────────────────────────────── */
export const places = pgTable('places', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // matches activity.id (e.g. 'coffee')
  area: text('area').notNull(),
  distanceKm: text('distance_km').notNull(), // e.g. '800m' or '1.2km'
  priceMin: integer('price_min').default(0).notNull(),
  priceMax: integer('price_max').default(0).notNull(),
  rating: text('rating').default('5.0').notNull(),
  description: text('description').notNull(),
})

export type Place = typeof places.$inferSelect
export type NewPlace = typeof places.$inferInsert

/* ── Itinerary Items ──────────────────────────────────────── */
export const itineraryItems = pgTable('itinerary_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  hangoutId: uuid('hangout_id')
    .notNull()
    .references(() => hangouts.id, { onDelete: 'cascade' }),
  placeId: uuid('place_id').references(() => places.id, {
    onDelete: 'set null',
  }),
  activityId: text('activity_id')
    .notNull()
    .references(() => activities.id, { onDelete: 'cascade' }),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  order: integer('order').notNull(),
  status: text('status', {
    enum: ['upcoming', 'in_progress', 'completed'],
  })
    .default('upcoming')
    .notNull(),
})

export type ItineraryItem = typeof itineraryItems.$inferSelect
export type NewItineraryItem = typeof itineraryItems.$inferInsert

/* ── Memories ─────────────────────────────────────────────── */
export const memories = pgTable('memories', {
  id: uuid('id').defaultRandom().primaryKey(),
  hangoutId: uuid('hangout_id')
    .notNull()
    .references(() => hangouts.id, { onDelete: 'cascade' }),
  note: text('note'),
  rating: integer('rating').notNull(), // 1 to 5
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Memory = typeof memories.$inferSelect
export type NewMemory = typeof memories.$inferInsert
