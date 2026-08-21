import { z } from 'zod'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import type { Hangout } from '@/db/schema'

export const createHangoutSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  area: z.string().min(3, 'Area must be at least 3 characters'),
  budget: z.number().optional().nullable(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().nullable(),
})

export type CreateHangoutInput = z.infer<typeof createHangoutSchema>

export const hangoutService = {
  async create(userId: string, input: CreateHangoutInput): Promise<Hangout> {
    const validated = createHangoutSchema.parse(input)

    const isAgam = userId.toLowerCase() === 'agam'
    const isDiva = userId.toLowerCase() === 'diva'

    const newHangout = await hangoutsRepository.create({
      createdBy: userId,
      date: validated.date,
      startTime: validated.startTime,
      endTime: validated.endTime,
      area: validated.area,
      budget: validated.budget ?? null,
      notes: validated.notes ?? null,
      status: 'activities_pending',
      agamConfirmed: isAgam ? 1 : 0,
      divaConfirmed: isDiva ? 1 : 0,
    })

    return newHangout
  },
}
