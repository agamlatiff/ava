import type { Metadata } from 'next'
import { memoriesRepository } from '@/db/repositories/memoriesRepository'
import { MemoriesPage } from '@/components/pages/MemoriesPage'

export const metadata: Metadata = {
  title: "Let's Go — Memories",
  description: "Cherished moments from our past hangouts.",
}

export default async function Page() {
  let memoriesList: Awaited<ReturnType<typeof memoriesRepository.getAllWithHangouts>> = []

  try {
    memoriesList = await memoriesRepository.getAllWithHangouts()
  } catch (err) {
    console.warn('Failed to load memories:', err)
  }

  const formattedMemories = memoriesList.map((m) => ({
    id: m.id,
    hangoutDate: m.hangoutDate,
    hangoutArea: m.hangoutArea,
    rating: m.rating,
    note: m.note,
  }))

  return <MemoriesPage memories={formattedMemories} />
}
