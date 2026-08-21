import type { Metadata } from 'next'
import { hangoutsRepository } from '@/db/repositories/hangoutsRepository'
import { matchingService } from '@/services/matchingService'
import { MatchResultsPage } from '@/components/pages/MatchResultsPage'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Let's Go — Match Results",
  description: "Matched hangout activities.",
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const hangout = await hangoutsRepository.findById(id)
  if (!hangout) {
    redirect('/home')
  }

  const allChoices = await hangoutsRepository.getHangoutActivities(id)
  const matches = matchingService.calculateMatches(
    hangout.createdBy,
    allChoices as Parameters<typeof matchingService.calculateMatches>[1]
  )

  return <MatchResultsPage hangoutId={id} matches={matches} />
}
